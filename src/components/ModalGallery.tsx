import {useState, useRef} from "react"
import {Dialog, IconButton} from "@mui/material";
import CloseIcon from "./icons/CloseIcon";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {Product} from "../utils/products";
import {Image} from "../../@types/woocommerce";

type ModalGalleryProps = {
    images: Product['images']
    cImage: Image
}

const ModalGallery = ({images, cImage, }: ModalGalleryProps) => {
    const [loaded, setLoaded] = useState(false)
    const [index, setIndex] = useState(images.indexOf(cImage))
    const [open, setOpen] = useState(false)
    const fullImage = useRef<HTMLImageElement>(null)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleNext = () => {
        (index === images.length - 1) ?
        setIndex(0) :
        setIndex(index + 1)
    }
    const handlePrev = () => {
        (index === 0) ?
            setIndex(images.length - 1) :
            setIndex(index - 1)
    }

    return (
        <>
            <div>
                {!loaded && <div style={{width: '100%', paddingBottom: '150%', backgroundColor: '#f5f5f7'}} />}
                <img onClick={handleOpen} onLoad={() => setLoaded(true)} src={images[index].woocommerce_single || images[index].src} alt="inanstudio" style={{width: '100%'}} />
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                style={{zIndex: 1401}}
                fullScreen
            >
                <img ref={fullImage} onLoad={() => setLoaded(true)} src={images[index].src} alt="inanstudio" style={{width: '100%', position: 'absolute'}} />
                <IconButton disableRipple onClick={() => setOpen(false)} style={{position: 'fixed', right: '2%', top: 0}}><CloseIcon width="21px" /></IconButton>
                <IconButton disableRipple onClick={handleNext} style={{position: 'fixed', right: '2%', top: '50%'}}><ArrowForwardIosIcon width="30px" /></IconButton>
                <IconButton disableRipple onClick={handlePrev} style={{position: 'fixed', left: '2%', top: '50%'}}><ArrowBackIosIcon width="30px" /></IconButton>
            </Dialog>
        </>
    )
}

export default ModalGallery