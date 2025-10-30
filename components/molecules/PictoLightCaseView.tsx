'use client'
import {useState, useEffect } from "react";
import Image from "next/image";
import ShelfButton from "@/components/atoms/ShelfButton"
const PictoLightCaseView = ({selectionMade}) => {
	const [currentResult, setCurrentResult] = useState("")
	const [allShelves, setAllShelves] = useState([])
	const [refreshKey, setRefreshKey] = useState(0)
	const forceRefresh = () => setRefreshKey(prevKey => prevKey + 1)
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
			console.log(`selecty made`)
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
			//console.log(JSON.stringify(Object.keys(shelfObj)))
			//for (const [key] of Object.entries(shelfObj)) {
			///	let eachSection = shelfObj[key]
			//	eachSection["id"] = key
			//	console.log(eachSection)
				
				//console.log(shelfObj[key])
			//}
			//console.log(JSON.stringify(shelfObj))
			shelves.push(shelfObj)
		}
		//console.log(`current resulto ${JSON.stringify(currentResult)}`)
		setAllShelves(shelves)
	}, [currentResult])
	
	const [sectionOne, setSectionOne] = useState([])
	const [sectionOneReversed, setSectionOneReversed] = useState([])
	const [sectionTwo, setSectionTwo] = useState([])
	const [sectionTwoReversed, setSectionTwoReversed] = useState([])
	const [sectionThree, setSectionThree] = useState([])
	const [sectionThreeReversed, setSectionThreeReversed] = useState([])
	const [shelfIds, setShelfIds] = useState(["005", "004", "003", "002", "001", "000"])
	const [mapKey, setMapKey] = useState(10)
	useEffect(() => {
		console.log(`all shelves updated `)
		//setSectionOne([])
		if (allShelves[0] !== undefined) {
			//console.log(JSON.stringify(allShelves))
			
			//console.log(JSON.stringify(allShelves[0]["001"]))
			//console.log(JSON.stringify(allShelves[1]["001"]))
			
			/*
			console.log(allShelves.length)
			console.log(allShelves[0])
			console.log(allShelves[0]["001"])
			console.log(allShelves[0]["001"].position)
			console.log(allShelves[0]["001"].width)
			*/
			//console.log(allShelves[5]["001"].position)
			//setSectionOne([])
			setTimeout(()=> {
				console.log(`all shelves ${allShelves.length}`)
				const sectiony1 = [];
				const sectiony2 = [];
				const sectiony3 = [];
				for (let i = 0; i < allShelves.length; i++) {
						console.log("pusshing it")
						sectiony1.push(allShelves[i]["001"])
						sectiony2.push(allShelves[i]["002"])
						sectiony3.push(allShelves[i]["003"])
						setMapKey(mapKey +1 )
					}
				setSectionOne(sectiony1)
				setSectionOneReversed(sectiony1)
				sectionOneReversed.reverse()
				setSectionTwo(sectiony2)
				setSectionTwoReversed(sectiony2)
				sectionTwoReversed.reverse()
				setSectionThree(sectiony3)
				setSectionThreeReversed(sectiony3)
				sectionThreeReversed.reverse()
			}, 5)
			/*
			for (let i = 0; i < allShelves.length; i++) {
				sectionOne.push(allShelves[i]["001"])
				sectionTwo.push(allShelves[i]["002"])
				sectionThree.push(allShelves[i]["003"])
			}
			setSectionOneReversed(sectionOne)
			sectionOneReversed.reverse()
			*/
			//console.log(`section 1: ${JSON.stringify(sectionOne)}`)
		}
	}, [allShelves])

	const updateShelves = () => {
		for (let i = 0; i < allShelves.length; i++) {
				sectionOne.push(allShelves[i]["001"])
				sectionTwo.push(allShelves[i]["002"])
				sectionThree.push(allShelves[i]["003"])
			}
		setSectionOneReversed(sectionOne)
		sectionOneReversed.reverse()
			
	}

	return(
		<div className="w-full h-full" key={mapKey}>
			<div className="
				w-[90vw] ml-[5vw] 
			"

			>
				<Image
					src="./case1.svg"
					width={1800}
					height={1800}
					alt="case"
				/>
				{sectionOne[0] &&
				<div className="
					absolute 
					top-[22vh] -left-[0vw]
					w-[90vw] h-[58vh]
					grid grid-rows-6 grid-cols-278
					
				">
					{sectionOne.map((key,index) => {
						return(
							<div className="
								row-start-1 w-full
								flex justify-center
								"
								key={mapKey+index}
								style={{gridColumnStart: `${sectionOne[index].position}`,
										gridRowStart : `${index+1}`
									}}
							>
								<div> 
							<ShelfButton
								key={`shelfy ${index+mapKey}`}
								selectionMade={selectionMade}
								shelfId = {shelfIds[index]}
								showIt = {sectionOne[index].show}
								sectionData={sectionOne[index]}
								inchWidth={sectionOne[index].width}
								sectionNum={1}
							/>
								</div>
							</div>
							)
					})}
					{sectionTwo.map((key,index) => {
						return(
							<div className="
								row-start-3 w-full 
								flex justify-center
								"
								key={mapKey+index}
								style={{gridColumnStart: `${sectionTwo[index].position}`,
										gridRowStart : `${index+1}`
									}}
							>
								<div> 
							<ShelfButton
								key={`shelfy ${index+mapKey}`}
								selectionMade={selectionMade}
								shelfId = {shelfIds[index]}
								showIt = {sectionTwo[index].show}
								sectionData={sectionTwo[index]}
								inchWidth={sectionTwo[index].width}
								sectionNum={2}
							/>
								</div>
							</div>
							)
					})}	
					{sectionThree.map((key,index) => {
						return(
							<div className="
								row-start-5 w-full 
								flex justify-center
								"
								key={mapKey+index}
								style={{gridColumnStart: `${sectionThree[index].position}`,
										gridRowStart : `${index+1}`
									}}
							>
								<div> 
							<ShelfButton
								key={`shelfy ${index+mapKey}`}
								selectionMade={selectionMade}
								shelfId = {shelfIds[index]}
								showIt = {sectionThree[index].show}
								sectionData={sectionThree[index]}
								inchWidth={sectionThree[index].width}
								sectionNum={3}
							/>
								</div>
							</div>
							)
					})}					
				</div>
				}
			</div>
		</div>
	)
}

export default PictoLightCaseView

/*
					<div className="
						row-start-1
						"
						style={{gridColumnStart: `${sectionOne[0].position}`}}
					> 
					<ShelfButton
						inchWidth={sectionOne[0].width}
						sectionNum={1}
					/>
					</div>
					<div className="
						"
						style={{gridColumnStart: `${sectionOne[1].position}`,
							gridRowStart: `2`
						}}
					> 
					<ShelfButton
						inchWidth={sectionOne[1].width}
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



${allShelves[4]["001"].position}

				{allShelves.map((item, index)=> (
						<h1 key={index}> {item} </h1>
					))}

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