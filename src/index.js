import { addUser } from "./services/firestoreService";
import {validateEmail} from "./utils/script"

//Espera que el DOM este listo 
document.addEventListener("DOMContentLoaded", () => {
  const  form = document.getElementById("formUsuario");
  const runInput = document.getElementById("run");
  const nombreInput = document.getElementById("nombre");
  const correoInput = document.getElementById("correo");
  const claveInput = document.getElementById("clave");
  const fechaInput = document.getElementById("fecha");
  const mensaje = document.getElementById("mensaje");

  //Validar si hay conexion con el formulario de registro de usuario
  if(!form) return console.log("No se encontro #formUsuario")
  
  form.addEventListener("submit", async(e) =>{
    e.preventDefault();
    mensaje.innerText = "";

    const run = runInput.value.trim().toUpperCase();
    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const clave = claveInput.value;
    const fecha = fechaInput.value;

    //Validar el ingreso correcto de los datos para el registro 
    if(!nombre) return mensaje.innerText = "Error, nombre en blanco";
    if(!validateEmail(correo)) return mensaje.innerText = "Error, correo incorrecto";
    
    try {
      await addUser({run, nombre, correo, clave, fecha})
      mensaje.innerText = "Formulario se envio correctamente";

      setTimeout(() => {
        window.location.href = 
          correo.toLowerCase() === "admin@duoc.cl"
          ? `assets/page/perfAdmin.html?nombre=${encodeURIComponent(nombre)}`
          : `assets/page/perfCliente.html?nombre=${encodeURIComponent(nombre)}`

      }, 1000);
    } catch (error) {
      console.error("Error, no se pudo guardar el usuario", error)
      mensaje.innerText = "Error al guardar el usuario en Firebase"
    }
  });
});