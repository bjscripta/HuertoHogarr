// Configuración de Firebase - ACTUALIZADA con tu proyecto
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
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosOferta = [];

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarCarrito();
    cargarProductosOferta();
    configurarEventos();
    actualizarNavegacion();
});

/**
 * Actualiza la navegación para que coincida con tu proyecto
 */
function actualizarNavegacion() {
    // Actualizar enlaces del header
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.textContent === 'Home') {
            link.href = '../../index.html';
        }
        if (link.getAttribute('href') === 'producto.html') {
            link.href = 'producto.html';
        }
    });
}

/**
 * Inicializa la interfaz del carrito
 */
function inicializarCarrito() {
    actualizarCarritoHeader();
    actualizarContadorCarrito();
    renderizarCarrito();
    calcularTotal();
}

/**
 * Actualiza el contador de items en el carrito
 */
function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((total, producto) => total + (producto.cantidad || 1), 0);
    const carritoCount = document.getElementById('carritoCount');
    if (carritoCount) {
        carritoCount.textContent = totalItems;
    }
}

/**
 * Carga productos en oferta desde Firestore
 */
async function cargarProductosOferta() {
    try {
        const snapshot = await db.collection("producto").get();
        productosOferta = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Para HuertoHogar, mostrar todos los productos como "Recomendados" en lugar de ofertas
        const productosRecomendados = productosOferta.filter(producto => producto.stock > 0).slice(0, 6);
        renderizarProductosRecomendados(productosRecomendados);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

/**
 * Renderiza los productos recomendados
 */
function renderizarProductosRecomendados(productos) {
    const contenedor = document.getElementById('productosOferta');
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos recomendados en este momento.</p>';
        return;
    }

    contenedor.innerHTML = productos.map(producto => `
        <div class="producto-card">
            <img src="${producto.imagen}" 
                 alt="${producto.nombre}" 
                 class="producto-imagen"
                 onerror="this.src='https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible'">
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <div class="precios-oferta">
                    <span class="precio-actual">$${producto.precio?.toLocaleString('es-CL')}</span>
                </div>
                <p class="stock-disponible">Stock: ${producto.stock || 0}</p>
                <p class="producto-unidad">Por ${producto.unidad || 'unidad'}</p>
                <button class="btn-agregar-oferta" data-id="${producto.id}">
                    Añadir al Carrito
                </button>
            </div>
        </div>
    `).join('');

    // Agregar eventos a los botones de añadir
    document.querySelectorAll('.btn-agregar-oferta').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            agregarProductoAlCarrito(productId);
        });
    });
}

/**
 * Renderiza los productos en el carrito
 */
function renderizarCarrito() {
    const tbody = document.getElementById('tablaCarritoBody');
    
    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="carrito-vacio">
                    <div class="icono">🛒</div>
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega algunos productos para continuar</p>
                    <a href="producto.html" class="btn-ir-catalogo">Ir al Catálogo</a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = carrito.map((producto, index) => `
        <tr>
            <td>
                <img src="${producto.imagen}" 
                     alt="${producto.nombre}" 
                     class="imagen-tabla"
                     onerror="this.src='https://via.placeholder.com/100x100/cccccc/969696?text=Imagen'">
            </td>
            <td>
                <strong>${producto.nombre}</strong>
                <br>
                <small class="texto-unidad">${producto.unidad || 'unidad'}</small>
            </td>
            <td>$${producto.precio?.toLocaleString('es-CL')}</td>
            <td>
                <div class="controles-cantidad">
                    <button class="btn-cantidad" onclick="disminuirCantidad(${index})">-</button>
                    <span class="cantidad-actual">${producto.cantidad || 1}</span>
                    <button class="btn-cantidad" onclick="aumentarCantidad(${index})">+</button>
                </div>
            </td>
            <td>$${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CL')}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Agrega un producto al carrito
 */
function agregarProductoAlCarrito(productId) {
    const producto = productosOferta.find(p => p.id === productId);
    
    if (producto) {
        // Verificar stock antes de agregar
        if (producto.stock <= 0) {
            mostrarNotificacion('Producto sin stock disponible', 'error');
            return;
        }
        
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === productId);
        
        if (productoExistente) {
            // Verificar que no exceda el stock disponible
            if (productoExistente.cantidad >= producto.stock) {
                mostrarNotificacion('No hay más stock disponible de este producto', 'error');
                return;
            }
            productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        
        // Actualizar stock en Firebase
        actualizarStockFirebase(productId, 1);
        
        mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
    }
}

/**
 * Actualizar stock en Firebase cuando se agrega al carrito
 */
async function actualizarStockFirebase(productId, cantidad) {
    try {
        const productoRef = db.collection("producto").doc(productId);
        const productoDoc = await productoRef.get();
        
        if (productoDoc.exists) {
            const stockActual = productoDoc.data().stock;
            const nuevoStock = stockActual - cantidad;
            
            await productoRef.update({
                stock: nuevoStock
            });
            
            console.log(`Stock actualizado: ${productoDoc.data().nombre} - Nuevo stock: ${nuevoStock}`);
        }
    } catch (error) {
        console.error("Error actualizando stock en Firebase:", error);
    }
}

/**
 * Restaurar stock cuando se elimina del carrito
 */
async function restaurarStockFirebase(productId, cantidad) {
    try {
        const productoRef = db.collection("producto").doc(productId);
        const productoDoc = await productoRef.get();
        
        if (productoDoc.exists) {
            const stockActual = productoDoc.data().stock;
            const nuevoStock = stockActual + cantidad;
            
            await productoRef.update({
                stock: nuevoStock
            });
            
            console.log(`Stock restaurado: ${productoDoc.data().nombre} - Nuevo stock: ${nuevoStock}`);
        }
    } catch (error) {
        console.error("Error restaurando stock en Firebase:", error);
    }
}

/**
 * Aumenta la cantidad de un producto en el carrito
 */
function aumentarCantidad(index) {
    const producto = carrito[index];
    
    // Verificar stock antes de aumentar
    const productoOriginal = productosOferta.find(p => p.id === producto.id);
    if (productoOriginal && producto.cantidad >= productoOriginal.stock) {
        mostrarNotificacion('No hay suficiente stock disponible', 'error');
        return;
    }
    
    carrito[index].cantidad = (carrito[index].cantidad || 1) + 1;
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    
    // Actualizar stock en Firebase
    actualizarStockFirebase(producto.id, 1);
}

/**
 * Disminuye la cantidad de un producto en el carrito
 */
function disminuirCantidad(index) {
    const producto = carrito[index];
    
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        
        // Restaurar stock en Firebase
        restaurarStockFirebase(producto.id, 1);
    }
}

/**
 * Elimina un producto del carrito
 */
function eliminarDelCarrito(index) {
    const producto = carrito[index];
    const cantidadEliminada = producto.cantidad || 1;
    
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    mostrarNotificacion(`"${producto.nombre}" eliminado del carrito`);

    // Restaurar stock en Firebase
    restaurarStockFirebase(producto.id, cantidadEliminada);
}

/**
 * Calcula el total del carrito
 */
function calcularTotal() {
    const total = carrito.reduce((sum, producto) => {
        return sum + ((producto.precio || 0) * (producto.cantidad || 1));
    }, 0);
    
    document.getElementById('totalCarrito').textContent = total.toLocaleString('es-CL');
    actualizarCarritoHeader();
    actualizarContadorCarrito();
}

/**
 * Actualiza el header del carrito
 */
function actualizarCarritoHeader() {
    const total = carrito.reduce((sum, producto) => {
        return sum + ((producto.precio || 0) * (producto.cantidad || 1));
    }, 0);
    
    const carritoTotalElement = document.querySelector('.carrito-total');
    if (carritoTotalElement) {
        carritoTotalElement.textContent = total.toLocaleString('es-CL');
    }
}

/**
 * Guarda el carrito en localStorage
 */
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

/**
 * Limpia todo el carrito
 */
function limpiarCarrito() {
    if (carrito.length === 0) {
        alert('El carrito ya está vacío');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres limpiar todo el carrito?')) {
        // Restaurar stock de todos los productos antes de limpiar
        carrito.forEach(producto => {
            restaurarStockFirebase(producto.id, producto.cantidad || 1);
        });
        
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
        calcularTotal();
        mostrarNotificacion('Carrito limpiado correctamente');
    }
}

/**
 * Redirige al checkout
 */
function irAlCheckout() {
    if (carrito.length === 0) {
        alert('Agrega productos al carrito antes de continuar');
        return;
    }
    
    window.location.href = 'checkout.html';
}

/**
 * Muestra una notificación temporal
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    const backgroundColor = tipo === 'success' ? '#28a745' : '#dc3545';
    
    notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

/**
 * Configura el buscador
 */
function configurarBuscador() {
    const buscador = document.getElementById('buscador');
    const btnBuscar = document.getElementById('btnBuscar');
    
    if (buscador && btnBuscar) {
        const buscarProductos = () => {
            const termino = buscador.value.trim().toLowerCase();
            if (termino) {
                alert(`Buscando: ${termino}\nEsta funcionalidad se integrará con el catálogo.`);
                // En el futuro: window.location.href = `producto.html?busqueda=${encodeURIComponent(termino)}`;
            }
        };
        
        btnBuscar.addEventListener('click', buscarProductos);
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarProductos();
        });
    }
}

/**
 * Configura los eventos de la página
 */
function configurarEventos() {
    const btnLimpiar = document.getElementById('btnLimpiarCarrito');
    const btnComprar = document.getElementById('btnComprarAhora');
    
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarCarrito);
    }
    if (btnComprar) {
        btnComprar.addEventListener('click', irAlCheckout);
    }
    
    configurarBuscador();
}

// Hacer funciones disponibles globalmente
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;