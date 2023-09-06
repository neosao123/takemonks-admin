import * as Yup from "yup";
import toast from 'react-hot-toast';
import { capitalCase } from "change-case";
import { useState } from "react";
import { Form, FormikProvider, useFormik } from "formik";
// material
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import {
    Card,
    Grid,
    Stack,
    Select,
    TextField,
    Typography,
    FormControl,
    FormHelperText,
    Box,
} from "@mui/material";
import { UploadSingleFile } from "src/components";
import * as api from "src/services";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

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

export default function BrandNewForm({ brands }) {
    const navigate = useNavigate();
    const [state, setstate] = useState({
        loading: false,
    });
    const { t } = useTranslation("brands");
    const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const { mutate, isLoading } = useMutation("new", api.newBrand, {
        onSuccess: () => {
            toast.success("New Brand Created");
            navigate("/brands");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const NewBrandSchema = Yup.object().shape({
        name: Yup.string().required(t("name-is-required")),
        cover: Yup.mixed().required(t("cover-is-required")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            cover: null,
            file: "",
        },
        validationSchema: NewBrandSchema,
        onSubmit: async (values) => {
            const { file, ...rest } = values;
            try {
                mutate({ ...rest, cover: file, status: "active" });
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
                        <Grid item xs={12} md={8}>
                            <Card sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <div>
                                        <LabelStyle>{t("brand-name")}</LabelStyle>
                                        <TextField
                                            fullWidth
                                            {...getFieldProps("name")}
                                            error={Boolean(touched.name && errors.name)}
                                            helperText={touched.name && errors.name}
                                        />
                                    </div>
                                    <div>
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
                                    </div>
                                    <LoadingButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        loading={isLoading || state.loading}
                                    >
                                        {t("create-brand")}
                                    </LoadingButton>
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </Form>
            </FormikProvider>
        </Box>
    );
}
