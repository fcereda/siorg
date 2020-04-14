'use strict'

const fs = require('fs')

function main () {
	//console.log(process.argv)
	let siglaOrgao = process.argv[2]
	if (!siglaOrgao) {
		return console.log('Por favor, especifique um órgao na linha de comando')
	}
    siglaOrgao = siglaOrgao.toUpperCase()
	let orgaos = carregarDados('./orgaos.json')
    let orgao  = orgaos.find(orgao => orgao.sigla == siglaOrgao)
    mostrarOrgao(orgao)
}

function carregarDados (filename) {
	//let fd = fs.openSync(filename, 'r')
	let str = fs.readFileSync(filename, 'utf-8')
	let obj = JSON.parse(str)

	return obj
}

function mostrarOrgao (orgao) {
	console.log(`Nome: ${ orgao.nome } (${ orgao.sigla }`)
	console.log(`Código: ${ orgao.codigoOrgao }`)
	console.log('${ orgao.unidades.length } unidades:')
	orgao.unidades.sort((a, b) => a.nome > b.nome ? 1 : -1)
	.forEach(unidade => console.log(`${ unidade.nome } (${ unidade.sigla}): ${ unidade.codigoUnidade }`))

	//orgao.unidades.forEach(unidade => console.log(`${ unidade.nome } (${ unidade.sigla})`))
}

main ()	