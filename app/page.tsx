'use client'
import { React, useState } from "react"
import Image from "next/image";

//import CaseDisplay from '@/components/CaseDisplayDev'
import CaseToggle from '@/components/atoms/CaseToggle'
import BigMenu from '@/components/BigMenu'
import CaseOptions from '@/components/CaseOptions'

export default function Home() {
  const [athing, setAthing] = useState("nope")
  const [currentMenu, setCurrentMenu] = useState("")
  const [dataFromChild, setDataFromChild] = useState('{"displayOptions":"ALL"}')
  const [menuToggleFromChild, setMenuToggleFromChild] = useState("")
  const [bigMenuVisible, setBigMenuVisible] = useState(false)

  function handleToggleDataFromChild(data) {
    doMenuChange(data)
    setBigMenuVisible(true)
  }

  function handleDataFromChild(data) {
    setDataFromChild(data)
    console.log(`dato ${data}`)
    setBigMenuVisible(false)
  }
  const doMenuChange = (menuChange) => {
    setCurrentMenu(menuChange)
  }
  const killMenu = () => {
    setBigMenuVisible(false)
  }
  return (
    <div className="m-2 
      overflow-hidden
      bg-[#001E60]
      ">
      <div className="
        p-[1vw] pr-[3vw]
        w-[100vw] h-full
        grid grid-rows-40 gap-5

      "
      >
        <div className="
        rounded-[3vw]
        h-[12vh]
        
        "
        style={{backgroundColor:'#fff'}}
        >
        <div className="grid grid-cols-7 gap-0 w-full h-full
          items-center text-center place-items-center
          p-0 
          ml-[5vw] 

        ">
          <div className=" 
            h-[10vw] w-[10vw] place-items-center 
            relative 
            -ml-[8vw]
            grid
          ">
          <Image
            src="./spark.svg"
            height={80}
            width={80}
            priority
            loading="eager"
            alt="spark"
          /> 
          </div> 
          <div className="
            h-[10vh] w-[20vw] 
           z-500"
          >
            <CaseToggle
              toggleMenu={handleToggleDataFromChild}
              name={"Case Display"}
              value={"displayOptions"}
              selectionMade={dataFromChild}
              currentMenu={currentMenu}
              bigMenuVisible={bigMenuVisible}
            />
          </div>
            <div className=" h-[90%] min-h-[1em] w-1 
              self-stretch m-auto"
              style={{backgroundColor:'#4dbdf5'}}
            >
            </div>

          <div className="z-500
              h-[10vh] w-[20vw]
            ">
            <CaseToggle
              toggleMenu={handleToggleDataFromChild}
              name={"Case P2L"}
              value={"pictolightOptions"}
              selectionMade={dataFromChild}
              currentMenu={currentMenu}
              bigMenuVisible={bigMenuVisible}
            />
          </div>
            <div className=" h-[90%] min-h-[1em] w-1 
              self-stretch m-auto "
              style={{backgroundColor:'#4dbdf5'}}
            >
            </div>
          <div className=" z-500
            h-[10vh] w-[20vw] relative 
            ">
            <CaseToggle
              toggleMenu={handleToggleDataFromChild}
              name={"Case Product Light"}
              value={"productlightOptions"}
              selectionMade={dataFromChild}
              currentMenu={currentMenu}
              bigMenuVisible={bigMenuVisible}
            />
          </div>          
          </div> 
        </div>
        
        <div className="
          rounded-[3vw]
          w-full h-[85vh]
          row-start-2
          row-span-8
        "
        style={{backgroundColor:'#fff'}}
        >
          
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
            top-[30vh]
          ">
          <BigMenu 
            className="z-500" 
            sendMenuMsgToParent={handleDataFromChild}
            whichMenu={currentMenu} />
          </div>
      </div>
      }
      <div className="
        absolute
        top-[14vh] left-0
        w-full
        h-full
      ">
        <CaseOptions
          selectionMade={dataFromChild}
        />
      </div>
  </div>
  );
}
