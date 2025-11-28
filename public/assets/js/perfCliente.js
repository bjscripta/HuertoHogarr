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
const auth = firebase.auth();
const db = firebase.firestore();

// Variables globales
let currentUser = null;
let userData = null;

// Mapeo de regiones y comunas
const regionesComunas = {
    'arica': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
    'tarapaca': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
    'antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
    'metropolitana': ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor']
};

// Función para formatear nombres de regiones y comunas
function formatearNombre(texto) {
    if (!texto) return '-';
    return texto
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Función para cargar comunas en el formulario de edición
function cargarComunasEdit() {
    const regionSelect = document.getElementById('editRegion');
    const comunaSelect = document.getElementById('editComuna');
    
    comunaSelect.innerHTML = '';
    const regionId = regionSelect.value;
    
    if (regionId) {
        comunaSelect.disabled = false;
        const comunas = regionesComunas[regionId] || [];
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona una comuna';
        defaultOption.disabled = true;
        comunaSelect.appendChild(defaultOption);
        
        comunas.forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna.toLowerCase().replace(/\s+/g, '_');
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
        
        // Si hay datos de usuario, seleccionar la comuna actual
        if (userData && userData.comuna) {
            setTimeout(() => {
                comunaSelect.value = userData.comuna;
            }, 100);
        }
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

// Función para verificar coincidencia de contraseñas
function verificarCoincidenciaContrasenas() {
    const contrasena = document.getElementById('editContrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    const mensaje = document.getElementById('passwordMatchMessage');
    
    if (contrasena && confirmarContrasena) {
        if (contrasena === confirmarContrasena) {
            mensaje.textContent = '✓ Las contraseñas coinciden';
            mensaje.className = 'form-text text-success';
            return true;
        } else {
            mensaje.textContent = '✗ Las contraseñas no coinciden';
            mensaje.className = 'form-text text-danger';
            return false;
        }
    } else if (!contrasena && !confirmarContrasena) {
        mensaje.textContent = '';
        return true; // No hay cambio de contraseña
    }
    mensaje.textContent = '';
    return false;
}

// Función para mostrar/ocultar secciones
function showSection(section) {
    document.getElementById('profileSection').style.display = section === 'profile' ? 'block' : 'none';
    document.getElementById('editSection').style.display = section === 'edit' ? 'block' : 'none';
    
    // Actualizar pestañas activas
    document.querySelectorAll('.nav-pills .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Si es la sección de edición, cargar los datos en el formulario
    if (section === 'edit') {
        cargarDatosEnFormulario();
    }
}

// Función para cargar datos en el formulario de edición
function cargarDatosEnFormulario() {
    if (userData) {
        document.getElementById('editNombre').value = userData.nombre || '';
        document.getElementById('editApellido').value = userData.apellido || '';
        document.getElementById('editCorreo').value = userData.correo || '';
        document.getElementById('editTelefono').value = userData.telefono || '';
        document.getElementById('editDireccion').value = userData.direccion || '';
        
        // Configurar región y comuna
        if (userData.region) {
            document.getElementById('editRegion').value = userData.region;
            cargarComunasEdit();
        }
        
        // Limpiar campos de contraseña
        document.getElementById('editContrasena').value = '';
        document.getElementById('confirmarContrasena').value = '';
        document.getElementById('passwordMatchMessage').textContent = '';
    }
}

// Función para actualizar la interfaz con los datos del usuario
function actualizarInterfazUsuario() {
    if (userData) {
        console.log('Actualizando interfaz con:', userData);
        
        // Actualizar nombre en diferentes lugares
        const userName = userData.nombre || 'Usuario';
        const userLastName = userData.apellido || '';
        const fullName = `${userName} ${userLastName}`.trim();
        
        document.getElementById('userFullName').textContent = fullName || 'Usuario';
        document.getElementById('userNameNav').textContent = userName;
        
        // Actualizar avatar con primera letra del nombre
        const firstLetter = userName.charAt(0).toUpperCase();
        document.getElementById('userAvatarNav').textContent = firstLetter;
        document.getElementById('avatarText').textContent = firstLetter;
        
        // Actualizar otros datos
        document.getElementById('userEmail').textContent = userData.correo || 'No especificado';
        document.getElementById('profileName').textContent = userData.nombre || '-';
        document.getElementById('profileLastName').textContent = userData.apellido || '-';
        document.getElementById('profileEmail').textContent = userData.correo || '-';
        document.getElementById('profileRun').textContent = userData.run || '-';
        document.getElementById('profilePhone').textContent = userData.telefono || 'No especificado';
        document.getElementById('profileAddress').textContent = userData.direccion || '-';
        document.getElementById('profileRegion').textContent = formatearNombre(userData.region);
        document.getElementById('profileComuna').textContent = formatearNombre(userData.comuna);
    }
}

// Función para mostrar alertas
function mostrarAlerta(tipo, mensaje) {
    const alertElement = tipo === 'success' ? document.getElementById('successAlert') : document.getElementById('errorAlert');
    const messageElement = tipo === 'success' ? document.getElementById('successMessage') : document.getElementById('errorMessage');
    
    messageElement.textContent = mensaje;
    alertElement.style.display = 'block';
    
    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}

// Función para obtener datos del usuario desde Firestore
async function obtenerDatosUsuario(uid) {
    try {
        console.log('Buscando usuario con UID:', uid);
        
        const userDoc = await db.collection('usuario')
            .where('correo', '==', currentUser.email)
            .get();
        
        if (!userDoc.empty) {
            userData = userDoc.docs[0].data();
            userData.id = userDoc.docs[0].id;
            console.log('Datos del usuario encontrados:', userData);
            actualizarInterfazUsuario();
        } else {
            console.error('No se encontraron datos del usuario en Firestore para:', currentUser.email);
            mostrarAlerta('error', 'No se pudieron cargar los datos del perfil');
        }
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        mostrarAlerta('error', 'Error al cargar los datos del perfil');
    }
}

// Función para actualizar datos en Firestore
async function actualizarDatosFirestore(datosActualizados) {
    try {
        await db.collection('usuario').doc(userData.id).update(datosActualizados);
        return true;
    } catch (error) {
        console.error('Error al actualizar en Firestore:', error);
        return false;
    }
}

// Función para actualizar email en Firebase Auth
async function actualizarEmailAuth(nuevoEmail) {
    try {
        await currentUser.updateEmail(nuevoEmail);
        return true;
    } catch (error) {
        console.error('Error al actualizar email en Auth:', error);
        throw error;
    }
}

// Función para actualizar contraseña en Firebase Auth
async function actualizarPasswordAuth(nuevaPassword) {
    try {
        await currentUser.updatePassword(nuevaPassword);
        return true;
    } catch (error) {
        console.error('Error al actualizar contraseña en Auth:', error);
        throw error;
    }
}

// Mostrar/ocultar loading
function setLoading(loading) {
    const submitBtn = document.getElementById('submitBtn');
    if (loading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
        document.getElementById('editProfileForm').classList.add('loading');
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-check-lg me-2"></i>Guardar Cambios';
        document.getElementById('editProfileForm').classList.remove('loading');
    }
}

// Manejar el formulario de edición
document.getElementById('editProfileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
        // Verificar coincidencia de contraseñas si se están cambiando
        const nuevaContrasena = document.getElementById('editContrasena').value;
        const confirmarContrasena = document.getElementById('confirmarContrasena').value;
        
        if (nuevaContrasena && nuevaContrasena !== confirmarContrasena) {
            mostrarAlerta('error', 'Las contraseñas no coinciden');
            setLoading(false);
            return;
        }
        
        if (nuevaContrasena && nuevaContrasena.length < 6) {
            mostrarAlerta('error', 'La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }
        
        // Obtener datos del formulario
        const datosActualizados = {
            nombre: document.getElementById('editNombre').value.trim(),
            apellido: document.getElementById('editApellido').value.trim(),
            correo: document.getElementById('editCorreo').value.trim(),
            telefono: document.getElementById('editTelefono').value.trim(),
            direccion: document.getElementById('editDireccion').value.trim(),
            region: document.getElementById('editRegion').value,
            comuna: document.getElementById('editComuna').value,
            fechaActualizacion: new Date().toISOString()
        };
        
        // Validar campos requeridos
        if (!datosActualizados.nombre || !datosActualizados.apellido || !datosActualizados.correo || 
            !datosActualizados.direccion || !datosActualizados.region || !datosActualizados.comuna) {
            mostrarAlerta('error', 'Por favor completa todos los campos obligatorios');
            setLoading(false);
            return;
        }
        
        // Actualizar email en Auth si cambió
        if (datosActualizados.correo !== userData.correo) {
            try {
                await actualizarEmailAuth(datosActualizados.correo);
            } catch (error) {
                mostrarAlerta('error', 'Error al actualizar el correo electrónico: ' + error.message);
                setLoading(false);
                return;
            }
        }
        
        // Actualizar contraseña en Auth si se proporcionó una nueva
        if (nuevaContrasena) {
            try {
                await actualizarPasswordAuth(nuevaContrasena);
            } catch (error) {
                mostrarAlerta('error', 'Error al actualizar la contraseña: ' + error.message);
                setLoading(false);
                return;
            }
        }
        
        // Actualizar datos en Firestore
        const firestoreActualizado = await actualizarDatosFirestore(datosActualizados);
        
        if (firestoreActualizado) {
            // Actualizar datos locales
            userData = { ...userData, ...datosActualizados };
            actualizarInterfazUsuario();
            mostrarAlerta('success', 'Perfil actualizado correctamente');
            setTimeout(() => showSection('profile'), 1000);
        } else {
            mostrarAlerta('error', 'Error al actualizar los datos del perfil');
        }
        
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        mostrarAlerta('error', 'Error al actualizar el perfil: ' + error.message);
    } finally {
        setLoading(false);
    }
});

// Función de logout
function logout() {
    auth.signOut().then(() => {
        window.location.href = '../../index.html';
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
        mostrarAlerta('error', 'Error al cerrar sesión');
    });
}

// Verificar autenticación al cargar la página
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        console.log('Usuario autenticado:', user.email);
        await obtenerDatosUsuario(user.uid);
    } else {
        // Redirigir al login si no está autenticado
        console.log('Usuario no autenticado, redirigiendo...');
        window.location.href = '../../index.html';
    }
});

// Event listeners para verificación de contraseñas en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('editContrasena').addEventListener('input', verificarCoincidenciaContrasenas);
    document.getElementById('confirmarContrasena').addEventListener('input', verificarCoincidenciaContrasenas);
});