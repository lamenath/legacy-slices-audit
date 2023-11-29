const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Endpoint to handle the initial form submission and retrieve custom types
app.post('/getCustomTypes', async (req, res) => {
    const { repositoryId, bearerToken } = req.body;
    try {
        const response = await axios.get('https://customtypes.prismic.io/customtypes', {
            headers: {
                'repository': repositoryId,
                'Authorization': `Bearer ${bearerToken}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching custom types');
    }
});

app.listen(port, () => {
    console.log(`🟢 ${port}`);
});
