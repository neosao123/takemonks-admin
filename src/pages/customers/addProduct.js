import React, { useState } from "react";

//components
import {
    HeaderBreadcrumbs,
    ProductNewForm,
    Toolbar,
    Page,
} from "src/components";
// notification
import toast from 'react-hot-toast';
// api
import { useQuery } from "react-query";
import * as api from "src/services";
import { useTranslation } from "react-i18next";
import { AddProductForm } from "src/components/forms/user";
import { AddAmc } from "src/components/forms/user";
import Typography from "src/theme/overrides/Typography";
import { Box, Button } from "@mui/material";


export default function Create() {
    const { t } = useTranslation("user");
    const [tab, setTab] = useState("products");

    const { data, isLoading } = useQuery("categories", api.getAllSubCategories, {
        onError: (err) => {
            toast.error(err.response.data.message || "Something went wrong!");
        },
    });


    return (
        <Page title={`Add Product | ${process.env.REACT_APP_DOMAIN_NAME}`}>
            <Toolbar>
                <HeaderBreadcrumbs
                    heading="Product List"
                    links={[
                        { name: t("dashboard"), href: "/" },
                        { name: t("orders"), href: "/orders" },
                        { name: t("Add Product/AMC") },
                    ]}
                    action={{
                        href: `/cart`,
                        title: t("Cart")
                    }}
                />
            </Toolbar>
            <Box sx={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                <Button onClick={() => setTab("products")}>Products</Button>
                <Button onClick={() => setTab("AMC")}>AMC</Button>
            </Box>
            {tab==="products" && <AddProductForm
                isLoading={isLoading}
                categories={isLoading ? [] : data?.data}
            />}
            {
                tab==="AMC" && <AddAmc/>
            }
        </Page>
    );
}