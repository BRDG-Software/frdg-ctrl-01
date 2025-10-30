/*
motion bezier curve tool
https://motion.dev/studio
*/

'use client'
import React from 'react'
import { getRandomInt } from '@/utils/utils.js'
import { socket } from "@/lib/socketClient"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import FrameScroller from '@/components/FrameScroller'

import { useSearchParams } from 'next/navigation'

const ContentScrollerSideLoaded = ({image, routeRules, hideSideLoader, isSample}) => {
  const loggit = (msg) => {
    //console.log(msg)
  }
  //const searchParams = useSearchParams()
  //const screeno = searchParams.get('screen')

  const searchParams = useSearchParams()
  let screeno = 1//searchParams.get('screen')

  if (isSample == 1) {
    //console.log("don't do the search params")
    screeno = 1
  }
  else {
    //console.log("do the search params")
    screeno = searchParams.get('screen')
  }

  const usernum = getRandomInt(9999,99999)
  const userBuilt = "player" + usernum

  const [message, setMessage ] = useState("")
  const [room, setRoom] = useState("123")
  const [userName, setUserName] = useState(userBuilt)
  const [joined, setJoined] = useState(false)

  const [vidurlA, setVidurlA] = useState('/img/screen'+screeno+'/walmart/frame1.png')//({url: '/video/burger.mp4'})
  const [vidurlB, setVidurlB] = useState('/img/screen'+screeno+'/walmart/frame1.png')

  const [seedA, setSeedA] = useState(1)
  const [seedB, setSeedB] = useState(12)

  const [vidAh, setVidAh] = useState(0)
  const [vidBh, setVidBh] = useState(0)
  const [vidAvisible, setVidAvisible] = useState(false)
  const [vidBvisible, setVidBvisible] = useState(false)
  const [vidAzindex, setVidAzindex] = useState(200)
  const [vidBzindex, setVidBzindex] = useState(0)

  const [screenCurrent, setScreenCurrent] = useState("screen"+screeno) 

  //useEffect(() => {
  //  setScreenCurrent("screen"+screeno)
  //}, [screeno])

  /*
    imgRules reads and stores animation rules for each
    different piece of content
  */

  const imgRules = routeRules.contentRoutes//routeRules["contentRoutes"]
  //console.log(imgRules.tyson.animate)
  
  let mixer = 0

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, username: userName})
      setJoined(true)
      //console.log(joined)
    }
  }

//ease: [0, 0.71, 0.2, 1.01],
//default: {type:"spring", stiffness: 100}
// ease: "easeInOut"
    // animationz
  const animationSlideup =  {
    raised: {
      x: 20,
      transition: { duration: 0.0 }
    },
    lowered: {
      x: 0, 
      transition: { duration: 0.5}
    }
  }
  const animationSpringdown =  {
    raised: {
      x: -20,
      //transition: { duration: 0.0 }
    },
    lowered: {
      x: 0, 
      dragTransition: { 
        power: 0.1,
        timeConstant: 200,
        min: 0,
        max: 10,
        bounceStiffness: 100,
        bounceDamping: 100

      }
    }
  }
  const animationSlidedown =  {
    raised: {
      x: 1200,  //-400
      transition: {
        duration: 1.0,
        ease: [0.72, -0.006, 0.659, 0.552]        
       }
      //transition: { duration: 0.0 }
    },
    lowered: {
      x: -50, 
      transition: { 
        duration: 1.5, //orig 0.5
        ease: [0.72, -0.006, 0.659, 0.552]
      }
    }
  }
  const animationFaded =  {
    raised: {
      x: 0,
      opacity: 0.0,
      transition: { duration: 0 }
    },
    lowered: {
      x: 0, 
      opacity: 1.0, 
      transition: { duration: 0.5}
    }
  }
  //let currentAnimation = animationSlideup
  const [currentAnimation, setCurrentAnimation] = useState(animationSlidedown)
    // end animationz
  
  const animDelay = 500
  const doZResetRef = useRef(null)
  const vidAinRef = useRef(null)
  const vidBinRef = useRef(null)
  const vidAoutRef = useRef(null)
  const vidBoutRef = useRef(null)
  const animationTimerRef = useRef(null)

  const doZreset = () => {
    if (doZResetRef.current) {
      clearTimeout(doZResetRef.current)
    }
    doZResetRef.current = setTimeout(() => {
      setVidAzindex(0)
      setVidBzindex(0)
    }, animDelay+500)
  }
  const vidAin = () => {
    if (vidAinRef.current) {
      clearTimeout(vidAinRef.current)
    }
    vidAinRef.current = setTimeout(() => {
      setVidAvisible(true)
      setVidAzindex(200)
      vidBout()
      doZreset()
    }, animDelay + 50) //+50)
  }
  const vidBin = () => {
    if (vidBinRef.current) {
      clearTimeout(vidBinRef.current)
    }
    vidBinRef.current = setTimeout(() => {
      setVidBvisible(true)
      setVidBzindex(200)
      doZreset()
      vidAout()
    }, animDelay+50) //+50)
  }
  const vidAout = () => {
    if (vidAoutRef.current) {
      clearTimeout(vidAoutRef.current)
    }
    vidAoutRef.current = setTimeout(() => {
      setVidAvisible(false)
    }, animDelay+100)
  }
  const vidBout = () => {
    if (vidBoutRef.current) {
      clearTimeout(vidBoutRef.current)
    }
    vidBoutRef.current = setTimeout(() => {
      setVidBvisible(false)
    }, animDelay+100)
  }
  
  const cancelTimeoutz = () => {
    if (doZResetRef.current) {
      clearTimeout(doZResetRef.current)
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
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
      animationTimerRef.current = null
    }
  }

    //hide side loader when the content is no longer
    //wally brand navy content
  useEffect(() => {
    //console.log("hiding side loader now")
    setVidAvisible(false)
    setVidBvisible(false)
  }, [hideSideLoader])

  let currentImage = "elp"
  let currentFrame = 1    // 1 to last frame, looping
  let numberOfFrames = 1
  let frameTime = 5000
  let doFrames = 0

  const frameAnimator = () => {}

  const animationTimer = () => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
    }
    animationTimerRef.current = setTimeout(() => {
      if (doFrames == 1) {
        frameAnimator()
        animationTimer()
        loggit("next frame!")
      }
    }, frameTime)
  }
  useEffect(() => {
    return () => {
      if (doZResetRef.current) {clearTimeout(doZResetRef.current)}
      if (vidAinRef.current) {clearTimeout(vidAinRef.current)}
      if (vidBinRef.current) {clearTimeout(vidBinRef.current)}
      if (vidAoutRef.current) {clearTimeout(vidAoutRef.current)}
      if (vidBoutRef.current) {clearTimeout(vidBoutRef.current)}
      if (animationTimerRef.current) {clearTimeout(animationTimerRef.current)}
    }
  }, []) //empty dependency arrays means this will only run on mount


  const refresher = () => {
    window.location.reload()
  }

  const [currentImageA, setCurrentImageA] = useState(currentImage)
  const [currentImageB, setCurrentImageB] = useState(currentImage)

  const noFly = ['walmart', 'kraft', 'storebranded', 'tyson']

    //change the key of the framescroller before bringing it in to remount the component
    //and reset its animation timers
  const [frameId1, setFrameId1] = useState(1)
  const [frameId2, setFrameId2] = useState(2)

  const [showContent, setShowContent] = useState(true)

  let previousImage = ""

  useEffect(() => {
    handleJoinRoom()
    socket.on("message", (data) => {
      let msgparse = JSON.parse(data.message)

              // if the message is NOT a system message, update the content
      if (msgparse["system"] === undefined) {
        console.log(`side scrolly received a mwesaage`)    
        let screeny = (msgparse["screen"])
        
        if (typeof message == 'string') {
          if ((screeny == "all") || (screeny == screenCurrent)) {
    
            let checkFly = msgparse["content"]

            //if ( (previousImage != currentImage) || (screeny == "all") ) {
            if ( (screeny == "all") || (screeny == screenCurrent) ) {
              
              if (!noFly.includes(checkFly)) {
                currentImage = msgparse["content"]
                if (currentImage == "blank") {
                  
                }
                else {
                  
                  if (mixer == 0) {
                      setFrameId2(getRandomInt(0,9999))
                      setVidurlB("/img/"+screenCurrent+"/"+currentImage+"/frame1.png")
                      setCurrentImageB(currentImage)
                      previousImage = currentImage
                      vidBin()
                    	mixer = 1

                  }
                  else if (mixer == 1) {
                      setFrameId1(getRandomInt(0,9999))
                    	setVidurlA("/img/"+screenCurrent+"/"+currentImage+"/frame1.png")
                      setCurrentImageA(currentImage)
                      previousImage = currentImage
                      vidAin()
                    	mixer = 0
                  }
                }
              }
            }
          }
        }
      } ////endo of msgparse["system"] === undefined
      else if (msgparse["system"] == "refresh") {
        loggit("doing a hella refreshe")
        refresher()
      }
    })
    return () => {
      socket.off("user_joined")
      socket.off("message")
    }


  }, []);  /// end useEffect()

	return (
    <div className="
      absolute left-0 top-0
    "
    style={{width:'1920px', height:'360px'}}
    >

      <motion.div
        variants={currentAnimation}
        initial="raised"
        animate={ vidAvisible? "lowered": "raised"}
        className="absolute w-full h-full left-0 top-0
        "
        style={{zIndex:`${vidAzindex}`}}
        >
          <FrameScroller
            key={frameId1}
            screen={screenCurrent} 
            image={currentImageA}
            routeRules={routeRules}
            imgWidth={1185}
            sideloader={true}
          /> 
        </motion.div>
        <motion.div 
          variants={currentAnimation}
          initial="raised"
          animate={ vidBvisible? "lowered": "raised"}
          className="absolute w-full h-full left-0 top-[0]
          "
          style={{
            zIndex:`${vidBzindex}`}}
          >
          <FrameScroller
            key={frameId2}
            screen={screenCurrent} 
            image={currentImageB}
            routeRules={routeRules}
            imgWidth={1185}
            sideloader={true}
          /> 
        </motion.div>   
    </div>
	)
}

export default ContentScrollerSideLoaded