'use client'
import { React, useState, useEffect } from "react";
import Image from "next/image";
import data from '@/public/data.json'
import { stringToKeyValue } from '@/utils/utils.js'

import ProductLightCtrl from '@/components/molecules/ProductLightCtrl'
import VideoSelectables from '@/components/atoms/VideoSelectables'

const CaseOptionsBody = ({selectionMade, currentSelection}) => {
	const [caseDisplay, setCaseDisplay] = useState(false)
	const [casePicto, setCasePicto] = useState(false)
	const [caseProduct, setCaseProduct] = useState(false)
	const [currentPage, setCurrentPage] = useState("")
	const [caseNum, setCaseNum] = useState(currentSelection)
	const [currentScreen, setCurrentScreen] = useState("")
	//const routeRules = data
	const imgRules = data.contentRoutes
	const displayOptions = data.displayOptions
		
	let imgUrls = []

	let screenMaps = []


	//console.log(`DISPLAY TITLES: ${displayTitles}`)
	useEffect(() => {
		if (selectionMade !== "") {
			let selParsed = JSON.parse(selectionMade)
			Object.keys(selParsed).forEach(function(key) {
				let keyo = Object.keys(selParsed) 
				setCurrentPage(keyo)
				if (keyo == "displayOptions") {
					setCaseDisplay(true)
					setCasePicto(false)
					setCaseProduct(false)
	
				}
				else if (keyo == "pictolightOptions") {
					setCaseDisplay(false)
					setCasePicto(true)
					setCaseProduct(false)
					//setNamo("Shelf P2L")
									}
				else if (keyo == "productlightOptions") {
					setCaseDisplay(false)
					setCasePicto(false)
					setCaseProduct(true)
					//setNamo("Product Light")
				}
			})


		}
	}, [selectionMade])

	const displayKeys = Object.keys(imgRules)
	let processedImgUrls = {}
	useEffect(() => {
		setCaseNum(currentSelection)
		for (let i = 0; i < displayOptions.length; i++) {
			if (displayOptions[i].name == currentSelection) {
				//console.log("found")
				//console.log(displayOptions[i].msg)
				setCurrentScreen(displayOptions[i].msg)

					// /img/screen1/kraft/frame1.png

				for (let key in imgRules) {
					imgUrls.push(`${key}: /imgIcon/${displayOptions[i].msg}/${key}/frame1.png`)	
					//imgUrls.push(`/imgIcon/${displayOptions[i].msg}/${key}/frame1.png`)
				}
				processedImgUrls = stringToKeyValue(imgUrls)
			}
		}
	}, [currentSelection])

	let urlo = "/imgIcon/screen1/rollback/frame1.png"

	for (let i = 0; i < displayOptions.length; i++) {
			if (displayOptions[i].name == currentSelection) {
				//console.log("found")
				//console.log(displayOptions[i].msg)
			
					// /img/screen1/kraft/frame1.png

				for (let key in imgRules) {
					imgUrls.push(`${key}: /imgIcon/${displayOptions[i].msg}/${key}/frame1.png`)	
					//imgUrls.push(`/imgIcon/${displayOptions[i].msg}/${key}/frame1.png`)
				}
				processedImgUrls = stringToKeyValue(imgUrls)
			}
		}

	return(
		<div className="
			w-full h-full
			justify-items-center
			text-center

		">
			<div>
				{caseDisplay && (
				<div className="
					h-full w-full
					mt-[15vh]
				">	
					<VideoSelectables
						selectionMade={selectionMade}
						imgRules={imgRules}
						processedImgUrls={processedImgUrls}
						currentScreen={currentScreen}
					/>					
				</div>
				)}
				{ caseProduct && (
				<div className="
					h-screen w-full
				">
				 	<ProductLightCtrl
				 		selectionMade={selectionMade}
				 	/>
				</div>
				)}
			</div>
		</div>
		)
}

export default CaseOptionsBody

/*
<VideoSelectables
	imgRules={imgRules}
	processedImgUrls={processedImgUrls}
	currentScreen={currentScreen}
/>
*/