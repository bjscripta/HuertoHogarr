import React, { useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { validarCorreo, validarClave } from "../../utils/script";
import { addUser } from "../../services/firestoreService";
import { useHistory } from "react-router-dom";

const UserForm = () => {
    const [form, setForm] = useState({ run:"", nombre:"", correo:"", clave:""});
    const [msg, setMsg] = useState("");
    const history = useHistory();

    const handleChange = e => setForm({ ...form, [e.target.id]: e.target.value});
    
    const handleSubmit = async e => {
        e.preventDefault();
        const { run, nombre, correo, clave} = form;
        if (!validarRun(run)) return setMsg("RUN INCORRECTO")
        if (!validarClave(clave)) return setMsg("CLAVE INCORRECTO");
        if (!validarCorreo(correo)) return setMsg("CORREO INCORRECTO");

        await addUser(form);
        setMsg("Formulario se envió correctamente");
        setTimeout(() => {
            history.push(correo === "admin@duoc.cl" ? "/perfil-admin?nombre="+nombre : "/perfil-cliente?nombre="+nombre);
        }, 1000);
    };

    return(
        <form onSubmit={handleSubmit}>
            <Input id="clave" label="CLAVE" value={form.clave} onChange={handleChange} required />
            <Input id="correo" label="CORREO" value={form.correo} onChange={handleChange} required />
            <Button type="submit">Enviar</Button>
            <p style={{color:"crimson"}}>{msg}</p>
        </form>
    );
};

export default UserForm;