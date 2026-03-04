const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// --- ESTAS LINHAS SÃO OBRIGATÓRIAS DENTRO DO SEU ARQUIVO ---
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // <--- ESSA LINHA É A CHAVE!

// Rotas para exibir as páginas (GET)
app.get('/', (req, res) => res.render('index'));
app.get('/produtos', (req, res) => res.render('produto'));
app.get('/contato', (req, res) => res.render('contato'));
app.get('/galeria', (req, res) => res.render('fotos'));
app.get('/detalhes', (req, res) => res.render('detalhes'));
app.get('/detalhes2', (req, res) => res.render('detalhes2'));
app.get('/detalhes3', (req, res) => res.render('detalhes3'));

// Rota para RECEBER os dados do formulário (POST)
app.post('/salvar', (req, res) => {
    const dadosRecebidos = req.body; // Aqui estão os dados do formulário
    const caminhoDoArquivo = path.join(__dirname, 'data', 'dados.json');

    // DESAFIO: Gravação Assíncrona (writeFile)
    // 1. Lemos o arquivo primeiro para não apagar o que já tem
    fs.readFile(caminhoDoArquivo, 'utf8', (err, conteudo) => {
        let lista = [];
        if (!err && conteudo) {
            lista = JSON.parse(conteudo);
        }

        // 2. Adicionamos o novo dado na lista
        lista.push(dadosRecebidos);

        // 3. Salvamos de volta no arquivo
        fs.writeFile(caminhoDoArquivo, JSON.stringify(lista, null, 2), (err) => {
            if (err) return res.send("Erro ao salvar");
            
            // 4. Respondemos ao usuário
            res.send("<h1>Dados salvos com sucesso!</h1><a href='/'>Voltar</a>");
        });
    });
});

// Porta para o Render ou Localhost
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor ON na porta " + PORT));
