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


export default function Create() {
    const { t } = useTranslation("user");

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
                        { name: t("customers"), href: "/customers" },
                        { name: t("addproduct") },
                    ]}
                    action={{
                        href: `/users/cart`,
                        title: t("View Cart")
                    }}
                />
            </Toolbar>
            <AddProductForm
                isLoading={isLoading}
                categories={isLoading ? [] : data?.data}
            />
        </Page>
    );
}