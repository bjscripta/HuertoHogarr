import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addUser(user) {
    try {
        const docRef = await addDoc(collection(db, "usuario"), {
            ...user,
            createAt: new Date(),
        });
        console.log("Usuario registrado con ID: ", docRef.id);
        return docRef;
    } catch (error) {
        console.error("Error al registrar usuario: ", error);
        return error;
    }
}