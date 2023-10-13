import React, { useState } from "react";
// material
import { useTheme, styled } from "@mui/material/styles";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CloseIcon from '@mui/icons-material/Close';
import moment from "moment"
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
} from "@mui/material";
// components
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Label } from "src/components";
import { useNavigate } from "react-router-dom";
import { fDateTime } from "src/utils/formatTime";
import { ar, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";


console.log(new Date().getFullYear() + 1)

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
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
                        <> {row?.orderId?.user?.fullName} </>
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
                        <Typography>
                            Duration:{" "}{isLoading ? <Skeleton variant="text" /> : row?.duration}{" "}
                        </Typography>
                        <Typography>
                            Perid:{" "}{isLoading ? <Skeleton variant="text" /> : row?.period}{" "}
                        </Typography>
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
                        <> {fDateTime(row?.createdAt, language !== "ar" ? enUS : ar)} </>
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
                        <IconButton color="success" onClick={handleOpenAproove}>
                            <CheckRoundedIcon />
                        </IconButton>
                        <IconButton color="error">
                            <ClearRoundedIcon onClick={handleOpenReject} />
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
                        <TextField fullWidth label="Expiry Date" aria-readonly />
                        <Button variant='contained'>submit</Button>
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
                        <TextField minRows={5} maxRows={5} fullWidth label="Message" required />
                        <Button variant='contained'>submit</Button>
                    </Box>
                </Modal>
            </div>
        </>
    );
}
