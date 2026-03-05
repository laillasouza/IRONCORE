const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Rotas das páginas
app.get('/', (req, res) => res.render('index'));
app.get('/produto', (req, res) => res.render('produto'));
app.get('/fotos', (req, res) => res.render('fotos'));
app.get('/contato', (req, res) => res.render('contato'));
app.get('/detalhes', (req, res) => res.render('detalhes'));
app.get('/detalhes2', (req, res) => res.render('detalhes2'));
app.get('/detalhes3', (req, res) => res.render('detalhes3'));

// NOVA ROTA: Exibir registros do IronCore
app.get('/registros', (req, res) => {
    const caminhoArquivo = path.join(__dirname, 'data', 'contatos.json');
    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) {
            try { lista = JSON.parse(data); } catch (e) { lista = []; }
        }
        res.render('exibirDados', { contatos: lista });
    });
});

// Rota POST corrigida para /salvar (conforme seu EJS)
app.post('/salvar', (req, res) => {
    const novoContato = req.body;
    const caminhoArquivo = path.join(__dirname, 'data', 'contatos.json');

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) { lista = JSON.parse(data); }
        
        lista.push(novoContato);

        fs.writeFile(caminhoArquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.send("Erro no servidor");
            // Nota: seu formulário usa name="nome", então passamos novoContato.nome
            res.render('sucesso', { nome: novoContato.nome });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IronCore rodando na porta ${PORT}`));
