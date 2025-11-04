document.addEventListener('DOMContentLoaded', () => {
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
    const categoryDescriptionContainer = document.getElementById('category-description-container');
    const increaseBtn = document.getElementById('increase-btn');
    const decreaseBtn = document.getElementById('decrease-btn');

    // Configuración de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBQWpFadj7L-U-jF1b1DeEJqX-vDEmyiTA",
        authDomain: "huertohogar-15d5.firebaseapp.com",
        projectId: "huertohogar-15d5",
        storageBucket: "huertohogar-15d5.appspot.com",
        messagingSenderId: "663380007423",
        appId: "1:663380007423:web:51638d3581e2453989efca",
        measurementId: "G-6YRGN9FZLM"
    };

    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Variables globales
    let productosGlobal = [];
    let currentProductId = null;
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Descripciones de categorías
    const descripcionesCategorias = {
        'Frutas Frescas': {
            titulo: 'Frutas Frescas',
            descripcion: 'Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies.'
        },
        'Verduras Organicas': {
            titulo: 'Verduras Orgánicas',
            descripcion: 'Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ofreciendo una excelente fuente de vitaminas, minerales y fibra. Ideales para ensaladas, guisos y platos saludables, nuestras verduras orgánicas promueven una alimentación consciente y sostenible.'
        },
        'Productos Organicos': {
            titulo: 'Productos Orgánicos',
            descripcion: 'Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente. Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad.'
        },
        'Productos Lacteos': {
            titulo: 'Productos Lácteos',
            descripcion: 'Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico. Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia.'
        }
    };

    // Función para mostrar descripción de categoría
    function mostrarDescripcionCategoria(categoria) {
        const descripcion = descripcionesCategorias[categoria];
        
        if (descripcion) {
            categoryDescriptionContainer.innerHTML = `
                <div class="category-description-content">
                    <h3>${descripcion.titulo}</h3>
                    <p>${descripcion.descripcion}</p>
                </div>
            `;
            categoryDescriptionContainer.style.display = 'block';
        } else {
            categoryDescriptionContainer.style.display = 'none';
        }
    }

    // Función para cargar productos desde Firebase
    async function cargarProductos() {
        try {
            const snapshot = await db.collection("producto").get();
            productosGlobal = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log("Productos cargados desde Firebase:", productosGlobal);
            renderProducts();
            mostrarDescripcionCategoria('all'); // Mostrar descripción inicial
            
        } catch (error) {
            console.error("Error cargando productos:", error);
            productGrid.innerHTML = "<p class='error'>Error al cargar los productos</p>";
        }
    }

    // Función para renderizar las tarjetas de productos
    const renderProducts = (category = 'all') => {
        productGrid.innerHTML = '';
        
        const productsToDisplay = category === 'all'
            ? productosGlobal
            : productosGlobal.filter(product => product.categoria === category);

        if (productsToDisplay.length === 0) {
            productGrid.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-seedling" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <p style="color: #666; font-size: 1.1rem;">No hay productos disponibles en esta categoría</p>
                </div>
            `;
            return;
        }

        productsToDisplay.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.productId = product.id;

            const stockText = product.stock > 0
                ? `<p class="product-price">$${product.precio.toLocaleString('es-CL')} CLP</p>`
                : `<p class="product-price" style="color: red;">Fuera de stock</p>`;

            const stockBadge = product.stock > 0 
                ? `<span class="stock-badge in-stock">En stock</span>`
                : `<span class="stock-badge out-of-stock">Agotado</span>`;

            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.imagen}" alt="${product.nombre}" 
                         onerror="this.src='https://via.placeholder.com/300x200/cccccc/969696?text=Imagen+No+Disponible'">
                    ${stockBadge}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.nombre}</h3>
                    <span class="product-category">${product.categoria}</span>
                    ${stockText}
                    <div class="product-actions">
                        <button class="btn-view">
                            <i class="fas fa-eye"></i> Ver Detalles
                        </button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    };

    // Función para actualizar el precio total basado en la cantidad
    const updateTotalPrice = (precio, unidad) => {
        const quantity = parseFloat(quantityInput.value);
        if (isNaN(quantity) || quantity <= 0) {
            totalPriceElement.textContent = `Total: $0 CLP`;
            return;
        }
        const total = quantity * precio;
        totalPriceElement.textContent = `Total: $${total.toLocaleString('es-CL')} CLP`;
    };

    // Evento para abrir el modal cuando se hace clic en una tarjeta de producto
    productGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.product-card');
        if (!card) return;

        currentProductId = card.dataset.productId;
        const product = productosGlobal.find(p => p.id === currentProductId);

        if (product) {
            modalImg.src = product.imagen;
            modalTitle.textContent = product.nombre;
            modalCode.textContent = `Código: ${product.id}`;
            modalPrice.textContent = `Precio: $${product.precio.toLocaleString('es-CL')} CLP por ${product.unidad || 'unidad'}`;
            modalDescription.textContent = product.descripcion || 'Sin descripción disponible';

            // Lógica de Stock y visualización de elementos
            if (product.stock > 0) {
                modalStock.textContent = `Stock: ${product.stock} ${product.unidad || 'unidad'}(s)`;
                modalStock.style.color = 'green';
                quantityInput.style.display = 'inline-block';
                unitLabel.style.display = 'inline-block';
                totalPriceElement.style.display = 'block';
                addToCartBtn.style.display = 'block';
                quantityInput.value = 1;
                quantityInput.setAttribute('max', product.stock);
            } else {
                modalStock.textContent = `${product.nombre} fuera de Stock`;
                modalStock.style.color = 'red';
                quantityInput.style.display = 'none';
                unitLabel.style.display = 'none';
                totalPriceElement.style.display = 'none';
                addToCartBtn.style.display = 'none';
            }

            unitLabel.textContent = product.unidad || 'unidad';
            updateTotalPrice(product.precio, product.unidad);
            modal.style.display = 'block';
        }
    });

    // Evento para actualizar el precio en el modal
    quantityInput.addEventListener('input', () => {
        const product = productosGlobal.find(p => p.id === currentProductId);
        if (product) {
            updateTotalPrice(product.precio, product.unidad);
        }
    });

    // EVENTOS PARA LOS BOTONES + Y -
    increaseBtn.addEventListener('click', () => {
        const product = productosGlobal.find(p => p.id === currentProductId);
        if (product) {
            const currentValue = parseFloat(quantityInput.value);
            const maxStock = product.stock;
            
            if (currentValue < maxStock) {
                quantityInput.value = currentValue + 1;
                updateTotalPrice(product.precio, product.unidad);
            } else {
                alert(`No puedes agregar más de ${maxStock} ${product.unidad || 'unidad'}(s)`);
            }
        }
    });

    decreaseBtn.addEventListener('click', () => {
        const product = productosGlobal.find(p => p.id === currentProductId);
        if (product) {
            const currentValue = parseFloat(quantityInput.value);
            
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updateTotalPrice(product.precio, product.unidad);
            } else {
                alert('La cantidad mínima es 1');
            }
        }
    });

    // Validación mejorada para cuando se escribe manualmente
    quantityInput.addEventListener('change', () => {
        const product = productosGlobal.find(p => p.id === currentProductId);
        if (product) {
            let value = parseFloat(quantityInput.value);
            
            // Validar que sea un número válido
            if (isNaN(value) || value <= 0) {
                quantityInput.value = 1;
                value = 1;
            }
            
            // Validar que no exceda el stock
            if (value > product.stock) {
                quantityInput.value = product.stock;
                value = product.stock;
                alert(`Solo hay ${product.stock} ${product.unidad || 'unidad'}(s) disponibles`);
            }
            
            updateTotalPrice(product.precio, product.unidad);
        }
    });

    // Función para agregar al carrito y actualizar stock en Firebase
    async function agregarAlCarrito(productId, cantidad) {
        try {
            const productoRef = db.collection("producto").doc(productId);
            const productoDoc = await productoRef.get();
            
            if (productoDoc.exists) {
                const stockActual = productoDoc.data().stock;
                const nuevoStock = stockActual - cantidad;
                
                if (nuevoStock < 0) {
                    alert('No hay suficiente stock disponible');
                    return false;
                }
                
                // Actualizar stock en Firebase
                await productoRef.update({
                    stock: nuevoStock
                });
                
                // Agregar al carrito local
                const producto = productosGlobal.find(p => p.id === productId);
                const productoExistente = carrito.find(item => item.id === productId);
                
                if (productoExistente) {
                    productoExistente.cantidad += cantidad;
                } else {
                    carrito.push({
                        ...producto,
                        cantidad: cantidad
                    });
                }
                
                localStorage.setItem('carrito', JSON.stringify(carrito));
                return true;
            }
        } catch (error) {
            console.error("Error al agregar al carrito:", error);
            return false;
        }
    }

    // Evento para el botón "Agregar al carrito"
    addToCartBtn.addEventListener('click', async () => {
        const product = productosGlobal.find(p => p.id === currentProductId);
        const quantity = parseFloat(quantityInput.value);

        if (isNaN(quantity) || quantity <= 0) {
            alert('Por favor, ingresa una cantidad válida.');
            return;
        }

        if (quantity > product.stock) {
            alert(`Error: Solo hay ${product.stock} ${product.unidad || 'unidad'}(s) en stock.`);
            return;
        }

        const exito = await agregarAlCarrito(currentProductId, quantity);
        
        if (exito) {
            alert(`¡Se agregaron ${quantity} ${product.unidad || 'unidad'}(s) de ${product.nombre} al carrito!`);
            
            // Actualizar la vista
            const index = productosGlobal.findIndex(p => p.id === currentProductId);
            if (index !== -1) {
                productosGlobal[index].stock -= quantity;
            }
            
            renderProducts();
            modal.style.display = 'none';
        } else {
            alert('Error al agregar el producto al carrito');
        }
    });

    // Eventos de categorías
    categoryListItems.forEach(item => {
        item.addEventListener('click', () => {
            categoryListItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            const category = item.dataset.category;
            
            // Mostrar descripción de la categoría seleccionada
            mostrarDescripcionCategoria(category);
            renderProducts(category);
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

    // Inicializar la página cargando productos desde Firebase
    cargarProductos();
});