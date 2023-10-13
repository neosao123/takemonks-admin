import * as React from "react";
// material
import { Menu, MenuItem, Box, Button, Modal, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import * as api from "src/services";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';
// notification
import toast from 'react-hot-toast';
import { useEffect } from "react";
import { useState } from "react";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

export default function SelectOrderStatus({ data }) {
  const navigate = useNavigate();
  const { t } = useTranslation("order");
  const { mutate, isLoading } = useMutation(api.updateOrderStatus, {
    onSuccess: () => {
      toast.success("Order Status Updated");
      navigate("/orders");
    },
    onError: () => {
      toast.error("Something Is Wrong!");
    },
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [statusArray, setStatusArray] = React.useState([]);
  const [openModel, setOpenModel] = React.useState(false);
  const [deliveryPartner, setDeliveredPartner] = useState("");
  const [TrackingNumber, setTrackingNumber] = useState("");
  const handleOpenModel = () => setOpenModel(true);
  const handleCloseModel = () => setOpenModel(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (props) => {
    if (props === "shipped") {
      handleOpenModel()
    }
    else {
      setSelected(props);
      if (props !== selected) {
        mutate({ id: data?._id, status: props });
      }
      setAnchorEl(null);
    }
  };

  const handleSubmit = () => {
    if (TrackingNumber !== "" && deliveryPartner !== "") {
      setSelected("shipped");
      if ("shipped" !== selected) {
        mutate({ id: data?._id, status: "shipped", deliveryPartner: deliveryPartner, ordertrackingNumber: TrackingNumber });
      }
      setAnchorEl(null);
    } else {
      toast.error("Please fill Delivery Partener Details and Order Tracking Number")
    }
  }

  useEffect(() => {
    if (data?.status === "pending") {
      setStatusArray([
        "shipped", "cancelled"
      ])
    }
    if (data?.status === "shipped") {
      setStatusArray(["in transit", "delivered", "cancelled"])
    }
    if (data?.status === "in transit") {
      setStatusArray(["delivered", "cancelled"])
    }
    if (data?.status === "delivered") {
      setStatusArray(["returned"])
    }
  }, [data?.status])

  return (
    <>
      <LoadingButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="outlined"
        endIcon={<ExpandMoreRoundedIcon />}
        sx={{ ml: 1 }}
        loading={isLoading || !data}
        loadingPosition="end"
      >
        {selected ? selected : t(data?.status) || "Loading"}
      </LoadingButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(selected)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {statusArray.map(
          (status) => (
            <MenuItem
              sx={{ textTransform: "capitalize" }}
              key={status}
              onClick={() => handleClose(status)}
            >
              {t(status)}
            </MenuItem>
          )
        )}
      </Menu>
      <div>
        <Modal
          open={openModel}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography>
                Update Tracking Details
              </Typography>
              <Button onClick={handleCloseModel}><CloseIcon /></Button>
            </Box>
            <TextField fullWidth label="Delivery Partner" onChange={(e) => setDeliveredPartner(e.target.value)} />
            <TextField fullWidth label="Order Tracking Number" onChange={(e) => setTrackingNumber(e.target.value)} />
            <Button onClick={() => handleSubmit()} variant='contained'>submit</Button>
          </Box>
        </Modal>
      </div>
    </>
  );
}
