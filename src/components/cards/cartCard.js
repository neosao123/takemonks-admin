import React from "react";
import { uniqueId } from "lodash";
import toast from "react-hot-toast";
// material
import {
    Grid,
    Paper,
    Typography,
    Skeleton,
    IconButton,
    Box,
    Stack,
    Link,
    Rating,
    Avatar,
    Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Label } from "src/components";
import { fDateShort } from "src/utils/formatTime";
import { capitalize } from "lodash";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link as RouterLink } from "react-router-dom";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { fCurrency } from "src/utils/formatNumber";
import { paramCase } from "change-case";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "src/redux/slices/settings";

const RootStyle = styled(Paper)(({ theme }) => ({
    padding: "10px 10px 10px 16px",
    marginBottom: "0.5rem",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid " + theme.palette.divider,
    borderRadius: 4,
    "& .name": {
        fontWeight: 600,
        color: theme.palette.info.main,
    },
    "& .time svg": {
        width: 10,
        height: 10,
        "& path": {
            fill: theme.palette.text.primary,
        },
    },
    "& .date": {
        fontSize: "0.75rem",
        fontWeight: 500,
    },
    "& .callander": {
        "& svg": {
            width: 10,
            height: 10,
        },
    },
    "& .time-slot": {
        fontWeight: 500,
        fontSize: "0.75rem",
    },
    "& .phone-container": {
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        gap: "0.5rem",
        "& .phone": {
            color: theme.palette.text.secondary,
            fontWeight: 400,
            fontSize: 11,
        },
        "& .btn-phone": {
            fontSize: "1px",
        },
    },
}));

const ThumbImgStyle = styled("img")(({ theme }) => ({
    width: 36,
    height: 36,
    objectFit: "cover",
    border: "1px solid " + theme.palette.divider,
    borderRadius: theme.shape.borderRadiusSm,
}));

export default function AgendaCodeMobile({ item, isLoading, handleClickOpen }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const cartitem = useSelector((state) => state?.settings?.cartItems);

    var cartitems = [...cartitem]

    const handleIncrese = () => {
        let itemtochange;
        let q;
        cartitems?.length > 0 && cartitems?.map((el) => {
            if (el._id === item?._id) {
                itemtochange = el;
                q = el.quantity;
            }
        })
        const tp = item.priceSale * (q + 1)

        const newItem = { ...itemtochange, quantity: q + 1, totalPrice: tp };
        const newArray = cartitems?.map((el) => {
            if (el._id !== item?._id) {
                return el
            }
            else {
                return newItem;
            }
        })
        dispatch(setCartItems(newArray))

    }

    const handleReduce = () => {
        let itemtochange;
        let q;
        cartitems?.length > 0 && cartitems?.map((el) => {
            if (el._id === item?._id) {
                itemtochange = el;
                q = el.quantity;
            }
        })
        const tp = item.priceSale * (q - 1)

        const newItem = { ...itemtochange, quantity: q - 1, totalPrice: tp };
        console.log("newitem", newItem)
        const newArray = cartitems?.map((el) => {
            if (el._id !== item?._id) {
                return el
            }
            else {
                return newItem;
            }
        })
        dispatch(setCartItems(newArray))
    }

    const handleRemoveCartiem = () => {
        const newArray = cartitems?.filter((el) => {
            if (el._id !== item?._id) {
                return el;
            }
        });
        dispatch(setCartItems(newArray));
        toast.success("Item Removed from the cart.")
    }


    return (
        <RootStyle
            sx={{
                borderLeft: `6px solid ${isLoading
                    ? theme.palette.divider
                    : theme.palette[
                        (item?.available < 1 && "error") ||
                        (item?.available < 20 && "warning") ||
                        (item?.available >= 20 && "success") ||
                        "primary"
                    ].main
                    }`,
            }}
            key={Math.random()}
        >
            <Grid container alignItems="center">
                <Grid item md={12} sm={12} xs={12}>
                    <Stack direction={"column"} >
                        {isLoading ? (
                            <Skeleton
                                variant="rectangular"
                                width={36}
                                height={36}
                                sx={{ borderRadius: 1 }}
                            />
                        ) : Boolean(item?.cover) ? (
                            <ThumbImgStyle alt={item?.name} src={item?.cover} />
                        ) : (
                            <Avatar>{item?.name}</Avatar>
                        )}
                        {isLoading ? (
                            <Skeleton variant="text" />
                        ) : (
                            <Typography
                                className="name"
                                // component={RouterLink}
                                // to={`/products/${paramCase(item?.name)}`}
                                underline="none"
                                noWrap
                            >
                                {capitalize(item?.name)}
                            </Typography>
                        )}
                        <Stack alignItems="center" sx={{ gap: "6px" }} direction="row">
                            {isLoading ? (
                                <Skeleton variant="circular" width={20} height={20} />
                            ) : (
                                <AccountBalanceWalletRoundedIcon fontSize="small" />
                            )}
                            <Typography className="time-slot">
                                {isLoading ? (
                                    <Skeleton variant="text" width={50} />
                                ) : (
                                    fCurrency(Number(item?.priceSale))
                                )}
                            </Typography>
                        </Stack>
                        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }} >
                            <Typography sx={{ fontSize: "12px" }}>
                                <Button disabled={item?.quantity <= 1} onClick={handleReduce} >-</Button>
                                {item?.quantity}
                                <Button disabled={item?.available <= item?.quantity} onClick={handleIncrese} >+</Button>
                            </Typography>
                            <Typography sx={{ fontSize: "12px" }}>
                                Total: {fCurrency(Number(item?.quantity * item?.priceSale))}
                            </Typography>
                        </Box>

                    </Stack>
                </Grid>

                <Grid item xs={4} sx={{ textAlign: "right" }}>
                    <Box className="phone-container">
                        {isLoading ? (
                            <Skeleton variant="circular" width={30} height={30} />
                        ) : (
                            <IconButton
                                className="btn-phone"
                                size="small"
                                // onClick={!isLoading && handleClickOpen(item._id)}
                                onClick={handleRemoveCartiem}
                            >
                                <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </RootStyle>
    );
}
