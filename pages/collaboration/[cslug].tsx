
import {getCollectionStaticProps} from "../../src/utils/helpers";
import {getAllCollectionIds} from "../../src/utils/layout";
import CollectionPage from "../../src/components/pages/collection/CollectionPage";

export default CollectionPage

export async function getStaticProps(context: {params?: {cslug?: string}}) {
    return getCollectionStaticProps(context, 'collaboration')
}

export async function getStaticPaths() {
    const paths = await getAllCollectionIds("collaboration");
    return {
        paths,
        fallback: 'blocking',
    };
}