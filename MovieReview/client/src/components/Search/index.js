import React, { useState } from 'react';
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Container, Button, TextField, Grid } from '@mui/material';
import MovieSelection from '../Review/MovieSelection';


const Search = () => {
    const navigate = useNavigate();

    const pages = ['Review', 'Search', 'MyPage'];

    const serverURL = ""

    const [movieTitle, setMovieTitle] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [actorName, setActorName] = useState('');
    const [directorName, setDirectorName] = useState('');
    const [movies, setMovies] = useState([]);
    const [errors, setErrors] = useState({});


    const handleSearch = async () => {
        const searchCriteria = {
            movieTitle,
            actorName,
            directorName
        };

        try {
            const response = await fetch('/api/searchMovies', { // Change the URL to match your server API endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(searchCriteria),
            });

            if (response.status !== 200) {
                console.error("Error fetching movies:", response.status);
                return;
            }

            const { movies } = await response.json();
            setMovies(movies);
        } catch (error) {
            console.error("Error searching movies:", error.message);
        }
    };

    const handleMovieChange = (movie) => {
        setSelectedMovie(movie);
        setErrors((prevErrors) => ({ ...prevErrors, selectedMovie: false }));
        setShowConfirmation(false);
      };

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
                                {page === 'Landing' ? 'Landing' : page}
                            </Typography>
                        ))}
                    </Toolbar>
                </Container>
            </AppBar>

            <Typography variant="h3" color="inherit" noWrap>
                MovReview's Search!
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MovieSelection
                        movies={movies}
                        selectedMovie={selectedMovie}
                        handleMovieChange={handleMovieChange}
                    />
                    {errors.selectedMovie && <Typography color="red">Select your movie</Typography>}
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Search by Actor's Name"
                        fullWidth
                        value={actorName}
                        onChange={(e) => setActorName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Search by Director's Name"
                        fullWidth
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Grid>
            </Grid>

            {/* Display the search results */}
            <div>
                <Typography variant="h4" color="inherit" noWrap>
                    Search Results:
                </Typography>
                {movies.map((movie) => (
                    <div key={movie.id}>
                        <Typography variant="h5" color="inherit" noWrap>
                            Movie Title: {movie.name}
                        </Typography>
                        <Typography variant="subtitle1" color="inherit" noWrap>
                            Director: {movie.director_first_name} {movie.director_last_name}
                        </Typography>
                        <Typography variant="subtitle1" color="inherit" noWrap>
                            Average Review Score: {movie.averageReviewScore}
                        </Typography>
                        {movie.reviews.map((review) => (
                            <Typography key={review.reviewID} variant="body1" color="inherit" noWrap>
                                Review: {review.reviewContent} (Rating: {review.reviewScore})
                            </Typography>
                        ))}
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Search;
