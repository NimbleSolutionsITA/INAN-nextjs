import VimeoPlayer from "../../VimeoPlayer";
import CollectionCard from "./CollectionCard";
import Container from "../../Container";
import {Divider, Grid, Typography} from "@mui/material";
import {CollectionPostACF, useIsMobile} from "../../../utils/layout";
import MultiCarousel from "../../MultiCarousel";

type CollectionProps = {
    collection: CollectionPostACF
}

const Collection = ({collection}: CollectionProps) => {
    const isMobile = useIsMobile()
    const { gallery, products, lookbook} = collection.acf
    return (
        <>
            <Container disableGutters={!isMobile}>
                <Typography variant="h1">{collection.title.rendered}</Typography>
            </Container>
            <Divider />
            {gallery && (
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={7} style={{position: 'relative'}}>
                        <MultiCarousel draggable={false}>
                            {gallery.map(slide => (
                                <img key={slide.ID} src={slide.url} alt={slide.alt} style={{width: '100%'}} />
                            ))}
                        </MultiCarousel>
                    </Grid>
                </Grid>
            )}
            <Grid container spacing={isMobile ? 0 : 4} style={{marginTop: '36px'}}>
                {Array.isArray(products) && products?.map(prod => (
                    <Grid key={prod.image.ID} item xs={12} md={6} style={{paddingBottom: isMobile ? '24px' : undefined}}>
                        <CollectionCard isMobile={isMobile} product={prod} />
                        <Divider />
                    </Grid>
                ))}
            </Grid>
            {collection.acf.video && (
                <div style={{position: 'relative', marginTop: '24px'}}>
                    <VimeoPlayer
                        video={collection.acf.video.video}
                        autoplay={false}
                        cover={collection.acf.video.video_poster}
                        color="#fff"
                    />
                </div>
            )}
            {Array.isArray(lookbook) && (
                <>
                    <div style={{height: '48px', width: '100%'}} />
                    <Container disableGutters={!isMobile}>
                        <Typography variant="h1">Lookbook</Typography>
                    </Container>
                    <Divider />
                    <Container disableGutters={!isMobile} style={{marginTop: '24px'}}>
                        <div style={{position: 'relative', marginRight: isMobile ? '-16px': undefined}}>
                            <MultiCarousel
                                partialVisbile
                                containerClass="multi"
                                itemClass="carousel-item-padding-40-px"
                                draggable={false}
                                responsive={{
                                    desktop: {
                                        breakpoint: { max: 10000, min: 735 },
                                        items: 3,
                                    },
                                    mobile: {
                                        breakpoint: { max: 735, min: 0 },
                                        items: 2,

                                        partialVisibilityGutter: 20
                                    }
                                }}
                            >
                                {lookbook.map(lb => (
                                    <CollectionCard isMobile={isMobile} key={lb.image.ID} product={lb} isLookbook />
                                ))}
                            </MultiCarousel>
                        </div>
                    </Container>
                </>
            )
            }
        </>
    )
}

export default Collection