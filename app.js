const express = require('express');
const axios = require('axios');
const { format } = require('date-fns');
require('dotenv').config();

const areceber = require('./src/areceber/index.js');
const recebido = require('./src/recebido/index.js');

const formatarDinheiro = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

const app = express();
const port = process.env.API_PORT || 3000;

// Middleware para verificar a chave de API
const verificarChaveAPI = (req, res, next) => {
  const apiKey = req.header('apiKey'); // Altere de acordo com sua preferência
  if (apiKey && apiKey === process.env.API_KEY) {
    next(); // Chave de API válida, prossiga para a rota desejada
  } else {
    res.status(401).json({ error: 'Chave de API inválida ou ausente' });
  }
};

app.use(verificarChaveAPI);

app.get('/', async (req, res) => {
  res.json({ message: "Em desenvolvimento por T3uZ" });
});

app.get('/areceber', async (req, res) => {
  try {
    // Chame a função que você criou
    const somaValores = await areceber();
    const valorFormatado = formatarDinheiro(somaValores);
    // Envie a resposta como JSON
    res.json({ total: valorFormatado });
  } catch (error) {
    console.error('Erro na API:', error.message);
    // Em caso de erro, envie uma resposta de erro
    res.status(500).json({ error: 'Erro ao consultar valores' });
  }
});

app.get('/recebido', async (req, res) => {
  try {
    // Chame a função que você criou
    const somaValores = await recebido();
    const valorFormatado = formatarDinheiro(somaValores);
    // Envie a resposta como JSON
    res.json({ total: valorFormatado });
  } catch (error) {
    console.error('Erro na API:', error.message);
    // Em caso de erro, envie uma resposta de erro
    res.status(500).json({ error: 'Erro ao consultar valores' });
  }
});

// Inicialize o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
