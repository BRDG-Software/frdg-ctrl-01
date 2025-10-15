"use client"
import { getRandomInt } from '@/utils/utils.js'
import { socket } from "@/lib/socketClient"
import { useState, useEffect } from "react"
import Image from 'next/image'
import data from '@/public/data.json'

const VideoSelectables = ({imgRules, processedImgUrls, currentScreen}) => {
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
	console.log(currentScreen)
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
		  console.log(data)
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
		//console.log(`VideoSelectables: attempting to change content on screen: ${currentScreen} to ${key}`)
		const message = `{"screen":"${currentScreen}", "content": "${key}", "displayType":"all"}`
		const data = { room, message, sender: userName };
		setMessage((prev) => [...prev, {sender: userName, message}])
		socket.emit("message", data)
		//console.log(message)
	}

	return (
		<div className="
			grid 
			w-full
			text-left
			-ml-[1.8vw] -mt-[3vh]
			pl-[4.6vw]
		">

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