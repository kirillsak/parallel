import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function TopBar() {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 0.25 }}
                >
                    <MenuIcon />
                </IconButton>
                <img src="https://placeholderlogo.com/img/placeholder-logo-1.png" alt="logo" className='parallel-logo-topbar' />
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Account Dashboard
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar >
    );
}