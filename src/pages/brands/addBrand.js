import React from "react";

//components
import {
    HeaderBreadcrumbs,
    SubCategoryNewForm,
    Page,
    Toolbar,
} from "src/components";
// notification
import toast from 'react-hot-toast';
// api
import { useQuery } from "react-query";
import * as api from "src/services";
import { useTranslation } from "react-i18next";
import BrandNewForm from "src/components/forms/brand/brandNewForm";

export default function CreateBrand() {
    const { t } = useTranslation("brands");

    const { data, isLoading } = useQuery("brands", api.getAllCategories, {
        onError: (err) => {
            toast.error(err.response.data.message || "Something went wrong!")
        },
    });
    return (
        <Page title={`Add Brand | ${process.env.REACT_APP_DOMAIN_NAME}`}>
            <Toolbar>
                <HeaderBreadcrumbs
                    heading="Brand List"
                    links={[
                        {
                            name: t("dashboard"),
                            href: "/dashboard",
                        },
                        {
                            name: t("brands"),
                            href: "/brands",
                        },
                        {
                            name: t("add"),
                            href: "/",
                        },
                    ]}
                />
            </Toolbar>
            <BrandNewForm categories={isLoading ? [] : data?.data} />
        </Page>
    );
}
