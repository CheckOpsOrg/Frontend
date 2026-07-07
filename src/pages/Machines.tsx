import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Printer, X, Plus, Edit, Trash2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import LoadingScreen from '../components/LoadingScreen';
import MachineFormModal from '../components/MachineFormModal';

export default function Machines() {
  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMachine, setEditingMachine] = useState<any>(null);

  const fetchMachines = () => {
    setLoading(true);
    api.get('/machines')
      .then(res => setMachines(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente inativar/deletar esta máquina?')) return;
    try {
      await api.delete(`/machines/${id}`);
      fetchMachines();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir máquina.');
    }
  };

  if (loading && machines.length === 0) return <LoadingScreen />;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Máquinas</h1>
          <p className="page-subtitle">Gerencie os equipamentos e gere os QR Codes.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingMachine(null); setShowForm(true); }}>
          <Plus size={18}/> Nova Máquina
        </button>
      </div>

      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>TAG</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m, i) => (
              <motion.tr 
                key={m.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <td style={{ fontWeight: 600 }}>{m.tag}</td>
                <td>{m.name}</td>
                <td>
                  <span className={`badge ${m.status === 0 ? 'success' : m.status === 1 ? 'warning' : 'danger'}`}>
                    {m.status === 0 ? 'Ativa' : m.status === 1 ? 'Manutenção' : 'Inativa'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      onClick={() => setSelectedMachine(m)}
                      style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                      title="Gerar QR Code"
                    >
                      <QrCode size={16} />
                    </button>
                    <button 
                      onClick={() => { setEditingMachine(m); setShowForm(true); }}
                      style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                      title="Editar Máquina"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(m.id)}
                      style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--danger)', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                      title="Inativar Máquina"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedMachine && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass"
              style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '400px', width: '100%', textAlign: 'center', position: 'relative' }}
            >
              <button 
                onClick={() => setSelectedMachine(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
              
              <h2 style={{ marginBottom: '8px' }}>{selectedMachine.tag}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{selectedMachine.name}</p>
              
              <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', display: 'inline-block', marginBottom: '32px' }}>
                <QRCodeCanvas 
                  value={JSON.stringify({ machine_id: selectedMachine.id, Tag: selectedMachine.tag })} 
                  size={200}
                  level="H"
                />
              </div>

              <button className="btn-primary" style={{ width: '100%' }} onClick={handlePrint}>
                <Printer size={18} /> Imprimir Etiqueta
              </button>
            </motion.div>
          </div>
        )}
        
        {showForm && (
          <MachineFormModal 
            machine={editingMachine} 
            onClose={() => setShowForm(false)} 
            onSaved={() => { setShowForm(false); fetchMachines(); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

