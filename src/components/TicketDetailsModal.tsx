import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, RefreshCcw, UserPlus } from 'lucide-react';
import api from '../api/axios';

interface TicketDetailsModalProps {
  ticket: any;
  onClose: () => void;
  onUpdated: () => void;
}

export default function TicketDetailsModal({ ticket, onClose, onUpdated }: TicketDetailsModalProps) {
  const [maintenanceUsers, setMaintenanceUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  
  const [closing, setClosing] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState('Solved'); // Solved, Invalid, WontFix

  const [reopening, setReopening] = useState(false);
  const [justification, setJustification] = useState('');

  useEffect(() => {
    // Role 3 = Maintenance
    api.get('/users?role=3')
      .then(res => setMaintenanceUsers(res.data))
      .catch(console.error);
  }, []);

  const handleAssign = async () => {
    if (!selectedUser) return;
    setAssigning(true);
    try {
      await api.put(`/tickets/${ticket.id}/assign`, { assignedToUserId: selectedUser });
      onUpdated();
    } catch (err) {
      console.error(err);
      alert('Erro ao atribuir chamado.');
    } finally {
      setAssigning(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!resolutionNotes) return alert('Por favor, informe a nota de resolução.');
    setClosing(true);
    try {
      await api.put(`/tickets/${ticket.id}/close`, { resolution: resolutionStatus, notes: resolutionNotes });
      onUpdated();
    } catch (err) {
      console.error(err);
      alert('Erro ao fechar chamado.');
    } finally {
      setClosing(false);
    }
  };

  const handleReopenTicket = async () => {
    if (!justification) return alert('A justificativa é obrigatória para reabrir o chamado.');
    setReopening(true);
    try {
      await api.put(`/tickets/${ticket.id}/reopen`, { justification });
      onUpdated();
    } catch (err) {
      console.error(err);
      alert('Erro ao reabrir chamado.');
    } finally {
      setReopening(false);
    }
  };

  const isClosed = ticket.status === 'Resolved' || ticket.status === 'Cancelled' || ticket.status === 2 || ticket.status === 3;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass"
        style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', color: 'var(--text)', padding: '8px', borderRadius: '50%' }}
        >
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: '8px', paddingRight: '40px' }}>{ticket.title}</h2>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{ticket.machineTag}</span>
          <span className={`badge ${ticket.priority === 'High' ? 'danger' : ticket.priority === 'Medium' ? 'warning' : 'info'}`}>
            Prioridade: {ticket.priority === 'High' ? 'Alta' : ticket.priority === 'Medium' ? 'Média' : 'Baixa'}
          </span>
          <span className={`badge ${isClosed ? 'success' : 'warning'}`}>
            Status: {ticket.status}
          </span>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>Reportado por <strong>{ticket.reportedByName}</strong> em {new Date(ticket.createdAt).toLocaleString()}</p>
          <p style={{ margin: 0, lineHeight: '1.6' }}>{ticket.description}</p>
        </div>

        {/* ASSIGNMENT PANEL */}
        {!isClosed && (
          <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={18} /> Responsável da Manutenção
            </h3>
            {ticket.assignedToName ? (
              <p style={{ color: '#22c55e', margin: 0 }}>Chamado atribuído a: <strong>{ticket.assignedToName}</strong></p>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <select 
                  className="form-input" 
                  style={{ flex: 1 }} 
                  value={selectedUser} 
                  onChange={e => setSelectedUser(e.target.value)}
                >
                  <option value="">Selecione um mantenedor...</option>
                  {maintenanceUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <button className="btn-primary" onClick={handleAssign} disabled={assigning || !selectedUser}>
                  Atribuir
                </button>
              </div>
            )}
          </div>
        )}

        {/* HISTORY / TIMELINE */}
        {ticket.history && ticket.history.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Histórico</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ticket.history.map((h: any, i: number) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '4px', fontSize: '12px' }}>
                    <span>{h.oldStatus} ➔ {h.newStatus}</span>
                    <span>{new Date(h.createdAt).toLocaleString()}</span>
                  </div>
                  {h.justification && <div><strong>Nota:</strong> {h.justification}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLOSING / REOPENING ACTIONS */}
        {!isClosed ? (
          <div style={{ padding: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#22c55e' }}>Encerrar Chamado</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <select className="form-input" value={resolutionStatus} onChange={e => setResolutionStatus(e.target.value)}>
                <option value="Solved">Resolvido</option>
                <option value="Invalid">Inválido</option>
                <option value="WontFix">Não será feito</option>
              </select>
            </div>
            <textarea 
              className="form-input" 
              placeholder="Notas de resolução (obrigatório)" 
              style={{ minHeight: '80px', marginBottom: '12px' }}
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
            />
            <button className="btn-primary" style={{ width: '100%', background: '#22c55e' }} onClick={handleCloseTicket} disabled={closing}>
              <CheckCircle size={18} /> Encerrar
            </button>
          </div>
        ) : (
          <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#ef4444' }}>Reabrir Chamado</h3>
            <textarea 
              className="form-input" 
              placeholder="Justificativa para reabertura (obrigatório)" 
              style={{ minHeight: '80px', marginBottom: '12px' }}
              value={justification}
              onChange={e => setJustification(e.target.value)}
            />
            <button className="btn-primary" style={{ width: '100%', background: '#ef4444' }} onClick={handleReopenTicket} disabled={reopening}>
              <RefreshCcw size={18} /> Reabrir Chamado
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
}
