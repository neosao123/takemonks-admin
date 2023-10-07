import { useState } from "react";
// react router dom
import { Form, useSearchParams } from "react-router-dom";
// api
import * as api from "src/services";
import { useQuery } from "react-query";
// notification
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
// material
import { Button, Card, CardContent, CardHeader, Container, Dialog, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles"
import {
  HeaderBreadcrumbs,
  DeleteDialog,
  Page,
  Toolbar,
  OrderCard,
  Table,
  OrderRow,
} from "src/components";
import { ClassNames } from "@emotion/react";

//------------------------------css--------------------------------//




// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "product", alignRight: false },
  { id: "createdAt", label: "created-at", alignRight: false, sort: true },
  { id: "inventoryType", label: "status", alignRight: false, sort: true },
  { id: "price", label: "price", alignRight: false, sort: true },
  { id: "quantity", label: "quantity", alignRight: false },
  { id: "", label: "actions", alignRight: true },
];

// ----------------------------------------------------------------------
export default function EcommerceProductList() {

  const { t } = useTranslation("order");

  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const [apicall, setApicall] = useState(false);
  const [selectedOption, setSelectedOption] = useState("")
  const { data, isLoading: loadingList } = useQuery(
    ["orders", apicall, pageParam, searchParam],
    () => api.getOrders(+pageParam || 1, searchParam || ""),
    {
      onError: (err) =>
        toast.error(err.response.data.message || "Something went wrong!"),
    }
  );
  const [open, setOpen] = useState(false);

  const [id, setId] = useState(null);

  const handleClickOpen = (props) => () => {
    setId(props);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };




  const isLoading = loadingList;
  return (
    <Page title={`Orders | ${process.env.REACT_APP_DOMAIN_NAME}`}>
      <Dialog onClose={handleClose} open={open}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteOrder"
          type="Order"
        />
      </Dialog>
      <Toolbar>
        <HeaderBreadcrumbs
          heading="Categories List"
          links={[
            {
              name: t("dashboard"),
              href: "/dashboard",
            },
            {
              name: t("orders"),
              href: "",
            },
          ]}
        />
      </Toolbar>
      <Card sx={{marginBottom:"10px"}} >
        <CardHeader title="Order Filter">
        </CardHeader>
        <CardContent>
          <Grid container spacing={1} gap={2}>
            <Grid item xs={12} lg={3} xl={2} md={4} sm={5}>
              <TextField label="From Date" fullWidth placeholder="" InputLabelProps={{
                shrink: true,
              }} variant="outlined" type="date" />
            </Grid>
            <Grid item display={"flex"} lg={1} md={1} sm={1} justifyContent={"center"} alignContent={"center"} alignItems={"center"}>To</Grid>
            <Grid item xs={12} xl={2} lg={3} md={4} sm={5}>
              <TextField label="To Date" placeholder="" fullWidth variant="outlined" InputLabelProps={{
                shrink: true,
              }} type="date" />
            </Grid>
            <Grid itme xs={12} lg={3} xl={2} pt={1} md={4} sm={5}>
              <TextField label="Product Name" InputLabelProps={{
                shrink: true,
              }} fullWidth variant="outlined" type="text" />
            </Grid>
            <Grid item xs={12} xl={2} lg={3} md={4} sm={5}>
              <FormControl fullWidth >
                <InputLabel id="delivery-status-label">Delivery Status</InputLabel>
                <Select
                  labelId="delivery-status-label"
                  id="delivery-status"
                  // value={age}
                  label="Delivery Status"
                // onChange={handleChange}
                >
                  <MenuItem value={10}>Delivered</MenuItem>
                  <MenuItem value={20}>Pending</MenuItem>
                  <MenuItem value={30}>Shipped</MenuItem>
                  <MenuItem value={10}>Canceled</MenuItem>
                  <MenuItem value={20}>Returned</MenuItem>
                  <MenuItem value={30}>Out For Delivery</MenuItem>
                  <MenuItem value={30}>In Transit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} xl={1} lg={2} md={3} sm={2} display={"flex"} justifyContent={"center"} alignItems={"center"}>
              <Button fullWidth variant="contained">Search</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={OrderRow}
        mobileRow={OrderCard}
        handleClickOpen={handleClickOpen}
      />
    </Page>
  );
}
