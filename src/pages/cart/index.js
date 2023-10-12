import * as api from "src/services";
import { useQuery } from "react-query";
// notification
import toast from 'react-hot-toast';
import { fCurrency } from "src/utils/formatNumber";
// components
import {
    HeaderBreadcrumbs,
    Table as TableCart,
    CartRow,
    DeleteDialog,
    Toolbar,
    CartCard,
    Page,
    AddShippingAddress
} from "src/components";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Card, CardContent, CardHeader, FormControl, Grid, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableRow, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import Typography from "src/theme/overrides/Typography";

import {
    setShipping,
    setSubtotal,
    setTotalCart
} from "src/redux/slices/settings";
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
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search");
    const { t } = useTranslation("user");
    const [totalPrice, setTotalPrice] = useState(0);
    const [shipping, setShippingCharges] = useState(0);
    const { data, isLoading } = useQuery(
        ["comman-setting"],
        () => api.getShippingCharges(),
        {
            onError: (err) => {
                toast.error(err.response.data.message || "Something went wrong!");
            },
        }
    );

    const { cartItems: cartdata, amcsItems } = useSelector((state) => {
        return state.settings;
    });

    useEffect(() => {
        let total = 0;
        cartdata?.map((el) => {
            total = total + Number(el.subTotal);
        })
        let totalamc = 0;
        amcsItems?.map((el) => {
            totalamc = totalamc + Number(el.subTotal);
        })
        setTotalPrice(total + totalamc)
        dispatch(setSubtotal(total + totalamc));
        let totalcart = total + shipping;
        dispatch(setTotalCart(totalcart + totalamc))

    }, [cartdata, shipping, amcsItems]);

    const handleShippingCharges = (e) => {
        setShippingCharges(e.target.value);
        dispatch(setShipping(e.target.value))
    }


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
                            { name: t("orders"), href: "/orders" },
                            { name: t("addproduct"), href: "/addproducts" },
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
                            <CardHeader title={`Products ${cartdata.length}`}></CardHeader>
                            <CardContent>
                                <TableCart
                                    headData={TABLE_HEAD}
                                    data={{ data: [...cartdata, ...amcsItems] }}
                                    isLoading={false}
                                    row={CartRow}
                                    mobileRow={CartCard}
                                // handleClickOpen={handleClickOpen}
                                // mutate={mutate}
                                />
                                <Table sx={{ marginTop: "10px" }}>
                                    <TableBody>
                                        <TableRow
                                            sx={{
                                                "& .MuiTableCell-root": {
                                                    bgcolor: (theme) => theme.palette.background.neutral,
                                                },
                                            }}
                                        >
                                            <TableCell colSpan={4}></TableCell>
                                            <TableCell align="right">
                                                {isLoading ? (
                                                    <Skeleton
                                                        variant="text"
                                                        sx={{ float: "right" }}
                                                        width={100}
                                                    />
                                                ) : (
                                                    <strong>{t("Subtotal")}</strong>
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {isLoading ? (
                                                    <Skeleton
                                                        variant="text"
                                                        sx={{ float: "right" }}
                                                        width={100}
                                                    />
                                                ) : (
                                                    <strong>
                                                        {fCurrency((totalPrice))}
                                                    </strong>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={4}></TableCell>
                                            <TableCell align="right">
                                                {isLoading ? (
                                                    <Skeleton
                                                        variant="text"
                                                        sx={{ float: "right" }}
                                                        width={100}
                                                    />
                                                ) : (
                                                    <strong>{t("Shipping Fee")}</strong>
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {isLoading ? (
                                                    <Skeleton
                                                        variant="text"
                                                        sx={{ float: "right" }}
                                                        width={100}
                                                    />
                                                ) : (
                                                    <Select labelId="shippingcharges" value={shipping} id="shipping" onChange={handleShippingCharges} sx={{ height: "30px", width: "150px", marginLeft: "10px" }}>
                                                        <MenuItem value={0}>{fCurrency((0))}</MenuItem>
                                                        {
                                                            data?.data?.map((el) => {
                                                                return <MenuItem value={Number(el.settingValue)} > {fCurrency(Number(el.settingValue))}</MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={4}></TableCell>
                                            <TableCell align="right">
                                                {isLoading ? (
                                                    <Skeleton
                                                        variant="text"
                                                        sx={{ float: "right" }}
                                                        width={100}
                                                    />
                                                ) : (
                                                    <strong>{t("Total")}</strong>
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {isLoading ? (
                                                    <Skeleton
                                                        variant="text"
                                                        sx={{ float: "right" }}
                                                        width={100}
                                                    />
                                                ) : (
                                                    <strong>
                                                        {" "}
                                                        {fCurrency((totalPrice + shipping))}
                                                    </strong>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
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
