import {BasePageProps} from "../../../../@types";
import {CollectionPageProps, useIsMobile} from "../../../utils/layout";
import type {NextPage} from "next";
import {useRouter} from "next/router";
import Layout from "../../layout";
import Loader from "../../Loader";
import Container from "../../Container";
import Collection from "./Collection";

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
	                                                   collection
                                                   }) => {
	const isMobile = useIsMobile()
	const router = useRouter()
	return (
		<Layout key={router.asPath} {...layoutProps} yoast={collection?.yoast_head} pageSettings={pageSettings} links={links} news={news} activeLink={collection?.slug}>
			<>
				<Loader image="collection" />
				<Container disableGutters={isMobile} headerPadding>
					{collection && <Collection collection={collection} />}
				</Container>
			</>
		</Layout>
	)
}

export default CollectionPage