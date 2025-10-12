/*
uses 
https://github.com/uiwjs/react-color
*/
'use client'
import { useState } from "react"
import ColorPicker from 'react-color-picker-wheel'

import {hex2rgb} from '@/utils/utils.js'

const ColorPickerWheel = () => {
	const [hex, setHex] = useState("#ffffff");

	return(
		<div className="
		">

		</div>
	)
}
export default ColorPickerWheel

/*
<ColorPicker
    initialColor="#FF0000"
    onChange={(color => console.log(color))}
    //Console output => { hex: "#FF0000", rgb : { r: 255, g: 0, b: 0 } , hsl : { h: 0, s: 100, l: 50 }
    size={300}
/>;

*/