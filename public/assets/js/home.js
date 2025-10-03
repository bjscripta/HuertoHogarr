// validation.js
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el formulario de newsletter
    const newsletterForm = document.querySelector('footer form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener el campo de email
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Validar el email
            if (validateEmail(email)) {
                // Email válido
                showAlert('Muchas gracias por suscribirse, te enviaremos un correo!', 'success');
                emailInput.value = ''; // Limpiar el campo
                
            } else {
                // Email inválido
                showAlert('Error, solo permitimos correos duoc.cl, profesor.duoc.cl o gmail.com');
                emailInput.focus();
            }
        });
    }
    
    // Función para validar el email
    function validateEmail(email) {
        // Expresión regular para validar el formato básico de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            return false;
        }
        
        // Validar dominios permitidos
        const allowedDomains = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
        const domain = email.split('@')[1];
        
        return allowedDomains.includes(domain);
    }
    
    // Función para mostrar alertas
    function showAlert(message, type) {
        // Eliminar alertas previas
        const existingAlert = document.querySelector('.email-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Crear elemento de alerta
        const alert = document.createElement('div');
        alert.className = `email-alert alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '1050';
        alert.style.minWidth = '300px';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Agregar al DOM
        document.body.appendChild(alert);
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
});