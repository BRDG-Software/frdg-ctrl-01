/*
uses 
https://github.com/uiwjs/react-color
*/
'use client'
import { useState, useEffect, useRef } from "react"
import {Sketch, Material, Colorful, Compact, Circle, Wheel, Block, Github, Chrome } from '@uiw/react-color';
import { EditableInput, EditableInputRGBA, EditableInputHSLA } from '@uiw/react-color';

import {hex2rgb} from '@/utils/utils.js'

const ColorPicker = ({getColorFromChild}) => {
	const [hex, setHex] = useState("#ffffff");
	const [wheelWidth, setWheelWidth] = useState(1)
	const [wheelHeight, setWheelHeight] = useState(1)
	const elementRef = useRef(null)
		/* to responsively set the color wheel size and pointer mapper
			you need to reference the width of the parent div
			then use that value as the wheel width & height
			and divide that value by 9 for the pointer translation 
		*/
	const [elementWidth, setElementWidth] = useState(0)
		//pointer translation is relative to wheel size by divisor 9
	const [translation, setTranslation] = useState(48)

	const setSize = () => {
		setWheelWidth(elementWidth)
	    setWheelHeight(elementWidth)
	    setTranslation(elementWidth/9)			
	}
	useEffect(() => {
	    setElementWidth(elementRef.current ? elementRef.current.offsetWidth : 0)
		setSize()
	}, [elementRef.current]);
	
	useEffect(() => {
		getColorFromChild(hex)
	}, [hex])

	return(
		<div ref={elementRef} className="h-[45vw] w-[45vw]

		"
		>
			<Wheel
				color={hex}
		      	width={wheelWidth}
		      	height={wheelHeight}
		      	onChange={(color) => {
		        	setHex(color.hex);
		      	}}
		      	pointer={({ color, style }) => {
			          return (
			            <div style={style}>
			              <div
			                style={{
			                width: '9vw',
			                height: '9vw',
			                transform: `translate(-${translation}px,-${translation}px)`,
			                backgroundColor: color,
			                border: '0.8vw solid #fff',
			            	borderRadius:"50%"	
			                }}
			              />
			            </div>
			          );
				}}
		    />
		</div>
	)
}
export default ColorPicker
