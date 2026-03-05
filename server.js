const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Rotas GET
app.get('/', (req, res) => res.render('index'));
app.get('/contato', (req, res) => res.render('contato'));
app.get('/registros', (req, res) => {
    const caminho = path.join(__dirname, 'data', 'dados.json');
    fs.readFile(caminho, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) { try { lista = JSON.parse(data); } catch(e) { lista = []; } }
        res.render('exibirDados', { contatos: lista });
    });
});

// Rota POST - CORRIGIDA PARA /salvar
app.post('/salvar', (req, res) => {
    const novoContato = req.body;
    const pasta = path.join(__dirname, 'data');
    const arquivo = path.join(pasta, 'dados.json');

    // Cria pasta se não existir
    if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);
    
    fs.readFile(arquivo, 'utf8', (err, data) => {
        let lista = [];
        // Se o arquivo tiver conteúdo, transforma em JSON
        if (!err && data && data.trim() !== "") {
            try { lista = JSON.parse(data); } catch (e) { lista = []; }
        }
        
        lista.push(novoContato);

        fs.writeFile(arquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.status(500).send("Erro ao salvar");
            // Tenta renderizar sucesso. Se não existir, envia texto plano
            try {
                res.render('sucesso', { nome: novoContato.nome });
            } catch (e) {
                res.send("Dados salvos com sucesso!");
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
