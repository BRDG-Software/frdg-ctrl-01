'use client'
import React from 'react'
import {useState, useEffect, useRef} from "react"
import Image from 'next/image'
import { AnimatePresence, motion } from "framer-motion"

const FrameScroller = ({screen, image, prefixo, routeRules, imgWidth, sideloader}) => {
	//console.log(prefixo)



  const [vidurlA, setVidurlA] = useState('/img/'+screen+'/'+image+'/frame1.png')
  const [vidurlB, setVidurlB] = useState('/img/'+screen+'/'+image+'/frame1.png')
  const [vidAvisible, setVidAvisible] = useState(true)
  const [vidBvisible, setVidBvisible] = useState(false)
  const [vidAzindex, setVidAzindex] = useState(200)
  const [vidBzindex, setVidBzindex] = useState(0)
  const [prefixA, setPrefixA] = useState('/img/')
  const [prefixB, setPrefixB] = useState('/img/')
  

	const imgRules = routeRules.contentRoutes
	let currentImage = image
	let currentFrame = 1    // 1 to last frame, looping
	//let numberOfFrames = 1
	let numberOfFrames = imgRules[currentImage].frames
	let frameTime = 5000
	let doFrames = 1
	
	useEffect(()=>{
		//console.log("RESSIETO")
		//console.log(`frame scroller id: ${scrollerId} now doing a thing`)
		currentImage = image
		currentFrame = 1

			/* this check exists, because occasionally prefixo is undefined
				
			*/
		if (sideloader != true) {
			if (prefixo !== undefined) {
				setPrefixA(prefixo)
				setPrefixB(prefixo)
				setVidurlA(prefixo+screen+"/"+currentImage+"/frame1.png")
				setVidurlB(prefixo+screen+"/"+currentImage+"/frame1.png")
			}
		}
		else {
			setPrefixA('/img/')
			setPrefixB('/img/')
			setVidurlA('/img/'+screen+"/"+currentImage+"/frame1.png")
			setVidurlB('/img/'+screen+"/"+currentImage+"/frame1.png")
		}
		numberOfFrames = imgRules[currentImage].frames
		
		startAnimation()
	},[image, prefixo]);
	
	const startAnimation = () => {
		doFrames = (numberOfFrames > 1) ? 1 : 0;
	}

	let mixer = 0
	const animationFaded =  {
		raised: {
		  y: 0,
		  opacity: 0.0,
		  transition: { duration: 0.0 }
		},
		lowered: {
		  y: 0, 
		  opacity: 1.0, 
		  transition: { duration: 0.5}
		}
	}
	const [currentAnimation, setCurrentAnimation] = useState(animationFaded)
	const animDelay = 500

	const doZResetRef = useRef(null)
	const vidAinRef = useRef(null)
	const vidBinRef = useRef(null)
	const vidAoutRef = useRef(null)
	const vidBoutRef = useRef(null)

	const doZreset = () => {
		if (doZResetRef.current) {
			clearTimeout(doZResetRef.current)
		}
		doZResetRef.current = setTimeout(() => {
			if (doFrames==1) {
				setVidAzindex(0)
				setVidBzindex(0)
			}
		}, animDelay+150)
	}

	const vidAin = () => {
		if (vidAinRef.current) {
			clearTimeout(vidAinRef.current)
		}
		vidAinRef.current = setTimeout(() => {
			if (doFrames == 1) {
			  setVidAvisible(true)
			  setVidAzindex(200)
			  vidBout()
			  doZreset()
			}
		}, animDelay+150)
	}
	const vidBin = () => {
		if (vidBinRef.current) {
			clearTimeout(vidBinRef.current)
		}
		vidBinRef.current = setTimeout(() => {
			if (doFrames == 1) {	
			  setVidBvisible(true)
			  setVidBzindex(200)
			  doZreset()
			  vidAout()
			}
		}, animDelay+150)  //originally 50?!?!
	}
	const vidAout = () => {
		if (vidAoutRef.current) {
			clearTimeout(vidAoutRef.current)
		}
		vidAoutRef.current = setTimeout(() => {
			if (doFrames == 1) {
	  			setVidAvisible(false)
			}
		}, animDelay+100)
	}
	const vidBout = () => {
		if (vidBoutRef.current) {
			clearTimeout(vidBoutRef.current)
		}
		vidBoutRef.current = setTimeout(() => {
		  if (doFrames == 1) {
				setVidBvisible(false)
		  }
	}, animDelay+100)

	}

	const cancelTimeoutz = () => {
		if (doZResetRef.current) {
			clearTimeout(doZResetRef.current)
			console.log('z ref cancelled')
			doZResetRef.current = null
		}
		if (vidAinRef.current) {
			clearTimeout(vidAinRef.current)
			vidAinRef.current = null
		}
		if (vidBinRef.current) {
			clearTimeout(vidBinRef.current)
			vidBinRef.current = null
		}
		if (vidAoutRef.current) {
			clearTimeout(vidAoutRef.current)
			vidAoutRef.current = null
		}
		if (vidBoutRef.current) {
			clearTimeout(vidBoutRef.current)
			vidBoutRef.current = null
		}
	}
	useEffect(() => {
		return () => {
			if (doZResetRef.current) {clearTimeout(doZResetRef.current)}
			if (vidAinRef.current) {clearTimeout(vidAinRef.current)}
			if (vidBinRef.current) {clearTimeout(vidBinRef.current)}
			if (vidAoutRef.current) {clearTimeout(vidAoutRef.current)}
			if (vidBoutRef.current) {clearTimeout(vidBoutRef.current)}
		}
	}, []) //empty dependency arrays means this will only run on mount


	const frameAnimator = () => {
		if (doFrames == 1) {
			if (currentFrame < numberOfFrames) {
			  currentFrame += 1
			  //loggit(`current frame: ${currentFrame}`)
			}
			else {
			  currentFrame = 1
			}
			if (mixer == 0) {
			    setVidurlB(prefixB+screen+"/"+currentImage+"/frame"+currentFrame+".png")
			    vidBin()
			    mixer = 1

			}
			else if (mixer == 1) {
			    setVidurlA(prefixA+screen+"/"+currentImage+"/frame"+currentFrame+".png")
			    vidAin()
			    mixer = 0
			}
		}
	}

	useEffect(() => {
		const animationTimer = setInterval(() => {
				if (doFrames == 1) {
					frameAnimator()
				}
				else {
					//loggit("animation timer stopped")
				}
			}, frameTime)
		return () => clearInterval(animationTimer)
	},[image])

	return (
	    <div className="
	      absolute left-0 top-0
	    	
	    "
	    style={{width:'1920px', height:'360px'}}
	    >

	      <motion.div
	        variants={currentAnimation}
	        initial="lowered"
	        animate={ vidAvisible? "lowered": "raised"}	      
	        className="absolute w-full h-full left-0 top-0
	        
	        "
	        style={{zIndex:`${vidAzindex}`}}
	        >
	        <Image 
	            src={vidurlA}
	            width={imgWidth}
	            height={360}
	            priority
            	loading="eager"
	            alt="a frame"
	           /> 
	        </motion.div>
	        <motion.div 
	          variants={currentAnimation}
	          initial="raised"
	          animate={ vidBvisible? "lowered": "raised"}
	          className="absolute w-full h-full left-0 top-0

	          "
	          style={{
	            zIndex:`${vidBzindex}`}}
	          >
	          <Image 
	            src={vidurlB}
	            width={imgWidth}
	            height={360}
            	priority
            	loading="eager"	            
	            style={{ }}
	            alt="a frame"
	           />
	        </motion.div>   
	    </div>	
	)
}

export default FrameScroller