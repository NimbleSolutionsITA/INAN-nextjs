import {ShopProduct} from "../utils/products";
import {Grid} from "@mui/material";
import ProductCard from "./pages/shop/ProductCard";
import {API_GET_PRODUCTS_ENDPOINT} from "../utils/endpoints";
import {useEffect, useState} from "react";
import {useIsMobile} from "../utils/layout";

const PrivateProductGrid = () => {
	const [products, setProducts] = useState([]);
	const isMobile = useIsMobile()

	useEffect(() => {
		const fetchProducts = async () => {
			const { products } = await fetch(`${API_GET_PRODUCTS_ENDPOINT}?status=private&per_page=100`).then((res) => res.json());
			setProducts(products);
		}
		fetchProducts();
	}, []);


	return (
		<Grid container spacing={isMobile ? 1 : 2}>
			{products.map((product: ShopProduct) => (
				<Grid key={product.id} xs={6} md={4} item>
					<ProductCard product={product} isPrivate />
				</Grid>
			))}
		</Grid>
	)
}

export default PrivateProductGrid