const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const caminhoArquivo = path.join(__dirname, 'data', 'contatos.json');

// Garantir que a pasta data existe ao iniciar o servidor
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Rotas de Navegação
app.get('/', (req, res) => res.render('index'));
app.get('/produto', (req, res) => res.render('produto'));
app.get('/fotos', (req, res) => res.render('fotos'));
app.get('/contato', (req, res) => res.render('contato'));
app.get('/detalhes', (req, res) => res.render('detalhes'));

// --- NOVA ROTA: EXIBIÇÃO DE DADOS ---
app.get('/registros', (req, res) => {
    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) {
            try {
                lista = JSON.parse(data);
            } catch (e) {
                lista = [];
            }
        }
        // Renderiza a página exibirDados.ejs passando o vetor
        res.render('exibirDados', { contatos: lista });
    });
});

// --- ROTA POST CORRIGIDA PARA /salvar ---
app.post('/salvar', (req, res) => {
    const novoContato = req.body;

    fs.readFile(caminhoArquivo, 'utf8', (err, data) => {
        let lista = [];
        if (!err && data) { 
            try { lista = JSON.parse(data); } catch(e) { lista = []; }
        }
        
        lista.push(novoContato);

        fs.writeFile(caminhoArquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.send("Erro no servidor");
            // Usamos novoContato.nome porque é o 'name' que está no seu input HTML
            res.render('sucesso', { nome: novoContato.nome });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor IronCore rodando na porta ${PORT}`));
