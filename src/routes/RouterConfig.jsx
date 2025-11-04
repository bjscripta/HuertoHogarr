import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/pages/Home";
import PerfilAdmin from "../components/pages/PerfilAdmin";
import PerfilCliente from "../components/pages/PerfilCliente";
import Catalogo from "../components/pages/Catalogo";
import Carrito from "../components/pages/Carrito";
import Checkout from "../components/pages/Checkout";
import CompraExitosa from "../components/pages/CompraExitosa";
import ErrorPago from "../components/pages/ErrorPago";

const RouterConfig = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perfAdmin" element={<PerfilAdmin />} />
            <Route path="/perfCliente" element={<PerfilCliente />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/exito" element={<CompraExitosa />} />
            <Route path="/error" element={<ErrorPago />} />
        </Routes>
    </Router>
);

export default RouterConfig;