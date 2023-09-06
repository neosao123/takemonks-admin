
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// react router dom
import { useSearchParams } from "react-router-dom";
// notification
import toast from "react-hot-toast";
// api
import * as api from "src/services";
// usequery
import { useQuery } from "react-query";
// mui
import { Dialog } from "@mui/material";
// components
import {
    HeaderBreadcrumbs,
    DeleteDialog,
    Page,
    Toolbar,
    BrandCard,
    Table,
    BrandRow,
} from "src/components";
import DeleteBrandDialog from "src/components/deleteBrandDialog";


const TABLE_HEAD = [
    { id: "brand", label: "brand", alignRight: false, sort: true },
    { id: "status", label: "status", alignRight: false },
    { id: "createdAt", label: "created-at", alignRight: false, sort: true },
    { id: "", label: "actions", alignRight: true },
];

export default function EcommerceBrandList() {
    const { t } = useTranslation("brands");

    const [searchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search");
    const [open, setOpen] = useState(false);
    const [apicall, setApicall] = useState(false);
    const [id, setId] = useState(null);


    const { data, isLoading } = useQuery(
        ["brand", apicall, searchParam, pageParam],
        () => api.getBrands(+pageParam || 1, searchParam || ""),
        {
            onError: (err) =>
                toast.error(err.response.data.message || "Something went wrong!"),
        }
    );

    const handleClickOpen = (props) => () => {
        setId(props);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog onClose={handleClose} open={open}>
                <DeleteBrandDialog
                    onClose={handleClose}
                    id={id}
                    apicall={setApicall}
                    endPoint="deleteBrand"
                    type="Brand"
                />
            </Dialog>
            <Page title={`Brands | ${process.env.REACT_APP_DOMAIN_NAME}`}>
                <Toolbar>
                    <HeaderBreadcrumbs
                        heading="Brand List"
                        links={[
                            {
                                name: t("dashboard"),
                                href: "/"
                            },
                            {
                                name: t("brands"),
                                href: "/brands"
                            }
                        ]}
                        action={{
                            href: `/brands/add`,
                            title: t("add-brand"),
                        }}
                    />
                </Toolbar>
                <Table
                    headData={TABLE_HEAD}
                    data={data}
                    mobileRow={BrandCard}
                    isLoading={isLoading}
                    row={BrandRow}
                    handleClickOpen={handleClickOpen}
                />
            </Page>
        </>
    );
}

