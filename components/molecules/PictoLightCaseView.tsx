'use client'
import {useState, useEffect } from "react";
import Image from "next/image";
import ShelfButton from "@/components/atoms/ShelfButton"
const PictoLightCaseView = ({selectionMade}) => {
	const [currentResult, setCurrentResult] = useState("")
	const [allShelves, setAllShelves] = useState([])
	
	const getCurrentData = async () => {
		if (selectionMade !== "") {
			let selJSON = JSON.parse(selectionMade)
			let currentValue = String(Object.values(selJSON))
			try {
				const msg = {
					case:currentValue
				}
				const response = await fetch('/api/getcurrentdata', {
					method: 'POST',
					headers: {
						'content-type': 'application/json'
					},
					body: JSON.stringify(msg)
				})

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
					let result = ""
			    result = await response.json() //.then(updateCase(result))
			    //console.log(`gathered result: ${result.pictolightOptions}`)
			    setCurrentResult(result.pictolightOptions)
			    //console.log(result.pictolightOptions)
			  } 
		    catch (err) {
		      console.error('Error making GET request:', err);
		    }
		}
	}
	useEffect(() => {
		if (selectionMade !== "") {
			getCurrentData()
		}
	},[selectionMade])
	useEffect(() => {
		//console.log(`pictolight datas: ${JSON.stringify(currentResult)}`)
		const dataz = Object.keys(currentResult)
		const shelves = []
		for (let i = 0; i < dataz.length-1; i++) {
			let shelfObj = currentResult[dataz[i]]
			delete shelfObj.ALL
			shelves.push(shelfObj)
		}
		setAllShelves(shelves)
	}, [currentResult])
	useEffect(() => {
		if (allShelves[0] !== undefined) {
			console.log(allShelves[0])
			console.log(allShelves[0]["001"])
			console.log(allShelves[0]["001"].position)
			console.log(allShelves[0]["001"].width)
		}
	}, [allShelves])

	return(
		<div className="w-full h-full">
			<div className="
				w-[90vw] ml-[5vw]  
			">
				<Image
					src="./case1.svg"
					width={1800}
					height={1800}
					alt="case"
				/>
				<div className="
					absolute
					top-[22vh]
					w-[90vw] h-[58vh]
					grid grid-rows-6 grid-cols-255
				">

				</div>
			</div>
		</div>
	)
}

export default PictoLightCaseView

/*
					<div className="
						row-start-1
						col-start-1
					">
					<ShelfButton
						inchWidth={10}
						sectionNum={1}
					/>
					</div>
					<div className="
						row-start-6 
						col-start-100
					">
					<ShelfButton
						inchWidth={8}
						sectionNum={2}
					/>
					</div>
*/