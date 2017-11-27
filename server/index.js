'use strict'

const express = require('express')
const volleyball = require('volleyball')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

app.use(volleyball)
app.use(express.static(path.join(__dirname,'..','public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


app.get('*',(req,res) => {
    res.sendFile(path.join(__dirname,'..','public','index.html'))
})

app.use((err,req,res,next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status||500).send(err.message||'Internal server error.')
})

module.exports = app