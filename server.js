const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const port = 3000;

const filmesPath = path.join(__dirname, 'filmes.json');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

let filmesData = fs.readFileSync(filmesPath, 'utf-8');
let filmes = JSON.parse(filmesData);

// FUNCTIONS SALVAR:

function SalvarFilmes() {
    fs.writeFileSync(filmesPath, JSON.stringify(filmes, null, 2));
}

function SalvarDadosFilme(filmes) { // OUTRO NOME PARA A FUNÇÃO NÃO CONFLITAR COM A OUTRA!
    fs.writeFileSync(filmesPath, JSON.stringify(filmes, null, 2));
}

function ExcluirFilme(filmes) { // OUTRO NOME PARA A FUNÇÃO NÃO CONFLITAR COM A OUTRA!
    fs.writeFileSync(filmesPath, JSON.stringify(filmes, null, 2));
}

// FUNCTIONS BUSCAR:

function BuscarFilmesTítulo(título) { // PESQUISA PELO TÍTULO, NÃO UTILIZA FILTER POIS UM FILME PODE TER SOMENTE UM TÍTULO
    return filmes.find(filme => filme.título.toLowerCase() === título.toLowerCase());
}

function BuscarFilmesDiretor(diretor) { // PESQUISA PELO DIRETOR, USANDO FILTER PARA RESULTADOS COM MAIS DE 1 JSON
    return filmes.find(filme => filme.diretor.toLowerCase() === diretor.toLowerCase()); // PERGUNTAR PARA PROF
}

function BuscarFilmesAno(ano) { // PESQUISA PELO ANO, USANDO FILTER PARA RESULTADOS COM MAIS DE 1 JSON
    return filmes.find(filme => filme.ano.toLowerCase() === ano.toLowerCase()); // PERGUNTAR PARA PROF
}

// ROTA PRINCIPAL:

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// GET MOSTRAR JSON:

app.get('/filmes', (req, res) => {

    res.send(`<a href="http://localhost:3000/"><strong>Voltar</strong></a>
    <h1>Catálogo com todos os filmes</h1>
    <a href="http://localhost:3000/filmes/buscar-filme"><strong>Pesquisar Filmes</strong></a>
    <pre>${JSON.stringify(filmes, null, 2)}</pre>
`);
});

// GET TIPO DE BUSCA:

app.get('/filmes/buscar-filme', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarfilme.html'));
});

// GET BUSCAR POR TÍTULO:

app.get('/filmes/buscar-filme-titulo', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarfilmetítulo.html'));
});

// POST BUSCAR POR TÍTULO:

app.post('/filmes/buscar-filme-titulo', (req, res) => {
    const filmeBuscado = req.body.título;
    const filmeEncontrado = BuscarFilmesTítulo(filmeBuscado);

    if (filmeEncontrado) {
        res.send(`<h1>Filme encontrado:</h1><pre>${JSON.stringify(filmeEncontrado, null, 2)}</pre>
        <a href="http://localhost:3000/filmes/buscar-filme"><strong>Voltar</strong></a>`);
    }
    else {
        res.send(`<h1>Filme não encontrado, tente novamente.</h1>
            <a href="http://localhost:3000/filmes/buscar-filme-titulo"><strong>Voltar</strong></a>`);
    }
});

// GET BUSCAR POR DIRETOR:

app.get('/filmes/buscar-filme-diretor', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarfilmediretor.html'));
});

// POST BUSCAR POR DIRETOR:

app.post('/filmes/buscar-filme-diretor', (req, res) => {
    const filmeBuscado = req.body.diretor;
    const filmeEncontrado = BuscarFilmesDiretor(filmeBuscado);

    if (filmeEncontrado) { // PERGUNTAR PARA PROF
        res.send(`<h1>Filme(s) encontrado(s):</h1><pre>${JSON.stringify(filmeEncontrado, null, 2)}</pre>
        <a href="http://localhost:3000/filmes/buscar-filme"><strong>Voltar</strong></a>`);
    }
    else {
        res.send(`<h1>Diretor do(s) filme(s) não encontrado, tente novamente.</h1>
            <a href="http://localhost:3000/filmes/buscar-filme-diretor"><strong>Voltar</strong></a>`);
    }
});

// GET BUSCAR POR ANO:

app.get('/filmes/buscar-filme-ano', (req, res) => {
    res.sendFile(path.join(__dirname, 'buscarfilmeano.html'));
});

// POST BUSCAR POR ANO:

app.post('/filmes/buscar-filme-ano', (req, res) => {
    const filmeBuscado = req.body.ano;
    const filmeEncontrado = BuscarFilmesAno(filmeBuscado);

    if (filmeEncontrado) { // PERGUNTAR PARA PROF
        res.send(`<h1>Filme(s) encontrado(s):</h1><pre>${JSON.stringify(filmeEncontrado, null, 2)}</pre>
        <a href="http://localhost:3000/filmes/buscar-filme"><strong>Voltar</strong></a>`);
    }
    else {
        res.send(`<h1>Ano de Lançamento do(s) filme(s) não encontrado(s), tente novamente.</h1>
            <a href="http://localhost:3000/filmes/buscar-filme-ano"><strong>Voltar</strong></a>`);
    }
});

// GET ADICIONAR:

app.get('/filmes/adicionar-filme', (req, res) => {
    res.sendFile(path.join(__dirname, 'adicionarfilme.html'));
});

// POST ADICIONAR

app.post('/filmes/adicionar-filme', (req, res) => {
    const novoFilme = req.body;

    if (filmes.find(filme => filme.título.toLowerCase() === novoFilme.título.toLowerCase())) {
        res.send(`<h1>O filme solicitado já existe, tente novamente.</h1>
            <a href="http://localhost:3000/filmes/adicionar-filme"><strong>Voltar</strong></a>`);
        return;
    }
    else {
        filmes.push(novoFilme);

        SalvarFilmes();

        res.send(`<h1>Novo filme adicionado com sucesso!</h1>
            <a href="http://localhost:3000/filmes"><strong>Conferir Filmes</strong></a><br><br>
            <a href="http://localhost:3000/"><strong>Voltar</strong></a>`);
    }
});

// GET ATUALIZAR:

app.get('/filmes/atualizar-filme', (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizarfilme.html'));
});

// POST ATUALIZAR:

app.post('/filmes/atualizar-filme', (req, res) => {
    const { título, diretor, ano } = req.body;

    let filmesData = fs.readFileSync(filmesPath, 'utf-8');
    let filmes = JSON.parse(filmesData);

    const filmesIndex = filmes.findIndex(filme => filme.título.toLowerCase() === título.toLowerCase());

    if (filmesIndex === -1) {
        res.send(`<h1>Título do filme solicitado não encontrado, tente novamente.</h1>
            <a href="http://localhost:3000/filmes/atualizar-filme"><strong>Voltar</strong></a>`
        );
        return;
    }
    else {
        filmes[filmesIndex].título = título;
        filmes[filmesIndex].diretor = diretor;
        filmes[filmesIndex].ano = ano;

        SalvarDadosFilme(filmes);

        res.send(`<h1>Dados do filme atualizados com sucesso!</h1>
            <a href="http://localhost:3000/filmes"><strong>Conferir Filmes</strong></a><br><br>
            <a href="http://localhost:3000/"><strong>Voltar</strong></a>`);
    }
});

// GET DELETAR:

app.get('/filmes/excluir-filme', (req, res) => {
    res.sendFile(path.join(__dirname, 'deletarfilme.html'));
});

app.post('/filmes/excluir-filme', (req, res) => {
    const { título } = req.body;

    let filmesData = fs.readFileSync(filmesPath, 'utf-8');
    let filmes = JSON.parse(filmesData);

    let filmesIndex = filmes.findIndex(filme => filme.título.toLowerCase() === título.toLowerCase());

    if (filmesIndex === -1) {
        res.send(`<h1>Filme não encontrado, tente novamente.</h1>
            <a href="http://localhost:3000/filmes/excluir-filme"><strong>Voltar</strong></a>`);
        return;
    }
    else {
        res.send(`
            <script>
            if (confirm('Tem certeza de que quer excluir o filme ${título}?')){
            window.location.href = '/filmes/excluir-filme-confirmado?título=${título}';
            }
            else{
            window.location.href = '/filmes/excluir-filme';
            }
        </script>`);
    }
});

app.get('/filmes/excluir-filme-confirmado', (req, res) => {
    const título = req.query.título;

    const filmesIndex = filmes.findIndex(filme => filme.título.toLowerCase() === título.toLowerCase());

    filmes.splice(filmesIndex, 1);

    ExcluirFilme(filmes);

    res.send(`<h1>Filme "${título}" removido com sucesso!</h1>
        <a href="http://localhost:3000/filmes"><strong>Conferir Filmes</strong></a><br><br>
        <a href="http://localhost:3000/"><strong>Voltar</strong></a>`);
});

app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}/`);
});
