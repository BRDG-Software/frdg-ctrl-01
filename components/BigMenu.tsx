'use client'
import {React, useState, useEffect } from 'react'
import data from '@/public/data.json'
import BigMenuButton from '@/components/atoms/BigMenuButton'

const BigMenu = ({ sendMenuMsgToParent, whichMenu }) => {

	const [options, setOptions] = useState(data[whichMenu])

	 //const stylee = {
    //	backgroundColor: inFocus ? '#0053e2' : '#9c9c9c'
 	 //}

	const doMessage = (msg) => {
		//console.log(msg)
	}

	useEffect(() => {
		setOptions(data[whichMenu])
		//console.log(data[whichMenu])
	}, [whichMenu])

	const [athing, setAthing] = useState("nah")
	
	return (
	<div className="">
		<div className="
			bg-[#001E60]
			top-0 left-0
			grid
			grid-rows-20
			rounded-[5vw]
			pt-10
			gap-1
			items-center text-center place-items-center
			col-span-20
			z-700
			border-10
			border-[#0053E2]
		">
			{options.map(item => 
				<div key={item.key}
					onClick={() => sendMenuMsgToParent('{"'+whichMenu+'":"'+item.name+'"}')}
					className="
						w-full
						z-99999
					"
				>
					<BigMenuButton
						name={item.name}
					/>
				</div>
				)}

		</div>
	</div>	
		)

/*
					
					className="bg-green-200 
					text-white
					text-[100px]
					row-span-1
					-m-0
					w-full"> 
					{item.name}






					className="bg-green-200 
					
					row-span-1
					-m-0
					w-full"

					"bg-green-200 
					text-white
					text-[100px]
					row-span-1
					-m-0
					w-full"


*/
}

export default BigMenu 