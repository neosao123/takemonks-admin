// material
import { paramCase } from "change-case";
import { useTheme, styled } from "@mui/material/styles";
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Avatar,
  Rating,
  Switch,
  Tooltip,
  Link,
} from "@mui/material";
// redux
import { fDateShort } from "src/utils/formatTime";
// components
import { Label } from "src/components";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useNavigate } from "react-router-dom";
import { ar, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

const ThumbImgStyle = styled("img")(({ theme }) => ({
  width: 50,
  height: 50,
  minWidth: 50,
  objectFit: "cover",
  background: theme.palette.background.default,
  marginRight: theme.spacing(2),
  border: "1px solid " + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
}));

export default function AmcRow({ isLoading, row, handleClickOpen }) {
  console.log(row, "row");
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { language } = i18n;
  return (
    <TableRow hover key={Math.random()}>
      <TableCell
        component="th"
        scope="row"
        padding="none"
        sx={{ maxWidth: 300 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {" "}
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              width={50}
              height={50}
              sx={{ borderRadius: 1 }}
            />
          ) : Boolean(row?.cover) > 0 ? (
            <ThumbImgStyle alt={row?.cover?.title} src={row?.cover?.url} />
          ) : (
            <Avatar> {row?.name?.slice(0, 1)} </Avatar>
          )}{" "}
          <Typography variant="subtitle2" noWrap>
            {" "}
            {isLoading ? (
              <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
            ) : row?.title?.length > 15 ? (
              `${row?.title?.slice(0, 15)}...`
            ) : (
              row?.title
            )}{" "}
          </Typography>
        </Box>{" "}
      </TableCell>{" "}
      {/* <TableCell
                component="th"
                scope="row"
                padding="none"
                sx={{ maxWidth: 300 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {" "}
                    {isLoading ? (
                        <Skeleton
                            variant="rectangular"
                            width={50}
                            height={50}
                            sx={{ borderRadius: 1 }}
                        />
                    ) : Boolean(row?.productId?.cover) > 0 ? (
                        <ThumbImgStyle alt={row?.productId?.name} src={row?.productId?.cover} />
                    ) : (
                        <Avatar> {row?.name?.slice(0, 1)} </Avatar>
                    )}{" "}
                    <Typography variant="subtitle2" noWrap>
                        {" "}
                        {isLoading ? (
                            <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
                        ) : (
                            row?.productId?.name?.length > 10 ? `${row?.productId?.name?.slice(0, 10)}...` : row?.productId?.name
                        )}{" "}
                    </Typography>{" "}
                </Box>{" "}
            </TableCell>{" "} */}
      <TableCell component="th" scope="row" padding="10px">
        {" "}
        {isLoading ? (
          <Skeleton variant="text" />
        ) : row?.productId?.name?.length > 15 ? (
          `${row?.productId?.name?.slice(0, 15)}...`
        ) : (
          row?.productId?.name
        )}{" "}
      </TableCell>
      <TableCell component="th" scope="row" padding="10px">
        {" "}
        {isLoading ? <Skeleton variant="text" /> : row?.price}{" "}
      </TableCell>
      <TableCell component="th" scope="row" padding="10px">
        {" "}
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          row?.durationType.toUpperCase()
        )}{" "}
      </TableCell>
      <TableCell component="th" scope="row" padding="10px">
        {" "}
        {isLoading ? <Skeleton variant="text" /> : row?.durationCount}{" "}
      </TableCell>
      <TableCell>
        {" "}
        {isLoading ? (
          <Skeleton variant="text" padding="10px" />
        ) : (
          <>{fDateShort(row.createdAt, language !== "ar" ? enUS : ar)} </>
        )}{" "}
      </TableCell>
      <TableCell align="left">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <>
              <Skeleton
                variant="circular"
                width={34}
                height={34}
                sx={{ mr: 1 }}
              />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <></>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
