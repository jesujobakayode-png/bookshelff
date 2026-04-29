let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isRead: true,
    publishedYear: 1925
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    isRead: false,
    publishedYear: 2018
  },
  {
    id: 3,
    title: "Things Fall Apart",
    author: "Chinua Achebe",
    isRead: true,
    publishedYear: 1958
  }
];

let nextId = 4;

const isFutureYear = (year) => {
  const currentYear = new Date().getFullYear();
  return year > currentYear;
};

const getBooks = (req, res) => {
  const { read } = req.query;

  if (read === "true") {
    return res.json(books.filter((book) => book.isRead === true));
  }

  if (read === "false") {
    return res.json(books.filter((book) => book.isRead === false));
  }

  res.json(books);
};

const getBookById = (req, res) => {
  const book = books.find((item) => item.id == req.params.id);

  if (!book) {
    return res.status(404).send("Book not found");
  }

  res.json(book);
};

const createBook = (req, res) => {
  if (isFutureYear(req.body.publishedYear)) {
    return res.status(400).json({ message: "Year cannot be in the future" });
  }

  const newBook = {
    id: nextId++,
    title: req.body.title,
    author: req.body.author,
    isRead: req.body.isRead,
    publishedYear: req.body.publishedYear
  };

  books.push(newBook);
  res.status(201).json(newBook);
};

const updateBook = (req, res) => {
  if (isFutureYear(req.body.publishedYear)) {
    return res.status(400).json({ message: "Year cannot be in the future" });
  }

  const book = books.find((item) => item.id == req.params.id);

  if (!book) {
    return res.status(404).send("Book not found");
  }

  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;
  book.isRead = req.body.isRead ?? book.isRead;
  book.publishedYear = req.body.publishedYear || book.publishedYear;

  res.json(book);
};

const deleteBook = (req, res) => {
  books = books.filter((book) => book.id != req.params.id);
  res.send("Book deleted");
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
