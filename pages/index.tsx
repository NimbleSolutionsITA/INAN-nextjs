import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getHomeProps, getLayoutProps, getPageProps, HomePageProps, useIsMobile} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {useEffect, useRef, useState} from "react";
import CoverContent from "../src/components/pages/home/CoverContent";
import HomeCovers from "../src/components/pages/home/HomeCovers";
import CrossSell from "../src/components/pages/product/CrossSell";
import {getProducts} from "../src/utils/products";
import {Container} from "@mui/material";
import {WP_REST_API_Post} from "wp-types";
import {useDispatch} from "react-redux";
import {setHeader} from "../src/redux/headerSlice";

export type HomeProps = BasePageProps & HomePageProps

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: null
}

const Home: NextPage<HomeProps> = ({
   layoutProps,
   news,
   covers,
   links,
   page
}) => {
    const [showContent, setShowContent] = useState(true);
    const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
    const currentCover = covers[currentCoverIndex]
    const isMobile = useIsMobile();
    const coversRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const isVisible = entry.isIntersecting;
                if (!isVisible) {
                    dispatch(setHeader({headerColor: "#000"}));
                    setShowContent(false)
                } else {
                    dispatch(setHeader({headerColor: currentCover.color ?? "#fff"}));
                    setShowContent(true)
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (coversRef.current) {
            observer.observe(coversRef.current);
        }

        return () => {
            if (coversRef.current) {
                observer.unobserve(coversRef.current);
            }
        };
    }, [dispatch]);

    return (
        <Layout {...layoutProps} yoast={page.yoast_head} pageSettings={pageSettings} links={links} news={news}>
            <div style={{position: 'relative'}}>
                {showContent && (
                    <CoverContent
                        title={currentCover.title}
                        ctaLink={currentCover.ctaLink}
                        ctaText={currentCover.ctaText}
                        color={currentCover.color}
                        colorMobile={currentCover.colorMobile}
                        hasNews={!!news.length}
                    />
                )}
                <div ref={coversRef}>
                    <HomeCovers
                        showContent={showContent}
                        setShowContent={setShowContent}
                        currentCoverIndex={currentCoverIndex}
                        setCurrentCoverIndex={setCurrentCoverIndex}
                        covers={covers}
                        currentCover={currentCover}
                        hasNews={!!news.length}
                    />
                </div>
                <Container sx={{my: '128px'}}>
                    <CrossSell items={currentCover.products} isMobile={isMobile} disableTitle/>
                </Container>
            </div>
        </Layout>
    )
}

export default Home

export async function getStaticProps() {
    const [
        {layoutProps, news},
        {covers},
        {page}
    ] = await Promise.all([
        getLayoutProps(),
        getHomeProps(),
        getPageProps('home')
  ]);

  const getCoverProducts = async (cover: any) => {
      const { products } = await getProducts({include: cover.products.map((p: WP_REST_API_Post) => p.ID)})
      return { ...cover, products }
  }

  return {
    props: {
        layoutProps,
        covers: await Promise.all(covers.map(getCoverProducts)),
        news,
        page
    },
    revalidate: 10
  }
}