import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom/cjs/react-router-dom.min';
import RouterConfig from './routes/RouterConfig';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <RouterConfig/>
      </Router>
    </UserProvider>
  );
}

export default App;
