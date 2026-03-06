const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Rotas das páginas existentes
app.get('/', (req, res) => res.render('index'));
app.get('/produto', (req, res) => res.render('produto'));
app.get('/fotos', (req, res) => res.render('fotos'));
app.get('/contato', (req, res) => res.render('contato'));
app.get('/detalhes', (req, res) => res.render('detalhes'));
app.get('/detalhes2', (req, res) => res.render('detalhes2'));
app.get('/detalhes3', (req, res) => res.render('detalhes3'));

// --- NOVA ROTA: Lendo e exibindo os dados (Requisitos A e B) ---
app.get('/registros', (req, res) => {
    const caminhoArquivo = path.join(__dirname, 'data', 'contatos.json');

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) {
            try {
                lista = JSON.parse(data); // Converte para vetor de objetos
            } catch (e) {
                lista = [];
            }
        }
        // Renderiza a nova página passando o vetor (Requisito B)
        res.render('exibirDados', { contatos: lista });
    });
});

// Sua rota POST atual (já está certinha!)
app.post('/enviar', (req, res) => {
    const novoContato = req.body;
    const caminhoArquivo = path.join(__dirname, 'data', 'contatos.json');

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) { lista = JSON.parse(data); }
        lista.push(novoContato);

        fs.writeFile(caminhoArquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.send("Erro no servidor");
            res.render('sucesso', { nome: novoContato.nomeCompleto });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
