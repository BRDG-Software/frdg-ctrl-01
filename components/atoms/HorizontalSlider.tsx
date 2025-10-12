'use client'
import { useState, useEffect } from "react"
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const HorizontalSlider = ({sliderValueUp, defaulty="000", minimum=0, maximum=255 }) => {
	const [currentSlide, setCurrentSlide] = useState(defaulty)
	const [slideDefault, setSlideDefault] = useState(parseInt(defaulty))
	const doSliderChange = (value) => {
		setCurrentSlide(value)
		sliderValueUp(value)
	}
//defaultValue={[10,150]}
	return(
		<div className="
		w-full h-full
		">
		<Slider
			className="t-slider"
			min={minimum}
			max={maximum}
			defaultValue={slideDefault}
			reverse={false}
			step={1}
			onChange={doSliderChange}
			trackStyle={{
				backgroundColor:'#d9d9d9', height: '4vw',
				borderRadius: '2vw'
				}}
			railStyle={{backgroundColor:'#d9d9d9', height:'4vw',
				borderRadius: '2vw'
				}}
			handleStyle={{    borderColor: "#fff",
						opacity: 0.99,
				          height: '8vw',
				          width: '5vw',
				          borderRadius:'1vw',
				          marginLeft: '-2vw',
				          marginTop: '-2.2vw',
				          backgroundColor: "#ffc220"}}
		/>
		</div>
	)
}

export default HorizontalSlider
/*
	to pass the value through ONLY on change completion
	onChange={doSliderChange}

	const marks = {
		0: 'item 1', 60: 'item 2', 130: 'item 3', 170: 'item 4'
	}
		<Slider
			range
			className="t-slider"
			min={0}
			max={190}
			defaultValue={[10,150]}
			reverse={true}
			step={10}
			marks={marks}
			onChangeComplete={doSliderChange}
			trackStyle={{backgroundColor:'#8888aa', height: 12}}
			railStyle={{backgroundColor:'#444488', height:10}}
			handleStyle={{    borderColor: "#fff",
				          height: 20,
				          width: 20,
				          marginLeft: -10,
				          marginTop: -5,
				          backgroundColor: "#ccccff"}}
		/>
*/