import React from 'react';
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Container, Button } from '@mui/material';

const Landing = () => {
    const navigate = useNavigate();

    const pages = ['Review', 'Search', 'MyPage'];

    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: 'blue' }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ padding: '40px'}}>
                        <Button
                            color="inherit"
                            sx={{
                                flexGrow: 1,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                mr: 2
                            }}
                            onClick={() => navigate('/')}
                        >
                            Home
                        </Button>
                        {pages.map((page) => (
                            <Typography
                                component={Link}
                                to={page === 'Home' ? '/' : `/${page.toLowerCase()}`}
                                variant="button"
                                color="white"
                                sx={{
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    mr: 2
                                }}
                                onClick={() => navigate(`/${page.toLowerCase()}`)}
                            >
                                {page}
                            </Typography>
                        ))}
                    </Toolbar>
                </Container>
            </AppBar>

            <Typography variant="h3" color="inherit" noWrap>
                Welcome to MovReview's Home Landing page!
            </Typography>
        </div>
    )
}

export default Landing;
