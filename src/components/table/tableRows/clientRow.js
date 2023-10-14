// material
import { useTheme, styled } from "@mui/material/styles";
import {
    Box,
    TableRow,
    Skeleton,
    TableCell,
    Typography,
    Stack,
    IconButton,
    Avatar,
    Tooltip,
    Modal,
    Button,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

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

import { Label, RolesRow } from "src/components";
import { useNavigate } from "react-router-dom";
import { capitalize } from "lodash";
import { fDateTime } from "src/utils/formatTime";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddModeratorIcon from '@mui/icons-material/AddModerator';

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { ar, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import configData from "src/configData";
import { useEffect } from "react";
import * as api from "src/services";
import toast from "react-hot-toast";


const ThumbImgStyle = styled("img")(({ theme }) => ({
    width: 40,
    height: 40,
    objectFit: "cover",
    marginRight: theme.spacing(2),
    borderRadius: theme.shape.borderRadiusSm,
}));
export default function UserRow({ isLoading, row }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const { language } = i18n;
    const [openModel, setOpenModel] = useState(false);
    const handleCloseModel = () => {
        setOpenModel(false)
    }
    const handleOpenModel = () => {
        setOpenModel(true)
    }
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [Role, setRole] = useState("")
    const [status, setStatus] = useState("")

    useEffect(() => {
        setRole(row?.role)
        setPhone(row?.phone)
        setEmail(row?.email)
        setStatus(row?.status)
        setName(row?.name)
    }, [])

    const { ROLE } = configData;

    const handleSubmit = async (id) => {
        let obj = {
            role: Role,
            status,
            phone,
            email,
            name
        }
        await api.EditClient(id, obj)
            .then((res) => {
                if (res.data.success === true) {
                    toast.success("user updated successfully.")
                    window.location.reload(false);
                }
            })
            .catch((err) => {
                toast.error("something went wrong.")
            })
    }

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
                        {isLoading ? (
                            <Skeleton variant="circular" width={40} height={40} />
                        ) : row.avatar ? (
                            <ThumbImgStyle alt={row?.name} src={row?.cover?.url} />
                        ) : (
                            <Avatar color="primary" sx={{ mr: 1 }}>
                                {" "}
                                {row?.name && row?.name.slice(0, 1)}{" "}
                            </Avatar>
                        )}{" "}
                        <Typography
                            variant="subtitle2"
                            noWrap
                            sx={{ textTransform: "capitalize" }}
                        >
                            {isLoading ? (
                                <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
                            ) : (
                                row?.name
                            )}{" "}
                        </Typography>{" "}
                    </Box>{" "}
                </TableCell>{" "}
                <TableCell style={{ minWidth: 160 }}>
                    {" "}
                    {isLoading ? <Skeleton variant="text" /> : row?.email}{" "}
                </TableCell>{" "}
                <TableCell style={{ minWidth: 160 }}>
                    {" "}
                    {isLoading ? <Skeleton variant="text" /> : row?.role}{" "}
                </TableCell>{" "}
                <TableCell style={{ minWidth: 80 }}>
                    {" "}
                    {isLoading ? <Skeleton variant="text" /> : row?.phone}{" "}
                </TableCell>{" "}
                <TableCell style={{ minWidth: 40 }}>
                    {" "}
                    {isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        <Label
                            variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                            color={row?.status === "active" ? "success" : "error"}
                        >
                            {capitalize(row?.status)}{" "}
                        </Label>
                    )}{" "}
                </TableCell>{" "}
                <TableCell style={{ minWidth: 40 }}>
                    {" "}
                    {isLoading ? (
                        <Skeleton variant="text" />
                    ) : (
                        fDateTime(row.createdAt, language !== "ar" ? enUS : ar)
                    )}{" "}
                </TableCell>{" "}
                <TableCell>
                    <Stack direction="row" justifyContent="flex-end">
                        {" "}
                        {isLoading ? (
                            <Skeleton
                                variant="circular"
                                width={34}
                                height={34}
                                sx={{ mr: 1 }}
                            />
                        ) : (
                            <>
                                <Tooltip title="Preview">
                                    <IconButton onClick={handleOpenModel}>
                                        <RemoveRedEyeIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}{" "}
                    </Stack>{" "}
                </TableCell>{" "}
            </TableRow>
            <div>
                <Modal
                    open={openModel}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography>
                                AMC Request Aprooval
                            </Typography>
                            <Button onClick={handleCloseModel} ><CloseIcon /></Button>
                        </Box>
                        <TextField fullWidth label="name" value={name} onChange={(e) => setName(e.target.value)} />
                        <TextField fullWidth label="email" value={email} onChange={e => setEmail(e, target.value)} />
                        <TextField fullWidth label="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                        <FormControl fullWidth >
                            <InputLabel id="Role">Role</InputLabel>
                            <Select label="Role" labelId="Role" required fullWidth value={Role} onChange={e => setRole(e.target.value)}>
                                {ROLE.map((el) => {
                                    return <MenuItem value={`${el}`}>{el}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="Status">Status</InputLabel>
                            <Select label="Status" labelId="Status" required fullWidth value={status} onChange={e => setStatus(e.target.value)}>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant='contained' onClick={() => handleSubmit(row?._id)}>submit</Button>
                    </Box>
                </Modal>
            </div>
        </>
    );
}
