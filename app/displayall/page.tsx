"use client"
//import { useSearchParams } from 'next/navigation'
import { getRandomInt } from '@/utils/utils.js'
import { socket } from "@/lib/socketClient"
import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation'
import ContentScroller from '@/components/ContentScroller'
import ContentScrollerSideLoaded from '@/components/ContentScrollerSideLoaded'

  /// we'll use the content routes look up key here to tell us how to handle
  /// each unique piece of screen content 
import data from '@/public/data.json'

export default function Home() {
  const searchParams = useSearchParams()


  const [scaler, setScaler] = useState(1)

  const widthScaled = `${1920*scaler}px`
  const heightScaled = `${360*scaler}px`
  
  return (
    <div className="
      absolute left-0 top-0
      ">
      <div className="
        w-[5760px] h-[360px]
        grid grid-rows-1 grid-cols-3"
      >
        <div 
        >
          <iframe 
        src="http://localhost:3434/display?screen=1" 
        title="first case display" 
        width={widthScaled} 
        height={heightScaled}
        frameBorder="0"
        style={{transform: `scale(${scaler})`}}
        ></iframe>
        </div>
        <div 
        >
          <iframe 
        src="http://localhost:3434/display?screen=2" 
        title="second case display" 
        width={widthScaled} 
        height={heightScaled}
        frameBorder="0"
        style={{transform: `scale(${scaler})`}}
        ></iframe>
        </div>
        <div
        >
          <iframe 
        src="http://localhost:3434/display?screen=3" 
        title="third case display" 
        width={widthScaled} 
        height={heightScaled}
        frameBorder="0"
        style={{transform: `scale(${scaler})`}}
        ></iframe>
        </div>
      </div>
    </div>
  );
}

