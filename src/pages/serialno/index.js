import { Dialog } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import {
  HeaderBreadcrumbs,
  Page,
  SerialCard,
  Table,
  Toolbar,
} from "src/components";
import DeleteSerialNoDialog from "src/components/deleteSerialNoDialog";
import SerialRow from "src/components/table/tableRows/serialnoRow";
import * as api from "src/services";

const TABLE_HEAD = [
  { id: "product", label: "product", alignRight: false, sort: true },
  { id: "serialno", label: "Serial Number", alignRight: false, sort: true },
  { id: "isUsed", label: "isUsed", alignRight: false, sort: true },
  { id: "createdAt", label: "created-at", alignRight: false, sort: true },
  { id: "", label: "actions", alignRight: true },
];

export default function EcommerceSerialNumberList() {
  const { t } = useTranslation("amcs");

  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ["serialno", apicall, searchParam, pageParam],
    () => api.getSerialNumber(+pageParam || 1, searchParam || ""),
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
        <DeleteSerialNoDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteSerialNo"
          type="Serial Number"
        />
      </Dialog>
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
              title: t("add serial number"),
            }}
          />
        </Toolbar>
        <Table
          headData={TABLE_HEAD}
          data={data}
          mobileRow={SerialCard}
          isLoading={isLoading}
          row={SerialRow}
          handleClickOpen={handleClickOpen}
        />
      </Page>
    </>
  );
}
