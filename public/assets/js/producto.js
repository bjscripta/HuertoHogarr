document.addEventListener('DOMContentLoaded', () => {
    // Datos simulados de los productos
    const productData = {
        'FR001': {
            img: '../img/productos/manzanaFuji.png',
            name: 'Manzanas Fuji',
            pricePerUnit: 1200,
            stock: 150,
            unit: 'kilo',
            category: 'frutas',
            description: 'Las Manzanas Fuji son una de las variedades más populares en el mercado chileno, conocidas por su sabor dulce y crujiente. Son ideales para comer frescas, en ensaladas, o para preparar jugos y postres.'
        },
        'FR002': {
            img: '../img/productos/naranjasValencia.png',
            name: 'Naranjas Valencia',
            pricePerUnit: 1000,
            stock: 200,
            unit: 'kilo',
            category: 'frutas',
            description: 'Las Naranjas Valencia son jugosas y perfectas para jugos frescos. Con un sabor equilibrado entre dulce y ácido, son una fuente excelente de vitamina C. Ideales para consumo diario.'
        },
        'FR003': {
            img: '../img/productos/platanosCavendish.png',
            name: 'Plátanos Cavendish',
            pricePerUnit: 800,
            stock: 250,
            unit: 'kilo',
            category: 'frutas',
            description: 'Los plátanos Cavendish son la variedad de plátano más común en el comercio internacional. Son grandes, de forma alargada y ligeramente curvada, y tienen una cáscara gruesa y fácilmente pelable. Su sabor es dulce y cremoso.'
        },
        'VR001': {
            img: '../img/productos/zanahoriaOrganicas.png',
            name: 'Zanahorias Orgánicas',
            pricePerUnit: 900,
            stock: 100,
            unit: 'kilo',
            category: 'verduras',
            description: 'Zanahorias orgánicas cultivadas sin pesticidas. Son crujientes y dulces, perfectas para ensaladas, guisos o como snack saludable. Una excelente fuente de betacaroteno.'
        },
        'VR002': {
            img: '../img/productos/espinacasFrescas.png',
            name: 'Espinacas Frescas',
            pricePerUnit: 700,
            stock: 80,
            unit: 'bolsa',
            category: 'verduras',
            description: 'Espinacas frescas y listas para consumir. Son ricas en hierro, vitaminas y antioxidantes. Ideales para ensaladas, jugos verdes o salteados.'
        },
        'VR003': {
            img: '../img/productos/pimientosTricolores.png',
            name: 'Pimientos Tricolores',
            pricePerUnit: 1500,
            stock: 120,
            unit: 'kilo',
            category: 'verduras',
            description: 'Pimientos de colores variados (rojo, amarillo y verde). Son crujientes y dulces, perfectos para ensaladas, asados o rellenos.'
        },
        'PO001': {
            img: '../img/productos/mielOrganica.png',
            name: 'Miel Orgánica',
            pricePerUnit: 5000,
            stock: 50,
            unit: 'frasco',
            category: 'organicos',
            description: 'Miel 100% orgánica, cosechada de manera sostenible. Un endulzante natural y saludable, ideal para tés, yogures o postres.'
        },
        'PO003': {
            img: '../img/productos/quinoaOrganica.png',
            name: 'Quinua Orgánica',
            pricePerUnit: 1800,
            stock: 80,
            unit: 'kilo',
            category: 'organicos',
            description: 'La quinua es un pseudocereal ancestral de los Andes, reconocido por su alto valor nutricional. Rica en proteínas, fibra y minerales, es un superalimento versátil que se adapta a una variedad de platos. Nuestra quinua orgánica es cultivada sin el uso de pesticidas ni fertilizantes sintéticos.'
        },
        'PL001': {
            img: '../img/productos/lecheEntera.png',
            name: 'Leche Entera',
            pricePerUnit: 1400,
            stock: 100,
            unit: '1L de caja',
            category: 'lacteos',
            description: 'Leche fresca y cremosa, ideal para toda la familia. Con su alto contenido de calcio y vitaminas, es perfecta para acompañar cereales, café o para usar en tus recetas de cocina.'
        }
    };

    // Referencias a elementos del DOM
    const productGrid = document.querySelector('.product-grid');
    const categoryListItems = document.querySelectorAll('.category-list li');
    const modal = document.getElementById('product-modal');
    const closeButton = document.querySelector('.close-button');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCode = document.getElementById('modal-code');
    const modalPrice = document.getElementById('modal-price');
    const modalStock = document.getElementById('modal-stock');
    const quantityInput = document.getElementById('quantity-input');
    const unitLabel = document.getElementById('unit-label');
    const totalPriceElement = document.getElementById('total-price');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const modalDescription = document.getElementById('modal-description');

    // Estado actual del stock
    let currentStock = { ...productData };
    
    // Variable para almacenar el código del producto que se está visualizando
    let currentProductCode = null;

    // Función para renderizar las tarjetas de productos
    const renderProducts = (category = 'all') => {
        productGrid.innerHTML = '';
        const productsToDisplay = category === 'all'
            ? Object.keys(currentStock)
            : Object.keys(currentStock).filter(key => currentStock[key].category === category);

        productsToDisplay.forEach(key => {
            const product = currentStock[key];
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.productCode = key;

            const stockText = product.stock > 0
                ? `<p class="product-price">Precio: $${product.pricePerUnit.toLocaleString('es-CL')} CLP</p>`
                : `<p class="product-price" style="color: red;">${product.name} fuera de stock</p>`;

            card.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <h3 class="product-name">${product.name}</h3>
                ${stockText}
            `;
            productGrid.appendChild(card);
        });
    };

    // Función para actualizar el precio total basado en la cantidad
    const updateTotalPrice = (pricePerUnit, unit) => {
        const quantity = parseFloat(quantityInput.value);
        if (isNaN(quantity) || quantity <= 0) {
            totalPriceElement.textContent = `Total: $0 CLP`;
            return;
        }
        const total = quantity * pricePerUnit;
        totalPriceElement.textContent = `Total: $${total.toLocaleString('es-CL')} CLP`;
    };

    // Evento para abrir el modal cuando se hace clic en una tarjeta de producto
    productGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.product-card');
        if (!card) return;

        // Al hacer clic, actualizamos la variable con el código del producto
        currentProductCode = card.dataset.productCode;
        const product = currentStock[currentProductCode];

        if (product) {
            modalImg.src = product.img;
            modalTitle.textContent = product.name;
            modalCode.textContent = `Código: ${currentProductCode}`;
            modalPrice.textContent = `Precio: $${product.pricePerUnit.toLocaleString('es-CL')} CLP por ${product.unit}`;
            modalDescription.textContent = product.description;

            // Lógica de Stock y visualización de elementos
            if (product.stock > 0) {
                modalStock.textContent = `Stock: ${product.stock} ${product.unit}(s)`;
                modalStock.style.color = 'green';
                quantityInput.style.display = 'inline-block';
                unitLabel.style.display = 'inline-block';
                totalPriceElement.style.display = 'block';
                addToCartBtn.style.display = 'block';
                quantityInput.value = 1;
                quantityInput.setAttribute('max', product.stock);
            } else {
                modalStock.textContent = `${product.name} fuera de Stock`;
                modalStock.style.color = 'red';
                quantityInput.style.display = 'none';
                unitLabel.style.display = 'none';
                totalPriceElement.style.display = 'none';
                addToCartBtn.style.display = 'none';
            }

            unitLabel.textContent = product.unit;
            updateTotalPrice(product.pricePerUnit, product.unit);
            modal.style.display = 'block';
        }
    });

    // Evento para actualizar el precio en el modal
    quantityInput.addEventListener('input', () => {
        // Usa la variable currentProductCode para obtener el producto correcto
        const product = currentStock[currentProductCode];
        if (product) {
            updateTotalPrice(product.pricePerUnit, product.unit);
        }
    });

    // Evento para el botón "Agregar al carrito"
    addToCartBtn.addEventListener('click', () => {
        // Usa la variable currentProductCode para obtener el producto correcto
        const product = currentStock[currentProductCode];
        const quantity = parseFloat(quantityInput.value);

        if (isNaN(quantity) || quantity <= 0) {
            alert('Por favor, ingresa una cantidad válida.');
            return;
        }

        if (quantity > product.stock) {
            alert(`Error: Solo hay ${product.stock} ${product.unit}(s) en stock.`);
            return;
        }

        // Restar el stock
        currentStock[currentProductCode].stock -= quantity;
        
        // Mensaje de éxito
        alert(`¡Se agregaron ${quantity} ${product.unit}(s) de ${product.name} al carrito!`);
        
        // Volver a renderizar los productos para mostrar el stock actualizado
        renderProducts();
        modal.style.display = 'none';
    });

    // Eventos de categorías
    categoryListItems.forEach(item => {
        item.addEventListener('click', () => {
            categoryListItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            renderProducts(item.dataset.category);
        });
    });

    // Cerrar el modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Inicializar la página mostrando todos los productos
    renderProducts();
});

