'use client'

import { convertColor, byteToString } from '@/utils/utils.js'

import { useState, useEffect } from 'react'

const SendButton = ({selectionMade, shelfId, sectionData, showIt, inchWidth, sectionNum}) => {
	const [label, setLabel] = useState("0"+String(sectionNum))
	const [realWidth, setRealWidth] = useState(inchWidth/3.9)

	const [currentStart, setCurrentStart] = useState("000")
	const [currentEnd, setCurrentEnd] = useState("000")

	const [ledMsg, setLedMsg] = useState("")

	const caseMap = {"001":"001", "002":"002","003":"003","ALL":"255"}

	function burstMessage() {

		if (selectionMade !== undefined) {
			const case1 = caseMap[(JSON.parse(selectionMade)).pictolightOptions]
			//const case1 = (JSON.parse(selectionMade)).pictolightOptions
			
			const center = sectionData.width/2
			const begin = sectionData.position-center
			const end = sectionData.position+center
			const endConverted = Math.ceil( (end > 280) ? 280 : end);
			const beginConverted = Math.ceil( (begin < 1) ? 1: begin);
			const beginString = byteToString(beginConverted)
			const endString = byteToString(endConverted)
			
			//setCurrentStart(byteToString(beginConverted))
			//setCurrentEnd(byteToString(endConverted))

			const nuColor = convertColor(sectionData.color)
			const red = byteToString(nuColor[0])
			const green = byteToString(nuColor[1])
			const blue = byteToString(nuColor[2])
			const animString = byteToString(sectionData.animation)
			
			setLedMsg(case1 + shelfId + 'D' + beginString + endString + red + green + blue + 'W' + animString + '000')
			sendMessage(case1 + shelfId + 'D' + beginString + endString + red + green + blue + 'W' + animString + '000')
			//console.log(`message will be ${case1} at ${shelfId}`)
		}
		//console.log(`section dataz ${JSON.stringify(sectionData)}`)
	}
	const sendMessage = async (inMsg) => {
		try {
			const msg = {
				ledmsg:inMsg
			}
			const response = await fetch('/api/led', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify(msg)
			})
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		      const result = response//await response.json();
		      //updateCurrentData()
	    } 
	    catch (err) {
	      console.error('Error making POST request:', err);
	    }
	}
	/*
	useEffect(() => {
		console.log(`new led msg: ${ledMsg}`)
	}, [ledMsg])
	*/
		// example message
		// '001003D000279000000000W000000'
	/*
	useEffect(() => {
		if (selectionMade !== undefined) {
			
		const case1 = (JSON.parse(selectionMade)).pictolightOptions
		} 
	}, [sectionData])
	*/
	return (
		<div className="w-full h-full">
			{showIt &&
				<div>
				<button className="
					text-[3vw]
					h-[6vw]
					bg-[#0053e2]
					text-[#fff]
					text-center
					border-[1vw]
					border-solid
					rounded-[0vw]
					border-[#001e60]
					font-bold
					"
					style={{width: `${realWidth}vw`}}
					 onClick={() => burstMessage()}
					
				>
					{label}
				</button>
				</div>
			}			
		</div>
	)
}

export default SendButton