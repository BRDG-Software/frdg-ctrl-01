'use client'
import { React, useState, useEffect } from "react";
import Image from "next/image";
import { getRandomInt } from '@/utils/utils.js'

import BigMenu from '@/components/BigMenu'
import CaseToggle from '@/components/atoms/CaseToggle'
import PictoLightCaseView from '@/components/molecules/PictoLightCaseView'
import PictoLightCtrl from '@/components/molecules/PictoLightCtrl'

const CaseOptionsHeader = ({selectionMade}) => {

	const [currentMenu, setCurrentMenu] = useState("")
	const [dataFromChild, setDataFromChild] = useState("")
 	
  	const [menuToggleFromChild, setMenuToggleFromChild] = useState("")
  	const [bigMenuVisible, setBigMenuVisible] = useState(false)
	const [shelvesVisible, setShelvesVisible] = useState(false)
	const [shelfName, setShelfName] = useState("Pick-to-Light")
	const [currentShelf, setCurrentShelf] = useState("")
	const [resetShelf, setResetShelf] = useState()

	function handleToggleDataFromChild(data) {
		doMenuChange(data)
		setBigMenuVisible(true)
	}
	function handleDataFromChild(data) {
	    setDataFromChild(data)
	    let datajson = JSON.parse(data)
	    //console.log(datajson.pictolightShelfOptions)
	    setCurrentShelf(datajson.pictolightShelfOptions)
	    setBigMenuVisible(false)
	    setShelvesVisible(true)
	    setShelfName("Shelf P2L")
	  }
	  const doMenuChange = (menuChange) => {
	    setCurrentMenu(menuChange)
	  }
	  const killMenu = () => {
	    setBigMenuVisible(false)
	  }

	useEffect(() => {
		//if we select a different case, refresh the page
		//console.log("RELOADIT")
		setDataFromChild("")
		setShelvesVisible(false)
		setShelfName("Pick-to-Light")
		setResetShelf(getRandomInt(1,9999))
	}, [selectionMade])
	return(
		<div className="w-full h-full">
		<div className="
			w-full h-full 
			justify-items-center
			text-center
			grid grid-cols-10
			grid-rows-100
			gap-0

		">
				<div className="
					col-start-1 col-span-4
					w-full
					row-start-3
					row-span-10
					font-light
					text-[6vw]
					text-left
					ml-[10vw]
					pl-[1vw] pt-[2vh] 
				">
					{shelfName}
				</div>
			{shelvesVisible && (
			<div className="
				w-full
				col-start-1 col-span-4
				row-start-9
				row-span-10 
				pl-[6vw] pt-0
				font-light text-[6vw] text-left
			">
				<div className="inline w-full">Label:</div>
				<div className="inline w-full pl-10 font-bold">
					{currentShelf}</div>
			</div>
			)}
			<div className="
				col-start-8 col-span-5 
				row-start-3
				h-[10vh] w-[20vw]
				row-span-24
				z-900
			"> 
				<CaseToggle
					toggleMenu={handleToggleDataFromChild}
					name={"Shelf #"}
					value={"pictolightShelfOptions"}
					selectionMade={dataFromChild}
					currentMenu={currentMenu}
					bigMenuVisible={bigMenuVisible}
					resetit={resetShelf}
				/>
			</div>
			<div className="
				ml-0
				col-span-10
				col-start-1
				row-start-15
				w-full
				row-span-100
			">
				{!shelvesVisible ? (
				<PictoLightCaseView/>
				) : (
				<PictoLightCtrl
					selectionMade={selectionMade}
					currentShelf={currentShelf}
				/>
				)
				}			
			</div>		

		</div>
      {bigMenuVisible &&
      <div className="
        absolute top-0 left-0 z-400
        w-screen
        h-screen
        "
        onClick={() => killMenu()}
        >
          <div className=" relative
            top-100
          ">
          <BigMenu 
            className="z-500" 
            sendMenuMsgToParent={handleDataFromChild}
            whichMenu={currentMenu} />
          </div>
      </div>
      }
    </div>
	)
}

export default CaseOptionsHeader

/*
			{shelvesVisible && (
			<div className="
				w-60
				h-40
				col-span-5
				col-start-8
				row-start-35
				place-items-center
			">
				<CaseToggle
					toggleMenu={handleToggleDataFromChild}
					name={''}
					value={'pictolightSectionOptions'}
					selectionMade={dataFromChild}
					currentMenud={currentMenu}
					bigMenuVisible={bigMenuVisible}
					resetit={resetShelf}
					/>
			</div>
			)}
*/