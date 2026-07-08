import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, KeyRound, CheckCircle, Filter } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import UserFormModal from '../components/UserFormModal';

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const roleFilter = searchParams.get('role') || '';

  const fetchUsers = () => {
    setLoading(true);
    let url = '/users';
    if (roleFilter) url += `?role=${roleFilter}`;
    
    api.get(url)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (user: any) => {
    try {
      if (user.active) {
        if (!confirm('Deseja realmente inativar este usuário?')) return;
        await api.delete(`/users/${user.id}`);
      } else {
        await api.put(`/users/${user.id}/reactivate`);
      }
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status do usuário.');
    }
  };

  const handleResetPassword = async (id: string) => {
    const newPassword = prompt('Digite a nova senha para este usuário:');
    if (!newPassword) return;
    
    try {
      await api.put(`/users/${id}/password`, { newPassword });
      alert('Senha redefinida com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao redefinir senha.');
    }
  };

  if (loading && users.length === 0) return <LoadingScreen />;

  return (
    <div>
      <div className="page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-subtitle">Visualização e gestão de acesso ao sistema (Operadores, Manutenção, Admins).</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select 
              value={roleFilter} 
              onChange={e => {
                if (e.target.value) {
                  setSearchParams({ role: e.target.value });
                } else {
                  setSearchParams({});
                }
              }}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', padding: '8px 4px' }}
            >
              <option value="">Todos</option>
              <option value="0">Admin</option>
              <option value="2">Operador</option>
              <option value="3">Manutenção</option>
            </select>
          </div>

          <button className="btn-primary" onClick={() => { setEditingUser(null); setShowForm(true); }}>
            <Plus size={18}/> Novo Usuário
          </button>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Contato / CPF</th>
              <th>Cargo</th>
              <th>Atividade Atual</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((o, i) => (
              <motion.tr 
                key={o.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {o.photoUrl ? (
                      <img src={o.photoUrl.startsWith('http') ? o.photoUrl : `https://api-production-cbeb.up.railway.app${o.photoUrl}`} alt={o.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                        {o.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{o.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Matrícula: {o.registration}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '14px' }}>{o.email}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{o.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</div>
                </td>
                <td>
                  <span className={`badge ${o.role === 'Admin' ? 'danger' : o.role === 'Maintenance' ? 'warning' : 'success'}`}>
                    {o.role === 'Operator' ? 'Operador' : o.role === 'Maintenance' ? 'Manutenção' : o.role === 'Manager' ? 'Gerente' : 'Admin'}
                  </span>
                </td>
                <td>
                  {o.activeOperation ? (
                    <div>
                      <span className="badge warning" style={{ display: 'inline-block', marginBottom: '4px' }}>Em Operação</span>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Máq: {o.activeOperation.machineTag}</div>
                    </div>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#aaa' }}>Disponível</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${o.active ? 'success' : 'danger'}`}>
                    {o.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleResetPassword(o.id)}
                      style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                      title="Redefinir Senha"
                    >
                      <KeyRound size={16} />
                    </button>
                    <button 
                      onClick={() => { setEditingUser(o); setShowForm(true); }}
                      style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                      title="Editar Usuário"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(o)}
                      style={{ background: o.active ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)', color: o.active ? 'var(--danger)' : '#22c55e', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                      title={o.active ? "Inativar Usuário" : "Reativar Usuário"}
                    >
                      {o.active ? <Trash2 size={16} /> : <CheckCircle size={16} />}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && !loading && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum usuário encontrado.</div>
        )}
      </div>
      
      <AnimatePresence>
        {showForm && (
          <UserFormModal 
            user={editingUser} 
            onClose={() => setShowForm(false)} 
            onSaved={() => { setShowForm(false); fetchUsers(); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
