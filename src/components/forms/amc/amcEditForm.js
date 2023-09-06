import * as Yup from "yup";
import toast from 'react-hot-toast';
import { capitalCase } from "change-case";
import { useState } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import { useTranslation } from "react-i18next";
import _ from "lodash";
// material
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import configData from "src/configData";

const { DURATION_TYPE, DURATION_COUNT } =
    configData;
import {
    Card,
    Grid,
    Stack,
    Select,
    TextField,
    Skeleton,
    Typography,
    FormControl,
    FormHelperText,
    Box,
} from "@mui/material";

// routes
import { UploadSingleFile } from "src/components";
import * as api from "src/services";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// ----------------------------------------------------------------------


const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    span: {
        fontSize: 12,
        float: "right",
        fontWeight: 400,
    },
}));

// ----------------------------------------------------------------------

export default function AmcEditForm({ currentAmc, products }) {
    const [state, setstate] = useState({
        loading: false,
    });
    const { t } = useTranslation("amcs");
    const navigate = useNavigate();

    let currentProduct = products?.filter((data) => data._id === currentAmc?.productId);
    if (currentProduct?.length > 0) {
        currentProduct = currentProduct[0];
    } else {
        currentProduct = null;
    }

    console.log("currentProduct", currentAmc);

    const { mutate, isLoading } = useMutation("update", api.updateAmcs, {
        enabled: Boolean(currentAmc?._id),
        onSuccess: () => {
            toast.success("AMC Updated");
            navigate("/amcs");
        },
        onError: (error) => {
            toast.error(error.message);
        },

    });
    console.log(currentAmc?._id, "currentAmc?._id");

    const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const NewAMCSchema = Yup.object().shape({
        title: Yup.string().required(t("title-is-required")),
        description: Yup.string().required(t("description-is-required")),
        productId: Yup.string().required(t("product-is-required")),
        price: Yup.number().required(t("price-is-required")),
        durationType: Yup.string().required(t("duration-type-is-required")),
        durationCount: Yup.number().required(t("duration-count-is-required")),
        cover: Yup.mixed().required(t("cover-is-required")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: currentAmc?.title || "",
            description: currentAmc?.description || "",
            productId: currentProduct?._id || "",
            price: currentAmc?.price || "",
            durationType: currentAmc?.durationType || DURATION_TYPE[0],
            durationCount: currentAmc?.durationCount || DURATION_COUNT[0],
            file: currentAmc?.cover,
            cover: currentAmc?.cover
        },
        validationSchema: NewAMCSchema,
        onSubmit: async (values) => {
            const { file, ...rest } = values;
            try {
                if (_.has(values.cover, "preview")) {
                    mutate({ ...rest, cover: file, id: currentAmc?._id });
                } else {
                    mutate({
                        title: values?.title,
                        description: values?.description,
                        productId: values?.productId,
                        price: values?.price,
                        durationType: values?.durationType,
                        durationCount: values?.durationCount,
                        id: currentAmc?._id,
                    });
                }
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
    const handleDrop = async (acceptedFiles) => {
        setstate({ ...state, loading: 2 });
        const file = acceptedFiles[0];
        if (file) {
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            });
        }
        setFieldValue("cover", file);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "my-uploads");
        const config = {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                const percentage = Math.floor((loaded * 100) / total);
                setstate({ ...state, loading: percentage });
            },
        };
        await axios
            .post(
                `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData,
                config
            )
            .then(({ data }) => {
                return (
                    setFieldValue("file", {
                        _id: data.public_id,
                        url: data.secure_url,
                    }),
                    setstate({ ...state, loading: false })
                );
            })
            .then(() => {
                return (
                    deleteMutate({ _id: values.file._id }),
                    setstate({ ...state, loading: false })
                );
            });
    };




    return (
        <Box>
            <FormikProvider value={formik}>
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <div>
                                        <LabelStyle>{t("title")}</LabelStyle>
                                        <TextField
                                            fullWidth
                                            {...getFieldProps("title")}
                                            error={Boolean(touched.title && errors.title)}
                                            helperText={touched.title && errors.title}
                                        />
                                    </div>
                                    <div>
                                        <LabelStyle>{t("description")}</LabelStyle>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={9}
                                            {...getFieldProps("description")}
                                            error={Boolean(touched.description && errors.description)}
                                            helperText={touched.description && errors.description}
                                        />
                                    </div>

                                    <div>
                                        <LabelStyle>{t("price")}</LabelStyle>
                                        <TextField
                                            fullWidth
                                            {...getFieldProps("price")}
                                            error={Boolean(touched.price && errors.price)}
                                            helperText={touched.price && errors.price}
                                        />
                                    </div>
                                    <div>
                                        <FormControl fullWidth>
                                            <LabelStyle>{t("duration-type")}</LabelStyle>
                                            <Select
                                                native
                                                {...getFieldProps("durationType")}
                                                id="grouped-native-select"
                                            >
                                                {
                                                    DURATION_TYPE?.map((dt, key) => {
                                                        return <option key={key} value={dt}>{capitalCase(dt)}</option>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <FormControl fullWidth>
                                            <LabelStyle>{t("duration-count")}</LabelStyle>
                                            <Select
                                                native
                                                {...getFieldProps("durationCount")}
                                                id="grouped-native-select"
                                            >
                                                {
                                                    DURATION_COUNT?.map((dc, key) => {
                                                        { console.log(dc) }
                                                        return <option key={key} value={dc}>{dc}</option>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </div>

                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Stack spacing={3}>
                                <Card sx={{ p: 3 }}>
                                    <FormControl fullWidth>
                                        <LabelStyle>{t("product")}</LabelStyle>
                                        {products ? (
                                            <Select
                                                native
                                                {...getFieldProps("productId")}
                                                id="grouped-native-select"
                                                sx={{ mb: 3 }}
                                                error={Boolean(touched.productId && errors.productId)}
                                            >
                                                {products?.map((product, key) => (
                                                    <option key={`pr-${key}`} value={product._id}>
                                                        {product.name}
                                                    </option>
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

                                    <div>
                                        <LabelStyle>
                                            {t("amc-image")} <span>512 * 512</span>
                                        </LabelStyle>
                                        <UploadSingleFile
                                            file={values.cover}
                                            onDrop={handleDrop}
                                            error={Boolean(touched.cover && errors.cover)}
                                            loading={state.loading}
                                            category
                                            sx={{ mb: 3 }}
                                        />
                                        {touched.cover && errors.cover && (
                                            <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                                {touched.cover && errors.cover}
                                            </FormHelperText>
                                        )}
                                    </div>



                                    <LoadingButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        loading={isLoading || state.loading}
                                    >
                                        {t("add-amc")}
                                    </LoadingButton>
                                </Card>
                            </Stack>

                        </Grid>
                    </Grid>
                </Form>
            </FormikProvider>
        </Box>
    );
}
