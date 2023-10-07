import * as Yup from "yup";
// import toast from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Form, FormikProvider, useFormik } from "formik";
// material
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { Card, Stack, TextField, Typography, Box, Grid, FormControl, Select, FormHelperText, } from "@mui/material";
import * as api from "src/services";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import configData from "src/configData";
import { capitalCase } from "change-case";
import { UploadSingleFile } from "src/components";
import { useState } from "react";
import axios from "axios";
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

const { GENDER } = configData;

export default function AddUserForm() {
    const navigate = useNavigate();
    const { t } = useTranslation("user");
    const [state, setstate] = useState({
        loading: false,
    });
    const { mutate, isLoading } = useMutation("new", api.addUser, {
        onSuccess: () => {
            toast.success("New User Added");
            navigate("/users");
        },
        onError: (error) => {
            console.log(error);
            toast.error(t(error.message))
        },
    });

    const NewUserSchema = Yup.object().shape({
        firstName: Yup.string().required(t("first-name-is-required")),
        lastName: Yup.string().required(t("last-name-is-required")),
        email: Yup.string().required(t("email-is-required")).email("Invalid email address")
            .matches(/^\w+@[a-zA-Z_]+?.[a-zA-Z]{2,3}$/, "Invalid Email Address"),
        phone: Yup.string().required(t("phone-is-required")).length(10, "Invalid Phone Number"),
        gender: Yup.string().required(t("gender-is-required")),
        gst: Yup.string().trim().matches(/^[0-9A-Z]{15}$/, 'Invalid GST Number'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            gender: "",
            cover: null,
            file: "",
            GSTNumber: ""
        },
        validationSchema: NewUserSchema,
        onSubmit: async (values) => {
            console.log(values);
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
                setFieldValue("file", {
                    _id: data.public_id,
                    url: data.secure_url,
                });
                setstate({ ...state, loading: false });
            })
            .then(() => {
                if (values.file) {
                    deleteMutate({ _id: values.file._id });
                }
                setstate({ ...state, loading: false });
            });
    };
    return (
        <Box>
            <FormikProvider value={formik}>
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={9} lg={8}>
                            <Card sx={{ p: 3 }}>
                                <Grid container spacing={2} marginBottom={2}>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <FormControl fullWidth>
                                            <LabelStyle>{t("first-name")}</LabelStyle>
                                            <TextField
                                                fullWidth
                                                {...getFieldProps("firstName")}
                                                error={Boolean(touched.firstName && errors.firstName)}
                                                helperText={touched.firstName && errors.firstName}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={6}>
                                        <FormControl fullWidth>
                                            <LabelStyle>{t("last-name")}</LabelStyle>
                                            <TextField
                                                fullWidth
                                                {...getFieldProps("lastName")}
                                                error={Boolean(touched.lastName && errors.lastName)}
                                                helperText={touched.lastName && errors.lastName}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={6}>
                                        <FormControl fullWidth>
                                            <LabelStyle>{t("user-email")}</LabelStyle>
                                            <TextField
                                                fullWidth
                                                {...getFieldProps("email")}
                                                error={Boolean(touched.email && errors.email)}
                                                helperText={touched.email && errors.email}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={6}>
                                        <FormControl fullWidth>
                                            <LabelStyle>{t("user-phone")}</LabelStyle>
                                            <TextField
                                                fullWidth
                                                {...getFieldProps("phone")}
                                                error={Boolean(touched.phone && errors.phone)}
                                                helperText={touched.phone && errors.phone}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={6}>
                                        <FormControl fullWidth>
                                            <LabelStyle>{t("gender")}</LabelStyle>
                                            <Select
                                                native
                                                {...getFieldProps("gender")}
                                                error={Boolean(touched.gender && errors.gender)}
                                            >
                                                <option value="" style={{ display: "none" }} />
                                                {GENDER?.map((gender) => (
                                                    <option key={gender} value={gender}>
                                                        {capitalCase(gender)}
                                                    </option>
                                                ))}
                                            </Select>
                                            {touched.gender && errors.gender && (
                                                <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                                    {touched.gender && errors.gender}
                                                </FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={6} lg={6}>
                                        <FormControl fullWidth>
                                            <LabelStyle>{t("GST Number")}</LabelStyle>
                                            <TextField
                                                fullWidth
                                                {...getFieldProps("gst")}
                                                error={Boolean(touched.gst && errors.gst)}
                                                helperText={touched.gst && errors.gst}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Stack spacing={3}>
                                    <FormControl>
                                        <LabelStyle>
                                            {t("image")} <span>512 * 512</span>
                                        </LabelStyle>
                                        <UploadSingleFile
                                            file={values.cover}
                                            onDrop={handleDrop}
                                            error={Boolean(touched.cover && errors.cover)}
                                            brands
                                            accept="image/*"
                                            loading={state.loading}
                                        />
                                        {touched.cover && errors.cover && (
                                            <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                                {touched.cover && errors.cover}
                                            </FormHelperText>
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
                                    {t("add customer")}
                                </LoadingButton>
                            </Card>
                        </Grid>
                    </Grid>
                </Form>
            </FormikProvider>
        </Box>
    );
}