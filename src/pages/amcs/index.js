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
  Table,
  AmcCard,
  AmcRow,
} from "src/components";
import DeleteAmcDialog from "src/components/deleteAmcDialog";

const TABLE_HEAD = [
  { id: "amc", label: "AMC", alignRight: false, sort: true },
  { id: "product", label: "product", alignRight: false, sort: true },
  { id: "price", label: "price", alignRight: false },
  { id: "durationType", label: "durationType", alignRight: false },
  { id: "durationCount", label: "durationCount", alignRight: false },
  { id: "createdAt", label: "created-at", alignRight: false, sort: true },
  { id: "", label: "actions", alignRight: true },
];

export default function EcommerceAmcList() {
  const { t } = useTranslation("amcs");

  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ["amcs", apicall, searchParam, pageParam],
    () => api.getAmcs(+pageParam || 1, searchParam || ""),
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
        <DeleteAmcDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteAmc"
          type="Amc"
        />
      </Dialog>
      <Page title={`Amcs | ${process.env.REACT_APP_DOMAIN_NAME}`}>
        <Toolbar>
          <HeaderBreadcrumbs
            heading="Amc List"
            links={[
              {
                name: t("dashboard"),
                href: "/",
              },
              {
                name: t("AMCs"),
                href: "/amcs",
              },
            ]}
            action={{
              href: `/amcs/add`,
              title: t("add AMC"),
            }}
          />
        </Toolbar>
        <Table
          headData={TABLE_HEAD}
          data={data}
          mobileRow={AmcCard}
          isLoading={isLoading}
          row={AmcRow}
          handleClickOpen={handleClickOpen}
        />
      </Page>
    </>
  );
}
