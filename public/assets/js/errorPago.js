// Inicializar página de error cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarPaginaError();
    configurarEventosError();
    actualizarHeaderCarrito();
    configurarBuscador();
    configurarBotonCarrito();
});

/**
 * Actualiza el contador y total del carrito en el header
 */
function actualizarHeaderCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, producto) => total + (producto.cantidad || 1), 0);
    const totalPrecio = carrito.reduce((sum, producto) => sum + ((producto.precio || 0) * (producto.cantidad || 1)), 0);
    
    const carritoCount = document.getElementById('carritoCount');
    const carritoTotal = document.querySelector('.carrito-total');
    
    if (carritoCount) {
        carritoCount.textContent = totalItems;
    }
    if (carritoTotal) {
        carritoTotal.textContent = totalPrecio.toLocaleString('es-CL');
    }
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
            }
        };
        
        btnBuscar.addEventListener('click', buscarProductos);
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarProductos();
        });
    }
}

/**
 * Configura el botón del carrito en el header
 */
function configurarBotonCarrito() {
    const btnCarrito = document.querySelector('.btn-carrito');
    if (btnCarrito) {
        btnCarrito.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'carrito.html';
        });
    }
}

/**
 * Inicializa la página de error con los datos de la compra fallida
 */
function inicializarPaginaError() {
    const urlParams = new URLSearchParams(window.location.search);
    const ordenParam = urlParams.get('orden');
    const ultimaCompra = JSON.parse(localStorage.getItem('ultimaCompra'));
    
    if (!ultimaCompra && !ordenParam) {
        // Redirigir al carrito si no hay datos de compra
        window.location.href = 'carrito.html';
        return;
    }

    // Mostrar datos de la compra fallida
    mostrarDatosCompraError(ultimaCompra);
    renderizarProductosError(ultimaCompra.productos);
    actualizarTotalError(ultimaCompra.total);
}

/**
 * Muestra los datos de la compra fallida en los formularios
 */
function mostrarDatosCompraError(compra) {
    // Actualizar número de compra
    document.getElementById('numeroError').textContent = compra.numeroOrden;

    // Datos del cliente
    document.getElementById('errorNombre').value = compra.cliente.nombre || '';
    document.getElementById('errorApellidos').value = compra.cliente.apellidos || '';
    document.getElementById('errorCorreo').value = compra.cliente.correo || '';
    document.getElementById('errorTelefono').value = compra.cliente.telefono || '';

    // Datos de dirección
    document.getElementById('errorCalle').value = compra.direccion.calle || '';
    document.getElementById('errorDepartamento').value = compra.direccion.departamento || '';
    document.getElementById('errorRegion').value = compra.direccion.region || '';
    document.getElementById('errorComuna').value = compra.direccion.comuna || '';
    document.getElementById('errorIndicaciones').value = compra.direccion.indicaciones || '';
}

/**
 * Renderiza los productos en la tabla de error
 */
function renderizarProductosError(productos) {
    const tbody = document.getElementById('tablaErrorBody');
    
    if (!productos || productos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-shopping-basket" style="font-size: 2rem; color: #ccc;"></i>
                    <p class="mt-2">No hay productos en esta compra</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = productos.map(producto => `
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
            <td>${producto.cantidad || 1}</td>
            <td>$${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CL')}</td>
        </tr>
    `).join('');
}

/**
 * Actualiza el total en la página de error
 */
function actualizarTotalError(total) {
    document.getElementById('totalError').textContent = total.toLocaleString('es-CL');
}

/**
 * Redirige al checkout para reintentar el pago
 */
function reintentarPago() {
    window.location.href = 'checkout.html';
}

/**
 * Redirige al carrito
 */
function volverAlCarrito() {
    window.location.href = 'carrito.html';
}

/**
 * Configura los eventos de la página de error
 */
function configurarEventosError() {
    const btnReintentar = document.getElementById('btnReintentarPago');
    const btnVolverCarrito = document.getElementById('btnVolverCarrito');
    
    if (btnReintentar) {
        btnReintentar.addEventListener('click', reintentarPago);
    }
    
    if (btnVolverCarrito) {
        btnVolverCarrito.addEventListener('click', volverAlCarrito);
    }
}