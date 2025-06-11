import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getHomeProps, getLayoutProps, getPageProps, HomePageProps, useIsMobile} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {useState} from "react";
import CoverContent from "../src/components/pages/home/CoverContent";
import HomeCovers from "../src/components/pages/home/HomeCovers";
import CrossSell from "../src/components/pages/product/CrossSell";
import {getProducts} from "../src/utils/products";
import {Container} from "@mui/material";
import {WP_REST_API_Post} from "wp-types";

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
                    />
                )}
                <HomeCovers
                    showContent={showContent}
                    setShowContent={setShowContent}
                    currentCoverIndex={currentCoverIndex}
                    setCurrentCoverIndex={setCurrentCoverIndex}
                    covers={covers}
                    currentCover={currentCover}
                />
                <Container sx={{my: '128px'}}>
                    <CrossSell items={currentCover.products} isMobile={isMobile} disableTitle />
                </Container>
            </div>
        </Layout>
  )
}

export default Home

export async function getStaticProps() {
  const [
      {layoutProps, news},
      { covers },
      { page }
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