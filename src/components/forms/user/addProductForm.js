import * as Yup from "yup";
// import toast from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Form, FormikProvider, useFormik } from "formik";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { OutlinedInput, InputAdornment } from "@mui/material";

// material
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { Card, Stack, TextField, Typography, Box, Grid, FormControl, Select, Skeleton, CardMedia, CardContent, CardActions, Button, Rating, } from "@mui/material";
import * as api from "src/services";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import configData from "src/configData";
import { capitalCase } from "change-case";
import { UploadSingleFile } from "src/components";
import { useState } from "react";
import axios from "axios";
import { Pagination } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems, setCount } from "src/redux/slices/settings";
import { rootReducer } from "src/redux/rootReducer";
// ----------------------------------------------------------------------



const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));
const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 190,
    transition: theme.transitions.create(["box-shadow", "width"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),

    "&.Mui-focused": { width: 230, boxShadow: theme.customShadows.z8 },
    "& fieldset": {
        borderWidth: `1px !important`,
    },
    [theme.breakpoints.down("sm")]: {
        width: 150,
        "&.Mui-focused": { width: 150 },
    },
}));

// ----------------------------------------------------------------------

const { GENDER } = configData;

export default function AddProductForm({
    categories,
    isLoading: categoryLoading,
}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation("user");
    const [state, setstate] = useState({
        loading: false,
    });
    const [searchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const [page, setPage] = useState();
    const searchParam = searchParams.get("search");
    const [search, setSearch] = useState(searchParam || "");
    const [apicall, setApicall] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [changeName, setChangeName] = useState("Add to cart");
    const [cartItems, setcartItems] = useState([]);
    const { data, isLoading: loadingList } = useQuery(
        ["product", apicall, currentPage, searchParam],
        () => api.getProducts(currentPage, search || "")
    );

    const cartdata = useSelector((state) => {
        return state.settings.cartItems
    })
    const { mutate, isLoading } = useMutation("new", api.addUser, {
        onSuccess: () => {
            toast.success("New User Added");
            navigate("/users");
        },
        onError: (error) => {
            toast.error(error.message)
        },
    });

    const AddProductSchema = Yup.object().shape({
        categories: Yup.string().required(t("name-is-required")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            categories: "",
        },
        validationSchema: AddProductSchema,
        onSubmit: async (values) => {
            const { file, ...rest } = values;
            try {
                mutate({ ...rest, cover: file });
            } catch (error) {
                console.error(error);
            }
        },
    });
    const {
        errors,
        values,
        touched,
        handleSubmit,
        setFieldValue,
        getFieldProps,
    } = formik;


    const addToCart = (e, data) => {
        if (cartdata.some(obj => obj._id === data._id)) {
            const new_data = cartdata.filter((el) => {
                if (el._id !== data._id) {
                    return el;
                }
            })
            dispatch(setCartItems(new_data))
            toast.success("Item Removed from cart");
        }
        else {
            data.quantity = 1;
            data.totalPrice = data?.quantity * data?.priceSale;
            dispatch(setCartItems([...cartdata, data]))
            toast.success("Item Added to cart");
        }
    }



    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <FormControl fullWidth>
                                        <LabelStyle>{t("category")}</LabelStyle>
                                        {!categoryLoading ? (
                                            <Select
                                                native
                                                {...getFieldProps("category")}
                                                id="grouped-native-select"
                                            >
                                                <option value="" disabled hidden style={{ display: "none" }}></option>
                                                {categories?.map((category) => (
                                                    <optgroup
                                                        label={capitalCase(category[0].parentCategory)}
                                                        key={Math.random()}
                                                    >
                                                        {category?.map((v) => (
                                                            <option
                                                                key={category._id}
                                                                value={category?.name?.lowerCase()}
                                                            >
                                                                {v.name}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </Select>
                                        ) : (
                                            <Skeleton
                                                variant="rectangular"
                                                width={"100%"}
                                                height={56}
                                            />
                                        )}
                                    </FormControl>
                                </Stack>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    loading={isLoading}
                                    sx={{ ml: "auto", mt: 3 }}
                                >
                                    {t("add-product")}
                                </LoadingButton>
                            </Card>
                        </Grid>
                    </Grid>
                </Form> */}
            {/* Make price and the value of price side by side */}
            <FormikProvider value={formik}>
                <Grid container spacing={1}>
                    {data?.data?.map((data, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ padding: "10px" }}>
                                <CardMedia title={data.name} style={{ textAlign: "center" }}>
                                    <img src={data.cover} style={{ textAlign: "center", height: "200px", width: "200px" }} />
                                </CardMedia>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {data.name.length < 13 ? data.name : data.name.slice(0, 15) + "..."}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Price:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {data.price}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Ratings:
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <Rating name="read-only" value={data.totalRating} readOnly />
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Button variant="contained" size="small" onClick={(e) => addToCart(e, data)}>
                                        {cartdata.some((el) => el._id === data._id) ? "Added to cart" : "Add to cart"}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}

                </Grid>
            </FormikProvider>
            {/* <Box sx={{ display: "flex", justifyContent: "center", pb: 3, }}>
                <Pagination
                    count={data?.count || 0}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                />
            </Box> */}
            <Stack spacing={2} mt={2} pr={2}>
                <Pagination
                    count={data?.count}
                    page={page}
                    onChange={(event, value) => setCurrentPage(value)}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    sx={{ m: { sm: "0 0 0 auto", xs: " 0 auto" }, mb: 3 }}
                />
            </Stack>

        </Box>
    );
}
