import React from "react";
import { uniqueId } from "lodash";
// material
import {
  Grid,
  Paper,
  Typography,
  Skeleton,
  Box,
  Stack,
  Link,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Label } from "src/components";
import { fDateShort } from "src/utils/formatTime";
import { capitalize } from "lodash";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import { Lable, Popover } from "src/components";
// import Icon from "src/utils/icon";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { fCurrency } from "src/utils/formatNumber";
import LockIcon from "@mui/icons-material/Lock";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
const RootStyle = styled(Paper)(({ theme }) => ({
  padding: "10px 10px 10px 16px",
  marginBottom: "0.5rem",
  backgroundColor: theme.palette.background.paper,
  border: "1px solid " + theme.palette.divider,
  borderRadius: 4,
  "& .name": {
    fontWeight: 600,
    color: theme.palette.info.main,
  },
  "& .time svg": {
    width: 10,
    height: 10,
    "& path": {
      fill: theme.palette.text.primary,
    },
  },
  "& .date": {
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  "& .callander": {
    "& svg": {
      width: 10,
      height: 10,
    },
  },
  "& .time-slot": {
    fontWeight: 500,
    fontSize: "0.75rem",
  },
  "& .phone-container": {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: "0.5rem",
    "& .phone": {
      color: theme.palette.text.secondary,
      fontWeight: 400,
      fontSize: 11,
    },
    "& .btn-phone": {
      fontSize: "1px",
    },
  },
}));

export default function AgendaCodeMobile({ item, isLoading, handleClickOpen }) {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <RootStyle
      sx={{
        borderLeft: `6px solid ${isLoading
          ? theme.palette.divider
          : theme.palette[
            (item?.status === "delivered" && "success") ||
            (item?.status === "ontheway" && "warning") ||
            (item?.status === "pending" && "info") ||
            "error"
          ].main
          }`,
      }}
      key={uniqueId()}
    >
      <Grid container alignItems="center">
        <Grid item md={8} sm={8} xs={8}>
          <Stack spacing={0.5}>
            <Link
              className="name"
              component={RouterLink}
              to={`/orders/${item?._id}`}
              underline="none"
            >
              {isLoading ? (
                <Skeleton variant="text" />
              ) : (
                capitalize(item?.user.fullName)
              )}
            </Link>
            <Stack spacing={1} direction="row" alignItems="center">
              {isLoading ? (
                <Skeleton variant="circular" width={20} height={20} />
              ) : (
                <ShoppingCartRoundedIcon fontSize="small" />
              )}
              <Typography className="time-slot">
                {isLoading ? (
                  <Skeleton variant="text" width={50} />
                ) : (
                  item.items.length + ` item${item.items.length > 1 ? "s" : ""}`
                )}
              </Typography>
              {isLoading ? (
                <Skeleton variant="circular" width={20} height={20} />
              ) : (
                <DateRangeRoundedIcon fontSize="small" />
              )}
              <Typography className="date">
                {isLoading ? (
                  <Skeleton variant="text" width={50} />
                ) : (
                  fDateShort(item.createdAt)
                )}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Typography sx={{ textAlign: "right", mb: 0.5 }} variant="body2">
            {isLoading ? (
              <Skeleton variant="text" width={50} sx={{ ml: "auto" }} />
            ) : (
              fCurrency(Number(item?.total))
            )}
          </Typography>
          <Box className="phone-container">
            {isLoading ? (
              <Skeleton variant="text" width={50} />
            ) : (
              <Label
                variant={theme.palette.mode === "light" ? "ghost" : "filled"}
                color={
                  (item?.status === "delivered" && "success") ||
                  (item?.status === "ontheway" && "warning") ||
                  (item?.status === "pending" && "info") ||
                  "error"
                }
              >
                {capitalize(item?.status)}
              </Label>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} >
          <Box sx={
            {
              display: "flex",
              justifyContent: "space-between"
            }
          }>
            <Stack direction="row" justifyContent="flex-end">
              {" "}
              {isLoading ? (
                <Skeleton
                  variant="circular"
                  width={34}
                  height={34}
                  sx={{ mr: 1 }}
                />
              ) : (
                <Tooltip title="Preview">
                  <IconButton onClick={() => navigate(`/orders/${item._id}`)}>
                    <RemoveRedEyeIcon />
                  </IconButton>
                </Tooltip>
              )}{" "}
            </Stack>{" "}
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              <Button disabled={item?.status !== "delivered"} variant="contained">Send Mail</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
