const fs = require('fs')
const axios = require('axios')
const baseUrl = 'https://estruturaorganizacional.dados.gov.br/'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

function getResource (resource) {
	let url = baseUrl + resource
	console.log(`Loading ${ url }`)
	return axios.get(url)
}

async function main () {
	let resource = 'doc/estrutura-organizacional'
	const response = await getResource(resource)
	console.log('carregou')
	const data = response.data
	console.log(data.servico)
	console.log(data.unidades.length + ' unidades foram encontradas')
	console.log(data.unidades[0])


/*	
	deua = data.unidades.filter(unidade => unidade.nome.toUpperCase().indexOf('ESTADOS UNIDOS') >= 0)
	deua.forEach(unidade => {
		console.log(unidade.nome, ': ', unidade.codigoUnidade)
	})
	let orgaos = data.unidades.filter(unidade => unidade.codigoUnidade == unidade.codigoOrgaoEntidade)
	let unidades = data.unidades.filter(unidade => unidade.codigoUnidade == unidade.codigoOrgaoEntidade)
	console.log('\n** ÓRGAOS')
	orgaos.forEach(orgao => console.log(orgao.nome))
	console.log(`Foram encontrados ${ orgaos.length } órgãos`)

	let mecon = orgaos.find(orgao => orgao.nome == 'Ministério da Economia')
	console.log('\n** MECON')
	console.log(mecon)

	let url = 'https://estruturaorganizacional.dados.gov.br/id/unidade-organizacional/26'
	console.log(getNumeroCodigo(url))

*/
    let entidades = data.unidades.map(unidade => {
		return {
			nome: unidade.nome,
			sigla: unidade.sigla,
			codigoUnidade: getNumeroCodigo(unidade.codigoUnidade),
			codigoOrgao: getNumeroCodigo(unidade.codigoOrgaoEntidade),
			codigoUnidadePai: getNumeroCodigo(unidade.codigoUnidadePai),
			codigoEsfera: getNumeroCodigo(unidade.codigoEsfera),
			codigoPoder: getNumeroCodigo(unidade.codigoPoder),
			unidades: [],
		}
	})
	let orgaos = entidades.filter(unidade => unidade.codigoUnidade == unidade.codigoOrgao)
	let unidades = entidades.filter(unidade => unidade.codigoUnidade != unidade.codigoOrgao)

    console.log(`${ orgaos.length } órgãos, ${ unidades.length } unidades`)
    
	let orgaosObj = []
	orgaos.forEach(orgao => {
		orgaosObj[orgao.codigoOrgao] = orgao
		//orgao.unidades = []
	})
	//console.log(orgaosObj)
	
    unidades.forEach(unidade => {
    	let codigoOrgao = unidade.codigoOrgao
    	//console.log(orgaosObj[codigoOrgao])
    	let orgao = orgaosObj[codigoOrgao]
    	if (!orgao) {
    		console.error('Unidade sem órgão: ' + unidade.nome)
    		return
    	}
    	orgao.unidades.push(unidade)
    })
    orgaos.forEach(orgao => {
    	console.log(`${ orgao.sigla }: ${ orgao.unidades.length} unidades`)
    })

    let mre = orgaos.find(orgao => orgao.sigla == 'MRE')
    console.log(mre)
    console.log('Salvando dados no arquivo orgaos.json')
    salvarDados(orgaos, './orgaos.json')
}

function getNumeroCodigo (url) {
	if (!url) return -1
	return parseInt(url.match(/\d{1,}$/)[0])
}

function salvarDados (dados, filename) {
	let fd = fs.openSync(filename, 'w')
	let json = JSON.stringify(dados)
    fs.writeSync(fd, json)
    fs.closeSync(fd)
}
 
main()