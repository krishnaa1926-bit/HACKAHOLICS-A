const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/internships', (req, res) => {
  const results = [];
  fs.createReadStream('internship.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Failed to read CSV file' });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
