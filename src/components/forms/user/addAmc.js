// import { Box, CardActions, CardContent, CardMedia } from "@mui/material"
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import { useQuery } from "react-query";
// import { useSearchParams } from "react-router-dom";
// import { Form, FormikProvider, useFormik } from "formik";
// import * as api from "src/services";
// import Button from "src/theme/overrides/Button";
// import Card from "src/theme/overrides/Card";
// import Grid from "src/theme/overrides/Grid";
// import Typography from "src/theme/overrides/Typography";

import { Grid, Box, Card, CardMedia, CardContent, Typography, CardActions, Button, Stack, Pagination, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import * as api from "src/services";
// import { setAmcItems } from "src/redux/slices/settings";
import { setAmcItems } from "src/redux/slices/settings"
import { useDispatch, useSelector } from "react-redux";
import { price } from "src/utils/mock-data/number";

// export default function AMCList() {
//     const { t } = useTranslation("amcs");

//     const [searchParams] = useSearchParams();
//     const pageParam = searchParams.get("page");
//     const searchParam = searchParams.get("search");
//     const [open, setOpen] = useState(false);
//     const [apicall, setApicall] = useState(false);
//     const [id, setId] = useState(null);

//     const { data, isLoading } = useQuery(
//         ["amcs", apicall, searchParam, pageParam],
//         () => api.getAmcs(+pageParam || 1, searchParam || ""),
//         {
//             onError: (err) =>
//                 toast.error(err.response.data.message || "Something went wrong!"),
//         }
//     );

//     return (
//         <Box>
//             <FormikProvider value={formik}>
//                 <Grid container spacing={1}>
//                     {data?.data?.map((data, index) => (
//                         <Grid item xs={12} sm={6} md={3} key={index}>
//                             <Card sx={{ padding: "10px" }}>
//                                 <CardMedia title={data.name} style={{ textAlign: "center" }}>
//                                     <img src={data.cover} style={{ textAlign: "center", height: "200px", width: "200px" }} />
//                                 </CardMedia>
//                                 <CardContent>
//                                     <Typography gutterBottom variant="h5" component="div">
//                                         {data.name.length < 13 ? data.name : data.name.slice(0, 15) + "..."}
//                                     </Typography>
//                                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                         <Typography variant="body2" color="text.secondary">
//                                             Price:
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             {data.price}
//                                         </Typography>
//                                     </Box>
//                                     {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                         <Typography variant="body2" color="text.secondary">
//                                             Ratings:
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary">
//                                             <Rating name="read-only" value={data.totalRating} readOnly />
//                                         </Typography>
//                                     </Box> */}
//                                 </CardContent>
//                                 <CardActions sx={{ justifyContent: 'center' }}>
//                                     <Button variant="contained" size="small" sx={{ backgroundColor: `${cartdata.some((el) => el._id === data._id) ? "green" : ""}` }} onClick={(e) => addToCart(e, data)}>
//                                         {cartdata.some((el) => el._id === data._id) ? "Added to cart" : "Add to cart"}
//                                     </Button>
//                                 </CardActions>
//                             </Card>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </FormikProvider>
//         </Box>
//     )
// }

export default function AMCList() {
    const { t } = useTranslation("amcs");

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = searchParams.get("page");
    const searchParam = searchParams.get("search");
    const [search, setSearch] = useState(searchParam || "");
    const [open, setOpen] = useState(false);
    const [apicall, setApicall] = useState(false);
    const [id, setId] = useState(null);
    const [page, setPage] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();

    const { data, isLoading } = useQuery(
        ["amcs", apicall, searchParam, pageParam],
        () => api.getAmcs(+pageParam || 1, searchParam || ""),
        {
            onError: (err) =>
                toast.error(err.response.data.message || "Something went wrong!"),
        }
    );

    const { amcsItems } = useSelector((state) => {
        return state?.settings;
    })

    useEffect(() => {
        let param = {}
        if (search) {
            param.search = search
        }
        if (page) {
            param.page = page
        }
        setSearchParams(param)
    }, [search, page])


    const addToCart = (e, data) => {
        if (amcsItems?.some(obj => obj._id === data._id)) {
            const new_data = amcsItems.filter((el) => {
                if (el._id !== data._id) {
                    return el;
                }
            })
            dispatch(setAmcItems(new_data))
            toast.success("Item Removed from cart");
        }
        else {
            let obj = {
                _id: data?._id,
                producttype: "amc",
                color: "",
                cover: data?.cover.url,
                name: data?.title,
                price: data?.price,
                priceSale: data?.price,
                quantity: 1,
                size: "",
                subTotal: data?.price,
                sku: "",
                durationType: data?.durationType,
                durationCount: data?.durationCount,
                amcProductId: {
                    _id: data?.productId._id,
                    cover: data?.productId.cover,
                    name: data?.productId.name
                }
            }
            dispatch(setAmcItems([...amcsItems, obj]))
            toast.success("Item Added to cart");
        }
    }

    return (
        <Box>
            <Grid container>
                <Grid item sx={{ marginBottom: "10px" }} xs={12} sm={6} md={4} xl={3}>
                    <TextField fullWidth label="Product Name" onChange={(e) => setSearch(e.target.value)} />
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                {
                    data?.data?.map((el) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} xl={3}>
                                <Card sx={{ maxWidth: 410, maxHeight: 450, height: 450, padding: "10px" }}>
                                    <CardMedia title={el.title} style={{ textAlign: "center" }}>
                                        <img src={el.cover.url} style={{ textAlign: "center", height: "200px", width: "200px" }} />
                                    </CardMedia>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {el.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Price:
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {el.price} ₹
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Product:
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {el.productId.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Duration Type:
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {el.durationType}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Duration Count:
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {el.durationCount}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'center' }}>
                                        <Button variant="contained" size="small" sx={{ backgroundColor: `${amcsItems?.some((amc) => amc._id === el._id) ? "green" : ""}` }} onClick={(e) => addToCart(e, el)}>
                                            {amcsItems?.some((amc) => amc._id === el._id) ? "Added to cart" : "Add to cart"}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
            <Stack spacing={2} mt={2} pr={2}>
                <Pagination
                    count={data?.data?.count}
                    page={page}
                    onChange={(event, value) => setCurrentPage(value)}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    sx={{ m: { sm: "0 0 0 auto", xs: " 0 auto" }, mb: 3 }}
                />
            </Stack>
        </Box>
    )
}