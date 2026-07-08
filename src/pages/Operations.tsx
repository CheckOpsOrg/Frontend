import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Eye, EyeOff, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import AssignOperationModal from '../components/AssignOperationModal';

export default function Operations() {
  const [loading, setLoading] = useState(true);
  const [operations, setOperations] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchOperations = () => {
    setLoading(true);
    api.get('/operations')
      .then(res => {
        // Backend doesn't guarantee sorting, sort by createdAt desc
        const sorted = res.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOperations(sorted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOperations();
  }, []);

  const filteredOperations = operations.filter(op => {
    if (showCompleted) return true;
    return op.status !== 'Completed' && op.status !== 'Cancelled';
  });

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'Assigned': return { icon: <Clock size={16} />, color: '#f59e0b', text: 'Pendente' };
      case 'Accepted': return { icon: <AlertCircle size={16} />, color: '#38bdf8', text: 'Em Andamento' };
      case 'Completed': return { icon: <CheckCircle size={16} />, color: '#22c55e', text: 'Concluída' };
      case 'Cancelled': return { icon: <XCircle size={16} />, color: '#ef4444', text: 'Cancelada' };
      default: return { icon: <Clock size={16} />, color: '#64748b', text: status };
    }
  };

  if (loading && operations.length === 0) return <LoadingScreen />;

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Gestão de Operações</h1>
          <p style={{ color: 'var(--text-muted)' }}>Controle e delegue tarefas ativas no chão de fábrica</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            className="btn-secondary"
            onClick={() => setShowCompleted(!showCompleted)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {showCompleted ? <><EyeOff size={20} /> Ocultar Finalizadas</> : <><Eye size={20} /> Mostrar Finalizadas</>}
          </button>
          
          <button 
            className="btn-primary" 
            onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', border: 'none' }}
          >
            <Plus size={20} /> Nova Operação
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        <AnimatePresence>
          {filteredOperations.length === 0 && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Nenhuma operação encontrada com os filtros atuais.
            </motion.div>
          )}
          
          {filteredOperations.map((op, i) => {
            const statusCfg = getStatusConfig(op.status);
            return (
              <motion.div 
                key={op.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass"
                style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${statusCfg.color}` }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{op.machineName} <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 'normal' }}>({op.machineTag})</span></h3>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      background: `${statusCfg.color}20`,
                      color: statusCfg.color,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 'bold'
                    }}>
                      {statusCfg.icon}
                      {statusCfg.text}
                    </span>
                    {op.priority === 'Alta' && <span style={{ background: '#ef444420', color: '#ef4444', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Alta Prioridade</span>}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <span><strong>Operador:</strong> {op.operatorName}</span>
                    <span><strong>Local:</strong> {op.location}</span>
                    <span><strong>Prazo:</strong> {op.timeoutMinutes} min</span>
                    <span><strong>Criada em:</strong> {new Date(op.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <AssignOperationModal 
            onClose={() => setShowModal(false)}
            onSaved={() => {
              setShowModal(false);
              fetchOperations();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
