import * as Yup from "yup";
import React, { useMemo, useRef, useState } from "react";
import toast from 'react-hot-toast';
import { capitalCase } from "change-case";
import { Form, FormikProvider, useFormik } from "formik";
// material
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
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

//
import { SelectColors, UploadMultiFile } from "src/components";
import * as api from "src/services";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import configData from "src/configData";
import { fCurrency } from "src/utils/formatNumber";
import 'jodit/build/jodit.min.css';
// ----------------------------------------------------------------------
const { GENDER_OPTION, STATUS_OPTIONS, TAGS_OPTION, SIZES, COLORS, OS, OSARCHITECTURE, RAMTYPE, RAMCAPACITY, STORAGETYPE, STORAGECAPACITY, USBPORTS, HDMIPORTS, WEIGHT, TOUCHSCREEN, CONDITION, NOOFCORES, MICIN, ETHERNETPORT } =
  configData;
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
import { useTranslation } from "react-i18next";
import JoditEditor from 'jodit-react';
import { useEffect } from "react";
// ----------------------------------------------------------------------

export default function ProductNewForm({
  categories,
  isLoading: categoryLoading,
  isBrandLoading: brandLoading,
  brands
}) {

  const { t } = useTranslation("product");
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [content, setContent] = useState("");
  const descriptionEditor = useRef();
  const detailsEditor = useRef();



  const joEditButtons = [
    'bold',
    'italic',
    'underline',
    '|',
    'align',
    'ul',
    'ol',
    '|',
    'undo',
    'redo',
    'table',
    'hr'];

  const configNote = useMemo(() => ({
    readonly: false,
    toolbar: true,
    buttons: joEditButtons,
    buttonsMD: joEditButtons,
    buttonsXS: joEditButtons,
  }), []);




  const { mutate, isLoading } = useMutation("new", api.newProduct, {
    onSuccess: () => {
      toast.success("New Product Created");
      navigate("/products");
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

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(t("name-is-required")),
    images: Yup.array().min(1, t("images-is-required")),
    price: Yup.number().required(t("price-is-required")),
    brand: Yup.string().required(t("brand-is-required")),
    status: Yup.string().required(t("status-is-required")),
    available: Yup.number().required(t("quantaty-is-required")),
    tags: Yup.array().min(1, t("tags-is-required")),
    category: Yup.string().required(t("category-is-required")),
    code: Yup.string().required(t("code-is-required")),
    sku: Yup.string().required(t("sku-is-required")),
    priceSale: Yup.number().lessThan(
      Yup.ref("price"),
      t("sale-price-should-be-smaller-than-price")
    ),
    salesPackage: Yup.string().required(t("salesPackage-is-required")),
    highlightOne: Yup.string().required(t("highlightOne-is-required")),
    highlightTwo: Yup.string().required(t("highlightTwo-is-required")),
    highlightThree: Yup.string().required(t("highlightThree-is-required")),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
      condition: "",
      details: "",
      images: [],
      code: "",
      sku: "",
      price: "",
      brand: "",
      priceSale: "",
      tags: [],
      category: "",
      status: "",
      available: 1,
      colors: [],
      sizes: [],
      inventoryType: "new",
      sold: 0,
      blob: [],
      isFeatured: false,
      salesPackage: "",
      highlightOne: "",
      highlightTwo: "",
      highlightThree: ""
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      const { blob, category, ...rest } = values;
      if (values.colors.length > 1) {
        toast.error("Enter only one color");
      } else if (values.description === "") {
        toast.error("Description is required");
      } else if (values.details === "") {
        toast.error("Details are required");
      } else {
        console.log({ values })
        try {
          const date = new Date().toISOString();
          mutate({
            ...rest,
            category: category,
            createdAt: date,
            priceSale: values.priceSale || values.price,
          });
        } catch (error) {
          console.error(error);
        }
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

  const handleDescriptionChange = (value) => {
    setFieldValue('description', value);
  };

  const handleDetailsChange = (value) => {
    setFieldValue('details', value);
  };

  const handleDrop = (acceptedFiles) => {
    setloading(true);
    const uploaders = acceptedFiles.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");
      setFieldValue("blob", values.blob.concat(acceptedFiles));
      return axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
    });
    const blobs = acceptedFiles.map((file) => {
      return URL.createObjectURL(file);
    });
    axios.all(uploaders).then((data) => {
      const newImages = data.map(({ data }, i) => ({
        url: data.secure_url,
        _id: data.public_id,
        blob: blobs[i],
      }));
      console.log("newImages", newImages)
      setloading(false);
      setFieldValue("images", values.images.concat(newImages));
    });
  };

  const handleRemoveAll = () => {
    values.images.forEach((image) => {
      deleteMutate({ _id: image._id });
    });
    setFieldValue("images", []);
  };
  const handleRemove = (file) => {
    const removeImage = values.images.filter((_file) => {
      if (_file._id === file._id) {
        deleteMutate({ _id: file._id });
      }
      return _file !== file;
    });
    setFieldValue("images", removeImage);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <LabelStyle>{t("product-name")}</LabelStyle>
                  <TextField
                    fullWidth
                    {...getFieldProps("name")}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </div>
                <div>
                  <LabelStyle>{t("description")}</LabelStyle>
                  <JoditEditor
                    config={configNote}
                    ref={descriptionEditor}
                    onChange={handleDescriptionChange}
                  />

                  {touched.description && errors.description && (
                    <FormHelperText error sx={{ px: 2, mx: 0 }}>
                      {touched.description && errors.description}
                    </FormHelperText>
                  )}
                </div>
                <div>
                  <LabelStyle>{t("details")}</LabelStyle>
                  <JoditEditor
                    config={configNote}
                    ref={detailsEditor}
                    onChange={handleDetailsChange}
                  />

                  {touched.details && errors.details && (
                    <FormHelperText error sx={{ px: 2, mx: 0 }}>
                      {touched.details && errors.details}
                    </FormHelperText>
                  )}


                </div>
                <div>
                  <Grid container spacing={2}>
                    {/* salesPackage */}
                    <Grid item xs={12} md={12}>
                      <div>
                        <LabelStyle>{t("salesPackage")}</LabelStyle>
                        <TextField
                          fullWidth
                          {...getFieldProps("salesPackage")}
                          error={Boolean(touched.salesPackage && errors.salesPackage)}
                          helperText={touched.salesPackage && errors.salesPackage}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <div>
                        <LabelStyle>{t("highlightOne")}</LabelStyle>
                        <TextField
                          fullWidth
                          {...getFieldProps("highlightOne")}
                          error={Boolean(touched.highlightOne && errors.highlightOne)}
                          helperText={touched.highlightOne && errors.highlightOne}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <div>
                        <LabelStyle>{t("highlightTwo")}</LabelStyle>
                        <TextField
                          fullWidth
                          {...getFieldProps("highlightTwo")}
                          error={Boolean(touched.highlightTwo && errors.highlightTwo)}
                          helperText={touched.highlightTwo && errors.highlightTwo}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <div>
                        <LabelStyle>{t("highlightThree")}</LabelStyle>
                        <TextField
                          fullWidth
                          {...getFieldProps("highlightThree")}
                          error={Boolean(touched.highlightThree && errors.highlightThree)}
                          helperText={touched.highlightThree && errors.highlightThree}
                        />
                      </div>
                    </Grid>


                    <Grid item xs={12} md={4}>
                      <LabelStyle>{t("colors")}</LabelStyle>
                      <Autocomplete
                        freeSolo
                        value={values.colors}
                        onChange={(event, newValue) => {
                          setFieldValue("colors", newValue);
                        }}
                        options={[]}
                        multiple
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              size="small"
                              label={option}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(touched.colors && errors.colors)}
                            helperText={touched.colors && errors.colors}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <LabelStyle>{t("tags")}</LabelStyle>

                      <Autocomplete
                        multiple
                        freeSolo
                        value={values.tags}
                        onChange={(event, newValue) => {
                          setFieldValue("tags", newValue);
                        }}
                        options={[]}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              size="small"
                              label={option}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(touched.tags && errors.tags)}
                            helperText={touched.tags && errors.tags}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </div>
                <div>
                  <LabelStyle>
                    {t("products-images")} <span>1080 * 1080</span>
                  </LabelStyle>
                  <UploadMultiFile
                    showPreview
                    maxSize={3145728}
                    accept="image/*"
                    files={values.images}
                    loading={loading}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                    blob={values.blob}
                    error={Boolean(touched.images && errors.images)}
                  />
                  {touched.images && errors.images && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.images && errors.images}
                    </FormHelperText>
                  )}
                </div>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <LabelStyle>{t("status")}</LabelStyle>

                    <Select
                      native
                      {...getFieldProps("status")}
                      error={Boolean(touched.status && errors.status)}
                    >
                      <option value="" style={{ display: "none" }} />
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {capitalCase(status)}
                        </option>
                      ))}
                    </Select>

                    {touched.status && errors.status && (
                      <FormHelperText error sx={{ px: 2, mx: 0 }}>
                        {touched.status && errors.status}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl fullWidth>
                    <LabelStyle>{t("category")}</LabelStyle>
                    {!categoryLoading ? (
                      <Select
                        native
                        {...getFieldProps("category")}
                        id="grouped-native-select"
                      >
                        <option value="" disabled hidden style={{ display: "none" }}></option>
                        {categories?.map((category) => (
                          <optgroup
                            label={capitalCase(category[0].parentCategory)}
                            key={Math.random()}
                          >
                            {category?.map((v) => (
                              <option
                                key={category._id}
                                value={category?.name?.lowerCase()}
                              >
                                {v.name}
                              </option>
                            ))}
                          </optgroup>
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

                  {/* BRAND */}

                  <FormControl fullWidth>
                    <LabelStyle>{t("brand")}</LabelStyle>
                    {!brandLoading ? (
                      <Select
                        native
                        {...getFieldProps("brand")}
                        id="grouped-native-select"
                      >
                        <option value="" disabled hidden style={{ display: "none" }}></option>
                        {brands?.map((v) => {
                          return <option
                            key={v?._id}
                            value={v?._id}
                          >
                            {v?.name}
                          </option>
                        }
                        )}
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
                    <LabelStyle>{t("product-code")}</LabelStyle>
                    <TextField
                      fullWidth
                      {...getFieldProps("code")}
                      error={Boolean(touched.code && errors.code)}
                      helperText={touched.code && errors.code}
                    />
                  </div>
                  <div>
                    <LabelStyle>{t("product-sku")}</LabelStyle>
                    <TextField
                      fullWidth
                      {...getFieldProps("sku")}
                      error={Boolean(touched.sku && errors.sku)}
                      helperText={touched.sku && errors.sku}
                    />
                  </div>
                  {/* <div>
                    <LabelStyle>{t("gender")}</LabelStyle>
                    <RadioGroup {...getFieldProps("gender")}>
                      <Stack direction="row" flexWrap="wrap">
                        {GENDER_OPTION.map((gender) => (
                          <FormControlLabel
                            key={gender}
                            value={gender}
                            control={<Radio />}
                            label={t(gender)}
                            sx={{ mr: 3 }}
                          />
                        ))}
                      </Stack>
                    </RadioGroup>
                  </div> */}
                  <div>
                    <LabelStyle>{t("quantity")}</LabelStyle>
                    <TextField
                      fullWidth
                      type="number"
                      {...getFieldProps("available")}
                      error={Boolean(touched.available && errors.available)}
                      helperText={touched.available && errors.available}
                    />
                  </div>
                  <div>
                    <LabelStyle>{t("condition")}</LabelStyle>
                    <RadioGroup {...getFieldProps("condition")}>
                      <Stack direction="row" flexWrap="wrap">
                        {CONDITION.map((condition) => (
                          <FormControlLabel
                            key={condition}
                            value={condition}
                            control={<Radio />}
                            label={t(condition)}
                            sx={{ mr: 3 }}
                          />
                        ))}
                      </Stack>
                    </RadioGroup>
                  </div>
                </Stack>
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <div>
                    <LabelStyle>{t("regular-price")}</LabelStyle>
                    <TextField
                      fullWidth
                      placeholder="0.00"
                      {...getFieldProps("price")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {fCurrency(0)?.split("0")[0]}
                          </InputAdornment>
                        ),
                        type: "number",
                      }}
                      error={Boolean(touched.price && errors.price)}
                      helperText={touched.price && errors.price}
                    />
                  </div>
                  <div>
                    <LabelStyle>{t("sale-price")}</LabelStyle>
                    <TextField
                      fullWidth
                      placeholder="0.00"
                      {...getFieldProps("priceSale")}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {fCurrency(0)?.split("0")[0]}
                          </InputAdornment>
                        ),
                        type: "number",
                      }}
                      error={Boolean(touched.priceSale && errors.priceSale)}
                      helperText={touched.priceSale && errors.priceSale}
                    />
                  </div>
                  <div>
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch {...getFieldProps("isFeatured")} />}
                        label={t("Pre-Owned-product")}
                      />
                    </FormGroup>
                  </div>
                </Stack>
              </Card>

              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                loading={isLoading}
              >
                {t("create-product")}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
