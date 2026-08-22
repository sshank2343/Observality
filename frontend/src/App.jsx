import { AuthProvider } from './context/AuthContext';
import { OrgProvider } from './context/OrgContext';
import AppRouter from './router';

function App() {
  return (
    <AuthProvider>
      <OrgProvider>
        <AppRouter />
      </OrgProvider>
    </AuthProvider>
  );
}

export default App;