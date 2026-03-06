const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define o caminho do arquivo de dados
const caminhoArquivo = path.join(__dirname, 'data', 'contatos.json');

// Rotas de navegação
app.get('/', (req, res) => res.render('index'));
app.get('/produto', (req, res) => res.render('produto'));
app.get('/fotos', (req, res) => res.render('fotos'));
app.get('/contato', (req, res) => res.render('contato'));

// ROTA DE EXIBIÇÃO (Requisito do professor)
app.get('/registros', (req, res) => {
    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data && data.trim() !== "") {
            try {
                lista = JSON.parse(data);
            } catch (e) {
                lista = [];
            }
        }
        res.render('exibirDados', { contatos: lista });
    });
});

// ROTA POST - Deve ser exatamente /salvar para bater com seu contato.ejs
app.post('/salvar', (req, res) => {
    const novoContato = req.body;
    const pastaData = path.join(__dirname, 'data');

    // Cria a pasta data se ela não existir
    if (!fs.existsSync(pastaData)) {
        fs.mkdirSync(pastaData);
    }

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data && data.trim() !== "") {
            try {
                lista = JSON.parse(data);
            } catch (e) {
                lista = [];
            }
        }

        lista.push(novoContato);

        fs.writeFile(caminhoArquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.send("Erro ao salvar");
            // Usamos novoContato.nome porque no seu HTML está name="nome"
            res.render('sucesso', { nome: novoContato.nome });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
