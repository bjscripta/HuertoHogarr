import { addUser } from "./services/firestoreService";
import { validarCorreo, validarRun, verificarCoincidenciaContrasenas} from "./utils/script";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formUsuario");
  const runInput = document.getElementById("run");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const correoInput = document.getElementById("correo");
  const claveInput = document.getElementById("clave");
  const confirmarClaveInput = document.getElementById("confirmarClave");
  const direccionInput = document.getElementById("direccion");
  const regionInput = document.getElementById("region");
  const comunaInput = document.getElementById("comuna");
  const telefonoInput = document.getElementById("telefono");
  const fechaInput = document.getElementById("fecha");
  const mensaje = document.getElementById("mensaje");

  if (!form) return console.log("No se encontro #formUsuario")
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    mensaje.innerText = "";

    const run = runInput.value.trim().toUpperCase();
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const correo = correoInput.value.trim();
    const clave = claveInput.value;
    const confirmarClave = confirmarClaveInput.value;
    const direccion = direccionInput.value.trim();
    const region = regionInput.value;
    const comuna = comunaInput.value;
    const telefono = telefonoInput.value.trim();
    const fecha = fechaInput.value;

    if (!validarRun(run)) return mensaje.innerText = "RUN incorrecto";
    if (!nombre) return mensaje.innerText = "Nombre es requerido";
    if (!apellido) return mensaje.innerText = "Apellido es requerido";
    if (!validarCorreo(correo)) return mensaje.innerText = "Correo incorrecto - Solo se permiten @duoc.cl, @profesor.duoc.cl y @gmail.com";
    if (!clave) return mensaje.innerText = "Contraseña es requerida";
    if (clave.length < 6) return mensaje.innerText = "La contraseña debe tener al menos 6 caracteres";
    if (clave !== confirmarClave) return mensaje.innerText = "Las contraseñas no coinciden";
    if (!direccion) return mensaje.innerText = "Dirección es requerida";
    if (!region) return mensaje.innerText = "Región es requerida";
    if (!comuna) return mensaje.innerText = "Comuna es requerida";

    try {
      const userData = {
        run,
        nombre,
        apellido,
        correo,
        clave, // En un caso real, deberías encriptar esta contraseña
        direccion,
        region,
        comuna,
        telefono: telefono || "",
        fecha: fecha || "",
        fechaRegistro: new Date().toISOString()
      };

      await addUser({ userData });
      mensaje.innerText = "Formulario se envio correctamente";

      setTimeout(() => {
        window.location.href = 
          correo.toLowerCase() === "admin@duoc.cl"
          ? `assets/page/perfAdmin.html?nombre=${encodeURIComponent(nombre)}`
          : `assets/page/perfCliente.html?nombre=${encodeURIComponent(nombre)}`
      }, 1000);
      
    } catch(error) {
      console.error("Error al guardar usuario: ", error);
      mensaje.innerText = "Error al guardar usuario en Firebase"

    }
  });
});