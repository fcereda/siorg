var fs = require('fs')

var express = require('express')
var app = express()
let root = process.env.PWD 

let orgaos = carregarOrgaos ()


app.get('/orgaos', (req, res, next) => {
    //let orgaos = ['MRE', 'MECON', 'MD', 'MS']
    //console.log(orgaos)
    let orgaosSimplificado = orgaos.map(({nome, sigla}) => {
    	return {
    		nome,
    		sigla
    	}	
    })
    res.status(200).json(orgaosSimplificado)
})

app.get('/orgao/:orgao', (req, res) => {
	let siglaOrgaoSolicitado = req.params.orgao.toUpperCase()
	let orgaoSolicitado = orgaos.find(({sigla}) => sigla == siglaOrgaoSolicitado)
	if (orgaoSolicitado)
		return res.status(200).json(orgaoSolicitado)
	return res.json({ erro: 'Órgão não encontrado' }, 500)
})

app.get('/', (req, res) => {
	res.sendFile('./static/index.html', {root})
})

app.listen(3000, () => {
	console.log('Server running on port 3000')
})


function carregarOrgaos () {
	let orgaos = carregarDados('./orgaos.json')
	return orgaos
}

function carregarDados (filename) {
	let str = fs.readFileSync(filename, 'utf-8')
	let obj = JSON.parse(str)
	return obj
}

