import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getHomeProps, getLayoutProps, getPageProps, HomePageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {useState} from "react";
import CoverContent from "../src/components/pages/home/CoverContent";
import HomeCovers from "../src/components/pages/home/HomeCovers";

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
    return (
        <Layout {...layoutProps} yoast={page.yoast_head} pageSettings={pageSettings} links={links} news={news}>
            <div style={{position: 'relative'}}>
                {showContent && (
                    <CoverContent
                        title={currentCover.title}
                        ctaLink={currentCover.ctaLink}
                        ctaText={currentCover.ctaText}
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
  return {
    props: {
        layoutProps,
        covers,
        news,
        page
    },
    revalidate: 10
  }
}