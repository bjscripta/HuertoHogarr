import { wait } from "@testing-library/user-event/dist/utils";
import  { db } from "../config/firebase";
import { collection, addDoc, getDoc, query, where } from "firebase/firestore";

export async function addUser(user){
    return await addUser(collection(db, "usuario"), { ...user,createdAt: new Date()});
}

export async function getProduct(params){
    const snap = await  getDoc(collection(db, "productos"));
    return snap.docs.map(d => ({id: d.id, ...d.data()}));
}

//COMMIT D EPRUEBA 