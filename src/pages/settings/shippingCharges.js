import React from 'react'
import { useTranslation } from 'react-i18next';
import {
    AccountGeneral,
    AccountChangePassword,
    Toolbar,
    HeaderBreadcrumbs,
    Roles,
    Page,
    AddRole,
    ProductNewForm,
    ShippingNewForm
} from "src/components";
import { Tabs, Tab, Box, Card, Typography } from "@mui/material";
const shippingCharges = () => {
    const { t } = useTranslation("setting");
    return (
        <Page title={`Settings | ${process.env.REACT_APP_DOMAIN_NAME}`}>
            <Box sx={{ m: "0 -16px" }}>
                <Toolbar>
                    <HeaderBreadcrumbs
                        heading="Users List"
                        links={[
                            {
                                name: t("dashboard"),
                                href: "/dashboard",
                            },
                            {
                                name: t("shipping-charges"),
                                href: "",
                            },
                        ]}
                    />
                </Toolbar>
            </Box>
            <ShippingNewForm />
        </Page>
    )
}

export default shippingCharges;