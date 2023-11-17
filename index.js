// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        Store.getBooks()
            .then(data => {
                data.forEach((book) => UI.addBookToList(book));
            });
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete" data-isbn="${book.isbn}">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static async getBooks() {
        try {
            const response = await fetch('get_books.php');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching books:', error);
            return [];
        }
    }

    static async addBook(book) {
        try {
            const response = await fetch('add_book.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            });

            const data = await response.json();
            console.log('Book added successfully:', data);
        } catch (error) {
            console.error('Error adding book:', error);
        }
    }

    static async removeBook(isbn) {
        try {
            const response = await fetch('remove_book.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isbn }),
            });

            const data = await response.json();
            console.log('Book removed successfully:', data);
        } catch (error) {
            console.error('Error removing book:', error);
        }
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', async (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        // Instantiate book
        const book = new Book(title, author, isbn);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to store
        await Store.addBook(book);

        // Show success message
        UI.showAlert('Book Added', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', async (e) => {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from store
    await Store.removeBook(e.target.dataset.isbn);

    // Show success message
    UI.showAlert('Book Removed', 'success');
});
