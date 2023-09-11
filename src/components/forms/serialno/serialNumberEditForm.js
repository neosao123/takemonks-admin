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
import { Form, Formik, FormikProvider, useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import * as api from "src/services";

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

export default function SerialNumberEditForm({ currentSerialNo, products }) {
  const { t } = useTranslation("amcs");

  const navigate = useNavigate();
  console.log("products", products);

  let currentProduct = products?.filter(
    (data) => data._id === currentSerialNo?.productId?._id
  );
  if (currentProduct?.length > 0) {
    currentProduct = currentProduct[0];
  } else {
    currentProduct = null;
  }

  console.log("currentProduct", currentSerialNo?._id);

  const { mutate, isLoading } = useMutation(
    ["update-serialno", currentSerialNo?._id],
    () => api.updateSerialNo,
    {
      enabled: Boolean(currentSerialNo?._id),
      onSuccess: (res) => {
        toast.success("Serial Number Updated");
        // navigate("/serialno/list");
        alert("api called");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const editSerialNoSchema = Yup.object().shape({
    serialNo: Yup.string().required(t("serial-number-is-required")),
    productId: Yup.string().required(t("product-is-required")),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productId: currentProduct?._id || "",
      serialNo: currentSerialNo?.productSerialNo || "",
    },
    validationSchema: editSerialNoSchema,
    onSubmit: async (values) => {
      const payload = {
        productId: values?.productId,
        isUsed: false,
        productSerialNo: values?.serialNo,
      };
      console.log(values);

      try {
        mutate({ payload: payload });
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
                    {t("update serial number")}
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
