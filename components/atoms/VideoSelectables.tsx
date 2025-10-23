"use client"
import { getRandomInt } from '@/utils/utils.js'
import { socket } from "@/lib/socketClient"
import { useState, useEffect } from "react"
import Image from 'next/image'
import data from '@/public/data.json'

const VideoSelectables = ({selectionMade, imgRules, processedImgUrls, currentScreen}) => {
	//console.log(`curry screen ${currentScreen}`)
	const displayKeys = Object.keys(imgRules)
	const usernum = getRandomInt(9999,99999)
	const userBuilt = "controller" + usernum
	//console.log(userBuilt)
	const [message, setMessage ] = useState<
	{ sender: string; message: string}[]
	>([])
	const [room, setRoom] = useState("123")
	const [userName, setUserName] = useState(userBuilt)
	const [joined, setJoined] = useState(false)
	const [contentSelected, setContentSelected] = useState("walmart")
	
	const [singleOrAll, setSingleOrAll] = useState("single")

	let dataArray = []
	
	const datain = data.contentRoutes
	
	//console.log(datain)
	for (const key in datain) {
		dataArray.push([ key, datain[key].icons ])
		//console.log(datain[key].title)
		//delete datain[key].title

	}
	const dataObj = {}
	for (let i = 0; i < dataArray.length; i++) {
    	const [key, val] = dataArray[i];
    	dataObj[key] = val;
	}
	
	const [iconUrls, setIconUrls] = useState(dataObj)

	let currentDatas = {}

	useEffect(() => {
		//console.log(`caseid? ${Object.values(JSON.parse(selectionMade))}`)
		const caseId = Object.values(JSON.parse(selectionMade))
		if (caseId == "ALL") {
			setSingleOrAll("all")
		}
		else {
			setSingleOrAll("single")
		}
	}, [selectionMade])

	const updateCurrentData = async () => {
		console.log(`currentDatas: ${JSON.stringify(currentDatas)}`)
		try {
			const msg = {
				someData:"cool data"
			}
			const response = await fetch('/api/updatecurrentdata', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(currentDatas)
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

	const handleJoinRoom = () => {
		if (room && userName) {
		  socket.emit("join-room", { room, username: userName})
		  setJoined(true)
		}
	}
	const [renderImages, setRenderImages] = useState(false)

	useEffect(() => {
		setIconUrls(processedImgUrls)
	}, [processedImgUrls])

	useEffect(() => {
		handleJoinRoom()
		socket.on("message", (data) => {
		  //console.log(`da datas ${data}`)
		  setMessage((prev) => [...prev, data])
		})
		socket.on("user_joined", (message) => {
		  setMessage((prev) => [...prev, { sender: "system", message }])
		})
		return () => {
		  socket.off("user_joined")
		  socket.off("message")
		}
	}, []);
	
	/*
		if displayType = single, send current data post update to 
		change current content to /imgSingle
	*/
	const doContent = (key) => {
		console.log(`keyoooo ${key}`)
		//console.log(`single or all ${singleOrAll}`)
		//console.log(`VideoSelectables: attempting to change content on screen: ${currentScreen} to ${key}`)
		setContentSelected(key)
		currentDatas[Object.values(JSON.parse(selectionMade))] = {
				"displayOptions": {
					"currentContent": key,
					"displayType":singleOrAll
				}
		}
		const message = `{"screen":"${currentScreen}", "content": "${key}", "displayType":"all"}`
		const data = { room, message, sender: userName };
		setMessage((prev) => [...prev, {sender: userName, message}])
		socket.emit("message", data)
		//console.log(message)
		updateCurrentData()
	}

	return (
		<div className="
			grid
			w-full h-[62vh]
			text-left
			-ml-[1.8vw] -mt-[18vh]
			pl-[4.6vw]
			overflow-y-scroll overscroll-x-none
			overflow-x-hidden
		"
		style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
		>
			<div className="
				w-full
			">
				<h1 className="w-full"
					style={{fontSize: '5vw'}}
				>
					Blank Navigation
				</h1>
				<div className="
						w-[90vw] 
						h-[10vh] 
						bg-[#000]
						"
						onClick={() => doContent("blank")}
						>
				</div>
			</div>
			{displayKeys.map((key) => (
				<div className="
					w-full 
				" 
				key={key}>
				<h1 key={key} className="
					w-full
					h-[3.5vh] 
				"
				style={{
	    			fontSize:'5vw'
	    		}}
				> 
					{imgRules[key].title} </h1>
					<div className="
						w-[92vw] 
						h-[10vh] 
						"
						onClick={() => doContent(key)}
						>
						<Image
				            key={iconUrls[key]}
				            src={iconUrls[key]}
				            width={960}
				            height={0}
				            priority
			            	loading="eager"
				            alt="a frame"
				            style={{width:'90vw', height: 'auto'}}
						/>
					</div>				
				</div>
			))}
			
		</div>
	)
}

export default VideoSelectables
/*
				            key={processedImgUrls[key]}
				            src={processedImgUrls[key]}
				            */