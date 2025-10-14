import { NextResponse } from 'next/server'
//import data from '@/public/currentData.json'
import dataAll from '@/public/currentData/ALL.json'
import data001 from '@/public/currentData/001.json'
import data002 from '@/public/currentData/002.json'
import data003 from '@/public/currentData/003.json'

export async function POST(request) {
	const msg = await request.json()
	const msgin = msg.case
	let datain = {}
	
	//if (msgin == "ALL") {
	//	datain = dataAll
	//}

	switch (msgin) {
	case "ALL":
		datain = dataAll;
		break;
	case "001":
		datain = data001;
		break;
	case "002":
		datain = data002;
		break;
	case "003": 
		datain = data003;
		break;
	}

	console.log(`returning current data from api request`)
	console.log(`we received case ${msgin}`)
	//return NextResponse.json( {message: 'googidee'})
	//return new Response(`body: "coolstuff"`, {status: 200})	

	return new Response(JSON.stringify(datain), {
		headers: { 'Content-Type': 'application/json'},	
	})
}