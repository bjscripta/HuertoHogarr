// Función para validar el RUN chileno
function validarRun(run) {
    // Eliminar espacios y convertir a mayúsculas
    run = run.trim().toUpperCase();
    
    // Verificar formato básico (7-9 dígitos + dígito verificador)
    if (!/^[0-9]{7,9}-[0-9K]$/.test(run)) {
        return false;
    }
    
    // Separar el cuerpo del dígito verificador
    const partes = run.split('-');
    const cuerpo = partes[0];
    let dv = partes[1];
    
    // Si es K, convertir a 10
    if (dv === 'K') dv = '10';
    
    // Calcular dígito verificador esperado
    let suma = 0;
    let multiplicador = 2;
    
    // Recorrer el cuerpo de derecha a izquierda
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? 0 : dvEsperado === 10 ? 'K' : dvEsperado;
    
    // Comparar con el dígito verificador ingresado
    return dvCalculado.toString() === dv;
}

// Función para validar correo electrónico
function validarCorreo(correo) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominiosPermitidos.some(dominio => correo.endsWith(dominio));
}

// Mapeo de regiones y comunas (ejemplo simplificado)
const regionesComunas = {
    'arica': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
    'tarapaca': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
    'antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
    // ... agregar más regiones y comunas según sea necesario
    'metropolitana': ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor']
};

// Función para cargar comunas según la región seleccionada
function cargarComunas() {
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    
    // Limpiar select de comuna
    comunaSelect.innerHTML = '';
    
    // Obtener valor de la región seleccionada
    const regionId = regionSelect.value;
    
    if (regionId) {
        // Habilitar select de comuna
        comunaSelect.disabled = false;
        
        // Obtener comunas para la región seleccionada
        const comunas = regionesComunas[regionId] || [];
        
        // Crear opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona una comuna';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        comunaSelect.appendChild(defaultOption);
        
        // Agregar opciones para cada comuna
        comunas.forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna.toLowerCase().replace(/\s+/g, '_');
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    } else {
        // Si no hay región seleccionada, deshabilitar y resetear comuna
        comunaSelect.disabled = true;
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Primero selecciona una región';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        comunaSelect.appendChild(defaultOption);
    }
}

// Función para verificar coincidencia de contraseñas
function verificarCoincidenciaContrasenas() {
    const contrasena = document.getElementById('contrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    const mensaje = document.getElementById('passwordMatchMessage');
    
    if (contrasena && confirmarContrasena) {
        if (contrasena === confirmarContrasena) {
            mensaje.textContent = 'Las contraseñas coinciden';
            mensaje.className = 'password-match success';
            return true;
        } else {
            mensaje.textContent = 'Las contraseñas no coinciden';
            mensaje.className = 'password-match error';
            return false;
        }
    }
    return false;
}

// Función principal de validación del formulario
function validarFormulario(event) {
    event.preventDefault();
    
    // Obtener valores de los campos
    const run = document.getElementById('run').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;
    const direccion = document.getElementById('direccion').value;
    
    // Validar RUN
    if (!run) {
        alert('El RUN es requerido');
        return false;
    }
    
    if (run.length < 7 || run.length > 10) { // Incluye el guión
        alert('El RUN debe tener entre 7 y 9 dígitos más el guión y dígito verificador');
        return false;
    }
    
    if (!validarRun(run)) {
        alert('El RUN ingresado no es válido');
        return false;
    }
    
    // Validar nombre
    if (!nombre) {
        alert('El nombre es requerido');
        return false;
    }
    
    if (nombre.length > 50) {
        alert('El nombre no puede exceder los 50 caracteres');
        return false;
    }
    
    // Validar apellido
    if (!apellido) {
        alert('El apellido es requerido');
        return false;
    }
    
    if (apellido.length > 100) {
        alert('El apellido no puede exceder los 100 caracteres');
        return false;
    }
    
    // Validar correo
    if (!correo) {
        alert('El correo electrónico es requerido');
        return false;
    }
    
    if (correo.length > 100) {
        alert('El correo electrónico no puede exceder los 100 caracteres');
        return false;
    }
    
    if (!validarCorreo(correo)) {
        alert('Solo se permiten correos con los dominios @duoc.cl, @profesor.duoc.cl y @gmail.com');
        return false;
    }
    
    // Validar región y comuna
    if (!region) {
        alert('Debe seleccionar una región');
        return false;
    }
    
    if (!comuna) {
        alert('Debe seleccionar una comuna');
        return false;
    }
    
    // Validar dirección
    if (!direccion) {
        alert('La dirección es requerida');
        return false;
    }
    
    if (direccion.length > 300) {
        alert('La dirección no puede exceder los 300 caracteres');
        return false;
    }
    
    // Validar coincidencia de contraseñas
    if (!verificarCoincidenciaContrasenas()) {
        alert('Las contraseñas no coinciden');
        return false;
    }
    
    // Si todas las validaciones pasan, se puede enviar el formulario
    alert('Formulario validado correctamente. Enviando datos...');
    // Aquí normalmente se enviarían los datos al servidor
    // form.submit();
}

// Inicializar eventos cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Asignar evento al formulario
    const formulario = document.getElementById('formRegistro');
    if (formulario) {
        formulario.addEventListener('submit', validarFormulario);
    }
    
    // Asignar evento al select de región
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        regionSelect.addEventListener('change', cargarComunas);
    }
    
    // Asignar eventos a los campos de contraseña
    const contrasenaInput = document.getElementById('contrasena');
    const confirmarContrasenaInput = document.getElementById('confirmarContrasena');
    
    if (contrasenaInput && confirmarContrasenaInput) {
        contrasenaInput.addEventListener('input', verificarCoincidenciaContrasenas);
        confirmarContrasenaInput.addEventListener('input', verificarCoincidenciaContrasenas);
    }
    
    // Formatear RUN mientras se escribe
    const runInput = document.getElementById('run');
    if (runInput) {
        runInput.addEventListener('input', function(e) {
            // Eliminar cualquier caracter que no sea número o K
            let value = e.target.value.replace(/[^0-9Kk]/g, '').toUpperCase();
            
            // Insertar guión antes del último caracter si hay más de 1 caracter
            if (value.length > 1) {
                value = value.slice(0, -1) + '-' + value.slice(-1);
            }
            
            e.target.value = value;
        });
    }
});