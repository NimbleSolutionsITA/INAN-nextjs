import React, { useState } from "react";
import Container from "../../../components/Container";
import ProductCard from "./ProductCard";
import {Grid, Typography, FormControlLabel, FormGroup, FormControl, FormLabel} from "@mui/material";
import { Attribute, ShopProduct } from "../../../utils/products";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { API_GET_PRODUCTS_ENDPOINT } from "../../../utils/endpoints";
import { useRouter } from "next/router";
import { ShopPageProps, useIsMobile } from "../../../utils/layout";
import Checkbox from "../../Checkbox";
import Filters from "./Filters";

type GridViewProps = {
    productCategories: ShopPageProps["productCategories"];
    attributes: Attribute[];
    inStock?: boolean;
};

const GridView = ({ productCategories, attributes, inStock }: GridViewProps) => {
    const isMobile = useIsMobile();
    const router = useRouter();

    const category =
        router.query.category
            ? productCategories.find((cat) => cat.slug === router.query.category) ?? productCategories[0]
            : productCategories[0];

    // State for attribute filters
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string|string[]|undefined>>(inStock ? {stock_status: "instock"} :{});

    // Handle filter change
    const handleFilterChange = (attributeSlug: string, optionSlug: string, checked?: boolean) => {
        setSelectedFilters((prev) => {
            const currentFilters = prev[attributeSlug] || [];
            if (attributeSlug === "name") {
                return { ...prev, name: [optionSlug] };
            }
            else if (attributeSlug === "stock_status") {
                return { ...prev, stock_status: checked ? "instock" : undefined };
            }
            else if (checked && Array.isArray(currentFilters)) {
                return { ...prev, [attributeSlug]: [...currentFilters, optionSlug] };
            } else if (Array.isArray(currentFilters)) {
                return {
                    ...prev,
                    [attributeSlug]: currentFilters.filter((slug) => slug !== optionSlug),
                };
            }
            return prev
        });
    };

    // Build query parameters
    const buildQueryParams = () => {
        const params: Record<string, string> = {
            page: "1",
            per_page: "9",
            categories: category?.id.toString() || "",
        };

        // Add attribute filters
        Object.entries(selectedFilters).forEach(([attributeSlug, options]) => {
            if (Array.isArray(options) && options.length > 0) {
                params[attributeSlug] = options.join(",");
            } else if (typeof options === "string") {
                params[attributeSlug] = options;
            }
        });

        return params;
    };

    // Infinite Query
    const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery(
        ["products", category?.id, selectedFilters],
        async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({
                ...buildQueryParams(),
                page: pageParam.toString(),
            });

            const { products: fetchedProducts } = await fetch(`${API_GET_PRODUCTS_ENDPOINT}?${params}`, {
                headers: {
                    "Accept-Encoding": "application/json",
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json());
            return fetchedProducts;
        },
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.length > 0) {
                    return pages.length + 1;
                }
            },
        }
    );

    return (
        <div style={{ width: !isMobile ? "100%" : undefined, paddingBottom: "40px" }}>
            <div style={{ borderBottom: isMobile ? "1px solid black" : undefined }}>
                <Container style={{ display: "flex" }}>
                    <Typography
                        style={{
                            width: "100%",
                            textTransform: "uppercase",
                            borderBottom: !isMobile ? "1px solid" : undefined,
                        }}
                        variant="h1"
                        component="h1"
                    >
                        {category?.name}
                    </Typography>
                </Container>
            </div>
            <Container>
                <Filters selectedFilters={selectedFilters} attributes={attributes} handleFilterChange={handleFilterChange} />
                {status === "success" && (
                    <InfiniteScroll
                        dataLength={data?.pages.length * 9}
                        next={fetchNextPage}
                        hasMore={hasNextPage || false}
                        loader={<h5>Loading...</h5>}
                    >
                        <Grid container spacing={isMobile ? 1 : 2}>
                            {data?.pages.map((products) =>
                                products.map((product: ShopProduct) => (
                                    <Grid key={product.id} xs={6} md={4} item>
                                        <ProductCard product={product} />
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </InfiniteScroll>
                )}
            </Container>
        </div>
    );
};

export default GridView;
