'use client'

//export const dynamic = "force-dynamic";
//import mqtt from 'mqtt'
import { useState, useEffect, useRef } from "react"
import Image from "next/image";

import { convertColor, mapRange, byteToString, getRandomInt } from '@/utils/utils.js'

import BigMenu from '@/components/BigMenu'
import HorizontalSlider from '@/components/atoms/HorizontalSlider'
import ToggleSwitch from '@/components/atoms/ToggleSwitch'
import ColorPicker from '@/components/atoms/ColorPicker'
import SendButton from '@/components/atoms/SendButton'
import CaseToggle from '@/components/atoms/CaseToggle'

const ProductLightCtrl = ({selectionMade}) => {
		//the ip of the pi to send led change requests to 
	const server_ip = process.env.NEXT_PUBLIC_DB_HOST

		//on render, set a timer to wait for settings to load,
		//before sending messages or updating data
	const [loaded, setLoaded] = useState(false)
	const loadTimerRef = useRef(null)
	const loadingTime = 1000

	const [lightOn, setLightOn] = useState(false)
	const [defaultLightOn, setDefaultLightOn] = useState(false)
	const [currentMsg, setCurrentMsg] = useState('001003T000255000000000W000000')
	const [currentColor, setCurrentColor] = useState("#000000")
	const [lockedColor, setLockedColor] = useState("#000000")
	const [lightTemp, setLightTemp] = useState("111")
	const [lightTempReal, setLightTempReal] = useState("2000k")
	const [coolTemp, setCoolTemp] = useState("000")
	const [warmTemp, setWarmTemp] = useState("111")

	const [lightBrightness, setLightBrightness] = useState("255")
	const [sliderTemp, setSliderTemp] = useState("222")

	const [colorFromChild, setColorFromChild] = useState('')

	const [shelfDataFromChild, setShelfDataFromChild] = useState("")
	const [resetShelf, setResetShelf] = useState()
	const [currentMenu, setCurrentMenu] = useState("productlightShelfOptions")
	const [bigMenuVisible, setBigMenuVisible] = useState(false)
	const [currentShelf, setCurrentShelf] = useState("001")
	const [currentCase, setCurrentCase] = useState("")
	const [currentValue, setCurrentValue] = useState("001")
	const [renderKey, setRenderKey] = useState(0)
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
	function handleColorDataFromChild(data) {
		setColorFromChild(data)
		setCurrentColor(data)
		//console.log(`child color data is ${data}`)
	}
	function handleChildTemp(data) {
		setLightTemp(data)
	}

	useEffect(() => {
		//console.log(`light on: ${lightOn}`)
		if (lightOn == true) {
			//console.log('sending product light off message')
			setCurrentMsg(caseConverted + shelfConverted + 'T000255000000000W000000')
		}
		else if (lightOn == false) {
			//console.log('sending product light on message')
			const nuColor = convertColor(currentColor)
			setCurrentMsg(caseConverted + shelfConverted + "T000255" + 
				byteToString(nuColor[0]) + byteToString(nuColor[1]) + byteToString(nuColor[2])
				+ "W" + coolTemp + warmTemp)
		}
	}, [lightOn])

	useEffect(() => {
		let warmy = 0
		let coldy = 0
		
		const tempy = parseInt(lightTemp)
		if (tempy >= 0) {
			warmy = tempy
			coldy = 0
		}
		else if (tempy < 0) {
			warmy = 0
			coldy = tempy * -1
		}
		let tempyNumbers = parseInt(mapRange(tempy, -255, 255, 6000, 2000))
		setLightTempReal(String(tempyNumbers) + "k")
		setCoolTemp(byteToString(coldy))
		setWarmTemp(byteToString(warmy))
	}, [lightTemp])

	function handleChildBrightness(data) {
		setLightBrightness(data)
	}
	function handleOnOffToggle(data) {
		//console.log(`on or off? ${data}`)
		setLightOn(data)
	}
	function handleShelfToggleDataFromChild(data) {
		doMenuChange(data)
		setBigMenuVisible(true)
	}
	function handleShelfDataFromChild(data) {
	    //console.log(`shelfy data: ${data}`)
	    setShelfDataFromChild(data)
	    let datajson = JSON.parse(data)
	    //console.log(datajson.pictolightShelfOptions)
	    if (datajson.productlightShelfOptions == "CANOPY") {
	    	setCurrentShelf("006")
	    }
	    else {
	    	setCurrentShelf(datajson.productlightShelfOptions)
	    }
	    setBigMenuVisible(false)

		setLoaded(false)
		loadTimer()
	 }
	const doMenuChange = (menuChange) => {
		setCurrentMenu(menuChange)
	}
	const killMenu = () => {
		setBigMenuVisible(false)
	}

	useEffect(() => {
		//console.log(`on load our selectionMade: ${selectionMade}`)
		getCurrentData()
		loadTimer()
	},[])

	const loadTimer = () => {
		if (loadTimerRef.current) {
			clearTimeout(loadTimerRef.current)
			loadTimerRef.current = null
		}
		loadTimerRef.current = setTimeout(() => {
			console.log("loading done")
			setLoaded(true)
		}, loadingTime)
	}

	useEffect(() => {
		const selecty = JSON.parse(selectionMade)
		setCurrentValue(Object.values(selecty))
		//console.log(`selecty made says selectionMade: ${selectionMade}`)
		//getCurrentData()

		setShelfDataFromChild("")
		//setShelvesVisible(false)
		//setShelfName("Product Light")
		setResetShelf(getRandomInt(1,9999))
		let casey = JSON.parse(selectionMade)
		updateCase(casey)

	}, [selectionMade])

	const updateCase = (casein) => {
		setCurrentCase(casein.productlightOptions)
	}

	const [caseConverted, setCaseConverted] = useState("001")
	const [shelfConverted, setShelfConverted] = useState("001")
	useEffect(() => {
		if (currentCase == "ALL"){
			setCaseConverted("255")
		}
		else {setCaseConverted(currentCase)}
	}, [currentCase])

	const burstMessage = async() => {
			const nuColor = convertColor(currentColor)
			setCurrentMsg(caseConverted + shelfConverted + "T000255" + 
				byteToString(nuColor[0]) + byteToString(nuColor[1]) + byteToString(nuColor[2])
				+ "W" + coolTemp + warmTemp)
			console.log(`attempting to send led message: ${currentMsg}`)
		
	}

	useEffect(() => {
		if (loaded == true) {
			console.log(`current product light message: ${currentMsg}`)
				// send the led message as api request 
			console.log('attempting to send light message')
			sendMessage()
		}
	}, [currentMsg])

	const [currentResult, setCurrentResult] = useState("")

		//get the current saved choices to display
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
		    setCurrentResult(result)
		  } 
	    catch (err) {
	      console.error('Error making GET request:', err);
	    }
	}

	const [currentDatas, setCurrentDatas] = useState({})

	const updateCurrentData = async () => {
		let tempUpdateData = {}
		let tempDataCombined = {}
		let tempDataFinal = {}
		if (loaded == true) {
			/*
			console.log(`shelf ${currentShelf}`)
			console.log({lightOn})
			console.log({lightTemp})
			console.log({lightBrightness})
			console.log({currentColor})
			*/
			/*
			if (currentDatas !== undefined) {
			console.log(`previous saved current datas: ${JSON.stringify(currentDatas)}`)
			}
			*/
			tempUpdateData["currentShelf"] = currentShelf
			tempUpdateData[currentShelf] = {
				lightOn: lightOn,
				sliderTemp: lightTemp,
				lightBrightness: lightBrightness,
				currentColor: currentColor
			}
			//console.log(`new data will be ${JSON.stringify(tempUpdateData)}`)
			tempDataCombined[Object.keys(JSON.parse(selectionMade))] = tempUpdateData
			tempDataFinal[Object.values(JSON.parse(selectionMade))] = tempDataCombined
			console.log(`new data will be ${JSON.stringify(tempDataFinal)}`)
			
			try {
				const response = await fetch('/api/updatecurrentdata', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(tempDataFinal)
				})

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
					//let result = ""
			    const result = await response.json() //.then(updateCase(result))
			    //console.log(result)
			    //setCurrentResult(result)
			  } 
		    catch (err) {
		      console.error('Error making POST request:', err);
		    }
		}
	}
	let tempDatas = {}

	useEffect(() => {
		if (currentResult !== undefined) {
			const savedSettings = currentResult.productlightOptions
			//console.log(JSON.stringify(currentResult.productlightOptions))
			if (savedSettings !== undefined) {
				//console.log(`current shelf: ${savedSettings.currentShelf}`)
				//console.log(`current shelf settings: ${JSON.stringify(savedSettings[savedSettings.currentShelf])}`)
				const setty = savedSettings[savedSettings.currentShelf]
				if (setty !== undefined) {
					//console.log(`setty says ${setty.currentShelf}`)
					setCurrentShelf(savedSettings.currentShelf)
					//setSliderTemp(setty.sliderTemp)
					//setLightBrightness(setty.lightBrightness)
					//setCurrentColor(setty.currentColor)
					//setLightOn(setty.lightOn)
					//setDefaultLightOn(setty.lightOn)
					setRenderKey(getRandomInt(1,9999))
					tempDatas[Object.values(JSON.parse(selectionMade))] = {
						productlightOptions : currentResult.productlightOptions
						}
					setCurrentDatas(tempDatas)
					//console.log(Object.values(JSON.parse(selectionMade)))
					//setCurrentDatas(tempDatas)
					//currentDatas[Object.values(JSON.parse(selectionMade))] = {
					//	productlightOptions : currentResult.productlightOptions
					//	}
					//console.log(`currentDatas: ${JSON.stringify(currentDatas)}`)
					}
				}
			}
	}, [currentResult])
	
	useEffect(() => {
		if (currentShelf == "ALL"){
			setShelfConverted("255")
		}
		else {setShelfConverted(currentShelf)}

		if (currentResult !== undefined) {
			const savedSettings = currentResult.productlightOptions
			if (savedSettings !== undefined) {
				//console.log(`current shelf: ${currentShelf}`)
				//console.log(`current shelf settings: ${JSON.stringify(savedSettings[currentShelf])}`)
				const setty = savedSettings[currentShelf]
				if (setty !== undefined) {
					//console.log(`setty says ${setty.currentShelf}`)
					//setCurrentShelf(savedSettings.currentShelf)
					setSliderTemp(setty.sliderTemp)
					setLightTemp(setty.sliderTemp)
					setLightBrightness(setty.lightBrightness)
					setCurrentColor(setty.currentColor)
					setLightOn(setty.lightOn)
					setDefaultLightOn(setty.lightOn)
					//setResetShelf(getRandomInt(1,9999))
					setRenderKey(getRandomInt(1,9999))
				}
			}
		}
	}, [currentShelf])

	const sendMessage = async () => {
		//const nuColor = convertColor(currentColor)
		/*
		const currentMsg = "001003" + "T000255" + 
			byteToString(nuColor[0]) + byteToString(nuColor[1]) + byteToString(nuColor[2])
			+ "W" + coolTemp + warmTemp
		console.log(`sending message: ${currentMsg}`)
		*/
		/*	caseID shelfID tuneableLED beginLED endLED red green blue modifier cool-warm
			001    003     T           000      255    255 255   255  W        000 000
			
			set case 1 shelf 3's leds to bright bright: 001003T000255255255255W000000
			need to include case prefix 
		TEMPY 
			approx:
			<- 255 (6000k) cooly - 255 (2000k) warmbo ->

		*/
		try {
			const msg = {
				ledmsg:currentMsg
				//ledmsg:"001003T000255000000000W000000"
				//ledmsg:"001003T000255000000000W000000"
				//ledmsg:"001003D050100000000255W000000"
				//ledmsg:"001003D000279255255255W000000"
				//ledmsg:"001003D000279000000000W000000"
				//ledmsg:"001003T000255255255255W000000"
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
		      //setResponseData(result);
		      //console.log(result)
		      //setError(null); // Clear any previous errors
		      	//upon success, update the currentData
		      updateCurrentData()
	    } 
	    catch (err) {
	      console.error('Error making POST request:', err);
	      //setError(err.message);
	      //setResponseData(null); // Clear any previous data
	    }
	}

	return (
		<div className="
			w-full
			h-full
		">
			<div className=" 
				absolute 
				w-[23vw] h-[8vh]
				-top-[24vh]
				left-[72vw]
			">
				<CaseToggle
					key={renderKey+3}
					toggleMenu={handleShelfToggleDataFromChild}
					name={"Shelf #"}
					value={"productlightShelfOptions"}
					selectionMade={shelfDataFromChild}
					currentMenu={currentMenu}
					bigMenuVisible={bigMenuVisible}
					reseitit={resetShelf}
					defaulty={currentShelf}
				/>
			</div>
			<div className="
				w-full h-full
				-mt-[3vh]
				grid grid-cols-20
				grid-rows-40
				font-regular
				text-left
			">
				<div className="
					col-start-2 col-span-8
					row-span-2
					text-[6vw]
					pt-[1vh]
				">On/Off:</div>
				<div className="
					col-start-13 col-span-6
					row-span-3
				">
					<ToggleSwitch
						key={renderKey+1}
						defaulty={defaultLightOn}
						toggleValueUp={handleOnOffToggle}
					/>
				</div>
				<div className="
					col-start-2 col-span-6
					row-start-7
					row-span-2
					-mt-[1vh]
					text-[4.6vw]
				">Light Temp:
				</div>
				<div className="
					col-start-8 col-span-9
					row-start-7
					row-span-2
					text-[4.6vw]
					-pt-[0.6vh]
				">
					<HorizontalSlider
						key={renderKey+5}
						sliderValueUp={handleChildTemp}
						defaulty={lightTemp}
						minimum={-255}
						maximum={255}
					/>
				</div>
				<div className="
					col-start-8 col-span-4
					row-start-5
					text-[3.6vw]
					font-bold
				">
					Cold
				</div>
				<div className="
					col-start-15 col-span-4
					row-start-5
					text-[3.6vw]
					font-bold
				">
					Warm
				</div>
				<div className="
					col-start-17 col-span-4
					row-start-7
					row-span-2
					-mt-[1vh]
					text-[4.6vw]
					font-bold
					text-center
				"> {lightTempReal}
				</div>

				<div className="
					col-start-2 col-span-6
					row-start-10
					row-span-2
					-mt-[1vh]
					text-[4.6vw]
				">Brightness:
				</div>
				<div className="
					col-start-8 col-span-9
					row-start-10
					row-span-2
					text-[3.6vw]
				">	
					<HorizontalSlider
						key={renderKey+9}
						sliderValueUp={handleChildBrightness}
						defaulty={lightBrightness}
					/>
				</div>
				<div className="
					col-start-17 col-span-4
					row-start-10
					row-span-2
					-mt-[1vh]
					text-[4.6vw]
					font-bold
					text-center
				">{lightBrightness}
				</div>

				<div className="
					col-start-2 col-span-4
					row-start-15
					row-span-2
					text-[4vw]
					font-regular
				">
					Color:
				</div>
				<div className="
					col-start-2 col-span-8
					row-start-17
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
					col-start-10 
					w-[40vw]
					h-[40vw]
					row-start-14
					row-span-6
				">
					<ColorPicker
						getColorFromChild={handleColorDataFromChild}
					/>
				</div>
				<div className="
					w-full h-full
					col-start-2 col-span-6
					row-start-20 row-span-4

				">
					<SendButton
						burstMessage={burstMessage}
					/>
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
			    -top-[5vh]
			  ">
			  <BigMenu 
			    className="z-500" 
			    sendMenuMsgToParent={handleShelfDataFromChild}
			    whichMenu={currentMenu} />
			  </div>
			</div>
			}
		</div>
		)
}

export default ProductLightCtrl


