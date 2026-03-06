const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rotas do VerdeVida
app.get('/', (req, res) => res.render('index'));
app.get('/produto', (req, res) => res.render('produto'));
app.get('/fotos', (req, res) => res.render('fotos'));
app.get('/contato', (req, res) => res.render('contato'));
app.get('/detalhes', (req, res) => res.render('detalhes'));
app.get('/detalhes2', (req, res) => res.render('detalhes2'));
app.get('/detalhes3', (req, res) => res.render('detalhes3'));

// --- NOVA ROTA GET: EXIBIÇÃO DE DADOS (Requisito a e b) ---
app.get('/registros', (req, res) => {
    const caminhoArquivo = path.join(__dirname, 'data', 'mensagens.json');

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) {
            try {
                // Converte os dados para objetos JSON em um vetor
                lista = JSON.parse(data);
            } catch (e) {
                lista = [];
            }
        }
        // Renderiza o EJS passando o vetor como parâmetro
        res.render('exibirDados', { mensagens: lista });
    });
});

// Rota para processar o formulário
app.post('/enviar', (req, res) => {
    const novoContato = req.body;
    const pastaData = path.join(__dirname, 'data');
    const caminhoArquivo = path.join(pastaData, 'mensagens.json');

    if (!fs.existsSync(pastaData)) { fs.mkdirSync(pastaData); }

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data && data.trim() !== "") { 
            try { lista = JSON.parse(data); } catch(e) { lista = []; }
        }
        
        lista.push({ ...novoContato, data: new Date() });

        fs.writeFile(caminhoArquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.send("Erro ao salvar mensagem.");
            res.render('sucesso', { nome: novoContato.nome });
        });
    });
});

// Ajuste para o Render (process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VerdeVida ON na porta ${PORT}`));
