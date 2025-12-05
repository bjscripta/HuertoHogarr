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

// Inicializar Firebase solo si no está inicializada
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Validación del correo
function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

// Validación de la contraseña (entre 4 y 10 caracteres)
function validarClave(clave) {
    return clave.length >= 4 && clave.length <= 10;
}

// Función para mostrar mensajes
function mostrarMensaje(elemento, mensaje, tipo = 'error') {
    elemento.innerText = mensaje;
    elemento.className = `mt-3 alert ${tipo === 'error' ? 'alert-danger' : 'alert-success'}`;
    elemento.style.display = 'block';
}

// Función para verificar si el usuario es admin
async function verificarAdmin(correo) {
    try {
        // Buscar en la colección usuario por correo
        const userQuery = await db.collection('usuario')
            .where('correo', '==', correo.toLowerCase())
            .get();
        
        if (!userQuery.empty) {
            const userData = userQuery.docs[0].data();
            // Verificar si es admin
            return userData.correo === 'admin@duoc.cl' || userData.rol === 'admin';
        }
        return false;
    } catch (error) {
        console.error('Error al verificar admin:', error);
        return false;
    }
}

// Función para iniciar sesión con Firebase
async function iniciarSesionFirebase(correo, clave) {
    try {
        // Intentar iniciar sesión con Firebase Authentication
        const userCredential = await auth.signInWithEmailAndPassword(correo, clave);
        
        if (userCredential.user) {
            console.log('Inicio de sesión exitoso:', userCredential.user.email);
            
            // Verificar si el usuario existe en Firestore
            const userQuery = await db.collection('usuario')
                .where('correo', '==', correo.toLowerCase())
                .get();
            
            if (userQuery.empty) {
                console.log('Usuario no encontrado en Firestore, creando documento...');
                // Crear documento básico si no existe
                const nuevoUsuario = {
                    correo: correo.toLowerCase(),
                    nombre: '',
                    apellido: '',
                    telefono: '',
                    direccion: '',
                    region: '',
                    comuna: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                await db.collection('usuario').add(nuevoUsuario);
            }
            
            return { success: true, user: userCredential.user };
        } else {
            return { success: false, error: 'No se pudo iniciar sesión' };
        }
    } catch (error) {
        console.error('Error en inicio de sesión Firebase:', error);
        
        // Traducir errores de Firebase a mensajes amigables
        let mensajeError = 'Error al iniciar sesión';
        
        switch (error.code) {
            case 'auth/user-not-found':
                mensajeError = 'No existe una cuenta con este correo electrónico';
                break;
            case 'auth/wrong-password':
                mensajeError = 'Contraseña incorrecta';
                break;
            case 'auth/invalid-email':
                mensajeError = 'Correo electrónico no válido';
                break;
            case 'auth/user-disabled':
                mensajeError = 'Esta cuenta ha sido deshabilitada';
                break;
            case 'auth/too-many-requests':
                mensajeError = 'Demasiados intentos. Por favor, intente más tarde';
                break;
            default:
                mensajeError = error.message;
        }
        
        return { success: false, error: mensajeError };
    }
}

// Evento principal del formulario
document.getElementById("formLogin").addEventListener("submit", async function(e){
    e.preventDefault();
    
    let correo = document.getElementById("correo").value.trim();
    let clave = document.getElementById("clave").value.trim();
    let mensajeElemento = document.getElementById("mensaje");
    let esValido = true;

    const correoInput = document.getElementById("correo");
    const claveInput = document.getElementById("clave");

    // Limpiar mensajes previos
    correoInput.setCustomValidity("");
    claveInput.setCustomValidity("");
    mensajeElemento.innerText = "";
    mensajeElemento.className = "mt-3";

    // Validar correo
    if(!validarCorreo(correo)){
        correoInput.setCustomValidity("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        correoInput.reportValidity();
        esValido = false;
    } 
    
    // Validar clave
    if(!validarClave(clave)){
        claveInput.setCustomValidity("La contraseña debe tener entre 4 y 10 caracteres.");
        claveInput.reportValidity();
        esValido = false;
    }

    // Si hay errores de validación, detener el proceso
    if (!esValido) {
        return;
    }

    // Mostrar estado de carga
    const submitBtn = document.querySelector('.btn-login');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Iniciando sesión...';
    submitBtn.disabled = true;

    try {
        // Intentar iniciar sesión con Firebase
        const resultado = await iniciarSesionFirebase(correo, clave);
        
        if (resultado.success) {
            // Inicio de sesión exitoso
            mostrarMensaje(mensajeElemento, "Inicio de sesión exitoso. Redirigiendo...", 'success');
            
            // Verificar si es admin para redirigir a la página correcta
            const esAdmin = await verificarAdmin(correo);
            
            // Esperar 1.5 segundos antes de redirigir
            setTimeout(() => {
                if (esAdmin) {
                    window.location.href = "../page/perfAdmin.html";
                } else {
                    window.location.href = "../page/perfilCliente.html";
                }
            }, 1500);
            
        } else {
            // Error en inicio de sesión
            mostrarMensaje(mensajeElemento, resultado.error, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('Error general:', error);
        mostrarMensaje(mensajeElemento, 'Error al procesar la solicitud. Intente nuevamente.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Validación en tiempo real para la contraseña
document.getElementById("clave").addEventListener("input", function() {
    const clave = this.value.trim();
    
    if (clave.length > 0 && !validarClave(clave)) {
        this.setCustomValidity("La contraseña debe tener entre 4 y 10 caracteres.");
    } else {
        this.setCustomValidity("");
    }
});

// Validación en tiempo real para el correo
document.getElementById("correo").addEventListener("input", function() {
    const correo = this.value.trim();
    
    if (correo.length > 0 && !validarCorreo(correo)) {
        this.setCustomValidity("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    } else {
        this.setCustomValidity("");
    }
});

// Verificar si ya hay un usuario autenticado al cargar la página
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('Usuario ya autenticado:', user.email);
        // Si el usuario ya está autenticado, redirigir según su tipo
        verificarAdmin(user.email).then(esAdmin => {
            if (esAdmin) {
                window.location.href = "../page/perfAdmin.html";
            } else {
                window.location.href = "../page/perfCliente.html";
            }
        });
    }
});