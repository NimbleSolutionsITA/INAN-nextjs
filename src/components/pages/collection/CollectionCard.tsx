import {Container, Dialog, Divider, IconButton, Typography} from "@mui/material"
import Button from "../../Button";
import {CloseOutlined} from "@mui/icons-material";
import {useState} from "react";
import {CollectionACFProduct} from "../../../utils/layout";
import CloseIcon from "../../icons/CloseIcon";

type CollectionCardProps = {
    product: CollectionACFProduct
    isMobile: boolean
    isLookbook?: boolean
}

const CollectionCard = ({product, isMobile, isLookbook}: CollectionCardProps) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <img onClick={handleOpen} style={{width: '100%', marginBottom: '-3px', cursor: 'pointer'}} src={product?.image.sizes?.large} alt="inan collection" />
            {product.product.post_name && (
                <>
                    <Divider />
                    <Container disableGutters={!isMobile || isLookbook}>
                        <div style={{display: 'flex', padding: '2px 0'}}>
                            <Typography variant="h3" component="div" style={{lineHeight: '21px'}}>{product.product.post_title === 'BAG BELT 4' ? 'bag belt' : product.product.post_title}</Typography>
                        </div>
                    </Container>
                    <Divider />
                </>
            )}
            <Dialog
                open={open}
                onClose={handleClose}
                style={{zIndex: 1401}}
                fullScreen
            >
                <div style={{maxWidth: '100%', maxHeight: '100vh', margin: 'auto'}}>
                    <img style={{objectFit: 'cover', marginBottom: '-2px', maxHeight: 'calc(100vh - 28px)', maxWidth: '100%'}} src={product.image.url} alt="inan collection" />
                    {product.product.post_name && (
                        <>
                            <Divider />
                            <div style={{display: 'flex', padding: '2px 0'}}>
                                <Typography variant="h3" component="div" style={{lineHeight: '21px'}}>{product.product.post_title === 'BAG BELT 4' ? 'bag belt' : product.product.post_title}</Typography>
                            </div>
                            <Divider />
                        </>
                    )}
                </div>
                <IconButton disableRipple onClick={() => setOpen(false)} style={{position: 'absolute', right: 0, top: 0}}>
                    <CloseIcon width="21px" />
                </IconButton>
            </Dialog>
        </>
    )
}

export default CollectionCard