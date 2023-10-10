import * as api from "src/services";
import { useQuery } from "react-query";
// notification
import toast from 'react-hot-toast';
// components
import {
    HeaderBreadcrumbs,
    Table,
    CartRow,
    DeleteDialog,
    Toolbar,
    CartCard,
    Page,
    AddShippingAddress
} from "src/components";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Card, CardContent, CardHeader, FormControl, Grid, InputLabel, Select, MenuItem } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import Typography from "src/theme/overrides/Typography";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "name", label: "product", alignRight: false },
    // { id: "createdAt", label: "created-at", alignRight: false, sort: true },
    // { id: "inventoryType", label: "status", alignRight: false, sort: true },
    { id: "quantity", label: "quantity", alignRight: false },
    { id: "price", label: "price", alignRight: false, sort: true },
    { id: "totalprice", label: "total price", alignRight: false, sort: true },
    { id: "", label: "actions", alignRight: true },
];

// ----------------------------------------------------------------------
export default function CartData() {

    const [searchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search");
    const { t } = useTranslation("user");
    const [totalPrice, setTotalPrice] = useState(0)
    const { data, isLoading } = useQuery(
        ["user", pageParam, searchParam],
        () => api.getUsers(+pageParam || 1, searchParam || ""),
        {
            onError: (err) => {
                toast.error(err.response.data.message || "Something went wrong!");
            },
        }
    );

    const cartdata = useSelector((state) => {
        return state.settings.cartItems
    })

    useEffect(() => {
        let total = 0;
        cartdata?.map((el) => {
            total = total + el.totalPrice;
        })
        setTotalPrice(total)
    }, [cartdata]);
    const [shipping, setShipping] = useState(0);

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
                                name: t("cart"),
                                href: "/cart",
                            },
                        ]}
                    // action={{
                    //     href: `/customers/${row?._id}/addproduct`,
                    //     title: t("add products"),
                    // }}
                    />
                </Toolbar>
                <Grid container spacing={1}>
                    <Grid item sm={12} md={8}>
                        <Card>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <CardHeader title={`Products ${cartdata.length}`}></CardHeader>
                                <CardHeader title={`Total Amount: ${totalPrice}`}></CardHeader>
                            </Box>
                            <CardContent>
                                <Table
                                    headData={TABLE_HEAD}
                                    data={{ data: cartdata }}
                                    isLoading={false}
                                    row={CartRow}
                                    mobileRow={CartCard}
                                // handleClickOpen={handleClickOpen}
                                // mutate={mutate}
                                />
                                <CardContent>
                                    <Grid container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Grid item xs={12} sm={3}>
                                            Subtotal: {totalPrice}
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="shippingcharges">Shipping Charges</InputLabel>
                                                <Select labelId="shippingcharges" id="shipping" onChange={(e) => setShipping(e.target.value)}>
                                                    <MenuItem value={0}>0</MenuItem>
                                                    <MenuItem value={1}>1</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            Total Amount: {totalPrice + shipping}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item sm={12} md={4}>
                        <AddShippingAddress />
                    </Grid>
                </Grid>

            </Page >
        </>
    );
}
