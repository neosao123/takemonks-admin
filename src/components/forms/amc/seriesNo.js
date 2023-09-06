import {
  Box,
  Button,
  Card,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import Grid from "src/theme/overrides/Grid";
import Typography from "src/theme/overrides/Typography";

export default function SeriesNumber() {
  //   const { t } = useTranslation("amcs");

  //   //   const LabelStyle = styled(Typography)(({ theme }) => ({
  //   //     ...theme.typography.subtitle2,
  //   //     color: theme.palette.text.secondary,
  //   //     marginBottom: theme.spacing(1),
  //   //     span: {
  //   //       fontSize: 12,
  //   //       float: "right",
  //   //       fontWeight: 400,
  //   //     },
  //   //   }));

  return (
    <Box>
      <Card>
        <TextField
          id="outlined-basic"
          sx={{ m: 1.5 }}
          label="Outlined"
          variant="outlined"
        />
        <Button size="large" variant="outlined" sx={{ m: 1.5 }}>
          Add
        </Button>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Age"
          sx={{ m: 1.5 }}
          style={{ width: "10%" }}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </Card>
      {/* <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <div>
                <InputLabel shrink htmlFor="bootstrap-input"></InputLabel>
              </div>
            </Stack>
          </Card>
        </Grid>
      </Grid> */}
    </Box>
  );
}
