// Validación del correo (reutilizada desde login)
function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

// Validación del nombre (máximo 100 caracteres)
function validarNombre(nombre) {
    return nombre.length <= 100;
}

// Validación del mensaje (máximo 500 caracteres)
function validarMensaje(mensaje) {
    return mensaje.length <= 500;
}

document.getElementById("formContact").addEventListener("submit", function(e){
    e.preventDefault();
    
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();
    let mensaje = document.getElementById("mensaje").value.trim();
    let mensajeElemento = document.getElementById("mensajeContacto");
    let esValido = true;

    // Limpiar mensajes previos
    document.getElementById("nombre").setCustomValidity("");
    document.getElementById("email").setCustomValidity("");
    document.getElementById("mensaje").setCustomValidity("");
    mensajeElemento.innerText = "";
    mensajeElemento.className = "mt-3";

    // Validar nombre
    if(nombre === "") {
        document.getElementById("nombre").setCustomValidity("El nombre es obligatorio.");
        document.getElementById("nombre").reportValidity();
        esValido = false;
    } else if(!validarNombre(nombre)) {
        document.getElementById("nombre").setCustomValidity("El nombre no puede exceder los 100 caracteres.");
        document.getElementById("nombre").reportValidity();
        esValido = false;
    }
    
    // Validar correo
    if(email === "") {
        document.getElementById("email").setCustomValidity("El correo electrónico es obligatorio.");
        document.getElementById("email").reportValidity();
        esValido = false;
    } else if(!validarCorreo(email)) {
        document.getElementById("email").setCustomValidity("Solo aceptamos correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        document.getElementById("email").reportValidity();
        esValido = false;
    } else if(!validarNombre(email)) { 
        document.getElementById("email").setCustomValidity("El correo no puede exceder los 100 caracteres.");
        document.getElementById("email").reportValidity();
        esValido = false;
    }
    
    // Validar mensaje
    if(mensaje === "") {
        document.getElementById("mensaje").setCustomValidity("El mensaje es obligatorio.");
        document.getElementById("mensaje").reportValidity();
        esValido = false;
    } else if(!validarMensaje(mensaje)) {
        document.getElementById("mensaje").setCustomValidity("El mensaje no puede exceder los 500 caracteres.");
        document.getElementById("mensaje").reportValidity();
        esValido = false;
    }

    // Si hay errores, detener el proceso
    if (!esValido) {
        return;
    }

    // Todos los datos son correctos
    mensajeElemento.innerText = "Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto.";
    mensajeElemento.classList.add("alert", "alert-success");
    
    // Limpiar formulario después de enviar
    setTimeout(() => {
        document.getElementById("formContact").reset();
        mensajeElemento.innerText = "";
        mensajeElemento.classList.remove("alert", "alert-success");
    }, 3000);
});

document.getElementById("nombre").addEventListener("input", function() {
    const nombre = this.value.trim();
    
    if (nombre.length > 0 && !validarNombre(nombre)) {
        this.setCustomValidity("El nombre no puede exceder los 100 caracteres.");
    } else {
        this.setCustomValidity("");
    }
});

document.getElementById("email").addEventListener("input", function() {
    const email = this.value.trim();
    
    if (email.length > 0 && !validarNombre(email)) { 
        this.setCustomValidity("El correo no puede exceder los 100 caracteres.");
    } else {
        this.setCustomValidity("");
    }
});

document.getElementById("mensaje").addEventListener("input", function() {
    const mensaje = this.value.trim();
    
    if (mensaje.length > 0 && !validarMensaje(mensaje)) {
        this.setCustomValidity("El mensaje no puede exceder los 500 caracteres.");
    } else {
        this.setCustomValidity("");
    }
});