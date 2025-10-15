/*
if screen is ALL:
  content will be grabbed from 
  /public/img/screenNUMBER/selection/frame1-x.png
if screen has a number (screen1, screen2, etc):
  content will be grabbed from 
  /public/imgSingle/screenNUMBER/selection/frame1-x.png

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

  // when you use this inside the display sample
  // pass a screen value to issample
  // to prevent it from doing a url params search 
const ContentScroller = ({image, routeRules, tellParentHideSideLoader, isSample}) => {
  const loggit = (msg) => {
    //console.log(msg)
  }
  const searchParams = useSearchParams()
  let screeno = 1//searchParams.get('screen')

  if (isSample == 1) {
    //console.log("don't do the search params")
    screeno = 2
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
  const [vidAvisible, setVidAvisible] = useState(true)
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
  
  let mixer = 0

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, username: userName})
      setJoined(true)
    }
  }

//ease: [0, 0.71, 0.2, 1.01],
//default: {type:"spring", stiffness: 100}
// ease: "easeInOut"
    // animationz
  const animationSlideup =  {
    raised: {
      y: 2000,
      transition: { duration: 0.0 }
    },
    lowered: {
      y: 0, 
      transition: { duration: 0.5}
    }
  }
  const animationSpringdown =  {
    raised: {
      y: -2000,
      //transition: { duration: 0.0 }
    },
    lowered: {
      y: 0, 
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
      y: -400,  //-400
      transition: {
         duration:0
         
       }
      //transition: { duration: 0.0 }
    },
    lowered: {
      y: 0, 
      transition: { 
        duration: 1.5, //orig 0.5
        //ease: [0.123, 0.358, 0.132, 0.848]
        ease: [0.335, 0.33, 0.153, 0.515]
        //ease: [0.102, 0.624, 0, 0.933]
        //ease: [0.72, -0.006, 0.659, 0.552]
      }
    }
  }
  const animationFaded =  {
    raised: {
      y: 0,
      opacity: 0.0,
      transition: { duration: 0 }
    },
    lowered: {
      y: 0, 
      opacity: 1.0, 
      transition: { duration: 0.5}
    }
  }
  //let currentAnimation = animationSlideup
  const [currentAnimation, setCurrentAnimation] = useState(animationSlidedown)
    // end animationz
  
  const animDelay = 400 //orig 400
  
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
      console.log("doing Z reset")
    }, animDelay+1400) //orig 150
  }
  const vidAin = () => {
    if (vidAinRef.current) {
      clearTimeout(vidAinRef.current)
    }
    vidAinRef.current = setTimeout(() => {
      console.log("now bring video A in ")
      setVidAvisible(true)
      setVidAzindex(200)
      vidBout()
      doZreset()
    }, 10)//animDelay) //+50)
  }
  const vidBin = () => {
    if (vidBinRef.current) {
      clearTimeout(vidBinRef.current)
    }
    vidBinRef.current = setTimeout(() => {
      console.log("now bring video B in ")
      setVidBvisible(true)
      setVidBzindex(200)
      doZreset()
      vidAout()
    }, 10)//animDelay) //+50)
  }
  const vidAout = () => {
    if (vidAoutRef.current) {
      clearTimeout(vidAoutRef.current)
    }
    vidAoutRef.current = setTimeout(() => {
      console.log("video A leaving ")
      setVidAvisible(false)
    }, animDelay+1200) //orig 100
  }
  const vidBout = () => {
    if (vidBoutRef.current) {
      clearTimeout(vidBoutRef.current)
    }
    vidBoutRef.current = setTimeout(() => {
      console.log("video B leaving ")
      setVidBvisible(false)
    }, animDelay+1200)
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
  let currentImage = "walmart"
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
  const [currentPrefixA, setCurrentPrefixA] = useState('/img/')
  const [currentPrefixB, setCurrentPrefixB] = useState('/img/')
    //dont display the side loader content on main vid
  const noFly = ['rollback', 'elp']
  
    //change the key of the framescroller before bringing it in to remount the component
    //and reset its animation timers
  const [frameId1, setFrameId1] = useState(1)
  const [frameId2, setFrameId2] = useState(2)

  useEffect(() => {
    handleJoinRoom()
    socket.on("message", (data) => {
      let msgparse = JSON.parse(data.message)
              // if the message is NOT a system message, update the content
      if (msgparse["system"] === undefined) {
        let screeny = (msgparse["screen"])
        
        if (typeof message == 'string') {
          if ((screeny == "all") || (screeny == screenCurrent)) {
            
              //make sure we're not loading the side loader content
              //in the main view
            let checkFly = msgparse["content"]
            
            if (!noFly.includes(checkFly)) {
          
                  // tell the parent to hide the side loader 
                  // unless you're on main navigation page
              currentImage = msgparse["content"]
              
              let prefix = "/img/"
              if (currentImage != "walmart") {
                  tellParentHideSideLoader("hide side loader now")
              }
              if (screeny != "all") {
                prefix = "/imgSingle/"
              }
              let imgSRC = prefix+screenCurrent+"/"+currentImage+"/frame1.png"
              console.log(imgSRC)
              if (mixer == 0) {
                  //console.log(prefix+screenCurrent+"/"+currentImage+"/frame1.png")
                  //setVidurlB(prefix+screenCurrent+"/"+currentImage+"/frame1.png")
                  setFrameId2(getRandomInt(0,9999))   
                  setVidurlB(imgSRC)
                  setCurrentPrefixB(prefix)
                  setCurrentImageB(currentImage)
                  vidBin()
                	mixer = 1
              }
              else if (mixer == 1) {
                  //console.log(prefix+screenCurrent+"/"+currentImage+"/frame1.png")
                	//setVidurlA(prefix+screenCurrent+"/"+currentImage+"/frame1.png")
                  setFrameId1(getRandomInt(0,9999))
                  setVidurlA(imgSRC)
                  setCurrentPrefixA(prefix)
                  setCurrentImageA(currentImage)
                  vidAin()
                	mixer = 0
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
        initial="lowered"
        animate={ vidAvisible? "lowered": "raised"}
        className="absolute w-[1920px] h-[360px] left-0 top-0
        "
        style={{zIndex:`${vidAzindex}`}}
        >
          <FrameScroller
            key={frameId1}
            screen={screenCurrent} 
            image={currentImageA}
            prefixo={currentPrefixA}
            routeRules={routeRules}
            imgWidth={1920}
          /> 
        </motion.div>
        <motion.div 
          variants={currentAnimation}
          initial="raised"
          animate={ vidBvisible? "lowered": "raised"}
          className="absolute w-[1920px] h-[360px] left-[0] top-[0]
          "
          style={{
            zIndex:`${vidBzindex}`}}
          >
          <FrameScroller
            key={frameId2}
            screen={screenCurrent} 
            image={currentImageB}
            prefixo={currentPrefixB}
            routeRules={routeRules}
            imgWidth={1920}
          /> 
        </motion.div>   
    </div>
	)
}

export default ContentScroller