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

// Variables globales
let currentUserData = null;

// Formatear nombres de regiones y comunas
function formatearNombre(texto) {
    if (!texto) return '-';
    return texto
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Formatear fecha
function formatearFecha(fechaString) {
    if (!fechaString) return '-';
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Cargar datos del usuario
async function loadUserProfile() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        console.log('Cargando perfil del usuario:', user.email);

        // Buscar usuario en la colección 'usuario'
        const userQuery = await db.collection('usuario')
            .where('correo', '==', user.email)
            .get();

        if (!userQuery.empty) {
            const doc = userQuery.docs[0];
            currentUserData = doc.data();
            currentUserData.id = doc.id;

            console.log('Datos del perfil encontrados:', currentUserData);

            // Actualizar interfaz
            updateProfileUI();
            updateUserNav();
        } else {
            console.log('No se encontraron datos del perfil');
            showAlert('error', 'No se encontraron datos del perfil. Por favor, actualiza tu información.');
        }

    } catch (error) {
        console.error('Error al cargar perfil:', error);
        showAlert('error', 'Error al cargar los datos del perfil');
    }
}

// Actualizar interfaz del perfil
function updateProfileUI() {
    if (!currentUserData) return;

    // Actualizar avatar y nombre
    const nombre = currentUserData.nombre || 'Usuario';
    const apellido = currentUserData.apellido || '';
    const fullName = `${nombre} ${apellido}`.trim();
    const firstLetter = nombre.charAt(0).toUpperCase();

    document.getElementById('userFullName').textContent = fullName;
    document.getElementById('avatarText').textContent = firstLetter;
    document.getElementById('userEmail').textContent = currentUserData.correo || 'No especificado';

    // Actualizar información personal
    document.getElementById('profileName').textContent = nombre;
    document.getElementById('profileLastName').textContent = apellido;
    document.getElementById('profileRun').textContent = currentUserData.run || '-';
    document.getElementById('profileEmail').textContent = currentUserData.correo || '-';
    document.getElementById('profilePhone').textContent = currentUserData.telefono || 'No especificado';

    // Actualizar dirección
    document.getElementById('profileAddress').textContent = currentUserData.direccion || '-';
    document.getElementById('profileRegion').textContent = formatearNombre(currentUserData.region);
    document.getElementById('profileComuna').textContent = formatearNombre(currentUserData.comuna);

    // Actualizar última actualización
    document.getElementById('profileLastUpdate').textContent = formatearFecha(currentUserData.updatedAt) || 
                                                               formatearFecha(currentUserData.createdAt) || '-';
}

// Actualizar navegación
async function updateUserNav() {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const userQuery = await db.collection('usuario')
            .where('correo', '==', user.email)
            .get();
        
        if (!userQuery.empty) {
            const data = userQuery.docs[0].data();
            const navName = document.getElementById('userNameNav');
            const navAvatar = document.getElementById('userAvatarNav');
            
            if (data.nombre) {
                const displayName = `${data.nombre} ${data.apellido || ''}`.trim();
                navName.textContent = displayName;
                navAvatar.textContent = data.nombre.charAt(0).toUpperCase();
            } else {
                navName.textContent = user.email;
                navAvatar.textContent = user.email.charAt(0).toUpperCase();
            }
        }
    } catch (error) {
        console.error('Error al actualizar navegación:', error);
    }
}

// Función para mostrar alertas
function showAlert(type, message) {
    const alertElement = type === 'success' ? document.getElementById('successAlert') : document.getElementById('errorAlert');
    const messageElement = type === 'success' ? document.getElementById('successMessage') : document.getElementById('errorMessage');
    
    if (alertElement && messageElement) {
        messageElement.textContent = message;
        alertElement.style.display = 'block';
        
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }
}++

// Función de logout
function logout() {
    auth.signOut().then(() => {
        window.location.href = '../../index.html';
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
        showAlert('error', 'Error al cerrar sesión');
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('Usuario autenticado:', user.email);
            loadUserProfile();
        } else {
            console.log('Usuario no autenticado, redirigiendo...');
            window.location.href = '../../index.html';
        }
    });
});