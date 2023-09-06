import React, { useState } from "react";

//components
import {
  HeaderBreadcrumbs,
  ProductNewForm,
  Toolbar,
  Page,
} from "src/components";
// notification
import toast from 'react-hot-toast';
// api
import { useQuery } from "react-query";
import * as api from "src/services";
import { useTranslation } from "react-i18next";

export default function Create() {
  const { t } = useTranslation("product");
  const [brandata, setBrandData] = useState();

  const { data, isLoading } = useQuery("categories", api.getAllSubCategories, {
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong!");
    },
  });

  const { brandData, isBrandLoading } = useQuery("brands", api.getAllBrands, {
    onSuccess: (res) => {
      setBrandData(res)
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong!");
    },
  })

  return (
    <Page title={`Add Product | ${process.env.REACT_APP_DOMAIN_NAME}`}>
      <Toolbar>
        <HeaderBreadcrumbs
          heading="Product List"
          links={[
            { name: t("dashboard"), href: "/" },
            { name: t("products"), href: "/products" },
            { name: t("add") },
          ]}
        />
      </Toolbar>
      <ProductNewForm
        isLoading={isLoading}
        isBrandLoading={isBrandLoading}
        categories={isLoading ? [] : data?.data}
        brands={isBrandLoading ? [] : brandata?.data}
      />
    </Page>
  );
}
