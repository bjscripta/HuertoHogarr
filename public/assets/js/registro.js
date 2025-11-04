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

// Función para validar edad (18+ años)
function esMayorEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        return edad - 1 >= 18;
    }
    return edad >= 18;
}

// Mapeo de regiones y comunas
const regionesComunas = {
    'arica': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
    'tarapaca': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
    'antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
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

async function guardarUsuario(userData) {
    try {
        await firebase.firestore().collection("usuario").add({
            ...userData,
            createdAt: new Date()
        });
        console.log("Usuario guardado en Firebase");
        return true;
    } catch (error) {
        console.error("Error al guardar:", error);
        return false;
    }
}

// Inicializar eventos cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formRegistro");
    const runInput = document.getElementById("run");
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const correoInput = document.getElementById("correo");
    const contrasenaInput = document.getElementById("contrasena");
    const confirmarContrasenaInput = document.getElementById("confirmarContrasena");
    const direccionInput = document.getElementById("direccion");
    const regionInput = document.getElementById("region");
    const comunaInput = document.getElementById("comuna");
    const telefonoInput = document.getElementById("telefono");
    const fechaInput = document.getElementById("fechaNacimiento");
    const mensaje = document.getElementById("mensaje");

    if (!form) {
        console.log("No se encontró #formRegistro");
        return;
    }

    // Limpiar los input y mensajes flotante automáticamente
    const inputs = [runInput, nombreInput, apellidoInput, correoInput, contrasenaInput, confirmarContrasenaInput, direccionInput, telefonoInput, fechaInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener("input", () => {
                input.setCustomValidity("");
                if (mensaje) mensaje.innerText = "";
            });
        }
    });

    // Evento para cargar comunas cuando cambia la región
    if (regionInput) {
        regionInput.addEventListener("change", cargarComunas);
    }

    // Evento para verificar contraseñas en tiempo real
    if (contrasenaInput && confirmarContrasenaInput) {
        contrasenaInput.addEventListener("input", verificarCoincidenciaContrasenas);
        confirmarContrasenaInput.addEventListener("input", verificarCoincidenciaContrasenas);
    }

    // Evento principal del formulario
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
    
        // Limpiar los mensajes
        if (mensaje) mensaje.innerText = "";
    
        // La validación correcta del run
        if (runInput) runInput.value = runInput.value.trim().toUpperCase();
    
        // Guardar los valores de los input
        const run = runInput ? runInput.value : '';
        const nombre = nombreInput ? nombreInput.value.trim() : '';
        const apellido = apellidoInput ? apellidoInput.value.trim() : '';
        const correo = correoInput ? correoInput.value.trim() : '';
        const contrasena = contrasenaInput ? contrasenaInput.value : '';
        const confirmarContrasena = confirmarContrasenaInput ? confirmarContrasenaInput.value : '';
        const direccion = direccionInput ? direccionInput.value.trim() : '';
        const region = regionInput ? regionInput.value : '';
        const comuna = comunaInput ? comunaInput.value : '';
        const telefono = telefonoInput ? telefonoInput.value.trim() : '';
        const fecha = fechaInput ? fechaInput.value : '';
    
        // Validación Run
        if (!validarRun(run)) {
            if (runInput) {
                runInput.setCustomValidity("El RUN es incorrecto. Debe tener 8 dígitos + número o K verificador");
                runInput.reportValidity();
            }
            return;
        }
    
        // Validación Nombre
        if (nombre === "") {
            if (nombreInput) {
                nombreInput.setCustomValidity("El nombre es obligatorio");
                nombreInput.reportValidity();
            }
            return;
        }

        // Validación Apellido
        if (apellido === "") {
            if (apellidoInput) {
                apellidoInput.setCustomValidity("El apellido es obligatorio");
                apellidoInput.reportValidity();
            }
            return;
        }
    
        // Validación correo
        if (!validarCorreo(correo)) {
            if (correoInput) {
                correoInput.setCustomValidity("El correo debe ser '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'");
                correoInput.reportValidity();
            }
            return;
        }

        // Validación contraseña
        if (!contrasena || contrasena.length < 6) {
            if (contrasenaInput) {
                contrasenaInput.setCustomValidity("La contraseña debe tener al menos 6 caracteres");
                contrasenaInput.reportValidity();
            }
            return;
        }

        // Validación confirmación de contraseña
        if (contrasena !== confirmarContrasena) {
            if (confirmarContrasenaInput) {
                confirmarContrasenaInput.setCustomValidity("Las contraseñas no coinciden");
                confirmarContrasenaInput.reportValidity();
            }
            return;
        }

        // Validación dirección
        if (!direccion) {
            if (direccionInput) {
                direccionInput.setCustomValidity("La dirección es obligatoria");
                direccionInput.reportValidity();
            }
            return;
        }

        // Validación región
        if (!region) {
            if (regionInput) {
                regionInput.setCustomValidity("Debe seleccionar una región");
                regionInput.reportValidity();
            }
            return;
        }

        // Validación comuna
        if (!comuna) {
            if (comunaInput) {
                comunaInput.setCustomValidity("Debe seleccionar una comuna");
                comunaInput.reportValidity();
            }
            return;
        }
    
        // Validación de Edad (si existe fecha)
        if (fecha && !esMayorEdad(fecha)) {
            if (fechaInput) {
                fechaInput.setCustomValidity("Debe ser mayor a 18 años para registrarse");
                fechaInput.reportValidity();
            }
            return;
        }
    
        // Todos los datos son correctos
        let nombreUsuario = nombre;
        if (mensaje) {
            mensaje.innerText = `Formulario enviado correctamente`;
            mensaje.style.color = "green";
        }
    
        // Aquí iría la lógica para enviar a Firebase
        
        const userData = {
            run,
            nombre,
            apellido,
            correo,
            clave: contrasena, // ¡IMPORTANTE!
            direccion,
            region,
            comuna,
            telefono: telefono || null,
            fecha: fecha || null,
            fechaRegistro: new Date().toISOString()
        };

        const guardadoExitoso = await guardarUsuario(userData);

        if (guardadoExitoso) {
            if (mensaje) {
                mensaje.innerText = "Usuario registrado correctamente";
                mensaje.style.color = "green";
            }
        } else {
            if (mensaje) {
                mensaje.innerText = "Error al guardar en la base de datos";
                mensaje.style.color = "red";
            }
        }


        // Redirección (descomentar cuando esté listo)
        /*
        const destino = correo.toLowerCase() === "admin@duoc.cl" ?
            `assets/page/perfilAdmin.html?nombre=${encodeURIComponent(nombreUsuario)}` :
            `assets/page/perfilCliente.html?nombre=${encodeURIComponent(nombreUsuario)}`;

        setTimeout(() => {
            window.location.href = destino;
        }, 1000);
        */
    });
});