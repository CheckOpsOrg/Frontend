import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Play, CheckCircle } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

export default function Tickets() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);

  const fetchTickets = () => {
    setLoading(true);
    api.get('/tickets')
      .then(res => setTickets(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChangeStatus = async (id: string, newStatus: number) => {
    try {
      await api.put(`/tickets/${id}/status`, { status: newStatus });
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status.');
    }
  };

  const handleClose = async (id: string) => {
    const notes = prompt('Digite as notas de resolução para fechar o chamado:');
    if (notes === null) return;
    try {
      await api.put(`/tickets/${id}/close`, { resolution: 'Solved', notes });
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert('Erro ao fechar chamado.');
    }
  };

  if (loading && tickets.length === 0) return <LoadingScreen />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Chamados</h1>
          <p className="page-subtitle">Gerenciamento de tickets de manutenção.</p>
        </div>
      </div>

      <div className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Máquina</th>
              <th>Descrição</th>
              <th>Severidade</th>
              <th>Status</th>
              <th>Reportado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <motion.tr 
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <td style={{ fontWeight: 600 }}>{t.machineName || t.machineId}</td>
                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.description}</td>
                <td>
                  <span className={`badge ${t.severity === 0 ? 'info' : t.severity === 1 ? 'warning' : 'danger'}`}>
                    {t.severity === 0 ? 'Baixa' : t.severity === 1 ? 'Média' : 'Alta'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${t.status === 0 ? 'warning' : t.status === 1 ? 'info' : t.status === 2 ? 'success' : 'danger'}`}>
                    {t.status === 0 ? 'Aberto' : t.status === 1 ? 'Em Progresso' : t.status === 2 ? 'Resolvido' : 'Fechado'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {t.status === 0 && (
                      <button 
                        onClick={() => handleChangeStatus(t.id, 1)}
                        style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                        title="Iniciar Atendimento"
                      >
                        <Play size={16} />
                      </button>
                    )}
                    {t.status === 1 && (
                      <button 
                        onClick={() => handleClose(t.id)}
                        style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                        title="Resolver Chamado"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
