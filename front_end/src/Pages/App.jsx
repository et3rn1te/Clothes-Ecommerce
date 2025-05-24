import '../assets/styles/App.css';
import AppLayout from '../components/AppLayout.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router> {/* Bọc mọi thứ bên trong Router */}
      <AppLayout/>
    </Router>
  );
}

export default App;