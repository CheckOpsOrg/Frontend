import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { X, Save, ArrowRightLeft } from 'lucide-react';

export default function TransferOperationModal({ 
  operationId, 
  onClose, 
  onSaved 
}: { 
  operationId: string, 
  onClose: () => void, 
  onSaved: () => void 
}) {
  const [operatorId, setOperatorId] = useState('');
  const [reason, setReason] = useState('');
  
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const usersRes = await api.get('/users?role=2'); // 2 = Operator
        setOperators(usersRes.data);
      } catch (err) {
        console.error("Error fetching operators", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchDependencies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(`/operations/${operationId}/transfer`, {
        newOperatorId: operatorId,
        reason
      });
      onSaved();
    } catch (err) {
      console.error(err);
      alert('Erro ao transferir operação');
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
        style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '400px', width: '100%', position: 'relative' }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowRightLeft size={24} color="#38bdf8" /> Transferir Operação
        </h2>
        
        {loadingData ? (
          <p>Carregando operadores...</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Novo Operador</label>
              <select value={operatorId} onChange={e => setOperatorId(e.target.value)} style={{ width: '100%' }} required>
                <option value="" disabled>Selecione o operador</option>
                {operators.map(o => (
                  <option key={o.id} value={o.id} style={{ color: '#000' }}>{o.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Motivo (Opcional)</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} style={{ width: '100%', minHeight: '60px', resize: 'vertical' }} />
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }} disabled={loading}>
              <Save size={20} />
              {loading ? 'Transferindo...' : 'Confirmar Transferência'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
