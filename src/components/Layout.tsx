import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Monitor, Users, Ticket, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import logoImg from '../assets/checkops_logo.png';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
           <img 
             src={logoImg} 
             alt="CheckOps Logo" 
             style={{ width: '64px', height: '64px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(0, 212, 170, 0.6))' }} 
           />
           <span style={{ fontSize: '32px', fontWeight: 700, letterSpacing: '1px' }}>Check<span style={{ color: 'var(--primary)' }}>Ops</span></span>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/machines" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <Monitor size={20} /> Máquinas
          </NavLink>
          <NavLink to="/operators" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Operadores
          </NavLink>
          <NavLink to="/tickets" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <Ticket size={20} /> Chamados
          </NavLink>
        </nav>

        <button className="nav-link" style={{ background: 'transparent', width: '100%', textAlign: 'left' }} onClick={handleLogout}>
          <LogOut size={20} /> Sair
        </button>
      </aside>

      <main className="main-content">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
