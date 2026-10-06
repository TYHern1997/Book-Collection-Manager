//for loading
const savedBooks = localStorage.getItem('books');
const books = savedBooks
  ? JSON.parse(savedBooks)
  : [
    { title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
    { title: 'Black Beauty', author: 'Anna Sewell', year: 1877 },
    { title: 'The Time Machine', author: 'H. G. Wells', year: 1895 },
  ];

//for saving
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

const container = document.getElementById('book-list');

let editingIndex = null;

const searchInput = document.getElementById('search-input');

function renderBooks(list = books) {
  container.innerHTML = '';

  list.forEach((book, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.year}</td>
      <td><button class="delete-btn">Delete</button>
      <button class="edit-btn">Edit</button>
      </td>
    `;

    container.appendChild(row);

    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      const realIndex = books.indexOf(book);
      books.splice(realIndex, 1);
      saveBooks();
      renderBooks();
    });

    const editBtn = row.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      titleInput.value = book.title;
      authorInput.value = book.author;
      yearInput.value = book.year;
      editingIndex = books.indexOf(book);
    });
  });
}

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  });
  renderBooks(filtered);
});

// Step 2: grab the new input elements and button
const titleInput = document.getElementById('title-input');
const authorInput = document.getElementById('author-input');
const yearInput = document.getElementById('year-input');
const addButton = document.getElementById('add-book');

// Step 3: write a named handler function for the click
function handleAddBook() {
  const newBook = {
    title: titleInput.value,
    author: authorInput.value,
    year: Number(yearInput.value),
  };

  if (editingIndex !== null) {
    // we're editing an existing book — replace it in place
    books[editingIndex] = newBook;
    editingIndex = null; // reset back to "not editing"
  } else {
    // normal add
    books.push(newBook);
  }

  saveBooks(); // add the new book to the array
  renderBooks(); // re-render the list with the new book included

  // clear the inputs after adding
  titleInput.value = '';
  authorInput.value = '';
  yearInput.value = '';
}

// Step 4: attach the handler to the button's click event
addButton.addEventListener('click', handleAddBook);

// Step 5: render the initial list on page load
renderBooks();
