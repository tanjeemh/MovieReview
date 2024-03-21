import mysql from 'mysql';
import config from './config.js';
import fetch from 'node-fetch';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import response from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, "client/build")));
// API to get all reviews submitted by a specific user
app.post('/api/getUserReviews', (req, res) => {
    const { userID } = req.body;

    let connection = mysql.createConnection(config);

    const sql = `
        SELECT reviewID , reviewTitle, reviewContent, reviewScore, movieID, userID FROM Review
    `;

    connection.query(sql, [userID], (error, results, fields) => {
        if (error) {
            console.error("Error fetching user reviews:", error.message);
            return res.status(500).json({ error: "Error fetching user reviews from the database" });
        }

        return res.status(200).json({ reviews: results });
    });
    connection.end();
});


// API to read movies from the database
app.post('/api/getMovies', (req, res) => {
	let connection = mysql.createConnection(config);

	const sql = `SELECT id, name, year, quality FROM movies`;

	connection.query(sql, (error, results, fields) => {
		if (error) {
			return console.error(error.message);
		}
		let string = JSON.stringify(results);
		res.send({ express: string });
	});
	connection.end();
});

// API to add a review to the database
app.post('/api/addReview', (req, res) => {
	const { userID, movieID, reviewTitle, reviewContent, reviewScore } = req.body;

	let connection = mysql.createConnection(config);

	const sql = `INSERT INTO Review (userID, movieID, reviewTitle, reviewContent, reviewScore) 
				 VALUES (?, ?, ?, ?, ?)`;

	const data = [userID, movieID, reviewTitle, reviewContent, reviewScore];

	connection.query(sql, data, (error, results, fields) => {
		if (error) {
			console.error("Error adding review:", error.message);
			return res.status(500).json({ error: "Error adding review to the database" });
		}

		return res.status(200).json({ success: true });
	});
	connection.end();
});

// API to search movies by title, actor, and director
app.post('/api/searchMovies', async (req, res) => {
    const { movieTitle, actorName, directorName } = req.body;

    let connection = mysql.createConnection(config);

    const sqlQuery = `
        SELECT 
            m.id,
            m.name,
            m.year,
            m.quality,
            d.first_name AS director_first_name,
            d.last_name AS director_last_name,
            r.reviewID,
            r.reviewContent,
            r.reviewScore,
            AVG(r.reviewScore) AS averageReviewScore
        FROM movies AS m
        LEFT JOIN movies_directors AS md ON m.id = md.movie_id
        LEFT JOIN directors AS d ON md.director_id = d.id
        LEFT JOIN Review AS r ON m.id = r.movieID
        WHERE
            ${movieTitle ? 'm.name LIKE ?' : '1=1'}
            ${actorName ? 'AND CONCAT(a.first_name, " ", a.last_name) LIKE ?' : ''}
            ${directorName ? 'AND CONCAT(d.first_name, " ", d.last_name) LIKE ?' : ''}
        GROUP BY m.id
    `;

    const params = [];

    if (movieTitle) {
        params.push(`%${movieTitle}%`);
    }

    if (actorName) {
        params.push(`%${actorName}%`);
    }

    if (directorName) {
        params.push(`%${directorName}%`);
    }

    connection.query(sqlQuery, params, (error, results, fields) => {
        if (error) {
            console.error("Error executing MySQL query:", error.message);
            return res.status(500).json({ error: 'Error retrieving movie data' });
        }

        // Group reviews by movie ID
        const movies = results.reduce((acc, movie) => {
            const { reviewID, reviewContent, reviewScore } = movie;
            if (!acc[movie.id]) {
                acc[movie.id] = {
                    ...movie,
                    reviews: reviewID ? [{ reviewID, reviewContent, reviewScore }] : []
                };
            } else if (reviewID) {
                acc[movie.id].reviews.push({ reviewID, reviewContent, reviewScore });
            }
            return acc;
        }, {});

        // Convert movies object to an array
        const movieList = Object.values(movies);

        // Send the retrieved movie data as the response
        return res.json({ movies: movieList });
    });

    connection.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
