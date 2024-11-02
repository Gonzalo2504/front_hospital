import ButtonAppBar from '../components/nav'
import { Box } from '@mui/material'

function Home() {

  return (
    <Box sx={{ backgroundImage: `url(assets/61804.jpg)`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}>
      <ButtonAppBar />
    </Box>
  )
}

export default Home;
