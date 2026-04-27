// script.js

const showSignupLink = document.getElementById("showSignup");
const showLoginLink = document.getElementById("showLogin");

if (showSignupLink) {
  showSignupLink.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("loginForm").hidden = true;
    document.getElementById("signupForm").hidden = false;
  });
}

if (showLoginLink) {
  showLoginLink.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("signupForm").hidden = true;
    document.getElementById("loginForm").hidden = false;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const bookList = document.getElementById("bookList");
  const addBookButton = document.getElementById("addBookButton");

  if (addBookButton) {
    addBookButton.addEventListener("click", createBook);
  }

  if (bookList) {
    bookList.addEventListener("click", (event) => {
      if (event.target.matches("[data-delete-id]")) {
        deleteBook(event.target.dataset.deleteId);
      }
    });

    getBooks();
  }
});

function createBook() {
  const book = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    publishedYear: Number(document.getElementById("year").value),
    isRead: document.getElementById("isRead").checked
  };

  fetch('/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(error => Promise.reject(error));
    }

    return res.json();
  })
  .then(data => {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("year").value = "";
    document.getElementById("isRead").checked = false;
    getBooks();
  })
  .catch(error => {
    alert(error.message || "Unable to create book");
  });
}


function getBooks() {
  fetch('/books')
    .then(res => res.json())
    .then(data => {
      console.log("Books:", data); // DEBUG

      const list = document.getElementById("bookList");
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = `
          <div class="empty-state">
            <p>No books yet. Add your first title and build your shelf.</p>
          </div>
        `;
        return;
      }

      data.forEach(book => {
        const item = document.createElement("div");
        item.className = "book-card";

        item.innerHTML = `
          <div>
            <h3>${book.title}</h3>
            <p class="book-meta">by ${book.author}</p>
            <p class="book-meta">Published ${book.publishedYear}</p>
            <span class="book-status ${book.isRead ? "read" : "unread"}">
              ${book.isRead ? "Read" : "Not Read Yet"}
            </span>
          </div>
          <button class="button button-danger" type="button" data-delete-id="${book.id}">Delete</button>
        `;

        list.appendChild(item);
      });
    });
}


function deleteBook(id) {
  fetch(`/books/${id}`, {
    method: 'DELETE'
  })
  .then(() => {
    getBooks(); // refresh list
  });
}
