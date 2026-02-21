const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

const PORT = process.env.PORT || 5000;

/**
 * 1. Initial Authorization Route
 * Redirects the user to GitHub's OAuth login page.
 * Scope 'repo' allows us to see repository data, 'user' gives basic profile info.
 */
app.get('/login/github', (req, res) => {
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`;
    res.redirect(url);
});

/**
 * 2. GitHub Callback Route
 * GitHub redirects back here with a temporary 'code'.
 * We exchange this code for a permanent 'access_token'.
 */
app.get('/auth/github/callback', async (req, res) => {
    const code = req.query.code; // Temporary code from GitHub
    
    try {
        // Exchange code for Access Token
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code
        }, {
            headers: { accept: 'application/json' }
        });

        const accessToken = response.data.access_token;

        // Redirect user back to the React Frontend (port 3000) with the token in the URL
        res.redirect(`http://localhost:3000?token=${accessToken}`);
    } catch (error) {
        console.error("Auth Error:", error.message);
        res.status(500).send('Server Error during GitHub Authentication');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});