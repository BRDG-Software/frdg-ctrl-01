/*
each pixel on led is approx. 0.163669064"
there is a good deal of variance here
*/
'use client'
import { React, useState, useEffect } from "react";
import Image from "next/image";

import { convertColor, mapRange, byteToString, getRandomInt } from '@/utils/utils.js'

import BigMenu from '@/components/BigMenu'
import HorizontalSlider from '@/components/atoms/HorizontalSlider'
import ToggleSwitch from '@/components/atoms/ToggleSwitch'
import ColorPicker from '@/components/atoms/ColorPicker'
import CaseToggle from '@/components/atoms/CaseToggle'
import SendButton from '@/components/atoms/SendButton'

const PictoLightCtrl = ({selectionMade, currentShelf}) => {
	const [lightOn, setLightOn] = useState(true)
	const [lockedColor, setLockedColor] = useState("#000000")
	const [currentColor, setCurrentColor] = useState("#000000")
	const [lightPosition, setLightPosition] = useState(1)
	const [lightWidth, setLightWidth] = useState(200)	
	
	const [currentMenu, setCurrentMenu] = useState("")
	const [dataFromChild, setDataFromChild] = useState("")	
	const [bigMenuVisible, setBigMenuVisible] = useState(false)
	const [currentSection, setCurrentSection] = useState("")
	const [resetSection, setResetSection] = useState()
	const [colorFromChild, setColorFromChild] = useState('')
	//const [currentShelf, setCurrentShelf] = useState("")
	const [currentCase, setCurrentCase] = useState("")
	const [currentMsg, setCurrentMsg] = useState('001003D000279000000000W000000')

	const animations = ["on", "sweep", "grow", "blink", "pulse"]
	const [currentAnimation, setCurrentAnimation] = useState(0)
	const [animationText, setAnimationText] = useState("on")
	const [animationConverted, setAnimationConverted] = useState("000")
	const [currentPosition, setCurrentPosition] = useState(150)
	const [currentWidth, setCurrentWidth] = useState(75)
	const [currentStart, setCurrentStart] = useState("000")
	const [currentEnd, setCurrentEnd] = useState("255")
	const [inchesPosition, setInchesPosition] = useState(0.125)
	const [inchesWidth, setInchesWidth] = useState(2)
	
	//const [currentColor, setCurrentColor] = useState("#000000")	
	const [currentResult, setCurrentResult] = useState("")
	useEffect(() => {
		///console.log(typeof(selectionMade))
		//let selJSON = JSON.parse(selectionMade)
		//let vally = Object.values(selJSON)
		//console.log(vally)
		//console.log(currentShelf)
		getCurrentData()
	},[])
	
	useEffect(() => {
		if (currentResult !== undefined) {
			console.log(`saved settings are ${currentResult}`)
			let currentObj = currentResult["001"]
			if (currentObj !== undefined) {
				console.log(currentObj)
				setLightPosition(currentObj.position)
				setLightWidth(currentObj.width)
				setCurrentColor(currentObj.color)
				setLightOn(currentObj.show)
			}
//			const [lightPosition, setLightPosition] = useState(1)
//	const [lightWidth, setLightWidth] = useState(200)	
	
		}
	}, [currentResult])

	const getCurrentData = async () => {
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
		    setCurrentResult(result.pictolightOptions[currentShelf])
		    //console.log(result.pictolightOptions)
		  } 
	    catch (err) {
	      console.error('Error making GET request:', err);
	    }
	}

	
	const inchesFactor = 0.163669064
	function roundyToDecimal(number, decimalPlaces) {
 		const factor = Math.pow(10, decimalPlaces);
  		return Math.trunc(number * factor) / factor;
	}
	useEffect(() => {
		setAnimationText(animations[currentAnimation])
		setAnimationConverted(byteToString(currentAnimation))
	}, [currentAnimation])
	useEffect(() => {
			//console.log(animationConverted)
	}, [animationConverted])
	useEffect(() => { 
		//console.log(lightPosition)
		updateSection()
		let outty = lightPosition*inchesFactor
		setInchesPosition(roundyToDecimal(outty,2))//*3.5)//*0.165)
	}, [lightPosition])
	useEffect(() => {
		//console.log(lightWidth)
		updateSection()
		let outty = lightWidth*inchesFactor
		setInchesWidth(roundyToDecimal(outty,2))//*3.5)//0.165)
	}, [lightWidth])
	
	const updateSection = () => {
		const center = lightWidth/2
		const begin = lightPosition-center
		const end = lightPosition+center
		/*
		if (end > 280) {
			let endConverted = 280
		}
		else { endConverted = end}
		*/
		let endConverted = Math.ceil( (end > 280) ? 280 : end);
		let beginConverted = Math.ceil( (begin < 1) ? 1: begin);
		setCurrentEnd(byteToString(endConverted))
		setCurrentStart(byteToString(beginConverted))
	}

	let newColor = "#000000"
	const colorChange = (event) => {
		newColor = event.target.value
		setCurrentColor(event.target.value)
		setLockedColor(currentColor)
	}
	const colorClear = () => {
		newColor = ""
		setCurrentColor("")
	}
	const updateColor = () => {}
	
	function handleOnOffToggle(data) {
		//console.log(`on or off? ${data}`)
		setLightOn(data)
	}
	function handleChildAnimation(data) {
		setCurrentAnimation(data)
	}
	function handleChildPosition(data) {
		setLightPosition(data)
		setCurrentPosition(data)
	}
	function handleChildWidth(data) {
		setLightWidth(data)
		setCurrentWidth(data)
	}

	function handleToggleDataFromChild(data) {
		doMenuChange(data)
		setBigMenuVisible(true)
	}
	function handleColorDataFromChild(data) {
		setColorFromChild(data)
		setCurrentColor(data)
	}
	function handleDataFromChild(data) {
	    setDataFromChild(data)
	    let datajson = JSON.parse(data)
	    setCurrentSection(datajson.pictolightSectionOptions)
	    setBigMenuVisible(false)
	  }
	  const doMenuChange = (menuChange) => {
	    setCurrentMenu(menuChange)
	  }
	  const killMenu = () => {
	    setBigMenuVisible(false)
	  }

	useEffect(() => {
		//setShelfDataFromChild("")
		
		//setResetShelf(getRandomInt(1,9999))
		
		let casey = JSON.parse(selectionMade)
		updateCase(casey)
		
	}, [selectionMade])

	const updateCase = (casein) => {
		setCurrentCase(Object.values(casein)) //casein.pictolightOptions)
	}

	const [caseConverted, setCaseConverted] = useState("001")
	const [shelfConverted, setShelfConverted] = useState("001")
	useEffect(() => {
		if (currentCase == "ALL"){
			setCaseConverted("255")
		}
		else {setCaseConverted(currentCase)}
	}, [currentCase])
	useEffect(() => {
		if (currentShelf == "ALL"){
			setShelfConverted("255")
		}
		else {setShelfConverted(currentShelf)}
	}, [currentShelf])


	useEffect(() => {
		if (lightOn == true) {
			console.log('sending product light off message')
			setCurrentMsg(caseConverted + shelfConverted + 'D' +
				currentStart + currentEnd + '000000000W000000')
		}
		else if (lightOn == false) {
			console.log('sending product light on message')
			const nuColor = convertColor(currentColor)
			//setCurrentMsg(caseConverted + shelfConverted + "D" +
			//	currentStart + currentEnd + 
			//	byteToString(nuColor[0]) + byteToString(nuColor[1]) + byteToString(nuColor[2])
			//	+ "W000000" )
		}
	}, [lightOn])

	const burstMessage = () => {
		const nuColor = convertColor(currentColor) 
		setCurrentMsg(caseConverted + shelfConverted + "D" + currentStart + currentEnd + 
			byteToString(nuColor[0]) + byteToString(nuColor[1]) + byteToString(nuColor[2])
			+ "W" + animationConverted + "000")
	}
	useEffect(() => {
		console.log(`attempting to send led message: ${currentMsg}`)	
		sendMessage()
	},[currentMsg])

	const sendMessage = async () => {
		try {
			const msg = {
				ledmsg:currentMsg
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
	    } 
	    catch (err) {
	      console.error('Error making POST request:', err);
	    }
	}

	return(
		<div className="w-full h-full">
			<div className="
				w-full h-full 
				pt-0
				grid grid-cols-20 
				grid-rows-40
				font-regular
				text-left 
			">
				<div className="
					col-start-2
					col-span-18
					row-start-1
					row-span-4
					flex 
					items-center
				">	
					<div className="relative -top-[12vh] w-full h-full">
					<Image
						src="./productLight.svg"
						width={1080}
						height={1080}
						priority
						loading="eager"
						alt="product light"
					/>
					</div>
				</div>
	            <div className="
	            	col-span-18
	            	row-start-4
	            	row-span-1
	            	col-start-2
	             	w-[95%] min-w-[1em] h-1 
	              self-stretch m-auto "
	              style={{backgroundColor:'#4dbdf5'}}
	            >
	            </div>
	            <div className="
	            	w-full 
	            	row-start-5 
	            	row-span-40
	            	col-start-1
	            	col-span-20
	            	font-regular
	            	text-left
	            	grid grid-cols-20
	            	grid-rows-40
	            	">
					<div className="
						col-start-2 col-span-8
						row-span-2
						text-[6vw]
						pt-[1vh]
					">Show/Hide:</div>
					<div className="
						col-start-15 col-span-6
						row-span-3
					">
						<ToggleSwitch
							toggleValueUp={handleOnOffToggle}
						/>
					</div>
					<div className="
						col-start-2 col-span-8
						row-start-6 row-span-2
						text-[4.6vw]
					">
						Section #:
					</div>
					<div className=" 
						col-start-16 col-span-6
						row-start-4 row-span-4
						w-full h-full -mt-[3vh]
					">
						<CaseToggle
							toggleMenu={handleToggleDataFromChild}
							name={''}
							value={'pictolightSectionOptions'}
							selectionMade={dataFromChild}
							currentMenu={currentMenu}
							bigMenuVisible={bigMenuVisible}
							resetit={resetSection}
							defaulty={'001'}
						/>
					</div>
					<div className="
						col-start-2 col-span-6
						row-start-9
						row-span-2
						text-[4.6vw]
					">Animation:
					</div>				
					<div className="
						col-start-8 col-span-9
						row-start-9
						row-span-2
						text-[4.6vw]
						-pt-[0.6vh]
					">
						<HorizontalSlider
							defaulty={currentAnimation}
							minimum={0}
							maximum={4}
							sliderValueUp={handleChildAnimation}
						/>
					</div>	            
					<div className="
						col-start-17 col-span-4
						row-start-8
						mt-[1.1vh]
						row-span-2
						text-[4.6vw]
						font-bold
						text-center
					"> {animationText}
					</div>
					<div className="
						col-start-2 col-span-6
						row-start-12
						row-span-2
						text-[4.6vw]
					">Position:
					</div>				
					<div className="
						col-start-8 col-span-9
						row-start-12
						row-span-2
						text-[4.6vw]
						-pt-[0.6vh]
					">
						<HorizontalSlider
							defaulty={currentPosition}
							minimum={1}
							maximum={278}
							sliderValueUp={handleChildPosition}
						/>
					</div>	            
					<div className="
						col-start-17 col-span-4
						row-start-11
						mt-[1.4vh]
						row-span-2
						text-[4.6vw]
						font-bold
						text-center
					"> {inchesPosition}"
					</div>
					<div className="
						col-start-2 col-span-6
						row-start-15
						row-span-2
						text-[4.6vw]
					">Width:
					</div>
					<div className="
						col-start-8 col-span-9
						row-start-15
						row-span-2
						text-[51px]
					">	
						<HorizontalSlider
							defaulty={currentWidth}
							minimum={1}
							maximum={278}
							sliderValueUp={handleChildWidth}
						/>
					</div>
					<div className="
						col-start-17 col-span-4
						row-start-14
						mt-[1.5vh]
						row-span-2
						text-[4.6vw]
						font-bold
						text-center
					">{inchesWidth}"
					</div>
					<div className="
						col-start-2 col-span-4
						row-start-18
						row-span-2
						text-[4vw]
						font-regular
					">
						Color:
					</div>
					<div className="
						col-start-2 col-span-8
						row-start-20
						row-span-4
						text-[4.2vw]
						font-bold
						text-[#fff]

					">
						<div className="
							relative
							w-[25vw] h-[12vw]
							bg-[#9c9c9c]
							text-center
							border-[1vw]

							border-solid
							rounded-[3vw]
							border-[#001e60]
						">
						<input type="text" 
								value={currentColor}
								onChange={colorChange}
								onFocus={colorClear}
								onBlur={updateColor}
								className="
								w-full h-full text-center"
							/>
						</div>
					</div>
					<div className="
						-mt-[2vh]
						w-[40vw]
						h-[40vw]
						col-start-10
						row-start-19
						row-span-6
						place-items-center
						text-center
					">
						<ColorPicker
							getColorFromChild={handleColorDataFromChild}	
						/>
					</div>
					<div className="
						w-full h-full
						col-start-2 col-span-6
						row-start-25 row-span-4

					">
						<SendButton
							burstMessage={burstMessage}
						/>
					</div>
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

export default PictoLightCtrl