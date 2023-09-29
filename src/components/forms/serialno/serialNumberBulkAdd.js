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
import { ExcelRenderer } from "react-excel-renderer";
import { useEffect } from "react";
import { InterpreterModeSharp } from "@mui/icons-material";

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

export default function SerialNumberBulkAddForm({ products }) {
  const { t } = useTranslation("serialno");
  const navigate = useNavigate();
  const [excelData, setExcelData] = useState([]);

  const { mutate, isLoading } = useMutation("new", api.bulkAddSerialNo, {
    onSuccess: (res) => {
      if (res?.duplicateData?.length === 0) {
        toast.success("Serial Numbers are added.");
        navigate("/serialno/list");
      } else {
        if (res?.dataInsertcount > 0) {
          toast.success(
            "Duplicate serial numbers not added, only unique serial sumbers are added succefully"
          );
          navigate("/serialno/list");
        } else {
          toast.error("Duplicate Data Found");
        }
      }
    },
    onError: (error) => {
      console.log("error", error);
      toast.error(error.response?.data?.data);
    },
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    ExcelRenderer(file, (err, resp) => {
      if (err) {
        console.error(err);
      } else {
        setExcelData(resp.rows);
      }
    });
  };

  useEffect(() => {
    console.log("excelData", excelData);
  }, [excelData]);

  const editSerialNoSchema = Yup.object().shape({
    productId: Yup.string().required(t("product-is-required")),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productId: products[0]?._id,
    },
    validationSchema: editSerialNoSchema,
    onSubmit: async (values) => {
      let arr = [];
      excelData?.map((data) => {
        arr.push({
          productId: values?.productId,
          isUsed: false,
          productSerialNo: data?.[0],
        });
      });

      const payload = {
        productSerialNumber: arr,
      };

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
                  <FormControl fullWidth>
                    <LabelStyle>{t("Product")}</LabelStyle>
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
                  <FormControl fullWidth>
                    <LabelStyle>{t("Multiple Serial Number")}</LabelStyle>
                    <LabelStyle>
                      <small>
                        {t(
                          "Excel file only contains serial number in first column"
                        )}
                      </small>
                    </LabelStyle>
                    <TextField
                      type="file"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ accept: ".xls, .xlsx" }}
                      onChange={handleFileUpload}
                      sx={{ mb: 3 }}
                    />
                  </FormControl>
                  <div>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      {excelData.length > 0 ? (
                        <>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              {excelData?.map((cell) => {
                                return <LabelStyle>{cell?.[0]}</LabelStyle>;
                              })}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              {excelData?.map((cell) => {
                                return <LabelStyle>{cell?.[1]}</LabelStyle>;
                              })}
                            </FormControl>
                          </Grid>
                        </>
                      ) : (
                        <Grid item xs={12} md={12}>
                          No Data Found
                        </Grid>
                      )}
                    </Grid>
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
