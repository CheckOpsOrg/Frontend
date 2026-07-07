import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, KeyRound, CheckCircle } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import OperatorFormModal from '../components/OperatorFormModal';

export default function Operators() {
  const [loading, setLoading] = useState(true);
  const [operators, setOperators] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOperator, setEditingOperator] = useState<any>(null);

  const fetchOperators = () => {
    setLoading(true);
    api.get('/users?role=2')
      .then(res => setOperators(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const handleToggleStatus = async (op: any) => {
    try {
      if (op.active) {
        if (!confirm('Deseja realmente inativar este operador?')) return;
        await api.delete(`/users/${op.id}`);
      } else {
        await api.put(`/users/${op.id}/reactivate`);
      }
      fetchOperators();
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status do operador.');
    }
  };

  const handleResetPassword = async (id: string) => {
    const newPassword = prompt('Digite a nova senha para este operador:');
    if (!newPassword) return;
    
    try {
      await api.put(`/users/${id}/password`, { newPassword });
      alert('Senha redefinida com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao redefinir senha.');
    }
  };

  if (loading && operators.length === 0) return <LoadingScreen />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Operadores</h1>
          <p className="page-subtitle">Visualização e gestão da equipe de operação e manutenção.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingOperator(null); setShowForm(true); }}>
          <Plus size={18}/> Novo Operador
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Operador</th>
              <th>Contato / CPF</th>
              <th>Cargo</th>
              <th>Atividade Atual</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((o, i) => (
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
                <td>{o.role === 'Operator' ? 'Operador' : o.role === 'Maintenance' ? 'Manutenção' : o.role === 'Manager' ? 'Gerente' : 'Admin'}</td>
                <td>
                  {o.activeOperation ? (
                    <div>
                      <span className="badge warning" style={{ display: 'inline-block', marginBottom: '4px' }}>Em Operação</span>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Máq: {o.activeOperation.machineTag}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Local: {o.activeOperation.location}</div>
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
                      onClick={() => { setEditingOperator(o); setShowForm(true); }}
                      style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                      title="Editar Operador"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(o)}
                      style={{ background: o.active ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)', color: o.active ? 'var(--danger)' : '#22c55e', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                      title={o.active ? "Inativar Operador" : "Reativar Operador"}
                    >
                      {o.active ? <Trash2 size={16} /> : <CheckCircle size={16} />}
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <AnimatePresence>
        {showForm && (
          <OperatorFormModal 
            operator={editingOperator} 
            onClose={() => setShowForm(false)} 
            onSaved={() => { setShowForm(false); fetchOperators(); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
