'use client'
import { React, useState, useEffect } from "react";
import Image from "next/image";

import CaseOptionsHeader from '@/components/molecules/CaseOptionsHeader'
import CaseOptionsBody from '@/components/molecules/CaseOptionsBody'
import CaseOptionsPictolight from '@/components/molecules/CaseOptionsPictolight'
/*


*/
const CaseOptions = ({ selectionMade }) => {
	
	const [caseDisplay, setCaseDisplay] = useState(false)
	const [casePicto, setCasePicto] = useState(false)
	const [currentSelection, setCurrentSelection] = useState("")
	
	useEffect(() => {
		if (selectionMade !== "") {

			let selParsed = JSON.parse(selectionMade)
			 Object.values(selParsed).forEach(value => {
			 		setCurrentSelection(value)
			 		//console.log(value)
			 })			
			Object.keys(selParsed).forEach(function(key) {
				let keyo = Object.keys(selParsed) 
				if (keyo == "displayOptions" ||
					keyo == "productlightOptions"
					) {
					setCaseDisplay(true)
					setCasePicto(false)
				}
				else if (keyo == "pictolightOptions") {
					setCaseDisplay(false)
					setCasePicto(true)
				}
			})
		}
	}, [selectionMade])

	return (
	<div className="
		w-full h-full
		grid grid-rows-20
		gap-0 m-auto

	">
		{caseDisplay  ? (
		<div className="
			h-full
			w-full 
			grid
		">
			<div className="
				row-span-3
			
			">
				<CaseOptionsHeader 
					selectionMade={selectionMade}
				/>
			</div>
			
		
			<div className="
				w-full 
				h-screen
				absolute
				top-[24vh]
			">
				<CaseOptionsBody
					selectionMade={selectionMade}
					currentSelection={currentSelection}
				/>
			</div>
		</div>
		) : (
			<div className="
				h-full
				w-full row-span-20
			">
				<CaseOptionsPictolight 
					selectionMade={selectionMade}
				/>
			</div>
		

		)
		}	
	</div>

	)
}

export default CaseOptions