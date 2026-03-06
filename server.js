const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Caminho do arquivo de dados
const caminhoArquivo = path.join(__dirname, 'data', 'contatos.json');

// Rotas GET (Navegação)
app.get('/', (req, res) => res.render('index'));
app.get('/produto', (req, res) => res.render('produto'));
app.get('/fotos', (req, res) => res.render('fotos'));
app.get('/contato', (req, res) => res.render('contato'));

// --- NOVIDADE: Rota para ler e exibir os dados salvos ---
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
        // Renderiza a nova página passando o vetor de objetos
        res.render('exibirDados', { contatos: lista });
    });
});

// --- ROTA POST: Agora com nome '/salvar' para bater com seu HTML ---
app.post('/salvar', (req, res) => {
    const novoContato = req.body;
    const pastaData = path.join(__dirname, 'data');

    // Cria a pasta data se não existir (evita erro no Render)
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
            if (err) return res.send("Erro ao salvar dados.");
            // Renderiza a página de sucesso
            res.render('sucesso', { nome: novoContato.nome });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IronCore ON na porta ${PORT}`));
