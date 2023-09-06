import React from "react";
// react router dom
import { useParams, useNavigate } from "react-router-dom";
//components
import {
    HeaderBreadcrumbs,
    SubCategoryEditForm,
    Page,
    Toolbar,
} from "src/components";
import { useQuery } from "react-query";
import * as api from "src/services";
// notification
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { BrandEditForm } from "src/components/forms/brand";
import { AmcEditForm } from "src/components/forms/amc";
// ----------------------------------------------------------------------

export default function editAmc() {
    const { aid } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation("amcs");


    const { data: products, isLoading } = useQuery("products", api.getAllProducts, {
        onError: (err) => {
            toast.error(err.response.data.message || "Something went wrong!")
        },
    });

    const { data: amc } = useQuery(
        ["update-amc", aid],
        () => api.getAmc(aid),
        {
            enabled: Boolean(aid),
            retry: false,
            onError: (error) => {
                if (!error.response.data.success) {
                    navigate("/404");
                }
            },
        }
    );
    const data = amc?.data;
    const pdata = products?.data;

    return (
        <Page title={`Edit AMC | ${process.env.REACT_APP_DOMAIN_NAME}`}>
            <Toolbar>
                <HeaderBreadcrumbs
                    heading="Categories List"
                    links={[
                        {
                            name: t("dashboard"),
                            href: "/dashboard",
                        },
                        {
                            name: t("AMCs"),
                            href: "/amcs",
                        },
                        {
                            name: t("edit"),
                            href: "",
                        },
                    ]}
                />
            </Toolbar>
            <AmcEditForm currentAmc={data} products={pdata} />
        </Page>
    );
}
