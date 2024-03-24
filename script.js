document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded');
    
    const addBookForm = document.querySelector('.bookinventory__addBook');
    console.log('addBookForm:', addBookForm);
    
    const booksContainer = document.querySelector('.bookinventory__booklist');
    console.log('booksContainer:', booksContainer);
    
    const template = document.getElementById("template");
    console.log('template:', template);
    
    const aside = document.querySelector(".bookinventory__sidebar");
    console.log('aside:', aside);
    
    const errorMessage = createMessageElement("Missing Required Book Information. Please fill out all fields", "form__incomplete");
    const completionMessage = createMessageElement("Book Added", "form__complete");
    const removeMessage = createMessageElement("Book Removed", "remove");

    addBookForm.addEventListener("submit", function(event) {
        console.log('Add Book Form Submitted');
        
        event.preventDefault();
        const title = document.getElementById("book-title").value;
        const author = document.getElementById("book-author").value;
        const image = document.getElementById("book-url").value;
        const price = document.getElementById("book-price").value;
        const stock = document.getElementById("stock-dropdown").value;

        if (!title || !author || !image || !price || !stock) {
            console.log('Error: Missing Required Book Information');
            handleFormMessage(errorMessage, completionMessage);
            return;
        }

        console.log('New Book Added:', title, author, image, price, stock);
        
        const bookObj = {
            title: title,
            author: author,
            image: image,
            price: `$${price}`,
            stockValue: stock,
            inStock: stock === "instock"
        };

        const bookElement = generateBookElement(bookObj);
        booksContainer.appendChild(bookElement);
        handleFormMessage(completionMessage, errorMessage);
        displayTemplate();
        addBookForm.reset();
    });

    function handleFormMessage(showMessage, hideMessage) {
        console.log('Handling Form Message');
        
        aside.innerHTML = "";
        aside.appendChild(showMessage);
        hideMessage.remove();
    }

    function createMessageElement(text, className) {
        console.log('Creating Message Element:', text, className);
        
        const messageElement = document.createElement("p");
        messageElement.textContent = text;
        messageElement.classList.add(className);
        return messageElement;
    }

    function displayTemplate() {
        const bookList = booksContainer.querySelectorAll(".books__book");
        if (bookList.length === 0) {
            booksContainer.innerHTML = "";
            if (template) {
                const templateClone = template.content.cloneNode(true);
                booksContainer.appendChild(templateClone);
            }
            booksContainer.style.display = "none"; 
        } else {
            if (template) {
                template.remove();
            }
            booksContainer.style.display = "grid"; 
        }
    }
    

    function generateBookElement(bookObj) {
        const bookElement = document.createElement("li");
        bookElement.classList.add("books__book");
        const bookInfo = document.createElement("div");
        bookInfo.classList.add("books__book-info");
        const img = document.createElement("img");
        img.src = bookObj.image;
        img.classList.add("bookinventory__booklist__image");
        const title = createElementWithText("p", bookObj.title, "bookinventory__booklist__title");
        const author = createElementWithText("p", bookObj.author, "bookinventory__booklist__author");
        const stock = createElementWithText("div", bookObj.stockValue, bookObj.inStock ? "bookinventory__booklist__stock stocked" : "bookinventory__booklist__stock notStocked");
        const price = createElementWithText("p", bookObj.price, "bookinventory__booklist__price");
        const trash = createTrashIcon();
    
        appendChildren(bookInfo, [title, author, stock, price]);
        appendChildren(bookElement, [img, bookInfo, trash]);
    
       
        const templateBooks = booksContainer.querySelectorAll(".template-book");
        templateBooks.forEach(templateBook => {
            templateBook.style.display = "none";
        });
    
        
        booksContainer.insertBefore(bookElement, booksContainer.firstChild);
    
        return bookElement;
    }
    
    
    
    

    function createElementWithText(elementType, text, classNames) {
        const element = document.createElement(elementType);
        element.textContent = text;
        if (classNames) {
            classNames.split(' ').forEach(className => {
                element.classList.add(className);
            });
        }
        return element;
    }
    

    function createTrashIcon() {
        console.log('Creating Trash Icon');
        
        const trash = document.createElement("button");
        trash.classList.add("bookinventory__booklist__garbage");
        trash.innerHTML = "🗑️";
        trash.addEventListener("click", function() {
            console.log('Trash Icon Clicked');
            
            const bookToRemove = trash.closest("li.books__book");
            bookToRemove.remove();
            aside.appendChild(removeMessage);
            displayTemplate();
        });
        return trash;
    }

    function appendChildren(parent, children) {
        console.log('Appending Children to Parent:', parent, children);
        
        for (let child of children) {
            parent.appendChild(child);
        }
    }
});
