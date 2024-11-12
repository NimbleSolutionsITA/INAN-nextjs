import {useIsMobile} from "../utils/layout";
import {useEffect, useState} from "react";

const Loader = ({image}: {image: string}) => {
	const isMobile = useIsMobile()
	const [hideLoader, setHideLoader] = useState(false)
	useEffect(() => {
		let timer = setTimeout(() => setHideLoader(true), 500)
		return () => clearTimeout(timer)
	})
	return hideLoader ? null :
		<div
			style={{
				zIndex: 9999,
				height: '100vh',
				width: '100vw',
				position: 'fixed',
				top: 0,
				backgroundImage: `url("/loaders/loader-${image}${isMobile && "-mobile"}.gif")`,
				backgroundSize: 'cover',
				backgroundPosition: 'center'
		}}
		/>
}

export  default Loader