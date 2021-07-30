'use strict';

const KEY = 'bookDB';
const PAGE_SIZE = 5;
const BOOK_IMG_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Book.svg/896px-Book.svg.png'
var gBooks;
var gPageIdx = 0;
var gCurrBookId = 0;
var gSortBy = 'nameUp';

_createBooks();
_saveLastBookId();

function getBooksForDisplay() {
    var books = gBooks;
    if (gSortBy === 'nameUp') {
        books.sort(function(book1, book2) {
            if (book1.name.toLowerCase() > book2.name.toLowerCase()) return 1;
            if (book1.name.toLowerCase() < book2.name.toLowerCase()) return -1;
            return 0;
        });
    } else if (gSortBy === 'nameDown') {
        books.sort(function(book1, book2) {
            if (book1.name.toLowerCase() > book2.name.toLowerCase()) return -1;
            if (book1.name.toLowerCase() < book2.name.toLowerCase()) return 1;
            return 0;
        });
    } else if (gSortBy === 'priceUp') {
        books.sort(function(book1, book2) {
            if (+book1.price > +book2.price) return 1;
            if (+book1.price < +book2.price) return -1;
            return 0;
        });
    } else if (gSortBy === 'priceDown') {
        books.sort(function(book1, book2) {
            if (+book1.price > +book2.price) return -1;
            if (+book1.price < +book2.price) return 1;
            return 0;
        });
    } else if (gSortBy === 'id') {
        books.sort(function(book1, book2) {
            if (+book1.id > +book2.id) return -1;
            if (+book1.id < +book2.id) return 1;
            return 0;
        });
    }
    var startIdx = gPageIdx * PAGE_SIZE;
    return books.slice(startIdx, startIdx + PAGE_SIZE);
}

function getBook(bookId) {
    var bookIdx = gBooks.findIndex(function(book) {
        return bookId === book.id;
    });
    return gBooks[bookIdx];
}

function _createBooks() {
    var books = loadFromStorage(KEY)
    if (!books || !books.length) {
        books = []

        books.push(_createBook('Full Stack React', '99', `https://books.google.co.il/books/content?id=ppjUtAEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72M_Pwq_ex14dgjJvaOQ3GBXa9Ke_q39Ea6f24lF4xOPNqUHyRIeHvHBUAGS8-rftoBv86FPIcsAGRs6Aatskz7fJx3pKhxBV4lLblwqZiZXHP9XV1yOdQptAp82Vhz-P-n70PD`));
        books.push(_createBook('Full Stack MVC', '102', `https://books.google.co.il/books/publisher/content?id=Es9TDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE72O9P3X5Mt4n6IWYuhmcxXEL0vMgPC-zP2APrGasu-aPEeV89jm9-YGvtvZqf5aO9xD31_Co0bsjKR7bq8VYAx57Jz5A1wXOkpLTy-DZZtjrvtW-_fzHh-1zBUKZZ0fhyT7vKqx`));
        books.push(_createBook('Full Stack Vue', '87', `https://books.google.co.il/books/content?id=G9s2tgEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73R3PNspJSr7fs-afgRMEUQ0EucvqWNS2HTuAwUaBRAn6f-DOnnI69OkansWEf_mlMZ1ZDPhrprWzH9wZzbaLCK08DKI2O62N0FhheHaNynS84cOf2ktsCiih14tiS4yS9aHwOE`));
        books.push(_createBook('Full Stack GraphQL', '97', `https://books.google.co.il/books/content?id=DbsKzgEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE71fXnkFdTvOtT0XiRyB5p-BPMZExSjlucXyf_RDn3kh6h8vsA2lHzIbkP7UjZNdYnalV7-mCU7sP3ev5n3NTAmP7WS59hdTX-ndsVU3G8yC-S5eHfat9w2bbA1Lqml1HTfYxtYU`));
        books.push(_createBook('Full Stack JavaScript', '113', `https://books.google.co.il/books/publisher/content?id=-6xPCwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE70Xu7t-O8-FtQ79_soilPoPCcKzOHFk5ii4g3rrXXKu_vONpFOYViigUZi5acAl_KgdtlSqaYk7dQmNgleewtqaFEHlQ-OCsCsutv8_wver9urDzLAaESTOM9i5drdSVs5uTwWd`));
        books.push(_createBook('Modern Full Stack', '109', `https://books.google.co.il/books/publisher/content?id=XLfZDwAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE70_n0yxi_6xrdfR514lO7cyyZluV4cuoNt1m5bY4OpM2cLrfi8-nPwBWMJq79Roif8m_DyXHmxHAQSJwj_Z6DOh2GE8m45UKW32PYR6XVVlWahjSdxiMuE02RB7L0WzGa4uqam7`));

    }
    gBooks = books;
    _saveBooksToStorage();
}

function _createBook(name, price, imgUrl) {
    return {
        id: ++gCurrBookId,
        name,
        price,
        rate: 0,
        imgUrl,
    };
}

function _saveBooksToStorage() {
    saveToStorage(KEY, gBooks);
}

function _saveLastBookId() {
    gCurrBookId = Math.max(...gBooks.map(function(book) {
        return book.id;
    }));
}

function nextPage() {
    gPageIdx++;
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0;
    }
}

function prevPage() {
    gPageIdx--;
    if (gPageIdx < 0) {
        var pageIdx = Math.ceil(gBooks.length / PAGE_SIZE) - 1;
        if (pageIdx < 0) gPageIdx = 0;
        else gPageIdx = Math.ceil(gBooks.length / PAGE_SIZE) - 1;
    }
}

function getCurrPageIdx() {
    return gPageIdx;
}

function getLastPageIdx() {
    var pageIdx = Math.ceil(gBooks.length / PAGE_SIZE) - 1;
    if (pageIdx < 0) return 0;
    return pageIdx;
}

function removeBook(bookId) {
    var bookIdx = gBooks.findIndex(function(book) {
        return bookId === book.id;
    });
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage();
}

function initPageIdx() {
    gPageIdx = 0;
}

function addBook() {
    var book = _createBook('New book', '0', BOOK_IMG_URL);
    gBooks.unshift(book);
    _saveBooksToStorage();
}


function updateBook(bookId, bookName, bookPrice) {
    var bookIdx = gBooks.findIndex(function(book) {
        return bookId === book.id
    });
    gBooks[bookIdx].name = bookName;
    gBooks[bookIdx].price = bookPrice;
    _saveBooksToStorage();
}

function getCurrBookId() {
    return gCurrBookId;
}

function rateUp(bookId) {
    var bookIdx = gBooks.findIndex(function(book) {
        return bookId === book.id;
    });
    if (gBooks[bookIdx].rate === 10) return;
    gBooks[bookIdx].rate++;
    _saveBooksToStorage();
}

function rateDown(bookId) {
    var bookIdx = gBooks.findIndex(function(book) {
        return bookId === book.id;
    });
    if (gBooks[bookIdx].rate === 0) return;
    gBooks[bookIdx].rate--;
    _saveBooksToStorage();
}

function setSortBy(sortBy) {
    if (sortBy === 'name') {
        if (gSortBy === 'nameUp') gSortBy = 'nameDown';
        else gSortBy = 'nameUp';
        return;
    }

    if (sortBy === 'price') {
        if (gSortBy === 'priceUp') gSortBy = 'priceDown';
        else gSortBy = 'priceUp';
        return;
    }

    if (sortBy === 'id') gSortBy = 'id';
}