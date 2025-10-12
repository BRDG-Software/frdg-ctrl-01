'use client'

import { useState, useEffect } from 'react'

const SendButton = ({burstMessage}) => {

	/*
	const [doThing, setDoThing] = useState(0)

	const randomThing = () => {
		setDoThing()
	}
	*/

	return (
		<div className="w-full h-full">
			<button className="
				text-[4vw]
				w-[30vw] h-[16vw]
				bg-[#0053e2]
				text-[#fff]
				text-center
				border-[1vw]
				border-solid
				rounded-[3vw]
				border-[#001e60]
				font-bold
				"
				 onClick={() => burstMessage()}
			>
				SEND
			</button>			
		</div>
	)
}

export default SendButton