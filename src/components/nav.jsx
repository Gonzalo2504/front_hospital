import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FixedContainer from './login';

export default function ButtonAppBar() {
  const [showLogin, setShowLogin] = React.useState(false);

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#405D72' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Guardia
          </Typography>
          <Button color="black" onClick={handleLoginClick}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      {showLogin && <FixedContainer showLogin={showLogin} setShowLogin={setShowLogin} />}
    </Box>
  );
}
