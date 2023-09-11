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
import SerialNumberNewForm from "src/components/forms/serialno/serialNumberNewForm";
import SerialNumberEditForm from "src/components/forms/serialno/serialNumberEditForm";
import { useNavigate, useParams } from "react-router";

export default function EditSerialNumber() {
  const { t } = useTranslation("amcs");

  const { sno } = useParams();
  const navigate = useNavigate();

  const { data: products, isLoading } = useQuery(
    "products",
    api.getAllProducts,
    {
      onError: (err) => {
        toast.error(err.response.data.message || "Something went wrong!");
      },
    }
  );

  const { data: serialno } = useQuery(
    ["update-serialno", sno],
    () => api.getSerialNoById(sno),
    {
      enabled: Boolean(sno),
      retry: false,
      onError: (error) => {
        if (!error.response.data.success) {
          navigate("/404");
        }
      },
    }
  );
  const data = serialno?.data;
  const pdata = products?.data;
  return (
    <Page title={`Edit Serial Number | ${process.env.REACT_APP_DOMAIN_NAME}`}>
      <Toolbar>
        <HeaderBreadcrumbs
          heading="Edit Serial Number"
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
              name: t("edit"),
              href: "/",
            },
          ]}
        />
      </Toolbar>
      <SerialNumberEditForm currentSerialNo={data} products={pdata} />
    </Page>
  );
}
