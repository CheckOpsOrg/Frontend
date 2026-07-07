import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import TicketDetailsModal from '../components/TicketDetailsModal';

export default function Tickets() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

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



  const handleUpdated = () => {
    fetchTickets();
    setSelectedTicket(null);
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
              <th>Quem abriu</th>
              <th>Responsável</th>
              <th>Severidade</th>
              <th>Status</th>
              <th>Data</th>
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
                <td style={{ fontWeight: 600 }}>{t.machineTag || t.machineId}</td>
                <td>{t.reportedByName}</td>
                <td>
                  {t.assignedToName ? (
                    <span style={{ fontWeight: 500 }}>{t.assignedToName}</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Não atribuído</span>
                  )}
                </td>
                <td>
                  <span className={`badge ${t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'warning' : 'info'}`}>
                    {t.priority === 'High' ? 'Alta' : t.priority === 'Medium' ? 'Média' : 'Baixa'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${t.status === 'Resolved' || t.status === 'Cancelled' ? 'success' : 'warning'}`}>
                    {t.status === 'Open' ? 'Aberto' : t.status === 'InProgress' ? 'Em Progresso' : t.status === 'Resolved' ? 'Resolvido' : 'Fechado'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      onClick={() => setSelectedTicket(t)}
                      style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                      title="Ver Detalhes do Chamado"
                    >
                      <Eye size={16} /> Detalhes
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTicket && (
        <TicketDetailsModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
          onUpdated={handleUpdated} 
        />
      )}
    </div>
  );
}
