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

export default function CreateAmc() {
  const { t } = useTranslation("amcs");

  const { data, isLoading } = useQuery("products", api.getAllProducts, {
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong!");
    },
  });
  return (
    <Page title={`Add Amc | ${process.env.REACT_APP_DOMAIN_NAME}`}>
      <Toolbar>
        <HeaderBreadcrumbs
          heading="Amc List"
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
              name: t("add"),
              href: "/",
            },
          ]}
        />
      </Toolbar>
      <AmcNewForm products={isLoading ? [] : data?.data} />
    </Page>
  );
}
