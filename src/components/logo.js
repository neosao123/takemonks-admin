import { forwardRef } from "react";
import PropTypes from "prop-types";
// material
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import takemonkLogo from "../assets/logo.png";
// ----------------------------------------------------------------------

const Logo = forwardRef(({ sx }, ref) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const PRIMARY_MAIN = theme.palette.primary.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  return (
    <Box
      ref={ref}
      sx={{
        cursor: "pointer",
        width: "180px",
        py: 0.63,
        height: "auto",
        ...sx
      }}
      onClick={() => navigate("/dashboard")}
    >
      <img src={takemonkLogo} alt="" style={{ width: "100%" }} />
    </Box>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
};

export default Logo;
