import React, { useEffect, useState } from "react";
// material
import { useTheme, styled } from "@mui/material/styles";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CloseIcon from '@mui/icons-material/Close';
import moment from "moment"
import * as api from "src/services";
import {
    Box,
    TableRow,
    Skeleton,
    TableCell,
    Typography,
    Stack,
    Avatar,
    IconButton,
    Tooltip,
    Button,
    Modal,
    TextField,
    TextareaAutosize,
} from "@mui/material";
// components
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Label } from "src/components";
import { useNavigate } from "react-router-dom";
import { fDateTime } from "src/utils/formatTime";
import { ar, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";


console.log(new Date().getFullYear() + 1)

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

const ThumbImgStyle = styled("img")(({ theme }) => ({
    width: 50,
    height: 50,
    objectFit: "cover",
    marginRight: theme.spacing(2),
    border: "1px solid " + theme.palette.divider,
    borderRadius: theme.shape.borderRadiusSm,
}));

export default function OrderRow({ isLoading, row, isUser }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const { language } = i18n;
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
        setAmcTitle(row?.amcId?.title);
        setOrderId(row?.orderId?._id);
        setSerialKeyValue(row?.serialKey);
        setEmail(row?.orderId?.user?.email)
    }, [])

    return (
        <>
            <TableRow hover key={Math.random()}>
                <TableCell component="th" scope="row" padding="none">
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="subtitle2" noWrap>
                            {" "}
                            {isLoading ? (
                                <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
                            ) : (
                                row?.orderId?._id
                            )}{" "}
                        </Typography>{" "}
                    </Box>{" "}
                </TableCell>{" "}
                <TableCell>
                    {" "}
                    {isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        <> {row?.orderId?.user?.fullName?.slice(0, 15)} </>
                    )}{" "}
                </TableCell>{" "}
                <TableCell>
                    {" "}
                    {isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        <Typography>
                            {row?.amcId?.title?.slice(0, 10)}
                        </Typography>
                    )}{" "}
                </TableCell>{" "}
                <TableCell>
                    {" "}
                    {isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        <> {fDateTime(row?.orderId?.createdAt, language !== "ar" ? enUS : ar)} </>
                    )}{" "}
                </TableCell>{" "}
                <TableCell>
                    {" "}
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        {isLoading ? (<Skeleton variant="text" />) : <Typography>
                            Duration:{" "}{isLoading ? <Skeleton variant="text" /> : row?.duration}{" "}
                        </Typography>}
                        {isLoading ? (<Skeleton variant="text" />) : <Typography>
                            Period:{" "}{isLoading ? <Skeleton variant="text" /> : row?.period}{" "}
                        </Typography>}
                    </Box>
                </TableCell>
                <TableCell>
                    {" "}
                    {isLoading ? <Skeleton variant="text" /> : row?.serialKey}{" "}
                </TableCell>
                <TableCell>
                    {" "}
                    {isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        <> {fDateTime(row?.appliedAt, language !== "ar" ? enUS : ar)} </>
                    )}{" "}
                </TableCell>
                <TableCell>
                    {" "}
                    {isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        row?.amcExpriry && <> {fDateTime(row?.amcExpriry, language !== "ar" ? enUS : ar)}</>
                    )}{" "}
                </TableCell>{" "}
                <TableCell>
                    {" "}
                    {isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        <Label
                            variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                            color={
                                (row?.status === "pending" && "info") ||
                                (row?.status === "aprooved" && "success") ||
                                (row?.status === "rejected" && "error")
                            }
                        >
                            {row.status}{" "}
                        </Label>
                    )}{" "}
                </TableCell>
                <TableCell>
                    {row?.status === "pending" && (<Box>
                        <IconButton color="success" onClick={() => {
                            calculateExpiryDate(row?.duration, row?.period)
                            handleOpenAproove()
                        }}>
                            <CheckRoundedIcon />
                        </IconButton>
                        <IconButton color="error">
                            <ClearRoundedIcon onClick={() => handleOpenReject()} />
                        </IconButton>
                    </Box>)}
                </TableCell>
            </TableRow>
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
                        <TextField fullWidth value={row?.orderId?._id} label="Order Id" aria-readonly />
                        <TextField fullWidth label="Seriral Key" value={row?.serialKey} aria-readonly />
                        <TextField fullWidth label="AMC" value={row?.amcId?.title} aria-readonly />
                        <TextField fullWidth label="Expiry Date" value={expiryDate} aria-readonly />
                        <Button variant='contained' onClick={() => handleAprooveRequest(row?._id)}>submit</Button>
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
                        <TextField fullWidth value={row?.orderId?._id} label="Order Id" aria-readonly />
                        <TextField fullWidth label="Seriral Key" value={row?.serialKey} aria-readonly />
                        <TextField fullWidth label="AMC" value={row?.amcId?.title} aria-readonly />
                        <TextareaAutosize minRows={4} required fullWidth placeholder="Message" onChange={(e) => setRejectionMessage(e.target.value)} maxRows={4} style={{ fontSize: "1rem", fontFamily: 'Poppins', padding: "10px", border: "2px solid #edeff1" }} aria-required variant="outlined" />
                        <Button variant='contained' onClick={() => handleRejectRequest(row?._id)}>submit</Button>
                    </Box>
                </Modal>
            </div>
        </>
    );
}
