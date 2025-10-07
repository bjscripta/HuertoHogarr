import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../component/pages/Home";
import PerfilAdmin from "../component/pages/PerfilAdmin";
import PerfilCliente from "../component/pages/PerfilCliente";

const RouterConfig = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/perfil-admin" component={PerfilAdmin} />
            <Route path="/perfil-cliente" component={PerfilCliente} />
        </Switch>
    </Router>
);

export default RouterConfig;