import {React, useRef, useState, useEffect } from 'react'

const BigMenuButton = ({name}) => {
	const [isHovered, setIsHovered] = useState(false)

	 const stylee = {
	 	zIndex: 90000,
    	backgroundColor: isHovered ? "#fff" : "",
    	color: isHovered ? "#001E60" : "#fff"
 	 }

 	 const handleMouseMove = (event) => {
 	 	console.log("AHHH")
 	 }
	return (
		<div
			className="
			text-white
			text-[10vw]
			row-span-1
			-m-0
			left-100 
			w-full
			h-[7vh]
			grid
			justify-items text-center
			place-items-center 
		"
		onMouseEnter={() => setIsHovered(true)}
		onMouseLeave={() => setIsHovered(false)}
		style={stylee}
		>
			{name}
		</div>	
	)
}

export default BigMenuButton