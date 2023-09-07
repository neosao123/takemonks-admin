// import { Toolbar } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { HeaderBreadcrumbs, Page, Toolbar } from "src/components";
import SeriesNumber from "src/components/forms/amc/seriesNo";
import * as api from "src/services";

export default function SeriesNo() {
  const { t } = useTranslation("amcs");

  const { data, isLoading } = useQuery("products", api.getAllProducts, {
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong!");
    },
  });

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
          />
        </Toolbar>
        <SeriesNumber products={isLoading ? [] : data?.data} />
      </Page>
    </>
  );
}
