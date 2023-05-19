window.onload = function () {
    let pageName = window.location.pathname.split('/').pop();

    if (pageName === "categories.html") {
        fetchCategories();
    }

    else if (pageName === "products.html") {
        fetchProducts();

        const select = document.getElementById('category');
        fetch('/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(categories => {
                categories.forEach((category) => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.text = category.title;
                    select.appendChild(option);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    else if (pageName === "sales.html") {
        fetchCart();

        const select = document.getElementById('product');
        fetch('/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(products => {
                products.forEach((product) => {
                    const option = document.createElement('option');
                    option.value = product.id;
                    option.text = product.title + " / " + product.price;
                    select.appendChild(option);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
}

function fetchCategories() {
    fetch('/categories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(categories => {
            const categoryTable = document.getElementById('categoryList');
            // clear the table first
            categoryTable.innerHTML = '';
            categories.forEach((category) => {
                const tableRow = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = category.id;
                tableRow.appendChild(idCell);

                const titleCell = document.createElement('td');
                titleCell.textContent = category.title;
                tableRow.appendChild(titleCell);

                const taxCell = document.createElement('td');
                taxCell.textContent = category.tax;
                tableRow.appendChild(taxCell);

                categoryTable.appendChild(tableRow);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function addCategory() {
    let title = document.getElementById('title').value;
    let tax = document.getElementById('tax').value;

    let data = {
        title: title,
        tax: parseFloat(tax)
    };

    fetch('/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            fetchCategories();
            showPopup(`Created category: ID - ${data.id}, Title - ${data.title}, Tax - ${data.tax}`);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    fetchCategories()
}

function fetchProducts() {
    fetch('/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(products => {
            const productsTable = document.getElementById('productsList');
            // clear the table first
            productsTable.innerHTML = '';
            products.forEach((product) => {
                const tableRow = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = product.id;
                tableRow.appendChild(idCell);

                const titleCell = document.createElement('td');
                titleCell.textContent = product.title;
                tableRow.appendChild(titleCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = product.price;
                tableRow.appendChild(priceCell);

                const categoryCell = document.createElement('td');
                categoryCell.textContent = product.category;
                tableRow.appendChild(categoryCell);

                const taxCell = document.createElement('td');
                taxCell.textContent = product.tax;
                tableRow.appendChild(taxCell);

                productsTable.appendChild(tableRow);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function fetchProduct($itemId) {
    return {
        id: $itemId,
        name: 'Item ' + $itemId,
        price: Math.random() * 100,
        category: 'Category ' + $itemId,
        taxPercentage: Math.random() * 10
    };
}

function addProduct() {
    let title = document.getElementById('title').value;
    let price = document.getElementById('price').value;
    let category = document.getElementById('category').value;

    let data = {
        title: title,
        price: parseFloat(price),
        category: parseInt(category)
    };

    fetch('/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            fetchCategories();
            showPopup(`Created category: ID - ${data.id}, Title - ${data.title}, Price - ${data.price}, Category ID - ${data.category}`);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    fetchProducts()
}

function fetchCart() {
    let bruteCartItems = localStorage.getItem('cartItems');

    if (bruteCartItems) {
        let cartItems = JSON.parse(bruteCartItems);
        let cartList = document.getElementById('cartList');
        cartList.innerHTML = '';

        let $totalPrice = 0.0
        let $totalTax = 0.0
        // Iterate through cart items and populate the table
        cartItems.forEach((itemId) => {
            let item = fetchProduct(itemId);

            // Create a new row
            let row = document.createElement('tr');

            // Add the item details to the row
            let nameCell = document.createElement('td');
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            let priceCell = document.createElement('td');
            priceCell.textContent = item.price.toFixed(2).toString();
            row.appendChild(priceCell);

            let categoryCell = document.createElement('td');
            categoryCell.textContent = item.category;
            row.appendChild(categoryCell);

            let taxPercentageCell = document.createElement('td');
            taxPercentageCell.textContent = item.taxPercentage.toFixed(2).toString();
            row.appendChild(taxPercentageCell);

            let taxAmountCell = document.createElement('td');
            let taxAmount = (item.price * item.taxPercentage) / 100;
            taxAmountCell.textContent = taxAmount.toFixed(2);
            row.appendChild(taxAmountCell);

            $totalPrice += item.price;
            $totalTax += taxAmount;
            // Append the row to the table body
            cartList.appendChild(row);
        });

        let totalPrice = document.getElementById('totalPrice');
        totalPrice.innerHTML = 'Total: ' + $totalPrice.toFixed(2);

        let totalTax = document.getElementById('totalTax');
        totalTax.innerHTML = 'Total de tributos: ' + $totalTax.toFixed(2);
    }
}

function addToCart() {
    let productSelect = document.getElementById('product');
    let selectedProductId = productSelect.value;

    let bruteCartItems = localStorage.getItem('cartItems');

    if (bruteCartItems) {
        let cartItems = JSON.parse(bruteCartItems);

        // Add the selected product ID to the cart
        cartItems.push(selectedProductId);

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
        let cartItems = [selectedProductId];
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    fetchCart()
}

// Function to send the cart data
function sendCart() {
    let bruteCartItems = localStorage.getItem('cartItems');

    if (bruteCartItems) {
        let cartItems = JSON.parse(bruteCartItems);

        console.log(cartItems);
    }
}

function showPopup(message) {
    let popup = document.getElementById('popup');
    popup.textContent = message;
    popup.classList.remove('hidden');
    popup.classList.add('popup');

    setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('popup');
    }, 3000);
}
