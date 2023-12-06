const axios = require('axios');
const { format, startOfMonth, endOfMonth } = require('date-fns');
require('dotenv').config();

const baseURL = process.env.API_URL;
const token = process.env.API_TOKEN;

// Função para obter a data formatada
function obterDataFormatada(date) {
  return format(date, 'yyyy-MM-dd');
}

// Função para obter o primeiro dia do mês
function obterPrimeiroDiaDoMes() {
  return obterDataFormatada(startOfMonth(new Date()));
}

// Função para obter o último dia do mês
function obterUltimoDiaDoMes() {
  return obterDataFormatada(endOfMonth(new Date()));
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

  // Obter primeiro e último dia do mês
  const primeiroDiaDoMes = obterPrimeiroDiaDoMes();
  const ultimoDiaDoMes = obterUltimoDiaDoMes();

  const gridParamString = `[{\"TB\":\"fn_areceber.credito_data\", \"OP\" : \">=\", \"P\" : \"${primeiroDiaDoMes}\"},{\"TB\":\"fn_areceber.credito_data\", \"OP\" : \"<=\", \"P\" : \"${ultimoDiaDoMes}\"}]`;

  const data = {
    qtype: 'fn_areceber.status',
    query: 'R',
    oper: '=',
    page: '1',
    rp: '100000',
    sortname: 'fn_areceber.id',
    sortorder: 'desc',
    grid_param: gridParamString
  };

  // Convertendo o objeto para uma string JSON manualmente
  const jsonString = JSON.stringify(data);

  try {
    const response = await axios.post(url, jsonString, { headers, timeout: 600000 });
    console.log(response);
    const registros = response.data.registros || [];
    console.log(registros);

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
