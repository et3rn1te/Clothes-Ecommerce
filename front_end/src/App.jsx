import {BrowserRouter} from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import MainLayout from './layouts/MainLayout'
import {AuthProvider} from "./contexts/AuthContext.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <MainLayout>
                    <AppRoutes/>
                </MainLayout>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App