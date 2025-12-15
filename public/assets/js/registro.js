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

// ========== FUNCIONES DE VALIDACIÓN ==========

// Función SIMPLIFICADA para validar RUN
function validarRun(run) {
    run = run.trim().toUpperCase();
    const regex = /^\d{7,8}-[\dkK]$/;
    return regex.test(run);
}

// Función para validar correo electrónico
function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

// Función para validar edad (18+ años) - OPCIONAL
function esMayorEdad(fechaNacimiento) {
    if (!fechaNacimiento) return true;
    
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

// ========== FUNCIÓN PRINCIPAL MEJORADA: guardarUsuario ==========
async function guardarUsuario(userData) {
    try {
        console.log('🔧 Creando usuario con datos:', {
            correo: userData.correo,
            nombre: userData.nombre,
            apellido: userData.apellido
        });
        
        // 1. CREAR USUARIO EN FIREBASE AUTHENTICATION
        console.log('📝 Paso 1: Creando en Firebase Authentication...');
        const userCredential = await auth.createUserWithEmailAndPassword(
            userData.correo, 
            userData.clave
        );
        
        const user = userCredential.user;
        const userId = user.uid;
        console.log('✅ Usuario creado en Auth. UID:', userId);
        
        // 2. PREPARAR DATOS PARA FIRESTORE
        const usuarioFirestore = {
            uid: userId, // ¡IMPORTANTE! Guardar el UID de Auth
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
            rol: 'cliente', // TODOS los nuevos usuarios son 'cliente' por defecto
            activo: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log('📝 Paso 2: Guardando en Firestore...', usuarioFirestore);
        
        // 3. GUARDAR EN FIRESTORE (colección 'usuario')
        // IMPORTANTE: Usamos .doc(userId) para que el ID del documento sea el mismo UID
        await db.collection("usuario").doc(userId).set(usuarioFirestore);
        
        console.log('✅ Usuario guardado en Firestore. Document ID:', userId);
        
        // 4. OPCIONAL: Actualizar el perfil en Auth
        await user.updateProfile({
            displayName: `${userData.nombre} ${userData.apellido}`
        });
        
        return { 
            success: true, 
            userId: userId,
            message: 'Usuario creado exitosamente en Auth y Firestore'
        };
        
    } catch (error) {
        console.error('❌ ERROR en guardarUsuario:', error);
        
        let errorMessage = "Error al registrar el usuario";
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Este correo electrónico ya está registrado";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "La contraseña debe tener al menos 6 caracteres";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "El correo electrónico no es válido";
        } else if (error.code === 'permission-denied') {
            errorMessage = "Error de permisos en Firestore. Verifica las reglas.";
        } else if (error.code === 'firestore/unavailable') {
            errorMessage = "Firestore no está disponible. Revisa tu conexión.";
        } else {
            errorMessage = `Error: ${error.message}`;
        }
        
        // Si falló después de crear en Auth, intentar eliminar el usuario de Auth
        if (auth.currentUser) {
            try {
                await auth.currentUser.delete();
                console.log('Usuario eliminado de Auth debido a error en Firestore');
            } catch (deleteError) {
                console.error('Error eliminando usuario de Auth:', deleteError);
            }
        }
        
        return { 
            success: false, 
            error: errorMessage,
            errorCode: error.code
        };
    }
}

// ========== FUNCIÓN ADICIONAL: Crear usuario Admin manualmente ==========
async function crearUsuarioAdminManual() {
    if (confirm('¿Crear usuario admin@duoc.cl manualmente?')) {
        try {
            const correoAdmin = 'admin@duoc.cl';
            const claveAdmin = 'admin123'; // Cambia esto por una contraseña segura
            
            console.log('🛠 Creando usuario admin manualmente...');
            
            // 1. Crear en Auth
            const userCredential = await auth.createUserWithEmailAndPassword(correoAdmin, claveAdmin);
            const userId = userCredential.user.uid;
            
            // 2. Crear en Firestore
            const adminData = {
                uid: userId,
                run: '11111111-1',
                nombre: 'Administrador',
                apellido: 'Sistema',
                correo: correoAdmin,
                telefono: '+56 9 1234 5678',
                direccion: 'Oficina Central',
                region: 'metropolitana',
                comuna: 'santiago',
                fecha: '1990-01-01',
                fechaRegistro: new Date().toISOString(),
                rol: 'admin', // ¡ROL DE ADMINISTRADOR!
                activo: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection("usuario").doc(userId).set(adminData);
            
            alert(`✅ Usuario admin creado:
Correo: ${correoAdmin}
Contraseña: ${claveAdmin}
UID: ${userId}

⚠️ IMPORTANTE: Cambia la contraseña en tu primer inicio de sesión.`);
            
            console.log('Usuario admin creado:', adminData);
            
        } catch (error) {
            console.error('Error creando admin:', error);
            alert('Error creando admin: ' + error.message);
        }
    }
}

// ========== INICIALIZACIÓN ==========

document.addEventListener("DOMContentLoaded", function() {
    console.log('🚀 DOM cargado. Inicializando registro...');
    
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
        console.log('📋 Formulario enviado...');
        
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
        
        console.log('📊 Validando datos...', { correo, nombre, apellido, region });
        
        // Validaciones
        if (!validarRun(run)) {
            mostrarError('RUN inválido. Formato: 12345678-9 (8 dígitos + guión + dígito/K)');
            return;
        }
        
        if (!nombre) {
            mostrarError('El nombre es obligatorio');
            return;
        }
        
        if (!apellido) {
            mostrarError('El apellido es obligatorio');
            return;
        }
        
        if (!validarCorreo(correo)) {
            mostrarError('Correo inválido. Debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com');
            return;
        }
        
        if (!contrasena || contrasena.length < 6) {
            mostrarError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        if (contrasena !== confirmarContrasena) {
            mostrarError('Las contraseñas no coinciden');
            return;
        }
        
        if (!direccion) {
            mostrarError('La dirección es obligatoria');
            return;
        }
        
        if (!region) {
            mostrarError('Debe seleccionar una región');
            return;
        }
        
        if (!comuna) {
            mostrarError('Debe seleccionar una comuna');
            return;
        }
        
        if (fecha && !esMayorEdad(fecha)) {
            mostrarError('Debe ser mayor de 18 años');
            return;
        }
        
        // Mostrar carga
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Registrando...';
        submitBtn.disabled = true;
        
        mostrarInfo('Registrando usuario en el sistema...');
        
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
            fecha: fecha || ''
        };
        
        // Guardar usuario
        console.log('🔄 Llamando a guardarUsuario...');
        const resultado = await guardarUsuario(userData);
        
        if (resultado.success) {
            console.log('✅ Registro exitoso. Redirigiendo...');
            mostrarExito('✓ Usuario registrado correctamente. Redirigiendo...');
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = '../page/perfCliente.html';
            }, 2000);
            
        } else {
            console.error('❌ Error en registro:', resultado.error);
            mostrarError(`Error: ${resultado.error} ${resultado.errorCode ? `(Código: ${resultado.errorCode})` : ''}`);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Función auxiliar para mostrar mensajes
    function mostrarError(mensaje) {
        mensajeElement.textContent = mensaje;
        mensajeElement.className = 'mt-3 alert alert-danger';
        console.error('❌ Error:', mensaje);
    }
    
    function mostrarExito(mensaje) {
        mensajeElement.textContent = mensaje;
        mensajeElement.className = 'mt-3 alert alert-success';
        console.log('✅ Éxito:', mensaje);
    }
    
    function mostrarInfo(mensaje) {
        mensajeElement.textContent = mensaje;
        mensajeElement.className = 'mt-3 alert alert-info';
        console.log('ℹ️ Info:', mensaje);
    }
    
});

// Verificar que Firebase esté funcionando
console.log('🔥 Firebase inicializado:', firebase.apps.length > 0 ? 'SÍ' : 'NO');