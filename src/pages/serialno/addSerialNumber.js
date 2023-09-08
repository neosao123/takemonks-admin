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

export default function CreateSerialNumber() {
  const { t } = useTranslation("amcs");

  const { data, isLoading } = useQuery("products", api.getAllProducts, {
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong!");
    },
  });
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
              name: t("add"),
              href: "/",
            },
          ]}
        />
      </Toolbar>
      <SerialNumberNewForm products={isLoading ? [] : data?.data} />
    </Page>
  );
}
