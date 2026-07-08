import { useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';

export default function UserFormModal({ user, onClose, onSaved }: { user?: any, onClose: () => void, onSaved: () => void }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [cpf, setCpf] = useState(user?.cpf || '');
  const [registration, setRegistration] = useState(user?.registration || '');
  const [role, setRole] = useState(() => {
    if (user?.role === 'Admin') return 0;
    if (user?.role === 'Manager') return 1;
    if (user?.role === 'Operator') return 2;
    if (user?.role === 'Maintenance') return 3;
    return 2;
  });
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user?.id) {
        // Edit só aceita Nome e Email no backend atual, mas agora aceita Role!
        await api.put(`/users/${user.id}`, { name, email, role: parseInt(role.toString()) });
      } else {
        await api.post('/users', {
          name,
          email,
          cpf,
          registration,
          role: parseInt(role.toString()),
          password
        });
      }
      onSaved();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass"
        style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '500px', width: '100%', position: 'relative' }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '24px' }}>{user ? 'Editar Usuário' : 'Novo Usuário'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Nome Completo</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} required />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Cargo</label>
            <select value={role} onChange={e => setRole(parseInt(e.target.value))} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}>
              <option value={2} style={{ color: '#000' }}>Operador</option>
              <option value={3} style={{ color: '#000' }}>Manutenção</option>
              <option value={0} style={{ color: '#000' }}>Admin</option>
            </select>
          </div>

          {!user?.id && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>CPF</label>
                <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} style={{ width: '100%' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Matrícula</label>
                <input type="text" value={registration} onChange={e => setRegistration(e.target.value)} style={{ width: '100%' }} required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Senha Inicial</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} required />
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }} disabled={loading}>
            <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Usuário'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
