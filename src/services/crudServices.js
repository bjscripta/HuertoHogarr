import { db } from "../config/firebase";
import { 
  collection, 
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp
} from "firebase/firestore";

export class CrudService {
  
  // ==================== COMPRAS ====================
  static async getCompras() {
    try {
      const comprasRef = collection(db, "compras");
      const q = query(comprasRef, orderBy("fecha", "desc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fecha: data.fecha?.toDate?.() || data.fecha
        };
      });
    } catch (error) {
      console.error("Error obteniendo compras:", error);
      return [];
    }
  }

  static async getCompraById(id) {
    try {
      const compraRef = doc(db, "compras", id);
      const compraSnap = await getDoc(compraRef);
      
      if (compraSnap.exists()) {
        const data = compraSnap.data();
        return { 
          id: compraSnap.id, 
          ...data,
          fecha: data.fecha?.toDate?.() || data.fecha
        };
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo compra:", error);
      return null;
    }
  }

  static async updateCompraEstado(id, nuevoEstado) {
    try {
      const compraRef = doc(db, "compras", id);
      await updateDoc(compraRef, {
        estado: nuevoEstado,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Error actualizando estado de compra:", error);
      return false;
    }
  }

  // ==================== PRODUCTOS ====================
  static async getProductos() {
    try {
      const productosRef = collection(db, "producto");
      const querySnapshot = await getDocs(productosRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error obteniendo productos:", error);
      return [];
    }
  }

  static async getProductoById(id) {
    try {
      const productoRef = doc(db, "producto", id);
      const productSnap = await getDoc(productoRef);
      
      if (productSnap.exists()) {
        return { id: productSnap.id, ...productSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo producto:", error);
      return null;
    }
  }

  static async createProducto(producto) {
    try {
      const docRef = await addDoc(collection(db, "producto"), {
        ...producto,
        nombre: producto.nombre || "",
        precio: parseFloat(producto.precio) || 0,
        stock: parseInt(producto.stock) || 0,
        categoria: producto.categoria || "",
        descripcion: producto.descripcion || "",
        imagen: producto.imagen || "",
        unidad: producto.unidad || "unidad",
        createdAt: Timestamp.now(),
        activo: true
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creando producto:", error);
      return null;
    }
  }

  static async updateProducto(id, datos) {
    try {
      const productoRef = doc(db, "producto", id);
      
      // Asegurar tipos correctos
      const datosActualizados = {
        ...datos,
        precio: datos.precio !== undefined ? parseFloat(datos.precio) : undefined,
        stock: datos.stock !== undefined ? parseInt(datos.stock) : undefined,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(productoRef, datosActualizados);
      return true;
    } catch (error) {
      console.error("Error actualizando producto:", error);
      return false;
    }
  }

  static async deleteProducto(id) {
    try {
      await deleteDoc(doc(db, "producto", id));
      return true;
    } catch (error) {
      console.error("Error eliminando producto:", error);
      return false;
    }
  }

  // ==================== USUARIOS ====================
  static async getUsuarios() {
    try {
      const usuariosRef = collection(db, "usuario");
      const querySnapshot = await getDocs(usuariosRef);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fecha: data.fecha?.toDate?.() || data.fecha
        };
      });
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
      return [];
    }
  }

  static async getUsuarioById(id) {
    try {
      const usuarioRef = doc(db, "usuario", id);
      const usuarioSnap = await getDoc(usuarioRef);
      
      if (usuarioSnap.exists()) {
        const data = usuarioSnap.data();
        return { 
          id: usuarioSnap.id, 
          ...data,
          fecha: data.fecha?.toDate?.() || data.fecha
        };
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      return null;
    }
  }

  static async updateUsuario(id, datos) {
    try {
      const usuarioRef = doc(db, "usuario", id);
      await updateDoc(usuarioRef, {
        ...datos,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      return false;
    }
  }

  // ==================== REPORTES ====================
  static async getReporteVentas(fechaInicio, fechaFin) {
    try {
      const comprasRef = collection(db, "compras");
      const q = query(
        comprasRef,
        where("fecha", ">=", fechaInicio),
        where("fecha", "<=", fechaFin),
        orderBy("fecha", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fecha: data.fecha?.toDate?.() || data.fecha
        };
      });
    } catch (error) {
      console.error("Error obteniendo reporte de ventas:", error);
      return [];
    }
  }

  static async getProductosMasVendidos() {
    try {
      const comprasRef = collection(db, "compras");
      const querySnapshot = await getDocs(comprasRef);
      
      const productosVendidos = {};
      
      querySnapshot.forEach(doc => {
        const compra = doc.data();
        if (compra.productos && Array.isArray(compra.productos)) {
          compra.productos.forEach(producto => {
            if (producto.id) {
              if (productosVendidos[producto.id]) {
                productosVendidos[producto.id].cantidad += producto.cantidad || 1;
                productosVendidos[producto.id].total += (producto.precio || 0) * (producto.cantidad || 1);
              } else {
                productosVendidos[producto.id] = {
                  id: producto.id,
                  nombre: producto.nombre || "Producto sin nombre",
                  cantidad: producto.cantidad || 1,
                  precio: producto.precio || 0,
                  total: (producto.precio || 0) * (producto.cantidad || 1),
                  categoria: producto.categoria || ""
                };
              }
            }
          });
        }
      });

      return Object.values(productosVendidos)
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);
    } catch (error) {
      console.error("Error obteniendo productos más vendidos:", error);
      return [];
    }
  }

  // ==================== DASHBOARD ====================
  static async getEstadisticasDashboard() {
    try {
      const [compras, productos, usuarios] = await Promise.all([
        this.getCompras(),
        this.getProductos(),
        this.getUsuarios()
      ]);

      // Calcular inventario total
      const inventarioTotal = productos.reduce((total, producto) => {
        return total + (parseInt(producto.stock) || 0);
      }, 0);

      // Compras del último mes
      const unMesAtras = new Date();
      unMesAtras.setMonth(unMesAtras.getMonth() - 1);
      
      const comprasUltimoMes = compras.filter(compra => {
        const fechaCompra = compra.fecha instanceof Date ? compra.fecha : new Date(compra.fecha);
        return fechaCompra >= unMesAtras;
      }).length;

      // Usuarios nuevos del último mes
      const usuariosNuevosMes = usuarios.filter(usuario => {
        const fechaRegistro = usuario.fecha instanceof Date ? usuario.fecha : new Date(usuario.fecha);
        return fechaRegistro >= unMesAtras;
      }).length;

      return {
        totalCompras: compras.length,
        proyeccionCompras: comprasUltimoMes,
        totalProductos: productos.length,
        inventarioTotal: inventarioTotal,
        totalUsuarios: usuarios.length,
        nuevosUsuariosMes: usuariosNuevosMes
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      return {
        totalCompras: 0,
        proyeccionCompras: 0,
        totalProductos: 0,
        inventarioTotal: 0,
        totalUsuarios: 0,
        nuevosUsuariosMes: 0
      };
    }
  }
}