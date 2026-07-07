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
    api.get('/users')
      .then(res => setOperators(res.data.filter((u: any) => u.role === 1 || u.role === 2)))
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
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Cargo</th>
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
                <td style={{ fontWeight: 600 }}>{o.registration}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {o.name.charAt(0)}
                    </div>
                    {o.name}
                  </div>
                </td>
                <td>{o.role === 1 ? 'Operador' : 'Manutenção'}</td>
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
