// import { Toolbar } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { HeaderBreadcrumbs, Page, Toolbar } from "src/components";
import SeriesNumber from "src/components/forms/amc/seriesNo";

export default function serialNumber() {
  const { t } = useTranslation("amcs");

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
      </Page>
    </>
  );
}
