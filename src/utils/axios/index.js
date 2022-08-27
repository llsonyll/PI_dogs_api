const axios = require('axios');
const { API_KEY } = process.env;

const DogAPI = axios.create({
  baseURL: 'https://api.thedogapi.com/v1/',
  timeout: 5000,
  headers: {
     'x-api-key': API_KEY
  }
});

module.exports = DogAPI;
