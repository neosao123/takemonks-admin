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
import { Form, Formik, FormikProvider } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";

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

export default function SerialNumberEditForm({ products }) {
  const { t } = useTranslation("amcs");

  const handleSubmit = () => {
    //
  };

  return (
    <Box>
      <FormikProvider value={Formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <FormControl fullWidth>
                    <LabelStyle>{t("product")}</LabelStyle>
                    <Select native id="grouped-native-select" sx={{ mb: 3 }}>
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
                      <TextField fullWidth sx={{ mb: 3 }} />
                    </FormControl>
                  </div>
                  <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                  >
                    {t("edit serial number")}
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