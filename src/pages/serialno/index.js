// import { Toolbar } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { HeaderBreadcrumbs, Page, Toolbar } from "src/components";
import SeriesNumber from "src/components/forms/amc/seriesNo";
import * as api from "src/services";
import Table from "src/theme/overrides/Table";

const TABLE_HEAD = [
  { id: "Serial Number", label: "serialNumber", alignRight: false, sort: true },
  { id: "product", label: "product", alignRight: false, sort: true },
  { id: "createdAt", label: "created-at", alignRight: false, sort: true },
  { id: "", label: "actions", alignRight: true },
];

export default function EcommerceSerialNumberList() {
  const { t } = useTranslation("amcs");

  const { data, isLoading } = useQuery("products", api.getAllProducts, {
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong!");
    },
  });

  const handleClickOpen = () => {
    //
  };

  return (
    <>
      <Page title={`Series No | ${process.env.REACT_APP_DOMAIN_NAME}`}>
        <Toolbar>
          <HeaderBreadcrumbs
            heading="Series No"
            links={[
              {
                name: t("dashboard"),
                href: "/dashboard",
              },
              {
                name: t("Series Number"),
                href: "/",
              },
            ]}
            action={{
              href: `/serialno/add`,
              title: t("add Serial Number"),
            }}
          />
        </Toolbar>
        {/* <Table
          headData={TABLE_HEAD}
          // data={data}
          // mobileRow={AmcCard}
          isLoading={isLoading}
          // row={AmcRow}
          handleClickOpen={handleClickOpen}
        /> */}
      </Page>
    </>
  );
}
