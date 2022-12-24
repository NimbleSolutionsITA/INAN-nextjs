import type { NextPage } from 'next'
import Layout from "../src/components/layout";
import {getHomeProps, getLayoutProps, HomePageProps} from "../src/utils/layout";
import {BasePageProps} from "../@types";
import {useState} from "react";
import CoverContent from "../src/components/pages/home/CoverContent";
import HomeCovers from "../src/components/pages/home/HomeCovers";

export type HomeProps = BasePageProps & HomePageProps

const Home: NextPage<HomeProps> = ({
   layoutProps,
   news,
   covers,
   links
}) => {
    const [showContent, setShowContent] = useState(true);
    const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
    const currentCover = covers[currentCoverIndex]
    return (
        <Layout {...layoutProps} links={links} news={news}>
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
      { covers }
  ] = await Promise.all([
      getLayoutProps(),
      getHomeProps()
  ]);
  return {
    props: {
        layoutProps,
        covers,
        news
    },
    revalidate: 10
  }
}