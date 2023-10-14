import React, { useEffect, useState } from "react";
import { uniqueId } from "lodash";
// material
import {
    Grid,
    Paper,
    Typography,
    Skeleton,
    Box,
    Stack,
    Link,
    IconButton,
    Modal,
    TextField,
    TextareaAutosize,
    Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Label } from "src/components";
import { fDateShort } from "src/utils/formatTime";
import { capitalize } from "lodash";
// import { Lable, Popover } from "src/components";
// import Icon from "src/utils/icon";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import { Link as RouterLink } from "react-router-dom";
import { fCurrency } from "src/utils/formatNumber";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import * as api from "src/services";

import CloseIcon from '@mui/icons-material/Close';
import toast from "react-hot-toast";
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

export default function OrderWithAmcCard({ item, isLoading }) {
    const theme = useTheme();
    const [openAproveModal, setAprooveModal] = useState(false);
    const handleOpenAproove = () => setAprooveModal(true);
    const handleCloseAproove = () => setAprooveModal(false);
    const [openRejectModal, setRejectModal] = useState(false);
    const handleOpenReject = () => setRejectModal(true);
    const handleCloseReject = () => setRejectModal(false);
    const [expiryDate, setExpiryDate] = useState("");
    const [RejectionMessage, setRejectionMessage] = useState("");
    const [orderId, setOrderId] = useState("");
    const [serialKeyValue, setSerialKeyValue] = useState("");
    const [AMCtitle, setAmcTitle] = useState("");
    const [email, setEmail] = useState("");

    function calculateExpiryDate(duration, unit) {
        const created = new Date();
        let expiry = new Date(created);

        switch (unit) {
            case "yearly":
                expiry.setDate(created.getDate() + duration * 365);
                setExpiryDate(expiry);
                break;
            case "monthly":
                expiry.setDate(created.getDate() + duration * 30);
                setExpiryDate(expiry);
                break;
            default:
                return null;
        }
        setExpiryDate(expiry)
        return expiry;
    }

    const handleAprooveRequest = async (id) => {
        try {
            api.AMCRequestListAprooval(id, { status: "aprooved", amcExpriry: expiryDate, orderId, serialKeyValue, AMCtitle, email })
                .then((res) => {
                    if (res.success === true) {
                        handleCloseAproove()
                        toast.success("Request Aprooved successfully");
                        window.location.reload(false)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            console.log("err", error)
            toast.error("Something went wrong while aprooving request.")
        }
    }

    const handleRejectRequest = async (id) => {
        if (RejectionMessage == "" || RejectionMessage.length < 20) {
            toast.error("Please write Rejection message with minimum 20 characters");
            return;
        }
        try {
            api.AMCRequestListAprooval(id, { status: "rejected", amcExpriry: "", message: RejectionMessage, orderId, serialKeyValue, AMCtitle, email })
                .then((res) => {
                    if (res.success === true) {
                        handleCloseReject()
                        toast.success("Request Rejected successfully");
                        window.location.reload(false)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            toast.error("Something went wrong while aprooving request.")
        }
    }

    useEffect(() => {
        setAmcTitle(item?.amcId?.title);
        setOrderId(item?.orderId?._id);
        setSerialKeyValue(item?.serialKey);
        setEmail(item?.orderId?.user?.email)
    }, [])

    return (
        <RootStyle
            sx={{
                borderLeft: `6px solid ${isLoading
                    ? theme.palette.divider
                    : theme.palette[
                        (item?.status === "delivered" && "success") ||
                        (item?.status === "ontheway" && "warning") ||
                        (item?.status === "pending" && "info") ||
                        "error"
                    ].main
                    }`,
            }}
            key={uniqueId()}
        >
            <Grid container alignItems="center">
                <Grid item md={12} sm={12} xs={12}>
                    <Stack spacing={0.5}>
                        <Typography
                            className="name"
                            underline="none"
                        >
                            {isLoading ? (
                                <Skeleton variant="text" />
                            ) : (
                                // capitalize(item?.user.fullName)
                                capitalize(item?.orderId?._id)
                            )}
                        </Typography>
                        <Typography
                            className=""
                            underline="none"
                        >
                            {isLoading ? (
                                <Skeleton variant="text" />
                            ) : (
                                capitalize(item?.orderId?.user?.fullName)
                            )}
                        </Typography>
                        <Typography
                            className=""
                            underline="none"
                        >
                            {isLoading ? (
                                <Skeleton variant="text" />
                            ) : (
                                <Typography>
                                    {item?.amcId?.title}
                                </Typography>
                            )}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            {isLoading ? (<Skeleton variant="text" width={50} />) : <Typography>
                                Duration:{" "}{item?.duration}
                            </Typography>}
                            {isLoading ? (<Skeleton variant="text" width={50} />) : <Typography>
                                Period:{" "}{item?.period}
                            </Typography>}
                        </Box>
                        <Stack>
                            {isLoading ? (
                                <Skeleton variant="outline" height={20} width={20} />
                            ) : (
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Stack direction={"item"}>
                                        <DateRangeRoundedIcon fontSize="small" />
                                        <Typography className="date">
                                            {isLoading ? (
                                                <Skeleton variant="text" width={50} />
                                            ) : (
                                                fDateShort(item.createdAt)
                                            )}
                                        </Typography>
                                    </Stack>
                                    <Stack direction={"item"}>
                                        <DateRangeRoundedIcon fontSize="small" />
                                        <Typography className="date">
                                            {isLoading ? (
                                                <Skeleton variant="text" width={50} />
                                            ) : (
                                                fDateShort(item.appliedAt)
                                            )}
                                        </Typography>
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            {isLoading ? (<Skeleton variant="text" width={50} />) : <Typography>
                                Serial No:{" "}{item?.serialKey}
                            </Typography>}
                            {isLoading ? (<Skeleton variant="text" width={50} />) : <Typography>
                                Expiry Date:{" "}{item?.amcExpriry}
                            </Typography>}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            {" "}
                            {isLoading ? (
                                <Skeleton variant="text" />
                            ) : (
                                <Label
                                    variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                                    color={
                                        (item?.status === "pending" && "info") ||
                                        (item?.status === "aprooved" && "success") ||
                                        (item?.status === "rejected" && "error")
                                    }
                                >
                                    {item.status}{" "}
                                </Label>
                            )}{" "}
                            {isLoading ? (<Skeleton variant="text" width={50} />) : (
                                item?.status === "pending" && (<Box>
                                    <IconButton color="success" onClick={() => {
                                        calculateExpiryDate(item?.duration, item?.period)
                                        handleOpenAproove()
                                    }} >
                                        <CheckRoundedIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleOpenReject()}>
                                        <ClearRoundedIcon />
                                    </IconButton>
                                </Box>)
                            )}
                        </Box>
                    </Stack>
                </Grid>
                <div>
                    <Modal
                        open={openAproveModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography>
                                    AMC Request Aprooval
                                </Typography>
                                <Button onClick={handleCloseAproove}><CloseIcon /></Button>
                            </Box>
                            <TextField fullWidth value={item?.orderId?._id} label="Order Id" aria-readonly />
                            <TextField fullWidth label="Seriral Key" value={item?.serialKey} aria-readonly />
                            <TextField fullWidth label="AMC" value={item?.amcId?.title} aria-readonly />
                            <TextField fullWidth label="Expiry Date" value={expiryDate} aria-readonly />
                            <Button variant='contained' onClick={() => handleAprooveRequest(item?._id)}>submit</Button>
                        </Box>
                    </Modal>
                </div>
                <div>
                    <Modal
                        open={openRejectModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography>
                                    AMC Request Rejection
                                </Typography>
                                <Button onClick={handleCloseReject}><CloseIcon /></Button>
                            </Box>
                            <TextField fullWidth value={item?.orderId?._id} label="Order Id" aria-readonly />
                            <TextField fullWidth label="Seriral Key" value={item?.serialKey} aria-readonly />
                            <TextField fullWidth label="AMC" value={item?.amcId?.title} aria-readonly />
                            <TextareaAutosize minRows={2} required placeholder="Message" onChange={(e) => setRejectionMessage(e.target.value)} maxitems={4} style={{ fontSize: "1rem", fontFamily: 'Poppins', padding: "10px", border: "2px solid #edeff1" }} aria-required variant="outlined" />
                            <Button variant='contained' onClick={() => handleRejectRequest(item?._id)}>submit</Button>
                        </Box>
                    </Modal>
                </div>
            </Grid>
        </RootStyle>
    );
}
