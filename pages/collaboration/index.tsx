
import {getCollectionStaticProps} from "../../src/utils/helpers";
import CollectionPage from "../../src/components/pages/collection/CollectionPage";

export default CollectionPage

export async function getStaticProps(context: {params?: {cslug?: string}}) {
    return getCollectionStaticProps(context, 'collaboration')
}