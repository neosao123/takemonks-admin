// material
import { paramCase } from "change-case";
import { useTheme, styled } from "@mui/material/styles";
import toast from 'react-hot-toast';
import {
    Box,
    TableRow,
    Skeleton,
    TableCell,
    Typography,
    Stack,
    IconButton,
    Avatar,
    Rating,
    Switch,
    Tooltip,
    Link,
    Button,
} from "@mui/material";
// redux
import { fCurrency } from "src/utils/formatNumber";
import { fDateShort } from "src/utils/formatTime";
// components
import { Label } from "src/components";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useNavigate } from "react-router-dom";
import { ar, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setCartItems, setAmcItems } from "src/redux/slices/settings";

const ThumbImgStyle = styled("img")(({ theme }) => ({
    width: 50,
    height: 50,
    minWidth: 50,
    objectFit: "cover",
    background: theme.palette.background.default,
    marginRight: theme.spacing(2),
    border: "1px solid " + theme.palette.divider,
    borderRadius: theme.shape.borderRadiusSm,
}));
const label = { inputProps: { "aria-label": "Switch demo" } };
export default function CartRow({ isLoading, row, handleClickOpen, mutate }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const { language } = i18n;
    const { cartItems, amcsItems } = useSelector((state) => state.settings)
    // useEffect(() => {
    //     const newitems = cartitem?.map((el) => {
    //         if (el._id === row._id) {
    //             return el.quantity = quantity;
    //         }
    //     })
    //     dispatch(setCartItems(newitems))
    // }, [quantity])
    const cartitems = [...cartItems];
    const amcitems = [...amcsItems];

    const handleIncrese = () => {
        if (row?.producttype === "amc") {
            let item;
            let q;
            amcitems.length > 0 && amcitems.map((el) => {
                if (el._id === row._id) {
                    item = el;
                    q = el.quantity;
                }
            })
            const tp = item.priceSale * (q + 1)

            const newItem = { ...item, quantity: q + 1, subTotal: tp };
            const newArray = amcitems?.map((el) => {
                if (el._id !== row?._id) {
                    return el
                }
                else {
                    return newItem;
                }
            })
            dispatch(setAmcItems(newArray))
        }
        else {
            let item;
            let q;
            cartitems.length > 0 && cartitems.map((el) => {
                if (el._id === row._id) {
                    item = el;
                    q = el.quantity;
                }
            })
            const tp = item.priceSale * (q + 1)

            const newItem = { ...item, quantity: q + 1, subTotal: tp };
            const newArray = cartitems?.map((el) => {
                if (el._id !== row?._id) {
                    return el
                }
                else {
                    return newItem;
                }
            })
            dispatch(setCartItems(newArray))
        }
    }

    const handleReduce = () => {
        if (row?.producttype === "amc") {
            let item;
            let q;
            amcitems.length > 0 && amcitems.map((el) => {
                if (el._id === row._id) {
                    item = el;
                    q = el.quantity;
                }
            })
            const tp = item.priceSale * (q - 1)

            const newItem = { ...item, quantity: q - 1, subTotal: tp };
            const newArray = amcitems?.map((el) => {
                if (el._id !== row?._id) {
                    return el
                }
                else {
                    return newItem;
                }
            })
            dispatch(setAmcItems(newArray))
        }
        else {
            let item;
            let q;
            cartitems.length > 0 && cartitems.map((el) => {
                if (el._id === row._id) {
                    item = el;
                    q = el.quantity;
                }
            })
            const tp = item.priceSale * (q - 1)

            const newItem = { ...item, quantity: q - 1, subTotal: tp };
            const newArray = cartitems?.map((el) => {
                if (el._id !== row?._id) {
                    return el
                }
                else {
                    return newItem;
                }
            })
            dispatch(setCartItems(newArray))
        }
    }

    const handleRemoveCartiem = () => {
        if (row?.producttype === "amc") {
            const newArray = amcitems?.filter((el) => {
                if (el._id !== row._id) {
                    return el;
                }
            });
            dispatch(setAmcItems(newArray));
            toast.success("Item Removed from the cart.")
        }
        else {
            const newArray = cartitems?.filter((el) => {
                if (el._id !== row._id) {
                    return el;
                }
            });
            dispatch(setCartItems(newArray));
            toast.success("Item Removed from the cart.")
        }
    }

    return (
        <TableRow hover key={Math.random()}>
            <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{ maxWidth: 300 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {" "}
                    {isLoading ? (
                        <Skeleton
                            variant="rectangular"
                            width={50}
                            height={50}
                            sx={{ borderRadius: 1 }}
                        />
                    ) : Boolean(row.cover) > 0 ? (
                        row.cover.url ? <ThumbImgStyle alt={row?.name} src={row?.cover?.url} /> : <ThumbImgStyle alt={row?.name} src={row?.cover} />
                    ) : (
                        <Avatar> {row?.name?.slice(0, 1)} </Avatar>
                    )}{" "}
                    <Typography variant="subtitle2" noWrap>
                        {" "}
                        {isLoading ? (
                            <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
                        ) : (
                            row?.name || row?.title
                        )}{" "}
                    </Typography>{" "}
                </Box>{" "}
            </TableCell>{" "}
            <TableCell>
                {" "}
                {isLoading ? (
                    <Skeleton variant="text" />
                ) : (
                    <>
                        <Typography><Button disabled={row?.quantity <= 1} onClick={handleReduce} >-</Button>{row?.quantity}<Button disabled={row?.available <= row?.quantity} onClick={handleIncrese} >+</Button></Typography>
                    </>
                )}{" "}
            </TableCell>{" "}
            <TableCell>
                {" "}
                {isLoading ? (
                    <Skeleton variant="text" />
                ) : (
                    fCurrency((row?.priceSale || row?.price))
                )}{" "}
            </TableCell>{" "}
            <TableCell>
                {" "}
                {isLoading ? (
                    <Skeleton variant="text" />
                ) : (
                    fCurrency((row?.subTotal))
                )}{" "}
            </TableCell>{" "}
            <TableCell align="right">
                {" "}
                {isLoading ? (
                    <Stack direction="row" justifyContent="flex-end">
                        <Skeleton
                            variant="circular"
                            width={34}
                            height={34}
                            sx={{ mr: 1 }}
                        />{" "}
                        <Skeleton
                            variant="circular"
                            width={34}
                            height={34}
                            sx={{ mr: 1 }}
                        />{" "}
                        <Skeleton variant="circular" width={34} height={34} />{" "}
                    </Stack>
                ) : (
                    <Stack direction="row" justifyContent="flex-end">
                        <Tooltip title="Delete">
                            <IconButton onClick={handleRemoveCartiem}>
                                <DeleteRoundedIcon />
                            </IconButton>
                        </Tooltip>{" "}
                    </Stack>
                )}{" "}
            </TableCell>{" "}
        </TableRow>
    );
}