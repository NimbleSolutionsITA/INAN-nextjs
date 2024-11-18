import {forwardRef, MouseEventHandler, useState} from "react"
import {IconButton, Dialog} from "@mui/material";
import CloseIcon from "./icons/CloseIcon";
import Image from "next/image";

type ModalImageProps = {
    url: { src: string, woocommerce_single?: string }
    alt: string,
}

const ModalImage = forwardRef(({url, alt}: ModalImageProps, disabled) => {
    const [open, setOpen] = useState(false)
    const handleOpen: MouseEventHandler<HTMLDivElement> = (event) => setOpen(true)
    const handleClose = () => setOpen(false)
    return (
        <>
            <div onClick={handleOpen} style={{position: 'relative', width: '100%', paddingBottom: '150%'}}>
                <Image
                    src={url.src}
                    alt={alt}
                    fill
                />
            </div>
            <Dialog
                // @ts-ignore
                open={open && !disabled?.current}
                onClose={handleClose}
                style={{zIndex: 1401}}
                fullScreen
                PaperProps={{
                    sx: {
                        backgroundColor: '#f4f4f6',
                        overflow: "auto"
                    }
                }}
            >
                <Image
                    src={url.src}
                    alt={alt}
                    width={1600}
                    height={1600}
                    style={{width: '100%', height: 'auto'}}
                />
                <IconButton disableRipple onClick={() => setOpen(false)} style={{position: 'fixed', right: 0, top: 0}}>
                    <CloseIcon width="21px" />
                </IconButton>
            </Dialog>
        </>
    )
})

export default ModalImage