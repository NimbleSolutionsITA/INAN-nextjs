import Shop, {getStaticProps as baseGetStaticProps} from "./index";
import {getAllProductCategoriesIds, getCategoriesProps} from "../../src/utils/shop";

export default Shop

export async function getStaticProps({ params: {category} }: {params: {category: string}}) {
    return await baseGetStaticProps({ params: {category} })
}

export async function getStaticPaths() {
    const paths = await getAllProductCategoriesIds();
    return {
        paths,
        fallback: false,
    };
}