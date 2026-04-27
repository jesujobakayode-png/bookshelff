const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

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

let books = [
    {"id": 1, "title": "The Great Gatsby","author": "F. Scott Fitzgerald","isRead": true,"publishedYear": 1925},
    {"id": 2, "title": "Atomic Habits","author": "James Clear","isRead": false,"publishedYear": 2018},
    {"id": 3, "title": "Things Fall Apart","author": "Chinua Achebe","isRead": true,"publishedYear": 1958}
];
let id = 4;


const validateYear = (req, res, next) => {
  const currentYear = new Date().getFullYear();

  if (req.body.publishedYear > currentYear) {
    return res.status(400).json({ message: "Year cannot be in the future" });
  }

  next();
};


const filterReadBooks = (req, res, next) => {
  const { read } = req.query;

  if (read === "true") {
    req.filteredBooks = books.filter(book => book.isRead === true);
  } else if (read === "false") {
    req.filteredBooks = books.filter(book => book.isRead === false);
  } else {
    req.filteredBooks = books;
  }

  next();
};


app.post('/books', validateYear, (req, res) => {
  const newBook = {
    id: id++,
    title: req.body.title,
    author: req.body.author,
    isRead: req.body.isRead,
    publishedYear: req.body.publishedYear
  };

  books.push(newBook);
  res.status(201).json(newBook);
});


app.get('/books', filterReadBooks, (req, res) => {
  res.json(req.filteredBooks);
});


app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);

  if (!book) return res.status(404).send("Book not found");

  res.json(book);
});


app.put('/books/:id', validateYear, (req, res) => {
  const book = books.find(b => b.id == req.params.id);

  if (!book) return res.status(404).send("Book not found");

  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;
  book.isRead = req.body.isRead ?? book.isRead;
  book.publishedYear = req.body.publishedYear || book.publishedYear;

  res.json(book);
});


app.delete('/books/:id', (req, res) => {
  books = books.filter(b => b.id != req.params.id);
  res.send("Book deleted");
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
