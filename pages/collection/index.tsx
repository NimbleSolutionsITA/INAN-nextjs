import type { NextPage } from 'next'
import {useEffect, useState} from "react";
import Layout from "../../src/components/layout";
import {CollectionPageProps, getLayoutProps, getCollectionProps} from "../../src/utils/layout";
import {BasePageProps} from "../../@types";
import Container from "../../src/components/Container"
import {useRouter} from "next/router";
import Collection from "../../src/components/pages/collection/Collection";
import {useSelector} from "react-redux";
import {RootState} from "../../src/redux/store";

const pageSettings = {
    bgColor: '#fff',
    headerColor: '#000',
    headerColorMobile: '#000',
    pageTitle: null
}

export type CollectionProps = BasePageProps & CollectionPageProps

const CollectionPage: NextPage<CollectionProps> = ({
   layoutProps,
   news,
   links,
   collections
}) => {
    const { isMobile } = useSelector((state: RootState) => state.header);
    const [hideLoader, setHideLoader] = useState(false)
    const router = useRouter()
    const slug = router.query.cslug ?? (links && links[links.length - 1]?.slug)

    const collection = collections.find((c) => c.slug === slug)

    useEffect(() => {
        let timer = setTimeout(() => setHideLoader(true), 500)
        return () => clearTimeout(timer)
    })
    return (
        <Layout {...layoutProps} yoast={collection?.yoast_head} pageSettings={pageSettings} links={links} news={news} activeLink={collection?.slug}>
            <>
                {!hideLoader && <div style={{zIndex: 9999, width: '100vw', height: '100vh', position: 'fixed', top: 0, backgroundImage: 'url("/loaders/loader-collection.gif")', backgroundSize: 'cover', backgroundPosition: 'center'}} />}
                <Container disableGutters={isMobile} headerPadding>
                    {collection && <Collection collection={collection} />}
                </Container>
            </>
        </Layout>
    )
}

export default CollectionPage

export async function getStaticProps(context: {params?: {cslug?: string}}) {
  const [
      {layoutProps},
      {collections}
  ] = await Promise.all([
      getLayoutProps(),
      getCollectionProps()
  ]);
  const links = collections.map(collection => ({
      id: collection.id,
      slug: collection.slug,
      name: collection.title.rendered,
      url: `/collection/${collection.slug}`
  }))
  return {
    props: {
        layoutProps,
        collections,
        links
    },
    revalidate: 10
  }
}