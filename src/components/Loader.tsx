import { useIsMobile } from "../utils/layout";
import { useEffect, useState } from "react";

const FRAME_DURATION = 100;
const FRAME_COUNT = 4;

const Loader = ({ page }: { page: string }) => {
	const isMobile = useIsMobile();
	const [hideLoader, setHideLoader] = useState(false);
	const [currentFrame, setCurrentFrame] = useState(0);

	useEffect(() => {
		// Timer to hide the loader after 10 seconds
		const hideTimer = setTimeout(() => setHideLoader(true), FRAME_DURATION * FRAME_COUNT);

		// Timer to cycle through frames every 500ms
		const frameTimer = setInterval(() => {
			setCurrentFrame((prevFrame) => (prevFrame + 1) % FRAME_COUNT);
		}, FRAME_DURATION);

		// Cleanup timers on component unmount
		return () => {
			clearTimeout(hideTimer);
			clearInterval(frameTimer);
		};
	}, []);

	// Hide the loader
	if (hideLoader) return null;

	// Get the current frame (with mobile suffix if applicable)
	const frameUrl = `/loaders/${isMobile ? "MOBILE" : "DESKTOP"}/${page.toUpperCase()}/FLASH-${page.toUpperCase()}${isMobile ? `-MOBILE` : ""}-0${currentFrame+1}.jpg`

	return (
		<div
			style={{
				zIndex: 9999,
				height: "100vh",
				width: "100vw",
				position: "fixed",
				top: 0,
				left: 0,
				backgroundImage: `url("${frameUrl}")`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundColor: "#fff",
			}}
		/>
	);
};

export default Loader;
