import {
    Card,
    Chip,
    Grid,
    Stack,
    Radio,
    Select,
    TextField,
    Typography,
    RadioGroup,
    FormControl,
    Autocomplete,
    InputAdornment,
    FormHelperText,
    FormControlLabel,
    FormGroup,
    Skeleton,
    Switch,
} from "@mui/material";
import React from 'react'
import { Form, FormikProvider, useFormik } from "formik";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@mui/lab";

const shippingNewForm = () => {
    const { t } = useTranslation("shipping");
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

    const formik = useFormik({});
    const {
        errors,
        values,
        touched,
        handleSubmit,
        setFieldValue,
        getFieldProps,
    } = formik;

    return (
        <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ p: 3 }}>
                            <Stack spacing={3} marginBottom={3}>
                                <div>
                                    <LabelStyle>{t("Shipping Charges")}</LabelStyle>
                                    <TextField
                                        fullWidth
                                        {...getFieldProps("name")}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </div>
                            </Stack>
                            <LoadingButton

                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                            // loading={isLoading || loading}
                            >
                                {t("save")}
                            </LoadingButton>
                        </Card>
                    </Grid>
                </Grid>
            </Form>
        </FormikProvider>
    )
}

export default shippingNewForm