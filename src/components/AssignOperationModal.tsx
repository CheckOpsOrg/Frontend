import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';

export default function AssignOperationModal({ 
  preSelectedMachineId, 
  onClose, 
  onSaved 
}: { 
  preSelectedMachineId?: string, 
  onClose: () => void, 
  onSaved: () => void 
}) {
  const [machineId, setMachineId] = useState(preSelectedMachineId || '');
  const [operatorId, setOperatorId] = useState('');
  const [location, setLocation] = useState('');
  const [timeoutMinutes, setTimeoutMinutes] = useState(60);
  const [priority, setPriority] = useState('Normal');
  const [instructions, setInstructions] = useState('');
  
  const [machines, setMachines] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [machinesRes, usersRes] = await Promise.all([
          api.get('/machines'),
          api.get('/users?role=2') // 2 = Operator
        ]);
        setMachines(machinesRes.data.filter((m: any) => m.active));
        setOperators(usersRes.data);
      } catch (err) {
        console.error("Error fetching dependencies", err);
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
      await api.post('/operations/assign', {
        machineId,
        operatorId,
        location,
        timeoutMinutes,
        priority,
        instructions
      });
      onSaved();
    } catch (err) {
      console.error(err);
      alert('Erro ao iniciar operação');
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
        
        <h2 style={{ marginBottom: '24px' }}>Delegar Operação</h2>
        
        {loadingData ? (
          <p>Carregando dados...</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Máquina</label>
              <select value={machineId} onChange={e => setMachineId(e.target.value)} style={{ width: '100%' }} required>
                <option value="" disabled>Selecione uma máquina</option>
                {machines.map(m => (
                  <option key={m.id} value={m.id} style={{ color: '#000' }}>{m.name || m.tag}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Operador</label>
              <select value={operatorId} onChange={e => setOperatorId(e.target.value)} style={{ width: '100%' }} required>
                <option value="" disabled>Selecione o operador</option>
                {operators.map(o => (
                  <option key={o.id} value={o.id} style={{ color: '#000' }}>{o.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Local / Setor</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%' }} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Tempo Esperado (min)</label>
                <input type="number" min="1" value={timeoutMinutes} onChange={e => setTimeoutMinutes(parseInt(e.target.value))} style={{ width: '100%' }} required />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Prioridade</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: '100%' }}>
                  <option value="Baixa" style={{ color: '#000' }}>Baixa</option>
                  <option value="Normal" style={{ color: '#000' }}>Normal</option>
                  <option value="Alta" style={{ color: '#000' }}>Alta</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Instruções Adicionais (Opcional)</label>
              <textarea value={instructions} onChange={e => setInstructions(e.target.value)} style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} />
            </div>
            
            <button type="submit" className="btn-primary" style={{ marginTop: '8px' }} disabled={loading}>
              <Save size={20} />
              {loading ? 'Iniciando...' : 'Iniciar Operação'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
