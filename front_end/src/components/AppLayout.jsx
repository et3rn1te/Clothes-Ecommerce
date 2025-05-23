import '../assets/styles/App.css';
import AppRoutes from '../routes/AppRoutes.jsx';
import { useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function AppLayout() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname.startsWith("/auth");

  return (
    <>
      {!hideHeaderFooter && <Header/>}
      <AppRoutes />
      {!hideHeaderFooter && <Footer/>}
    </>
  );
}
export default AppLayout;