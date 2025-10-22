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
document.addEventListener("formUsuario").addEventListener("submit", function(e) {
    const runInput = document.getElementById("run");
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const fechaInput = document.getElementById("fecha");
    const mensaje = document.getElementById("mensaje");

    //limpiar los input y mensajes flotante automaticamente
    [runInput, nombreInput, correoInput, fechaInput].forEach(input => {
        input.addEventListener("input", () => {
            input.setCustomValidity("");
            mensaje.innerText = "";
        });
    });

    document.getElementById("formUsuario").addEventListener("submit", function(e) {
        e.preventDefault();
    
        //limpiar los mensajes
        mensaje.innerText = "";
    
        //La validación correcta del run
        runInput.value = runInput.value.trim().toUpperCase();
    
        //Guardar los valores de los otros input
        const run = runInput.value;
        const nombre = nombreInput.value.trim();
        const correo = correoInput.value.trim();
        const fecha = fechaInput.value;
    
        //Validación Run
        if(!validarRun(run)) {
            runInput.setCustomValidity("El RUN es incorrecto. Debe tener 8 dígitos + número o K verificador");
            runInput.reportValidity();
            return;
        }
    
        //Validación Nombre
        if (nombre === "") {
            nombreInput.setCustomValidity("El nombres es obligatorio")
            nombreInput.reportValidity();
            return;
        }
    
        //Validación correo
        if (!validarCorreo(correo)) {
            correoInput.setCustomValidity("El correo debe ser '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'");
            correoInput.reportValidity();
            return;
        }
    
        //Validación de Edad
        if (!esMayorEdad(fecha)) {
            fechaInput.setCustomValidity("Debe seer mayor a 18 años para registrarse");
            fechaInput.reportValidity();
            return;
        }
    
        //Todos los datos sean correctos
        let nombreUsuario = nombre;
        mensaje.innerText = `Formulario enviado correctamente` //alt gr + tecla }]`
    
        //Redirección a las paginas del perfil para el Admin o Cliente
        //const destino = correo.toLowerCase() === "admin@duoc.cl" ?
        //    `assets/page/perfilAdmin.html?nombre=${encodeURIComponent(nombreUsuario)}` :
        //    `assets/page/perfilCliente.html?nombre=${encodeURIComponent(nombreUsuario)}`;
    
        //Tiempo de reacción al redirigir
        //setTimeout(() => {
          //  window.location.href = destino;
        //}, 1000);
        
    
    });
});