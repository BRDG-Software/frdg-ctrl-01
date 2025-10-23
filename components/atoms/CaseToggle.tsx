'use client'
import { React, useState, useEffect } from "react";
import Image from "next/image";

const CaseToggle = ({toggleMenu, id, name, value, selectionMade, currentMenu, 
  bigMenuVisible, resetit, defaulty}) => {
  const [nameo, setNameo] = useState(name)
	const [inFocus, setInFocus] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSelection, setCurrentSelection] = useState(selectionMade)
  const [currentItem, setCurrentItem] = useState("000")
  const stylo = {
    backgroundColor: inFocus ? '#0053e2' : '#9c9c9c'
  }

  useEffect(() => {
    if (defaulty !== undefined) {
      setCurrentItem(defaulty)
      //setInFocus(true)
      //setMenuOpen(false)      
      doDefault()
      //setCurrentItem('ALL')
      //setInFocus(true)
      //setMenuOpen(false)
    }
  }, [defaulty])

  const doDefault = () => {
      setCurrentItem(defaulty)
      //setInFocus(true)
      setInFocus(true) //this gets canceled by currentMenu useffect
      setMenuOpen(false)
  }
  useEffect(() => {
      //console.log(`in focuso? ${inFocus}`)
      
  },[inFocus])
  const doMenu = (value) => {
    setInFocus(true)
    setMenuOpen(true)
    toggleMenu(value)
  }

  useEffect(() => {
    if (bigMenuVisible == false) {
      setMenuOpen(false)
    }
  }, [bigMenuVisible])

  useEffect(() => {
    //console.log(`the current menu is: ${currentMenu}`)
    if (currentMenu == value) {
      setMenuOpen(true)
      setInFocus(true)
    }
    else {
      setMenuOpen(false)
      setInFocus(false)
    }

  }, [currentMenu])
  
    //when resetit changes, we've gone back to the default pictolight screen
    //so, reset this sub case toggle
  useEffect(() => {
    if (resetit !== undefined) {
      setMenuOpen(false)
      setInFocus(false)
    }
  }, [resetit])
  useEffect(() => {
      setCurrentSelection(selectionMade)
    
    //doSelectionCheck()
    /*
    if (selectionMade !== "") {
      let selParsed = JSON.parse(selectionMade)
      if (selParsed.hasOwnProperty(value)) {
        //console.log("do a thing!")
        //setInFocus(true)
        setMenuOpen(false)
        setCurrentItem(selParsed[value])
      }
      else {
        //setInFocus(false)
      }
    }
    */
  }, [selectionMade])

  useEffect(() => {
    doSelectionCheck()
  }, [currentSelection])

  const doSelectionCheck = () => {
    if (currentSelection !== "") {
      let selParsed = JSON.parse(currentSelection)
      if (selParsed.hasOwnProperty(value)) {
        if (selParsed[value] == "CANOPY") {
          setMenuOpen(false)
          setCurrentItem("CNPY")
        }
        else {
          setMenuOpen(false)
          setCurrentItem(selParsed[value])
        }
      }
      else {
        //setInFocus(false)
      }    
    }
  }

/*
 font-(family-name:--font-edBold)
*/
  return (
		<div className="
      grid grid-rows-2 gap-0
      w-[20vw] v-[20vh]
      place-items-center
      items-end
      content-end
    ">
		  <div className="
        w-[20vw] h-[3vh]

        w-fit
        h-fit
      ">
        <p className="
          text-[3vw]
          text-[#001E60]
          font-bold align-text-bottom
        "
        > {nameo} </p>
      </div>
    <button className="
      w-[20vw] h-[5vh]
      border-4 border-solid rounded-[3vw]
      border-[#001E60]
    " 
    style={stylo}
      onClick={()=> doMenu(value)}
    >
      <div className="
        flex
        w-[16vw]
        gap-[10%] p-0 ml-[1vw] mr-10 
        place-items-center
      ">
        <p className="
          text-[#fff]
          text-[5vw]
          text-center
          
          grow-3
        ">
          {currentItem}
        </p>
        {inFocus &&
        <div className="
        ">
          {menuOpen ? (
            <Image
              src="./triangleUp.svg"
              height={50}
              width={50}
              alt="triangle"
            />
            ) : (
              <Image
                src="./triangleDown.svg"
                height={50}
                width={50}
                alt="triangle"
              />
            )}
          </div>
        }
      </div>
    </button>
    </div>
	)
}

export default CaseToggle