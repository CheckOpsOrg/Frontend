import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Monitor, Users, Ticket, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/checkops_logo.png';

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [usersOpen, setUsersOpen] = useState(location.pathname.startsWith('/users'));

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
             style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(0, 212, 170, 0.6))' }} 
           />
           <span style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.5px', color: '#fff' }}>Check<span style={{ color: 'var(--primary)' }}>Ops</span></span>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/machines" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
            <Monitor size={20} /> Máquinas
          </NavLink>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button 
              className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`} 
              onClick={() => {
                setUsersOpen(!usersOpen);
              }}
              style={{ background: 'transparent', width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Users size={20} /> Usuários
              </div>
              <ChevronDown size={16} style={{ transform: usersOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>
            <AnimatePresence>
              {usersOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '32px', marginTop: '4px' }}
                >
                  <NavLink to="/users?role=2" className={({isActive}) => `nav-link ${isActive && location.search === '?role=2' ? 'active' : ''}`}>
                    Operadores
                  </NavLink>
                  <NavLink to="/users?role=0" className={({isActive}) => `nav-link ${isActive && location.search === '?role=0' ? 'active' : ''}`}>
                    Administradores
                  </NavLink>
                  <NavLink to="/users?role=3" className={({isActive}) => `nav-link ${isActive && location.search === '?role=3' ? 'active' : ''}`}>
                    Mantenedores
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
