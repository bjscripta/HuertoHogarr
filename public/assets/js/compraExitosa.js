// Inicializar página de éxito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarPaginaExito();
    configurarEventosExito();
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
 * Inicializa la página de éxito con los datos de la compra
 */
function inicializarPaginaExito() {
    const urlParams = new URLSearchParams(window.location.search);
    const ordenParam = urlParams.get('orden');
    const ultimaCompra = JSON.parse(localStorage.getItem('ultimaCompra'));
    
    if (!ultimaCompra && !ordenParam) {
        // Redirigir al carrito si no hay datos de compra
        window.location.href = 'carrito.html';
        return;
    }

    // Mostrar datos de la compra
    mostrarDatosCompra(ultimaCompra);
    renderizarProductosExito(ultimaCompra.productos);
    actualizarTotalExito(ultimaCompra.total);
}

/**
 * Muestra los datos de la compra en los formularios
 */
function mostrarDatosCompra(compra) {
    // Actualizar números de orden y compra
    document.getElementById('codigoOrden').textContent = compra.numeroOrden;
    document.getElementById('numeroCompra').textContent = compra.numeroOrden;

    // Datos del cliente
    document.getElementById('exitoNombre').value = compra.cliente.nombre;
    document.getElementById('exitoApellidos').value = compra.cliente.apellidos;
    document.getElementById('exitoCorreo').value = compra.cliente.correo;
    document.getElementById('exitoTelefono').value = compra.cliente.telefono || 'No proporcionado';

    // Datos de dirección
    document.getElementById('exitoCalle').value = compra.direccion.calle;
    document.getElementById('exitoDepartamento').value = compra.direccion.departamento || 'No especificado';
    document.getElementById('exitoRegion').value = compra.direccion.region;
    document.getElementById('exitoComuna').value = compra.direccion.comuna;
    document.getElementById('exitoIndicaciones').value = compra.direccion.indicaciones || 'No hay indicaciones adicionales';
}

/**
 * Renderiza los productos en la tabla de éxito
 */
function renderizarProductosExito(productos) {
    const tbody = document.getElementById('tablaExitoBody');
    
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
 * Actualiza el total en la página de éxito
 */
function actualizarTotalExito(total) {
    document.getElementById('totalPagado').textContent = total.toLocaleString('es-CL');
}

/**
 * Genera e imprime la boleta en PDF
 */
function imprimirBoletaPDF() {
    try {
        const compra = JSON.parse(localStorage.getItem('ultimaCompra'));
        const fecha = new Date().toLocaleDateString('es-CL');
        const hora = new Date().toLocaleTimeString('es-CL');
        
        const contenidoBoleta = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Boleta HuertoHogar - ${compra.numeroOrden}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
                    .header { text-align: center; border-bottom: 2px solid #2E8B57; padding-bottom: 10px; margin-bottom: 20px; }
                    .header h1 { color: #2E8B57; margin: 0; }
                    .info-cliente { margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px; }
                    .tabla-productos { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .tabla-productos th, .tabla-productos td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    .tabla-productos th { background-color: #2E8B57; color: white; }
                    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 10px; border-top: 2px solid #2E8B57; }
                    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                    .producto-info { font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🌱 HuertoHogar</h1>
                    <p><strong>BOLETA ELECTRÓNICA</strong></p>
                    <p>Orden: ${compra.numeroOrden} | Fecha: ${fecha} ${hora}</p>
                </div>
                
                <div class="info-cliente">
                    <h3>Datos del Cliente</h3>
                    <p><strong>Nombre:</strong> ${compra.cliente.nombre} ${compra.cliente.apellidos}</p>
                    <p><strong>Email:</strong> ${compra.cliente.correo}</p>
                    <p><strong>Teléfono:</strong> ${compra.cliente.telefono || 'No proporcionado'}</p>
                    <p><strong>Dirección:</strong> ${compra.direccion.calle}${compra.direccion.departamento ? ', ' + compra.direccion.departamento : ''}</p>
                    <p><strong>Comuna:</strong> ${compra.direccion.comuna}, ${compra.direccion.region}</p>
                    ${compra.direccion.indicaciones ? `<p><strong>Indicaciones:</strong> ${compra.direccion.indicaciones}</p>` : ''}
                </div>
                
                <table class="tabla-productos">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${compra.productos.map(producto => `
                            <tr>
                                <td>
                                    ${producto.nombre}
                                    <div class="producto-info">${producto.unidad || 'unidad'}</div>
                                </td>
                                <td>$${producto.precio?.toLocaleString('es-CL')}</td>
                                <td>${producto.cantidad || 1}</td>
                                <td>$${((producto.precio || 0) * (producto.cantidad || 1)).toLocaleString('es-CL')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="total">
                    <p><strong>TOTAL: $${compra.total.toLocaleString('es-CL')}</strong></p>
                </div>
                
                <div class="footer">
                    <p>¡Gracias por preferir HuertoHogar!</p>
                    <p>Productos frescos y orgánicos directamente a tu hogar</p>
                    <p>Este documento es una boleta electrónica generada automáticamente</p>
                </div>
            </body>
            </html>
        `;

        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write(contenidoBoleta);
        ventanaImpresion.document.close();
        
        ventanaImpresion.onload = function() {
            ventanaImpresion.print();
            setTimeout(() => {
                ventanaImpresion.close();
            }, 500);
        };

    } catch (error) {
        console.error('Error al generar la boleta:', error);
        alert('Error al generar la boleta. Por favor, intente nuevamente.');
    }
}

/**
 * Simula el envío de la boleta por email
 */
function enviarBoletaEmail() {
    try {
        const compra = JSON.parse(localStorage.getItem('ultimaCompra'));
        const email = compra.cliente.correo;
        
        const btnEnviar = document.getElementById('btnEnviarEmail');
        const textoOriginal = btnEnviar.innerHTML;
        btnEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btnEnviar.disabled = true;
        
        // Simular envío de email
        setTimeout(() => {
            btnEnviar.innerHTML = textoOriginal;
            btnEnviar.disabled = false;
            
            Swal.fire({
                icon: 'success',
                title: '¡Boleta enviada!',
                text: `La boleta ha sido enviada exitosamente a ${email}`,
                confirmButtonText: 'Aceptar',
                timer: 3000
            });
            
        }, 2000);
        
    } catch (error) {
        console.error('Error al enviar la boleta:', error);
        
        const btnEnviar = document.getElementById('btnEnviarEmail');
        btnEnviar.innerHTML = '<i class="fas fa-envelope"></i> Enviar por Email';
        btnEnviar.disabled = false;
        
        Swal.fire({
            icon: 'error',
            title: 'Error al enviar',
            text: 'No se pudo enviar la boleta. Por favor, intente nuevamente.',
            confirmButtonText: 'Aceptar'
        });
    }
}

/**
 * Redirige al catálogo para seguir comprando
 */
function seguirComprando() {
    window.location.href = 'producto.html';
}

/**
 * Configura los eventos de la página de éxito
 */
function configurarEventosExito() {
    // Configurar botón de imprimir
    const btnImprimir = document.getElementById('btnImprimirPDF');
    if (btnImprimir) {
        btnImprimir.addEventListener('click', imprimirBoletaPDF);
    }
    
    // Configurar botón de enviar
    const btnEnviar = document.getElementById('btnEnviarEmail');
    if (btnEnviar) {
        btnEnviar.addEventListener('click', enviarBoletaEmail);
    }
    
    // Configurar botón de seguir comprando
    const btnSeguir = document.getElementById('btnSeguirComprando');
    if (btnSeguir) {
        btnSeguir.addEventListener('click', seguirComprando);
    }
}