//Validación del correo
function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

//Validación de la contraseña (entre 4 y 10 caracteres)
function validarClave(clave) {
    return clave.length >= 4 && clave.length <= 10;
}

document.getElementById("formLogin").addEventListener("submit", function(e){
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

    // Si hay errores, detener el proceso
    if (!esValido) {
        return;
    }

    // Todos los datos son correctos
    mensajeElemento.innerText = "Inicio de sesión exitoso. Redirigiendo...";
    mensajeElemento.classList.add("alert", "alert-success");
    
    const destino = correo.toLowerCase() === "admin@duoc.cl" ? 
                    "../page/perfAdmin.html" : 
                    "../page/perfCliente.html";

    setTimeout(() => {
        window.location.href = destino;
    }, 1500);
});

// Validación en tiempo real para la contraseña
document.getElementById("clave").addEventListener("input", function() {
    const clave = this.value.trim();
    const mensajeElemento = document.getElementById("mensaje");
    
    if (clave.length > 0 && !validarClave(clave)) {
        this.setCustomValidity("La contraseña debe tener entre 4 y 10 caracteres.");
    } else {
        this.setCustomValidity("");
    }
});