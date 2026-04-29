const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Parse JSON
app.use(express.json());

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/books', bookRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
