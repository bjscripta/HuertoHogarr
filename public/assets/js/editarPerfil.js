// editarPerfil.js

// Variables globales
let profileImageFile = null;
let currentUserData = null;

// Cargar datos del usuario al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    updateUserNav();
    
    // Verificar autenticación
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = '../page/login.html';
        }
    });
});

// Cargar datos del usuario desde Firestore
async function loadUserData() {
    try {
        const user = auth.currentUser;
        if (!user) {
            showError('Usuario no autenticado');
            return;
        }

        // Obtener datos del usuario de Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const data = userDoc.data();
            currentUserData = data;
            
            // Rellenar formulario con datos existentes
            document.getElementById('editNombre').value = data.nombre || '';
            document.getElementById('editApellido').value = data.apellido || '';
            document.getElementById('editCorreo').value = user.email || '';
            document.getElementById('editTelefono').value = data.telefono || '';
            document.getElementById('editRun').value = data.run || '';
            document.getElementById('editDireccion').value = data.direccion || '';
            
            // Cargar región y comuna
            if (data.region) {
                document.getElementById('editRegion').value = data.region;
                cargarComunasEdit();
                
                // Esperar un momento para cargar la comuna
                setTimeout(() => {
                    if (data.comuna) {
                        document.getElementById('editComuna').value = data.comuna;
                    }
                }, 100);
            }
            
            // Cargar imagen de perfil si existe
            if (data.profileImage) {
                document.getElementById('profileImagePreview').src = data.profileImage;
            }
            
        } else {
            // Si no existe el documento, crear uno con datos básicos
            await db.collection('users').doc(user.uid).set({
                nombre: '',
                apellido: '',
                telefono: '',
                run: '',
                direccion: '',
                region: '',
                comuna: '',
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        showError('Error al cargar los datos del usuario');
    }
}

// Actualizar navegación con datos del usuario
async function updateUserNav() {
    const user = auth.currentUser;
    if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const data = userDoc.data();
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
    const region = document.getElementById('editRegion').value;
    const comunaSelect = document.getElementById('editComuna');
    
    comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
    comunaSelect.disabled = true;
    
    if (region) {
        comunaSelect.disabled = false;
        
        // Mapeo de comunas por región (ejemplo simplificado)
        const comunas = {
            'metropolitana': [
                'Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú',
                'La Florida', 'Puente Alto', 'San Bernardo', 'La Cisterna',
                'El Bosque', 'La Granja', 'La Pintana', 'San Miguel'
            ],
            'valparaiso': [
                'Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana',
                'San Antonio', 'Quillota', 'Los Andes', 'San Felipe'
            ],
            'biobio': [
                'Concepción', 'Talcahuano', 'Chiguayante', 'San Pedro de la Paz',
                'Coronel', 'Lota', 'Tomé', 'Penco'
            ]
        };
        
        const comunasRegion = comunas[region] || [];
        comunasRegion.forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna.toLowerCase().replace(/\s+/g, '-');
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
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
    
    if (password === confirmPassword) {
        messageElement.textContent = 'Las contraseñas coinciden ✓';
        messageElement.className = 'form-text match';
        return true;
    } else {
        messageElement.textContent = 'Las contraseñas no coinciden ✗';
        messageElement.className = 'form-text mismatch';
        return false;
    }
}

// Subir imagen a Firebase Storage
async function uploadProfileImage(userId, imageFile) {
    try {
        // Crear referencia única para la imagen
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`profile_images/${userId}/${Date.now()}_${imageFile.name}`);
        
        // Subir archivo
        const snapshot = await imageRef.put(imageFile);
        
        // Obtener URL de descarga
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return downloadURL;
    } catch (error) {
        console.error('Error al subir imagen:', error);
        throw error;
    }
}

// Actualizar perfil
async function updateProfile(event) {
    event.preventDefault();
    
    // Deshabilitar botón de envío
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Guardando...';
    submitBtn.disabled = true;
    
    try {
        // Validar contraseñas
        if (!checkPasswordMatch()) {
            throw new Error('Las contraseñas no coinciden');
        }
        
        const user = auth.currentUser;
        if (!user) {
            throw new Error('Usuario no autenticado');
        }
        
        // Obtener datos del formulario
        const formData = {
            nombre: document.getElementById('editNombre').value.trim(),
            apellido: document.getElementById('editApellido').value.trim(),
            telefono: document.getElementById('editTelefono').value.trim(),
            run: document.getElementById('editRun').value.trim(),
            direccion: document.getElementById('editDireccion').value.trim(),
            region: document.getElementById('editRegion').value,
            comuna: document.getElementById('editComuna').value,
            updatedAt: new Date()
        };
        
        // Validaciones básicas
        if (!formData.nombre) throw new Error('El nombre es requerido');
        if (!formData.apellido) throw new Error('El apellido es requerido');
        if (!formData.direccion) throw new Error('La dirección es requerida');
        if (!formData.region) throw new Error('La región es requerida');
        if (!formData.comuna) throw new Error('La comuna es requerida');
        
        let profileImageUrl = currentUserData?.profileImage;
        
        // Subir nueva imagen si existe
        if (profileImageFile) {
            profileImageUrl = await uploadProfileImage(user.uid, profileImageFile);
        }
        
        // Actualizar datos en Firestore
        await db.collection('users').doc(user.uid).update({
            ...formData,
            profileImage: profileImageUrl
        });
        
        // Actualizar email si cambió
        const newEmail = document.getElementById('editCorreo').value.trim();
        if (newEmail !== user.email) {
            try {
                await user.updateEmail(newEmail);
            } catch (emailError) {
                if (emailError.code === 'auth/requires-recent-login') {
                    throw new Error('Para cambiar el email, necesitas iniciar sesión nuevamente');
                }
                throw emailError;
            }
        }
        
        // Actualizar contraseña si se proporcionó
        const newPassword = document.getElementById('editContrasena').value;
        if (newPassword) {
            try {
                await user.updatePassword(newPassword);
            } catch (passwordError) {
                if (passwordError.code === 'auth/requires-recent-login') {
                    throw new Error('Para cambiar la contraseña, necesitas iniciar sesión nuevamente');
                }
                throw passwordError;
            }
        }
        
        // Mostrar mensaje de éxito
        showSuccess('Perfil actualizado correctamente');
        
        // Actualizar navegación
        updateUserNav();
        
        // Limpiar archivo de imagen
        profileImageFile = null;
        
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        showError(error.message || 'Error al actualizar el perfil');
    } finally {
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Mostrar mensaje de éxito
function showSuccess(message) {
    const alert = document.getElementById('successAlert');
    const messageSpan = document.getElementById('successMessage');
    
    messageSpan.textContent = message;
    alert.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}
