

// ANCHOR General

const click = new Event("click")

// ANCHOR HTML BUILDING BLOCS

function buildCategoryFilter(categories) {
    let html = ""
    categories.forEach(category => {
        html += `<button class="submenu_button" onclick="getProductsByCategory('${category}')">${category}</button>`
    }) 
    return html
}
function buildCategoryOptions(categories) {
    let select = document.getElementById("category")
    categories.forEach(category => {
        select.options.add(new Option(category, category))
    })

}

function displayProductBO(product) {




    let html = `
    <div class="product_promo">
        <div class="product">`
        if(product.image) {
            html += `<img class="product_image" src="${product.image}">`
        } else {
            html += `<img class="product_image" src="https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg">`
        }
        html += `<div class="product_info_actions">
                <div class="product_info">
                    <h3 class="product_title">${product.title}</h3>
                    <p class="product_description">${product.description}</p>
                    <div class="product_prices">`
    if(product.promotion === null) {
        html += `<p class="product_price">${product.price} €</p>`
    } else {
        let startDatePromo = new Date(product.promotion.startDate).getTime()
        let endDatePromo = new Date(product.promotion.endDate).getTime()
        if(!endDatePromo >= Date.now() || startDatePromo > Date.now()) {
            html += `<p class="product_price">${product.price} €</p>`
        } else {
            html +=  `<p class="product_initialPrice">${product.price} €</p>
                    <p class="product_promoPrice">${(product.price * ((100 - product.promotion.reduction) / 100)).toFixed(2)} €</p>`
        }
    }
    html += 
                    `</div>
                </div>
                <div class="product_promo_actions">
                    <div class="product_actions">
                        <button class="edit" onclick="editProduct('${product.product_id}')">Edit</button>
                        <button class="delete" onclick="deleteProduct('${product.product_id}')">Delete</button>
                    </div>`
    if(product.promotion !== null) {
        let sdate = new Date(product.promotion.startDate)
        let edate = new Date(product.promotion.endDate)
        let options = {day: 'numeric', month: 'long', year: 'numeric'}
        let startDate = sdate.toLocaleDateString("fr-FR", options)
        let endDate = edate.toLocaleDateString("fr-FR", options)
        html +=
                `</div>
            </div>
        </div>
        <div class="promo">
            <p class="promo_title">Promotion</p>
            <div class="promo_info">
                <p class="promo_reduction">Reduction of ${product.promotion.reduction}%</p>
                <p class="promo_startDate">Starts: ${startDate}</p>
                <p class="promo_endDate"> Ends: ${endDate}</p>
            </div>
            <div class="promo_actions">
                <button class="edit" onclick="editPromo(${product.product_id})">Edit</button>
                <button class="delete" onclick="deletePromo(${product.product_id}, ${product.promotion.promotion_id})">Delete</button>
            </div>
        </div>
    </div>`
    } else {
        html += `
                    <button class="add_promo" onclick="createPromo('${product.product_id}')">Add Promo</button>
                </div>
            </div>
        </div>
    </div>`
    }
    return html;
}

// ANCHOR Header Buttons Handling

    // My Account 
        // -> change password
        // -> delete account

    // Log Out
    function logout() {

        sessionStorage.removeItem('jwtToken');
        window.location.href = "./index.html"
    }


// ANCHOR Menu Filter Buttons Handling

function filterAll() {
    let submenu = document.getElementById("submenu")
    let filterAll = document.getElementById("displayAllProducts")
    let filterByCategory = document.getElementById("displayByCategory")
    let filterById = document.getElementById("displayById")
    let idSubmenu = document.getElementById("filterByIdSubmenu")
    filterByCategory.classList.remove("selected")
    filterById.classList.remove("selected")
    filterAll.classList.add("selected")
    submenu.style.display = "none"
    idSubmenu.style.display = "none"
    getAllProducts();
}

function filterByCategory() {
    let submenu = document.getElementById("submenu")
    let filterAll = document.getElementById("displayAllProducts")
    let filterByCategory = document.getElementById("displayByCategory")
    let filterById = document.getElementById("displayById")
    let idSubmenu = document.getElementById("filterByIdSubmenu")
    filterByCategory.classList.add("selected")
    filterById.classList.remove("selected")
    filterAll.classList.remove("selected")
    submenu.style.display = "flex"
    idSubmenu.style.display = "none"
}

function filterById() {
    let submenu = document.getElementById("submenu")
    let filterAll = document.getElementById("displayAllProducts")
    let filterByCategory = document.getElementById("displayByCategory")
    let filterById = document.getElementById("displayById")
    let idSubmenu = document.getElementById("filterByIdSubmenu")
    filterByCategory.classList.remove("selected")
    filterById.classList.add("selected")
    filterAll.classList.remove("selected")
    submenu.style.display = "none"
    idSubmenu.style.display = "flex"
}

function submitFilterById() {
    let idInput = document.getElementById("productId")
    let id = idInput.value 
    getProductById(id)
}

// ANCHOR Create Product Button Handling

function createProduct() {
    openModal("modalProduct")
    let formProduct = document.getElementById("modalProduct-form")
    formProduct.reset();
}

// ANCHOR Displayed Product Actions Handling

function editProduct(productId) {
    openModal("modalProduct")
    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL_DEV + `api/v1/back-office/products/by-id?id=${productId}`);
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                if(xhr.response) {
                    let product = JSON.parse(xhr.response);
                    if(product) {
                        document.getElementById("productIdInput").value = product.product_id
                        document.getElementById("title").value = product.title
                        let select = document.getElementById("category")
                        let myoptions = Array.from(select.options)
                        myoptions.forEach( function(option){
                            if(option.value == product.category) {
                                option.selected = true;
                            }
                        })
                        document.getElementById("description").value = product.description
                        document.getElementById("price").value = product.price
                        if(product.image != "") {
                            document.getElementById("currentFile").classList.add("show")
                            document.getElementById("currentFileUrl").classList.add("show")
                            document.getElementById("currentFileUrl").innerText = product.image
                        }
                    } else {
                        alert(`Ce produit n'existe plus. Veuillez recharger la page.`)
                    }
                }
            }  
        }
    });
    xhr.send();
}

// ANCHOR Displayed Promo Actions Handling

function createPromo(productId) {
    openModal("modalPromo")
    let formPromo = document.getElementById("modalPromo-form")
    formPromo.reset();
    let id = document.getElementById("product-id")
    id.value = productId
}

function editPromo(productId) {
    openModal("modalPromo")
    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL_DEV + `api/v1/back-office/products/by-id?id=${productId}`);
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                if(xhr.response) {
                    let product = JSON.parse(xhr.response);
                    if(product) {
                        document.getElementById("promoId").value = product.promotion.promotion_id
                        document.getElementById("product-id").value = product.product_id
                        document.getElementById("startDate").value = product.promotion.startDate
                        document.getElementById("endDate").value = product.promotion.endDate
                        document.getElementById("reduction").value = product.promotion.reduction
                    } else {
                        alert(`Ce produit n'existe plus. Veuillez recharger la page.`)
                    }
                }
            }  
        }
    });
    xhr.send();
}

// ANCHOR Modal Open Handling

function openModal(modal) {
    let mymodal = document.getElementById(modal)
    mymodal.style.display = "flex"
    let body = document.getElementById("body")
    body.classList.add("modal-open")
    if(modal == 'modalProduct') {
        const formValidator = new ProductFormValidator();
    } else if(modal == 'modalPromo') {
        const promoFormValidator = new PromoFormValidator();
    }
}

// ANCHOR Modal Close Handling

function shutModal(modal) {
    let currentModal = document.getElementById(modal)
    currentModal.style.display = "none"
    let body = document.getElementById("body")
    body.classList.remove("modal-open")
    document.getElementById("currentFileUrl").classList.remove("show")
    document.getElementById("currentFile").classList.remove("show")
}

// ANCHOR Modal Cancel Button Handling

function cancel(modal, form) {
    let confirm = window.confirm("Voulez vous vraiment quitter cette fenêtre? Si oui, toute modification sera abandonnée.")
    if(confirm) {
        document.getElementById("startDate").classList.remove("invalid")
        document.getElementById("endDate").classList.remove("invalid")
        document.getElementById("reduction").classList.remove("invalid")
        document.getElementById("title").classList.remove("invalid")
        document.getElementById("category").classList.remove("invalid")
        document.getElementById("description").classList.remove("invalid")
        document.getElementById("picture").classList.remove("invalid")

        let currentForm = document.getElementById(form)
        currentForm.reset()
        shutModal(modal)
    }
}

// ANCHOR Product Modal Buttons Handling

function saveProductToDB() {
    const formValidator = new ProductFormValidator();
    if (formValidator.validateForm()) {
        let id = document.getElementById("productIdInput").value
        let title = document.getElementById("title").value
        let category = document.getElementById("category").value
        let description = document.getElementById("description").value
        let price = document.getElementById("price").value
        let pictureInput = document.getElementById("picture")
        let picture = pictureInput.files[0]
        console.log(picture)
        let product = {}
        if(id != ""){
            product = {
                product_id: id,
                title: title,
                description: description,
                price: price,
                image: picture.type,
                category: category
            }
            putProduct(product, picture)
        } else {
            product = {
                title: title,
                description: description,
                price: price,
                image: picture.type,
                category: category
            }

            postProduct(product, picture);
        }
    }
}

// ANCHOR Promo Modal Buttons Handling

function savePromoToDB() {
    const formValidator = new PromoFormValidator();
    if (formValidator.validateForm()) {
        let productId = document.getElementById("product-id").value
        let promoId = document.getElementById("promoId").value
        let startDate = document.getElementById("startDate").value
        let endDate = document.getElementById("endDate").value
        let reduction = document.getElementById("reduction").value
        let promo = {}
        if(promoId){
            promo = {
                promotion_id: promoId,
                startDate: startDate,
                endDate: endDate,
                reduction: reduction,
            }
            putPromo(promo)
        } else {
            promo = {
                startDate: startDate,
                endDate: endDate,
                reduction: reduction,
            }
            postPromo(promo, productId)
        }
    }

}

// ANCHOR AJAX GET Categories

function getCategories() {
    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL_DEV + 'api/v1/client/categories');
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                let categories = JSON.parse(xhr.response);
                let myhtml = buildCategoryFilter(categories)
                document.getElementById("submenu").innerHTML = myhtml;
                buildCategoryOptions(categories)
            }  
        }
    });
    xhr.send();
}

// ANCHOR AJAX Products

// GET ALL PRODUCTS
function getAllProducts() {
    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL_DEV + 'api/v1/back-office/products');
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                let products = JSON.parse(xhr.response);
                let myhtml = "";
                if(products[0]) {
                    products.forEach(product => {
                        myhtml += displayProductBO(product);
                    })
                } else {
                    myhtml = `<p class="noProductFound">No product matches your search.</p>`
                }
                document.getElementById("allProducts").innerHTML = myhtml;
            }  
        }
    });
    xhr.send();
}

// GET BY CATEGORY 
function getProductsByCategory(category) {
    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL_DEV + `api/v1/back-office/products/by-category?category=${category}`);
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                let products = JSON.parse(xhr.response)
                let myhtml = "";
                if(products[0]) {
                    products.forEach(product => {
                        myhtml += displayProductBO(product);
                    })
                } else {
                    myhtml = `<p class="noProductFound">No product matches your search.</p>`
                }
                document.getElementById("allProducts").innerHTML = myhtml;
            }  
        }
    });
    xhr.send();
}

// GET BY ID 
function getProductById(productId) {
    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', URL_DEV + `api/v1/back-office/products/by-id?id=${productId}`);
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                let myhtml = ""
                if(xhr.response) {
                    let product = JSON.parse(xhr.response);
                    if(product) {
                        myhtml = displayProductBO(product);
                    } 
                } else {
                    myhtml = `<p class="noProductFound">No product matches your search.</p>`
                }
                document.getElementById("allProducts").innerHTML = myhtml;
            }  
        }
    });
    xhr.send();
}

// CREATE PRODUCT
function postProduct(product, picture) {
    let formData = new FormData();

    formData.append('product', new Blob([JSON.stringify(product)], {type: 'application/json'}));

    formData.append('picture', picture);

    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL_DEV + `api/v1/back-office/products`);
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);

    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                document.getElementById("displayAllProducts").dispatchEvent(click)
                let formProduct = document.getElementById("modalProduct-form")
                formProduct.reset()
                shutModal("modalProduct")
            }  
        }
    });
    xhr.send(formData);
}

// EDIT PRODUCT
function putProduct(product, picture) {
    let formData = new FormData();

    formData.append('product', new Blob([JSON.stringify(product)], {type: 'application/json'}));

    formData.append('picture', picture);

    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', URL_DEV + `api/v1/back-office/products?product_id=${product.product_id}`);
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);

    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                document.getElementById("displayAllProducts").dispatchEvent(click)
                let formProduct = document.getElementById("modalProduct-form")
                formProduct.reset()
                shutModal("modalProduct")
            }  
        }
    });
    xhr.send(formData);
}

// DELETE PRODUCT
function deleteProduct(productId) {
    let confirm = window.confirm("Voulez vous vraiment supprimer ce produit définitivement?")
    if(confirm) {
        let jwtToken = sessionStorage.getItem('jwtToken');
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', URL_DEV + `api/v1/back-office/products?product_id=${productId}`);
        xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.addEventListener('readystatechange', function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 502 || xhr.status === 403) {
                    window.location.href = "./index.html"
                } else if(xhr.status !== 200) {
                    alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
                } else {
                    document.getElementById("displayAllProducts").dispatchEvent(click)
                }  
            }
        });
        xhr.send();
    }
}

// ANCHOR AJAX Promo

// CREATE PROMO
function postPromo(promo, productId) {
    let body = JSON.stringify(promo)
    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', URL_DEV + `api/v1/back-office/promotions?product_id=${productId}`);
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                document.getElementById("displayAllProducts").dispatchEvent(click)
                let formPromo = document.getElementById("modalPromo-form")
                formPromo.reset()
                shutModal("modalPromo")
            }  
        }
    });
    xhr.send(body);
}

// EDIT PROMO
function putPromo(promo) {
    let body = JSON.stringify(promo)
    let jwtToken = sessionStorage.getItem('jwtToken');
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', URL_DEV + `api/v1/back-office/promotions?id=${promo.promotion_id}`);
    xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener('readystatechange', function() {
        if(xhr.readyState === 4) {
            if(xhr.status === 502 || xhr.status === 403) {
                window.location.href = "./index.html"
            } else if(xhr.status !== 200) {
                alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
            } else {
                document.getElementById("displayAllProducts").dispatchEvent(click)
                let formPromo = document.getElementById("modalPromo-form")
                formPromo.reset()
                shutModal("modalPromo")
            }  
        }
    });
    xhr.send(body);
}

// DELETE PROMO
function deletePromo(productId, promoId) {
    let confirm = window.confirm("Voulez vous vraiment supprimer cette promotion définitivement?")
    if(confirm) {
        let jwtToken = sessionStorage.getItem('jwtToken');
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', URL_DEV + `api/v1/back-office/promotions?product_id=${productId}&promotion_id=${promoId}`);
        xhr.setRequestHeader("Authorization", `Bearer ${jwtToken}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.addEventListener('readystatechange', function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 502 || xhr.status === 403) {
                    window.location.href = "./index.html"
                } else if(xhr.status !== 200) {
                    alert('An error has occured. Code ' + xhr.status + ', Message: ' + xhr.statusText);
                } else {
                    document.getElementById("displayAllProducts").dispatchEvent(click)
                }  
            }
        });
        xhr.send();
    }
}


// ANCHOR Immediate Action Calls

//ON READY 

getCategories()
getAllProducts()
