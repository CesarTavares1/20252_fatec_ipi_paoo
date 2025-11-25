//se o import não funcionar
// const express = require('express')
// const axios = require('axios')
import express from 'express'
import axios from 'axios'
const app = express()
app.use(express.json())

const eventos = []

//POST /eventos
app.post('/eventos', async (req, res) => {
  const evento = req.body
  eventos.push(evento)
  console.log(evento)
  try{
    await axios.post('http://localhost:4000/eventos', evento)
  }
  catch(e){}
  try{
    await axios.post('http://localhost:5000/eventos', evento)
  }
  catch(e){}
  try{
    await axios.post('http://localhost:6000/eventos', evento)
  }
  catch(e){}
  try{
    await axios.post('http://localhost:7000/eventos', evento)
  }
  catch(e){}
  try{
    await axios.post('http://localhost:8000/eventos', evento)
  }
  catch(e){}
  try{
    await axios.post('http://localhost:9000/eventos', evento)
  }
  catch(e){}
  res.end()
})


//viabilizar a obtenção da base de eventos
app.get('/eventos', (req, res) => {
  res.json(eventos)
})


const port = 10000
app.listen(port, () => {
  console.log(`Barramento. Porta ${port}.`)
})