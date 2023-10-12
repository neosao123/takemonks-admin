import { Box, Modal, TextField, Button } from "@mui/material";
import { useState } from "react";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'primary',
    boxShadow: 24,
    border: "none",
    p: 5,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: "15px"
};

export default function DeliveryPartnerAndOrderTrackingNumber(open, handleClose) {
    const [delivaryPartner, setDeliveryPartner] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");

    const handleSubmit = () => {
        handleClose()
    }

    return (<>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
                border: "none"
            }}
        >
            <Box sx={style}>
                <TextField label="Delivery Partener" onChange={(e) => setDeliveryPartner(e.target.value)} fullWidth />
                <TextField label="Order Tracking Number" fullWidth onChange={(e) => setTrackingNumber(e.target.value)} />
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </Box>
        </Modal>
    </>
    )
}