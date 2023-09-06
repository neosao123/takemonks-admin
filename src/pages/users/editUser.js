import React from "react";
import { useQuery } from "react-query";
import * as api from "src/services";

//components

import {
    HeaderBreadcrumbs,
    ProductEditForm,
    Toolbar,
    Page,
} from "src/components";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EditUserForm from "src/components/forms/user/editUserForm";
// ----------------------------------------------------------------------

export default function EditUser() {
    const { pid } = useParams();
    const { t } = useTranslation("user");
    const navigate = useNavigate();

    return (
        <Page title={`Edit User | ${process.env.REACT_APP_DOMAIN_NAME}`}>
            <Toolbar>
                <HeaderBreadcrumbs
                    heading="Edit User"
                    links={[
                        { name: t("dashboard"), href: "/" },
                        { name: t("users"), href: "/users" },
                        { name: t("edit") },
                    ]}
                />
            </Toolbar>

            <EditUserForm
            //    currentProduct={data} isInitialized={!isLoading} 
            />
        </Page>
    );
}
