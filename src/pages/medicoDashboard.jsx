import PersistentDrawerLeft from "../components/adminNav";
import { Box } from "@mui/material";

export default function MedicoDashboard() {
  return (
    <Box
      sx={{
        backgroundImage: `url(assets/61804.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <PersistentDrawerLeft />
    </Box>
  );
}