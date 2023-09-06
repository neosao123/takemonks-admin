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
// ----------------------------------------------------------------------

export default function editBrand() {
    const { bid } = useParams();
    console.log(bid);
    const navigate = useNavigate();
    const { t } = useTranslation("brands");



    const { data: brand } = useQuery(
        ["update-brand", bid],
        () => api.getBrand(bid),
        // {
        //     enabled: Boolean(bid),
        //     retry: false,
        //     onError: (error) => {
        //         if (!error.response.data.success) {
        //             navigate("/404");
        //         }
        //     },
        // }
    );
    const data = brand?.data;
    return (
        <Page title={`Edit Brand | ${process.env.REACT_APP_DOMAIN_NAME}`}>
            <Toolbar>
                <HeaderBreadcrumbs
                    heading="Categories List"
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
                            name: t("edit"),
                            href: "",
                        },
                    ]}
                />
            </Toolbar>
            <BrandEditForm brand={data} />
        </Page>
    );
}
