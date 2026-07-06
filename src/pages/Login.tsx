import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

import logoImg from '../assets/checkops_logo.png';

export default function Login() {
  const [cpfOrRegistration, setCpfOrRegistration] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        tenantId: '11111111-1111-1111-1111-111111111111',
        cpfOrRegistration,
        password
      };
      const res = await api.post('/auth/login', payload);
      login(res.data.token);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1a1e26 0%, #0f1115 100%)' }}>
      <motion.div 
        className="glass"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '48px', borderRadius: '24px', width: '100%', maxWidth: '420px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
           <img src={logoImg} alt="CheckOps Logo" style={{ width: '80px', height: '80px', marginBottom: '16px', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Check<span style={{ color: 'var(--primary)' }}>Ops</span></h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Portal Administrativo</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Matrícula ou CPF</label>
            <input 
              type="text" 
              value={cpfOrRegistration} 
              onChange={e => setCpfOrRegistration(e.target.value)} 
              placeholder="ADMIN ou 12345678900"
              style={{ width: '100%' }}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Senha</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              style={{ width: '100%' }}
              required 
            />
          </div>
          
          {error && <div style={{ color: 'var(--danger)', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Entrando...' : <><LogIn size={18} /> Entrar</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
