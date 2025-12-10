const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

app.get('/monitoramento', async (req, res) => {
  try{
    const retorno = await axios.get('http://localhost:10000/verificar')
    console.log(retorno.data)
  } catch(e){
    console.log('Barramento não esta funcionando')
  }
  res.end()
})

const port= 12000
app.listen(port, () => console.log(`Monitoramento. Porta:${port}`))