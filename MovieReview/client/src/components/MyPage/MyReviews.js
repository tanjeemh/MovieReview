import React, { useState } from 'react';
import Typography from "@mui/material/Typography";
import { AppBar, Toolbar, Container } from '@mui/material';

const MyReviews = () => {
    const userID = 1; 

    const [userReviews, setUserReviews] = useState([]);

    const getUserReviews = async () => {
        try {
            const response = await fetch('/api/getUserReviews', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userID }),
            });

            if (response.status !== 200) {
                console.error("Error fetching user reviews:", response.status);
                return;
            }

            const { reviews } = await response.json();
            setUserReviews(reviews);
        } catch (error) {
            console.error("Error fetching user reviews:", error.message);
        }
    };

    React.useEffect(() => {
        getUserReviews();
    }, []); 

    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: 'blue' }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ padding: '40px'}}>
                    </Toolbar>
                </Container>
            </AppBar>

            <Typography variant="h3" color="inherit" noWrap>
                My Reviews
            </Typography>

            <div>
                {userReviews.map((review) => (
                    <div key={review.reviewID}>
                        <Typography variant="h5" color="inherit" noWrap>
                            Movie: {review.movieName}
                        </Typography>
                        <Typography variant="subtitle1" color="inherit" noWrap>
                            Review Title: {review.reviewTitle}
                        </Typography>
                        <Typography variant="subtitle1" color="inherit" noWrap>
                            Review Content: {review.reviewContent}
                        </Typography>
                        <Typography variant="subtitle1" color="inherit" noWrap>
                            Rating: {review.reviewScore}
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyReviews;
