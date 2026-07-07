import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Activity, Server, Users, AlertCircle } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ machines: 0, operations: 0, users: 0, tickets: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machinesRes, opsRes, usersRes, ticketsRes] = await Promise.all([
          api.get('/machines'),
          api.get('/operations'),
          api.get('/users'),
          api.get('/tickets')
        ]);
        setStats({
          machines: machinesRes.data.length,
          operations: opsRes.data.length,
          users: usersRes.data.length,
          tickets: ticketsRes.data.length
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { title: 'Operações Ativas', value: stats.operations, icon: <Activity size={24} color="var(--primary)" />, color: 'var(--primary)' },
    { title: 'Máquinas Cadastradas', value: stats.machines, icon: <Server size={24} color="#38bdf8" />, color: '#38bdf8' },
    { title: 'Operadores', value: stats.users, icon: <Users size={24} color="#a855f7" />, color: '#a855f7' },
    { title: 'Chamados Abertos', value: stats.tickets, icon: <AlertCircle size={24} color="var(--danger)" />, color: 'var(--danger)' },
  ];

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">Acompanhe as estatísticas do sistema CheckOps em tempo real.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            className="glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            style={{ padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px' }}
          >
            <div style={{ padding: '16px', borderRadius: '12px', background: `rgba(255,255,255,0.05)` }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{card.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>{card.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div style={{ marginTop: '48px' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Atividade Recente</h2>
          <div className="glass" style={{ borderRadius: '16px', padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Gráfico de Atividades será implementado aqui...
          </div>
      </div>
    </div>
  );
}
