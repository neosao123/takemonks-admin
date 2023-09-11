import * as Yup from "yup";
import { Icon } from "@iconify/react";
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
  Box,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as api from "src/services";
import { Form, Formik, FormikProvider, useFormik } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

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

export default function SerialNumberNewForm({ products }) {
  const { t } = useTranslation("serialno");
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation("new", api.newSerialNumber, {
    onSuccess: (res) => {
      toast.success("New Serial Number Added");
      navigate("/serialno/list");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error.response?.data?.data);
    },
  });

  const newSerialNoSchema = Yup.object().shape({
    serialNo: Yup.string().required(t("serial-number-is-required")),
    productId: Yup.string().required(t("product-is-required")),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productId: products[0]?._id,
      serialNo: "",
    },
    validationSchema: newSerialNoSchema,
    onSubmit: async (values) => {
      const payload = {
        productId: values?.productId,
        isUsed: false,
        productSerialNo: values?.serialNo,
      };
      console.log(values);

      try {
        mutate(payload);
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

  return (
    <Box>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      container
                      justifyContent="flex-end"
                    >
                      <LoadingButton
                        type="button"
                        variant="outlined"
                        size="auto"
                      >
                        <span>
                          {t("bulk add")} {"  "}
                        </span>
                        <Icon
                          icon="vscode-icons:file-type-excel"
                          width="1.2rem"
                          height="1.2rem"
                          style={{ marginLeft: ".8rem" }}
                        />
                      </LoadingButton>
                    </Grid>
                  </Grid>
                  <FormControl fullWidth>
                    <LabelStyle>{t("product")}</LabelStyle>
                    <Select
                      native
                      id="grouped-native-select"
                      sx={{ mb: 3 }}
                      {...getFieldProps("productId")}
                    >
                      {products?.map((product, key) => (
                        <option key={`pr-${key}`} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <div>
                    <FormControl fullWidth>
                      <LabelStyle>{t("Serial Number")}</LabelStyle>
                      <TextField
                        fullWidth
                        sx={{ mb: 3 }}
                        {...getFieldProps("serialNo")}
                      />
                    </FormControl>
                  </div>
                  <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    isLoading={isLoading}
                  >
                    {t("add serial number")}
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
