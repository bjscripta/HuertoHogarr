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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ========== FUNCIONES DE VALIDACIÓN SIMPLIFICADAS ==========

// Función SIMPLIFICADA para validar RUN - solo formato, no algoritmo
function validarRun(run) {
    // Eliminar espacios y convertir a mayúsculas
    run = run.trim().toUpperCase();
    
    // Verificar formato: 7-8 dígitos + guión + dígito/K
    // Ejemplos válidos: 12345678-9, 1234567-8, 12345678-K
    const regex = /^\d{7,8}-[\dkK]$/;
    return regex.test(run);
}

// Función para validar correo electrónico
function validarCorreo(correo) {
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominiosPermitidos.some(dominio => correo.toLowerCase().endsWith(dominio));
}

// Función para validar edad (18+ años) - OPCIONAL
function esMayorEdad(fechaNacimiento) {
    if (!fechaNacimiento) return true; // Si no hay fecha, es válido
    
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
    'atacama': ['Copiapó', 'Caldera', 'Vallenar', 'Huasco', 'Tierra Amarilla', 'Freirina', 'Alto del Carmen'],
    'coquimbo': ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Los Vilos', 'Salamanca', 'Vicuña', 'Andacollo'],
    'valparaiso': ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Quillota', 'Los Andes', 'San Felipe'],
    'metropolitana': ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'],
    'ohiggins': ['Rancagua', 'Machalí', 'Graneros', 'Codegua', 'San Fernando', 'Rengo', 'Santa Cruz', 'San Vicente', 'Pichilemu'],
    'maule': ['Talca', 'Curicó', 'Linares', 'Constitución', 'Cauquenes', 'Parral', 'San Javier', 'Molina'],
    'nuble': ['Chillán', 'Chillán Viejo', 'Bulnes', 'Quillón', 'San Carlos', 'San Ignacio', 'Yungay'],
    'biobio': ['Concepción', 'Talcahuano', 'Chiguayante', 'San Pedro de la Paz', 'Coronel', 'Lota', 'Tomé', 'Penco', 'Los Ángeles'],
    'araucania': ['Temuco', 'Padre las Casas', 'Villarrica', 'Pucón', 'Angol', 'Victoria', 'Lautaro', 'Collipulli'],
    'losrios': ['Valdivia', 'La Unión', 'Paillaco', 'Río Bueno', 'Los Lagos', 'Panguipulli', 'Máfil'],
    'loslagos': ['Puerto Montt', 'Osorno', 'Puerto Varas', 'Ancud', 'Castro', 'Quellón', 'Frutillar', 'Llanquihue'],
    'aysen': ['Coyhaique', 'Aysén', 'Puerto Aysén', 'Chile Chico', 'Cochrane', 'Puerto Cisnes'],
    'magallanes': ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Puerto Williams', 'Cabo de Hornos']
};

// Función para cargar comunas
function cargarComunas() {
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');
    
    if (!regionSelect || !comunaSelect) return;
    
    // Limpiar comuna
    comunaSelect.innerHTML = '';
    
    const regionId = regionSelect.value;
    
    if (regionId) {
        comunaSelect.disabled = false;
        const comunas = regionesComunas[regionId] || [];
        
        // Opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona una comuna';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        comunaSelect.appendChild(defaultOption);
        
        // Agregar comunas
        comunas.forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna.toLowerCase().replace(/\s+/g, '_');
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    } else {
        comunaSelect.disabled = true;
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Primero selecciona una región';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        comunaSelect.appendChild(defaultOption);
    }
}

// Función para verificar contraseñas
function verificarCoincidenciaContrasenas() {
    const contrasena = document.getElementById('contrasena');
    const confirmarContrasena = document.getElementById('confirmarContrasena');
    const mensaje = document.getElementById('passwordMatchMessage');
    
    if (!contrasena || !confirmarContrasena || !mensaje) return false;
    
    const pass1 = contrasena.value;
    const pass2 = confirmarContrasena.value;
    
    if (pass1 && pass2) {
        if (pass1 === pass2) {
            mensaje.textContent = '✓ Las contraseñas coinciden';
            mensaje.className = 'password-match success';
            return true;
        } else {
            mensaje.textContent = '✗ Las contraseñas no coinciden';
            mensaje.className = 'password-match error';
            return false;
        }
    }
    return false;
}

// Función para guardar usuario
async function guardarUsuario(userData) {
    try {
        // 1. Crear usuario en Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(
            userData.correo, 
            userData.clave
        );
        
        const userId = userCredential.user.uid;
        
        // 2. Guardar datos en Firestore
        const usuarioData = {
            run: userData.run,
            nombre: userData.nombre,
            apellido: userData.apellido,
            correo: userData.correo.toLowerCase(),
            telefono: userData.telefono || '',
            direccion: userData.direccion,
            region: userData.region,
            comuna: userData.comuna,
            fecha: userData.fecha || '',
            fechaRegistro: new Date().toISOString(),
            uid: userId,
            rol: 'cliente',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection("usuario").add(usuarioData);
        
        return { success: true, userId: userId };
        
    } catch (error) {
        let errorMessage = "Error al registrar el usuario";
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Este correo electrónico ya está registrado";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "La contraseña debe tener al menos 6 caracteres";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "El correo electrónico no es válido";
        } else {
            errorMessage = `Error: ${error.message}`;
        }
        
        return { success: false, error: errorMessage };
    }
}

// ========== INICIALIZACIÓN ==========

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formRegistro");
    
    if (!form) {
        console.error("No se encontró el formulario de registro");
        return;
    }

    // Crear elemento para mensajes
    let mensajeElement = document.getElementById("mensaje");
    if (!mensajeElement) {
        mensajeElement = document.createElement("div");
        mensajeElement.id = "mensaje";
        mensajeElement.className = "mt-3";
        const btn = form.querySelector('.btn-register');
        if (btn) {
            btn.parentNode.insertBefore(mensajeElement, btn.nextSibling);
        }
    }

    // Configurar eventos
    const regionInput = document.getElementById('region');
    if (regionInput) {
        regionInput.addEventListener('change', cargarComunas);
    }
    
    // Verificación de contraseñas en tiempo real
    const contrasenaInput = document.getElementById('contrasena');
    const confirmarContrasenaInput = document.getElementById('confirmarContrasena');
    if (contrasenaInput && confirmarContrasenaInput) {
        contrasenaInput.addEventListener('input', verificarCoincidenciaContrasenas);
        confirmarContrasenaInput.addEventListener('input', verificarCoincidenciaContrasenas);
    }
    
    // Auto-formatear RUN
    const runInput = document.getElementById('run');
    if (runInput) {
        runInput.addEventListener('input', function(e) {
            let valor = e.target.value.toUpperCase().replace(/[^0-9K\-]/g, '');
            
            // Auto-insertar guión después de 7-8 dígitos
            if (valor.length > 7 && !valor.includes('-')) {
                const cuerpo = valor.slice(0, 8); // Toma máximo 8 dígitos
                const resto = valor.slice(8);
                e.target.value = cuerpo + (resto ? '-' + resto : '');
            } else {
                e.target.value = valor;
            }
        });
    }

    // Evento de envío del formulario
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        // Limpiar mensajes
        mensajeElement.textContent = '';
        mensajeElement.className = 'mt-3';
        
        // Obtener valores
        const run = document.getElementById('run').value.trim().toUpperCase();
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const contrasena = document.getElementById('contrasena').value;
        const confirmarContrasena = document.getElementById('confirmarContrasena').value;
        const direccion = document.getElementById('direccion').value.trim();
        const region = document.getElementById('region').value;
        const comuna = document.getElementById('comuna').value;
        const telefono = document.getElementById('telefono').value.trim();
        const fecha = document.getElementById('fechaNacimiento').value;
        
        // Validaciones
        if (!validarRun(run)) {
            mensajeElement.textContent = 'RUN inválido. Formato: 12345678-9 (8 dígitos + guión + dígito/K)';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        if (!nombre) {
            mensajeElement.textContent = 'El nombre es obligatorio';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        if (!apellido) {
            mensajeElement.textContent = 'El apellido es obligatorio';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        if (!validarCorreo(correo)) {
            mensajeElement.textContent = 'Correo inválido. Debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        if (!contrasena || contrasena.length < 6) {
            mensajeElement.textContent = 'La contraseña debe tener al menos 6 caracteres';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        if (contrasena !== confirmarContrasena) {
            mensajeElement.textContent = 'Las contraseñas no coinciden';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        if (!direccion) {
            mensajeElement.textContent = 'La dirección es obligatoria';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        if (!region) {
            mensajeElement.textContent = 'Debe seleccionar una región';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        if (!comuna) {
            mensajeElement.textContent = 'Debe seleccionar una comuna';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        if (fecha && !esMayorEdad(fecha)) {
            mensajeElement.textContent = 'Debe ser mayor de 18 años';
            mensajeElement.className = 'alert alert-danger';
            return;
        }
        
        // Mostrar carga
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Registrando...';
        submitBtn.disabled = true;
        
        mensajeElement.textContent = 'Registrando usuario...';
        mensajeElement.className = 'alert alert-info';
        
        // Datos para guardar
        const userData = {
            run: run,
            nombre: nombre,
            apellido: apellido,
            correo: correo.toLowerCase(),
            clave: contrasena,
            direccion: direccion,
            region: region,
            comuna: comuna,
            telefono: telefono || '',
            fecha: fecha || '',
            fechaRegistro: new Date().toISOString()
        };
        
        // Guardar usuario
        const resultado = await guardarUsuario(userData);
        
        if (resultado.success) {
            mensajeElement.textContent = '✓ Usuario registrado correctamente. Redirigiendo...';
            mensajeElement.className = 'alert alert-success';
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = '../page/perfCliente.html';
            }, 2000);
            
        } else {
            mensajeElement.textContent = resultado.error;
            mensajeElement.className = 'alert alert-danger';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});