const fs = require('fs')

const writeIt = async (filepath, fileo) => {
	let stringo = JSON.stringify(fileo, null, 2)
	fs.writeFile(filepath, stringo, (err) => {
		if (err) {
			console.error('Error writing to currentData file: ', err)
			return
		}
		console.log('currentData file write success ', caseData)
	})	
}

let caseData = ""

export async function POST(request) {
	const body = await request.json()
		//the case data to be modified
	const casey = Object.keys(body)

	//console.log(`da body: ${JSON.stringify(body)}`)
	
	caseData = "./public/currentData/" + casey + ".json"
	//console.log(caseData)
	
	let allData = JSON.parse(fs.readFileSync(caseData,'utf8'))
	
	//console.log(JSON.stringify(allData))
	
		//the key that we'll update
	const updateKey = Object.keys(body[casey])

	let shelfKey = ""	
	let sectionKey = ""
	//console.log(`updato ${updateKey}`)
	
	if (updateKey == "productlightOptions") {
		shelfKey = body[casey].productlightOptions.currentShelf
		allData[updateKey][shelfKey] = body[casey][updateKey][shelfKey]
	}
	else if (updateKey == "displayOptions") {
		allData[updateKey] = body[casey][updateKey]
	}
	else if (updateKey == "pictolightOptions") {
		shelfKey = Object.keys(body[casey].pictolightOptions)
		sectionKey = Object.keys(body[casey].pictolightOptions[shelfKey])
		//console.log(JSON.stringify(body[casey].pictolightOptions[shelfKey][sectionKey]))
		//console.log(JSON.stringify(allData[updateKey][shelfKey][sectionKey]))
		
		allData[updateKey][shelfKey][sectionKey] = body[casey].pictolightOptions[shelfKey][sectionKey]
	}

	if ((caseData !== undefined) && (allData != undefined)){
		writeIt(caseData, allData)
	}

	return new Response(JSON.stringify({ message: 'received updateContent messgae Success' }), {
		headers: { 'Content-Type': 'application/json' },
	});

	//console.log(`updating current data from api request`)
	//return new Response(`updating current data`, {status: 200})	
}