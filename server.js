const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
// ESSA LINHA É O QUE PERMITE LER O FORMULÁRIO DEPOIS
app.use(express.urlencoded({ extended: true }));

// --- ROTAS DE NAVEGAÇÃO (GET) ---
app.get('/', (req, res) => res.render('index'));
app.get('/produtos', (req, res) => res.render('produto'));
app.get('/contato', (req, res) => res.render('contato'));

// Rotas de Detalhes (Certifique-se de que os nomes dos arquivos em /views batem)
app.get('/detalhes', (req, res) => res.render('detalhes'));
app.get('/detalhes2', (req, res) => res.render('detalhes2'));
app.get('/detalhes3', (req, res) => res.render('detalhes3'));

// --- ROTA DE GRAVAÇÃO (POST) ---
// Esta rota SÓ deve ser chamada pelo formulário da página de contato
app.post('/salvar', (req, res) => {
    const dados = req.body;
    const arquivo = path.join(__dirname, 'data', 'dados.json');

    fs.readFile(arquivo, 'utf8', (err, cont) => {
        let lista = (err || !cont) ? [] : JSON.parse(cont);
        lista.push(dados);

        // Desafio: writeFile assíncrono
        fs.writeFile(arquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.send("Erro ao salvar");
            res.send("<h1>Dados salvos!</h1><a href='/'>Voltar</a>");
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando!"));
