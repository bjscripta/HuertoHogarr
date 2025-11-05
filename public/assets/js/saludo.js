document.addEventListener('DOMContentLoaded', function() {
    const bienvenido = document.getElementById('bienvenido');
    const hora = new Date().getHours();
    
    if (hora < 12) {
        bienvenido.textContent = '¡Buenos días, Administrador!';
    } else if (hora < 18) {
        bienvenido.textContent = '¡Buenas tardes, Administrador!';
    } else {
        bienvenido.textContent = '¡Buenas noches, Administrador!';
    }
});s