'use client'
import { React, useState, useEffect } from "react";
import Image from "next/image";



const CaseOptionsHeader = ({selectionMade}) => {
	const [currentPage, setCurrentPage] = useState("")
	const [caseDisplay, setCaseDisplay] = useState(false)
	const [casePicto, setCasePicto] = useState(false)
	const [caseProduct, setCaseProduct] = useState(false)

	const [namo, setNamo] = useState("")
	const [currentValue, setCurrentValue]  = useState("")
	const [currentScreen, setCurrentScreen] = useState("screen1")
	const [displayURL, setDisplayURL] = useState("")
	
	const [currentCase, setCurrentCase] = useState("")
	const [currentContent, setCurrentContent] = useState("walmart")

	const [currentResult, setCurrentResult] = useState("")

		//get the current saved choices to display
	const getCurrentData = async () => {
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
	useEffect(()=> {
		getCurrentData()
	},[])
	useEffect(() => {
		if (currentResult !== undefined) {
			if (currentResult.displayOptions !== undefined) {
				setCurrentContent(currentResult.displayOptions.currentContent)
			}
		}
	}, [currentResult])

	const updateDisplaySample = (value) => {
		if (caseDisplay == true) {
			//console.log(`updating to ${value}`)
			//console.log(parseInt(value))
			//setCurrentScreen(value)
			if (value != "ALL") {
				//console.log(`screeny ${parseInt(value)}`)
				setCurrentScreen("screen" + parseInt(value))
			}
			else {
				setCurrentScreen("all")
			}
				//setCurrentScreen(parseInt(value))
				//console.log(`current screen: ${currentScreen}`)
			//}
		}
	}

	useEffect(() => {
		if (selectionMade !== "") {
			let selParsed = JSON.parse(selectionMade)
			Object.keys(selParsed).forEach(function(key) {
				let keyo = Object.keys(selParsed) 
				if (keyo == "displayOptions") {
					setCaseDisplay(true)
					setCasePicto(false)
					setCaseProduct(false)
					setNamo("CMS")
				}
				else if (keyo == "pictolightOptions") {
					setCaseDisplay(false)
					setCasePicto(true)
					setCaseProduct(false)
					setNamo("Shelf P2L")
									}
				else if (keyo == "productlightOptions") {
					setCaseDisplay(false)
					setCasePicto(false)
					setCaseProduct(true)
					setNamo("Product Light")
				}
			})
			 Object.values(selParsed).forEach(value => {
			 		setCurrentValue(value)
			 			updateDisplaySample(value)
			 })


		}
	}, [selectionMade])

	useEffect(() => {
		getCurrentData()
	}, [currentValue])

	return(
		<div className="
			w-full h-[22vh]
			justify-items-center
			text-center
			grid grid-cols-2
			grid-rows-20
			gap-0
			pt-[2vh]
			p-[2vh] 
		">

			<div className="
				col-start-1
				w-full
				row-span-4
				font-light
				text-[6vw] 
				text-left
			">
				{namo}
			</div>
			{ caseProduct &&
				<div className="
					w-full h-full
					grid col-start-1 col-end-7
					row-span-10
					flex
					items-center
				">
					<div className="
						relative -top-[9vh] 
						w-full h-full
					">
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
			}
			{ caseDisplay &&
				<div className ="
					col-start-3 col-end-7
					w-full
					row-span-4
					grid grid-cols-10 gap-4
				">
					<div className="
						w-full
						font-light
						text-[5vw]
						col-span-8
						text-right
					">
						Unit Screen:
					</div>
					<div className="
						col-span-2
						font-bold
						text-[5vw]
						text-left
					">
						{currentValue}
					</div>
				</div>
			}
			{}
			<div className="
			w-full h-full
				col-span-7
				w-full
				row-span-20
				grid
			"
			>
			<div className="
				place-items-left
			">
				{caseDisplay && 
		      <div className="w-full h-full 
		      	place-items-center grid
		      	text-[5vw] 
		      	">
							<div className="
								w-[92vw] 
								h-[10vh] 
								">
								<Image
						            key={3434}
						            src={"/imgIcon/"+currentScreen + "/" + currentContent + "/frame1.png"}
						            width={960}
						            height={0}
						            priority
					            	loading="eager"
						            alt="a frame"
						            style={{width:'90vw', height: 'auto'}}
								/>
							</div>
		      </div>
	    	}
			</div>
			</div>	
            <div className="
            	col-span-6
            	row-span-8
            	col-start-1
             	w-[95%] min-w-[1em] h-1 
              self-stretch m-auto "
              style={{backgroundColor:'#4dbdf5'}}
            >
            </div>
		</div>
		)
}

// aspect ratio of image is 16:3, fullsize is 1920:360
/*
i frame no worky on phone
			      <iframe 
			        src={`http://localhost:3000/display?screen=`+`${currentScreen}`} 
			        title="Example Website"
			        width="1600vw" 
			        height="300vw" 
			        frameBorder="0"
			        style={{
			        	position:'absolute',
			        	top: '3vh',
			        	left:'-6vw',
			        	transform: 'scale(0.5)'
			        }}
			      ></iframe>
*/
export default CaseOptionsHeader