import CollectionPage, {getStaticProps as baseGetStaticProps} from "./index";
import {getAllCollectionIds} from "../../src/utils/layout";

export default CollectionPage

export async function getStaticProps(context: {params?: {cslug?: string}}) {
    return await baseGetStaticProps(context)
}

export async function getStaticPaths() {
    const paths = await getAllCollectionIds();
    return {
        paths,
        fallback: false,
    };
}