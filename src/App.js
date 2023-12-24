import './App.css';
import Layout from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Layout/>
    </AuthProvider>
  );
}

export default App;
