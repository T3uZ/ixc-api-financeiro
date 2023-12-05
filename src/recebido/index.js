// server.js

const axios = require('axios');
const { format } = require('date-fns');
require('dotenv').config();

const baseURL = process.env.API_URL;
const token = process.env.API_TOKEN;

// Função para obter a data de hoje
function obterDataAtual() {
  const hoje = new Date();
  return format(hoje, 'yyyy-MM-dd');
}

// Função para converter string em número e tratar valores nulos ou vazios
const parseNumber = (str) => (str && parseFloat(str.replace(',', '.'))) || 0;

// Função para formatar como dinheiro
const formatarDinheiro = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Listar e somar valores abertos
async function listarRegistros() {
  const url = `${baseURL}/webservice/v1/fn_areceber`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${Buffer.from(token).toString('base64')}`,
    'ixcsoft': 'listar'
  };

  // Obter data atual
  const hoje = obterDataAtual();

  const gridParamString = `[{\"TB\":\"fn_areceber.data_vencimento\", \"OP\" : \"=\", \"P\" : \"${hoje}\"},{\"TB\":\"fn_areceber.status\", \"OP\" : \"=\", \"P\" : \"R\"}]`;

  const data = {
    qtype: 'fn_areceber.id',
    query: '',
    oper: '!=',
    page: '1',
    rp: '1000000',
    sortname: 'fn_areceber.id',
    sortorder: 'desc',
    grid_param: gridParamString
  };

  try {
    const response = await axios.post(url, data, { headers });
    const registros = response.data.registros || [];
    
    // Somar os valores abertos
    const somaValores = registros.reduce((total, resultado) => {
      const valorAberto = parseNumber(resultado.valor_recebido);
      return total + valorAberto;
    }, 0);

    // Retornar o resultado
    return somaValores;
  } catch (error) {
    console.error('Erro na listagem:', error.message);
    throw error;
  }
}

module.exports = listarRegistros;
