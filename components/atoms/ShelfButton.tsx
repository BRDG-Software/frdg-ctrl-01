'use client'

import { useState, useEffect } from 'react'

const SendButton = ({inchWidth, sectionNum}) => {
	const [label, setLabel] = useState("0"+String(sectionNum))
	const [realWidth, setRealWidth] = useState(inchWidth*3)
	function burstMessage() {

	}

	return (
		<div className="w-full h-full">
			<button className="
				text-[3vw]
				h-[6vw]
				bg-[#0053e2]
				text-[#fff]
				text-center
				border-[1vw]
				border-solid
				rounded-[0vw]
				border-[#001e60]
				font-bold
				"
				style={{width: `${realWidth}vw`}}
				 onClick={() => burstMessage()}
				
			>
				{label}
			</button>			
		</div>
	)
}

export default SendButton