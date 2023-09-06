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

export default function BrandEditForm({ brand }) {
    const [state, setstate] = useState({
        loading: false,
    });
    const { t } = useTranslation("brands");
    const navigate = useNavigate();

    const { mutate, isLoading } = useMutation("update", api.updateBrand, {
        enabled: Boolean(brand?._id),
        onSuccess: () => {
            toast.success("Brand Updated");
            navigate("/brands");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const NewBrandSchema = Yup.object().shape({
        name: Yup.string().required(t("name-is-required")),
        cover: Yup.string().required(t("cover-is-required")),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: brand?.name,
            cover: brand?.cover,
            file: brand?.cover,
        },
        validationSchema: NewBrandSchema,
        onSubmit: async (values) => {
            const { file, ...rest } = values;
            try {
                if (_.has(values.cover, "preview")) {
                    mutate({ ...rest, cover: file, id: brand?._id });
                } else {
                    mutate({
                        name: values.name,
                        cover: values.cover,
                        status: "active",
                        id: brand?._id,
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
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ p: 3 }}>
                            <Stack spacing={3}>
                                <div>
                                    <LabelStyle>
                                        {brand ? (
                                            t("name")
                                        ) : (
                                            <Skeleton variant="text" width="100px" />
                                        )}
                                    </LabelStyle>
                                    {!brand ? (
                                        <Skeleton variant="rectangular" width="100%" height={56} />
                                    ) : (
                                        <TextField
                                            fullWidth
                                            value={values?.name ?? ""}
                                            {...getFieldProps("name")}
                                            error={Boolean(touched.name && errors.name)}
                                            helperText={touched.name && errors.name}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    )}
                                </div>




                                {!brand ? (
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        height={240}
                                        sx={{ mb: 1.4 }}
                                    />
                                ) : (
                                    <div>
                                        <LabelStyle>
                                            {t("image")} <span>512 * 512</span>
                                        </LabelStyle>
                                        <UploadSingleFile
                                            file={values.cover}
                                            onDrop={handleDrop}
                                            error={Boolean(touched.cover && errors.cover)}
                                            loading={state.loading}
                                            category
                                        />
                                        {touched.cover && errors.cover && (
                                            <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                                {touched.cover && errors.cover}
                                            </FormHelperText>
                                        )}
                                    </div>
                                )}
                                {!brand ? (
                                    <Skeleton
                                        variant="rectangular"
                                        width="100%"
                                        height={56}
                                        sx={{ mb: 1.4 }}
                                    />
                                ) : (
                                    <LoadingButton
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        loading={isLoading}
                                    >
                                        {t("edit-brand")}
                                    </LoadingButton>
                                )}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    );
}
