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

  const handleAdd = () => {
    let arr = [];
    excelData?.map((data) => {
      arr.push({
        productId: data?.[0],
        isUsed: false,
        productSerialNo: data?.[1],
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
  };

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

  return (
    <Box>
      {/* <FormikProvider> */}
      {/* <Form noValidate autoComplete="off"> */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <FormControl fullWidth>
                <LabelStyle>{t("Product")}</LabelStyle>
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
                onClick={handleAdd}
              >
                {t("add serial number")}
              </LoadingButton>
            </Card>
          </Stack>
        </Grid>
      </Grid>
      {/* </Form> */}
      {/* </FormikProvider> */}
    </Box>
  );
}
