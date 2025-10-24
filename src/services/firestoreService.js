import { wait } from "@testing-library/user-event/dist/utils";
import  { db } from "../config/firebase";
import { collection, addDoc, getDoc, query, where, doc } from "firebase/firestore";

export async function addUser(user){
    try {
        const docRef = await addDoc(collection(db, "usuario"),{
            ...user,
            createdAt: new Date(),
        })
        console.log("Usuario registrado con ID: ",docRef.id)
        return docRef;
    } catch (error) {
        console.error("Error al registrar usuario: ",error);
        return error;
    }
}

export async function getProduct(params){
    const snap = await  getDoc(collection(db, "productos"));
    return snap.docs.map(d => ({id: d.id, ...d.data()}));
}




