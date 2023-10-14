import * as api from "src/services";
import { useQuery } from "react-query";
// notification
import toast from 'react-hot-toast';
// components
import {
  HeaderBreadcrumbs,
  Toolbar,
  clientCard,
  Table,
  clientRow,
  Page,
} from "src/components";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const TABLE_HEAD = [
  { id: "fullName", label: "Name", sort: true },
  { id: "email", label: "email", sort: true },
  { id: "phone", label: "role" },
  { id: "phone", label: "phone" },
  { id: "status", label: "status", sort: true },
  { id: "joined", label: "joined" },
  { id: "", label: "actions", alignRight: true },
];

// ----------------------------------------------------------------------
export default function UsersList() {

  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const { t } = useTranslation("user");
  const { data, isLoading } = useQuery(
    ["user", pageParam, searchParam],
    () => api.GetAdminUsers(+pageParam || 1, searchParam || ""),
    {
      onError: (err) => {
        toast.error(err.response.data.message || "Something went wrong!");
      },
    }
  );

  return (
    <>
      <Page title={`Users | ${process.env.REACT_APP_DOMAIN_NAME}`}>
        <Toolbar>
          <HeaderBreadcrumbs
            heading="Users List"
            links={[
              {
                name: t("dashboard"),
                href: "/dashboard",
              },
              {
                name: t("users"),
                href: "/users",
              },
            ]}
            action={{
              href: `/users/add`,
              title: t("add-user"),
            }}
          />
        </Toolbar>
        <Table
          headData={TABLE_HEAD}
          data={data}
          isLoading={isLoading}
          row={clientRow}
          mobileRow={clientCard}
        />
      </Page>
    </>
  );
}
