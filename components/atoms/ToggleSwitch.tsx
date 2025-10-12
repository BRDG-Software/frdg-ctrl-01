'use client'
import { useState, useEffect } from 'react'
import * as styles from './ToggleSwitch.module.css'

const ToggleSwitch = ({toggleValueUp, defaulty}) => {
	const [updato, setUpdato] = useState(true)
	const [defaulto, setDefaulto] = useState(defaulty)
	const doToggleChange = () => {
		setUpdato(!updato)
		toggleValueUp(updato)
	}
	const toggleChange = () => (event) => {
		doToggleChange()
	}

	/*
	useEffect(() => {
		setDefaulto(defaulty)
		setUpdato(defaulty)
		console.log(`defaulty is ${defaulty}`)
	}, [defaulty])
	*/
	return (
		<div className="w-full h-full 
			grid
			place-items-center
			
		"
		>
			<label className={styles.switch}>
			 <input type="checkbox"
			 	defaultChecked={true}
			 	onChange={toggleChange()}
			 />
			 <span className={`${styles.slider} ${styles.round}`}></span>
			</label>
		</div>
	)
}

export default ToggleSwitch