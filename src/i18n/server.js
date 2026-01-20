const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// A simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Placeholder for future API routes
app.get('/api/tools', (req, res) => {
    // In a real application, this would fetch data from the PostgreSQL database
    res.json([
        { id: 'ai-assistant', name: 'AI Assistant' },
        { id: 'searxng', name: 'SearXNG' }
    ]);
});


app.listen(port, () => {
  console.log(`YemenJPT backend listening at http://localhost:${port}`);
});
