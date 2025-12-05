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
const storage = firebase.storage();

// Variables globales
let profileImageFile = null;
let currentUserData = null;

// Mapeo completo de regiones y comunas
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
    'rios': ['Valdivia', 'La Unión', 'Paillaco', 'Río Bueno', 'Los Lagos', 'Panguipulli', 'Máfil'],
    'lagos': ['Puerto Montt', 'Osorno', 'Puerto Varas', 'Ancud', 'Castro', 'Quellón', 'Frutillar', 'Llanquihue'],
    'aysen': ['Coyhaique', 'Aysén', 'Puerto Aysén', 'Chile Chico', 'Cochrane', 'Puerto Cisnes'],
    'magallanes': ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Puerto Williams', 'Cabo de Hornos']
};

// Cargar datos del usuario al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            await loadUserData(user);
            updateUserNav(user);
        } else {
            window.location.href = '../../index.html';
        }
    });

    // Configurar evento para verificar contraseñas
    document.getElementById('editContrasena').addEventListener('input', checkPasswordMatch);
    document.getElementById('confirmarContrasena').addEventListener('input', checkPasswordMatch);

    // Configurar envío del formulario
    document.getElementById('editProfileForm').addEventListener('submit', updateProfile);
});

// Cargar datos del usuario desde Firestore
async function loadUserData(user) {
    try {
        console.log('Cargando datos del usuario:', user.uid);

        // Buscar usuario en la colección 'usuario' usando el email
        const userQuery = await db.collection('usuario')
            .where('correo', '==', user.email)
            .get();

        if (!userQuery.empty) {
            // Obtener el primer documento que coincida
            const doc = userQuery.docs[0];
            currentUserData = doc.data();
            currentUserData.id = doc.id;

            console.log('Datos encontrados:', currentUserData);

            // Rellenar formulario con datos existentes
            document.getElementById('editNombre').value = currentUserData.nombre || '';
            document.getElementById('editApellido').value = currentUserData.apellido || '';
            document.getElementById('editCorreo').value = user.email || '';
            document.getElementById('editTelefono').value = currentUserData.telefono || '';
            document.getElementById('editRun').value = currentUserData.run || '';
            document.getElementById('editDireccion').value = currentUserData.direccion || '';
            
            // Cargar región y comuna
            if (currentUserData.region) {
                const regionSelect = document.getElementById('editRegion');
                regionSelect.value = currentUserData.region;
                
                // Cargar comunas para la región seleccionada
                cargarComunasEdit();
                
                // Esperar un momento para seleccionar la comuna
                setTimeout(() => {
                    if (currentUserData.comuna) {
                        const comunaSelect = document.getElementById('editComuna');
                        comunaSelect.value = currentUserData.comuna;
                    }
                }, 100);
            }
            
            // Cargar imagen de perfil si existe
            if (currentUserData.profileImage) {
                document.getElementById('profileImagePreview').src = currentUserData.profileImage;
            }
            
        } else {
            console.log('No se encontraron datos del usuario, creando documento...');
            
            // Crear un documento básico si no existe
            currentUserData = {
                nombre: '',
                apellido: '',
                correo: user.email,
                telefono: '',
                run: '',
                direccion: '',
                region: '',
                comuna: '',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Guardar en la colección 'usuario'
            const docRef = await db.collection('usuario').add(currentUserData);
            currentUserData.id = docRef.id;
        }
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        showError('Error al cargar los datos del usuario');
    }
}

// Actualizar navegación con datos del usuario
async function updateUserNav(user) {
    try {
        const userQuery = await db.collection('usuario')
            .where('correo', '==', user.email)
            .get();
        
        if (!userQuery.empty) {
            const data = userQuery.docs[0].data();
            const navName = document.getElementById('userNameNav');
            const navAvatar = document.getElementById('userAvatarNav');
            
            if (data.nombre) {
                navName.textContent = `${data.nombre} ${data.apellido || ''}`.trim();
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

// Manejar cambio de imagen
function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
        // Validar tamaño (2MB máximo)
        if (file.size > 2 * 1024 * 1024) {
            showError('La imagen es demasiado grande. Máximo 2MB.');
            return;
        }
        
        // Validar tipo de archivo
        if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
            showError('Formato no válido. Solo JPG y PNG.');
            return;
        }
        
        profileImageFile = file;
        
        // Mostrar preview
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImagePreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Cargar comunas según región seleccionada
function cargarComunasEdit() {
    const regionSelect = document.getElementById('editRegion');
    const comunaSelect = document.getElementById('editComuna');
    const regionId = regionSelect.value;
    
    comunaSelect.innerHTML = '';
    
    if (regionId) {
        comunaSelect.disabled = false;
        const comunas = regionesComunas[regionId] || [];
        
        // Agregar opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Selecciona una comuna';
        defaultOption.disabled = true;
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

// Verificar coincidencia de contraseñas
function checkPasswordMatch() {
    const password = document.getElementById('editContrasena').value;
    const confirmPassword = document.getElementById('confirmarContrasena').value;
    const messageElement = document.getElementById('passwordMatchMessage');
    
    if (password === '' && confirmPassword === '') {
        messageElement.textContent = '';
        messageElement.className = 'form-text';
        return true;
    }
    
    if (password.length < 6) {
        messageElement.textContent = 'La contraseña debe tener al menos 6 caracteres';
        messageElement.className = 'form-text mismatch';
        return false;
    }
    
    if (password === confirmPassword) {
        messageElement.textContent = '✓ Las contraseñas coinciden';
        messageElement.className = 'form-text match';
        return true;
    } else {
        messageElement.textContent = '✗ Las contraseñas no coinciden';
        messageElement.className = 'form-text mismatch';
        return false;
    }
}

// Subir imagen a Firebase Storage
async function uploadProfileImage(userId, imageFile) {
    try {
        // Crear referencia única para la imagen
        const storageRef = storage.ref();
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `profile_${Date.now()}.${fileExtension}`;
        const imageRef = storageRef.child(`profile_images/${userId}/${fileName}`);
        
        // Subir archivo
        await imageRef.put(imageFile);
        
        // Obtener URL de descarga
        const downloadURL = await imageRef.getDownloadURL();
        
        return downloadURL;
    } catch (error) {
        console.error('Error al subir imagen:', error);
        throw error;
    }
}

// Función para mostrar alertas
function showAlert(type, message) {
    const alertElement = type === 'success' ? document.getElementById('successAlert') : document.getElementById('errorAlert');
    const messageElement = type === 'success' ? document.getElementById('successMessage') : document.getElementById('errorMessage');
    
    messageElement.textContent = message;
    alertElement.style.display = 'block';
    
    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        alertElement.style.display = 'none';
    }, 5000);
}

// Función auxiliar para showSuccess
function showSuccess(message) {
    showAlert('success', message);
}

// Función auxiliar para showError
function showError(message) {
    showAlert('error', message);
}

// Actualizar perfil
async function updateProfile(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
    submitBtn.disabled = true;
    
    try {
        // Obtener usuario actual
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        // Validar contraseñas
        if (!checkPasswordMatch()) {
            throw new Error('Por favor verifica que las contraseñas coincidan');
        }

        // Obtener datos del formulario
        const formData = {
            nombre: document.getElementById('editNombre').value.trim(),
            apellido: document.getElementById('editApellido').value.trim(),
            telefono: document.getElementById('editTelefono').value.trim() || currentUserData?.telefono || '',
            run: document.getElementById('editRun').value.trim() || currentUserData?.run || '',
            direccion: document.getElementById('editDireccion').value.trim(),
            region: document.getElementById('editRegion').value,
            comuna: document.getElementById('editComuna').value,
            updatedAt: new Date().toISOString()
        };

        // Validaciones
        if (!formData.nombre) throw new Error('El nombre es obligatorio');
        if (!formData.apellido) throw new Error('El apellido es obligatorio');
        if (!formData.direccion) throw new Error('La dirección es obligatoria');
        if (!formData.region) throw new Error('La región es obligatoria');
        if (!formData.comuna) throw new Error('La comuna es obligatoria');

        let profileImageUrl = currentUserData?.profileImage;

        // Subir nueva imagen si existe
        if (profileImageFile) {
            profileImageUrl = await uploadProfileImage(user.uid, profileImageFile);
            formData.profileImage = profileImageUrl;
        }

        // Obtener el nuevo email
        const newEmail = document.getElementById('editCorreo').value.trim();
        formData.correo = newEmail;

        // Obtener la nueva contraseña (si se cambió)
        const newPassword = document.getElementById('editContrasena').value;

        // Actualizar email en Auth si cambió
        if (newEmail !== user.email) {
            try {
                await user.updateEmail(newEmail);
                console.log('Email actualizado en Auth');
            } catch (emailError) {
                if (emailError.code === 'auth/requires-recent-login') {
                    throw new Error('Para cambiar el email, necesitas iniciar sesión nuevamente');
                }
                throw new Error('Error al actualizar el email: ' + emailError.message);
            }
        }

        // Actualizar contraseña si se proporcionó
        if (newPassword) {
            try {
                await user.updatePassword(newPassword);
                console.log('Contraseña actualizada en Auth');
            } catch (passwordError) {
                if (passwordError.code === 'auth/requires-recent-login') {
                    throw new Error('Para cambiar la contraseña, necesitas iniciar sesión nuevamente');
                }
                throw new Error('Error al actualizar la contraseña: ' + passwordError.message);
            }
        }

        // Actualizar datos en Firestore
        if (currentUserData && currentUserData.id) {
            await db.collection('usuario').doc(currentUserData.id).update(formData);
            console.log('Datos actualizados en Firestore');
            
            // Actualizar datos locales
            currentUserData = { ...currentUserData, ...formData };
            
            // Mostrar mensaje de éxito
            showSuccess('Perfil actualizado correctamente');
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = '../page/perfCliente.html';
            }, 2000);
        } else {
            throw new Error('No se encontró el ID del usuario');
        }

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        showError(error.message || 'Error al actualizar el perfil');
    } finally {
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Función de logout
function logout() {
    auth.signOut().then(() => {
        window.location.href = '../../index.html';
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
        showError('Error al cerrar sesión');
    });
}