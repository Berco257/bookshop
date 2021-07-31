'use strict';

var gIsBookOnUpdate = false;
var gMsgInterval = 0;

function onInit() {
    renderBooks();
    renderPageNumber();
}

function renderBooks() {
    var books = getBooksForDisplay();
    var strHtmls = books.map(function(book) {
        return `<tr class="book-row">
        <td>${book.id}</td>
        <td><input type="text" value="${book.name}" name="name-${book.id}"
         disabled class="book-disabled"></td>
        <td><input type="text" value="${book.price}" name="price-${book.id}"
         disabled class="book-disabled"></td>
        <td class="actions">
        <button onclick="onReadBook(${book.id})">Read</button>
        <button onclick="onUpdateBook(${book.id})">Update</button>
        <button onclick="onRemoveBook(${book.id})">Delete</button>
        </td></tr>`
    })

    strHtmls.unshift(`
        <table>
        <tbody>
        <tr class="msgs"><td colspan="4"><span>Msgs: </span></td></tr>
        <tr class="titles-row">
        <th>Id</th>
        <th name="title" onclick="onSetSortBy('name')">Title <span>↕</span></th>
        <th name="price" onclick="onSetSortBy('price')">Price <span>↕</span></th>
        <th>Actions</th>
        </tr>`);
    strHtmls.push(`</tbody></table>`);
    document.querySelector('.books-container').innerHTML = strHtmls.join('')
}

function renderPageNumber() {
    var elPageNumber = document.querySelector('.page-number span');
    var currPageIdx = getCurrPageIdx();
    var lastPageIdx = getLastPageIdx();
    elPageNumber.innerText = `${currPageIdx + 1}/${lastPageIdx + 1}`
}

function renderModal(bookId) {
    var elModal = document.querySelector('.modal-container');
    elModal.hidden = false;

    var book = getBook(bookId);
    var elH2 = document.querySelector('.modal h2');
    elH2.innerText = book.name;
    var elH3 = document.querySelector('.modal h3');
    elH3.innerText = `Price: ${book.price}`;
    var elDiv = document.querySelector('.modal div');
    elDiv.innerHTML = `<img src="${book.imgUrl}">`;
    var elRate = document.querySelector('.modal .rate');
    elRate.innerHTML = `Rating: <span class="rate-box">
    <span class="rate-minus" onclick="onRateDown(${book.id})">➖</span> ${book.rate}
    <span class="rate-plus" onclick="onRateUp(${book.id})">➕</span></span>`;
}

function onNextPage() {
    if (checkBookOnUpdate()) return;

    nextPage();
    renderBooks();
    renderPageNumber();
}

function onPrevPage() {
    if (checkBookOnUpdate()) return;

    prevPage();
    renderPageNumber();
    renderBooks();
}

function onAddBook() {
    if (checkBookOnUpdate()) return;

    addBook();
    initPageIdx();
    renderPageNumber();
    onSetSortBy('id')
    onUpdateBook(getCurrBookId());
    writeMsg('A new book has been added 📓');
}

function onRemoveBook(bookId) {
    if (checkBookOnUpdate()) return;

    removeBook(bookId);
    renderBooks();
    renderPageNumber();
    writeMsg('The book has been deleted 📕');
}

function onUpdateBook(bookId) {
    var elBookName = document.querySelector(`[name=name-${bookId}]`);
    var elBookPrice = document.querySelector(`[name=price-${bookId}]`);

    if (elBookName.disabled) {
        if (checkBookOnUpdate()) return;

        elBookName.disabled = false;
        elBookPrice.disabled = false;
        elBookName.classList.remove('book-disabled')
        elBookPrice.classList.remove('book-disabled')
        elBookName.classList.add('book-enabled')
        elBookPrice.classList.add('book-enabled')
        elBookName.focus();
        gIsBookOnUpdate = true;
        writeMsg('Update the details and click the update button 📘');
        return;
    }

    elBookName.classList.add('book-disabled')
    elBookPrice.classList.add('book-disabled')
    elBookName.classList.remove('book-enabled')
    elBookPrice.classList.remove('book-enabled')

    elBookName.disabled = true;
    elBookPrice.disabled = true;
    updateBook(bookId, elBookName.value, elBookPrice.value);
    renderBooks();
    gIsBookOnUpdate = false;
    writeMsg('The book has been successfully updated 📗');

}

function onReadBook(bookId) {
    if (checkBookOnUpdate()) return;
    renderModal(bookId);
}

function writeMsg(msg) {
    clearInterval(gMsgInterval);
    var elMsg = document.querySelector('.msgs span');
    elMsg.innerText = `Msgs: ${msg}`;
    gMsgInterval = setTimeout(function() {
        elMsg.innerText = 'Msgs: '
    }, 4000);
}

function onCloseModal() {
    var elModal = document.querySelector('.modal-container');
    elModal.hidden = true;
}

function checkBookOnUpdate() {
    if (gIsBookOnUpdate) {
        writeMsg('Please finish updating the book first 🛑');
        return true;
    }
    return false;
}

function onRateUp(bookId) {
    rateUp(bookId);
    renderModal(bookId);
}

function onRateDown(bookId) {
    rateDown(bookId);
    renderModal(bookId);
}

function onSetSortBy(sortBy) {
    if (checkBookOnUpdate()) return;
    setSortBy(sortBy);
    renderBooks();
}