import React from "react";

//components
import {
  HeaderBreadcrumbs,
  SubCategoryNewForm,
  Page,
  Toolbar,
} from "src/components";
// notification
import toast from "react-hot-toast";
// api
import { useQuery } from "react-query";
import * as api from "src/services";
import { useTranslation } from "react-i18next";
import { AmcNewForm } from "src/components/forms/amc";
import SerialNumberNewForm from "src/components/forms/serialno/serialNumberNewForm";
import SerialNumberBulkAddForm from "src/components/forms/serialno/serialNumberBulkAdd";

export default function BulkAddSerialNumber() {
  const { t } = useTranslation("amcs");

  return (
    <Page title={`Add Serial Number | ${process.env.REACT_APP_DOMAIN_NAME}`}>
      <Toolbar>
        <HeaderBreadcrumbs
          heading="Add Serial Number"
          links={[
            {
              name: t("dashboard"),
              href: "/dashboard",
            },
            {
              name: t("Serial Number"),
              href: "/serialno/list",
            },
            {
              name: t("Bulk Add"),
              href: "/",
            },
          ]}
        />
      </Toolbar>
      <SerialNumberBulkAddForm />
    </Page>
  );
}
