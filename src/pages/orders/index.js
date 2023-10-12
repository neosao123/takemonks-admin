import { useEffect, useState } from "react";
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
import { start } from "nprogress";

//------------------------------css--------------------------------//




// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "name", alignRight: false },
  { id: "phone", label: "Phone Number", alignRight: false },
  { id: "createdAt", label: "Order Date", alignRight: false, sort: true },
  { id: "inventoryType", label: "status", alignRight: false, sort: true },
  { id: "price", label: "price", alignRight: false, sort: true },
  { id: "quantity", label: "quantity", alignRight: false },
  { id: "", label: "view", alignRight: true },
  { id: "", label: "actions", alignRight: true },
];

// ----------------------------------------------------------------------
export default function EcommerceProductList() {

  const { t } = useTranslation("order");

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("search");
  const [apicall, setApicall] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productName, setProductName] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const { data, isLoading: loadingList } = useQuery(
    ["orders", apicall, pageParam, searchParam, startDate, endDate, productName, deliveryStatus],
    () => api.getOrders(+pageParam || 1, searchParam || "", startDate || "", endDate || "", productName || "", deliveryStatus || ""),
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

  useEffect(() => {
    let params = {

    }
    if (startDate) {
      params.startDate = startDate
    }
    if (endDate) {
      params.endDate = endDate
    }
    if (productName) {
      params.productName = productName
    }
    if (deliveryStatus) {
      params.deliveryStatus = deliveryStatus
    }
    setSearchParams(params);
  }, [startDate, endDate, productName, deliveryStatus])






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
            }
          ]}
          action={{
            href: `/addproducts`,
            title: t("add product"),
          }}
        />
      </Toolbar>
      <Card sx={{ marginBottom: "10px" }} >
        <CardHeader title="Order Filter">
        </CardHeader>
        <CardContent>
          <Grid container spacing={1} gap={2}>
            <Grid item xs={12} lg={3} xl={2} md={4} sm={5}>
              <TextField label="From Date" fullWidth placeholder="" name="startDate" InputLabelProps={{
                shrink: true,
              }} variant="outlined" type="date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
            </Grid>
            <Grid item display={"flex"} lg={1} md={1} sm={1} justifyContent={"center"} alignContent={"center"} alignItems={"center"}>To</Grid>
            <Grid item xs={12} xl={2} lg={3} md={4} sm={5}>
              <TextField label="To Date" placeholder="" fullWidth name="endDate" variant="outlined" InputLabelProps={{
                shrink: true,
              }} type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate} />
            </Grid>
            <Grid itme xs={12} lg={3} xl={2} pt={1} md={4} sm={5}>
              <TextField label="Product Name" name="productName" InputLabelProps={{
                shrink: true,
              }} fullWidth variant="outlined" type="text" onChange={(e) => setProductName(e.target.value)} value={productName} />
            </Grid>
            <Grid item xs={12} xl={2} lg={3} md={4} sm={5}>
              <FormControl fullWidth >
                <InputLabel id="delivery-status-label">Delivery Status</InputLabel>
                <Select
                  labelId="delivery-status-label"
                  id="delivery-status"
                  // value={age}
                  label="Delivery Status"
                  name="deliveryStatus"
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                // onChange={handleChange}
                >
                  <MenuItem value={"delivered"}>Delivered</MenuItem>
                  <MenuItem value={"pending"}>Pending</MenuItem>
                  <MenuItem value={"shipped"}>Shipped</MenuItem>
                  <MenuItem value={"canceled"}>Canceled</MenuItem>
                  <MenuItem value={"returned"}>Returned</MenuItem>
                  <MenuItem value={"outfordelivery"}>Out For Delivery</MenuItem>
                  <MenuItem value={"in-transit"}>In Transit</MenuItem>
                </Select>
              </FormControl>
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
