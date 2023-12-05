const express = require('express');
const axios = require('axios');
const { format } = require('date-fns');
require('dotenv').config();

const areceber = require('./src/areceber/index.js');
const recebido = require('./src/recebido/index.js')

const app = express();
const port = process.env.API_PORT || 3000;

// ... (incluir as funções de data, parseNumber, etc.)

app.get('/', async (req, res) => {
  
    res.json({ message: "Em desenvolvimento por T3uZ" });
});

app.get('/areceber', async (req, res) => {
  try {
    // Chame a função que você criou
    const somaValores = await areceber();

    // Envie a resposta como JSON
    res.json({ total: somaValores });
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

    // Envie a resposta como JSON
    res.json({ total: somaValores });
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
