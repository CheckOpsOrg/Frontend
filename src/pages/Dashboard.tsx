import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Activity, Zap, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error("Error fetching metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !metrics) return <LoadingScreen />;

  const cards = [
    { title: 'Disponibilidade (Global)', value: `${metrics.availabilityPercentage?.toFixed(1) || 0}%`, icon: <Activity size={24} color="#22c55e" />, color: '#22c55e' },
    { title: 'MTTR (Últimos 30d)', value: `${metrics.mttrHours?.toFixed(1) || 0}h`, icon: <Clock size={24} color="#f59e0b" />, color: '#f59e0b' },
    { title: 'MTBF (Global)', value: `${metrics.mtbfHours?.toFixed(1) || 0}h`, icon: <Zap size={24} color="#38bdf8" />, color: '#38bdf8' },
    { title: 'Entregas no Prazo', value: `${metrics.otdPercentage?.toFixed(1) || 0}%`, icon: <CheckCircle size={24} color="#a855f7" />, color: '#a855f7' },
  ];

  const COLORS = ['#ef4444', '#f97316', '#3b82f6'];

  const criticalityData = [
    { name: 'Alta', value: metrics.criticalityDistribution?.highCount || 0 },
    { name: 'Média', value: metrics.criticalityDistribution?.mediumCount || 0 },
    { name: 'Baixa', value: metrics.criticalityDistribution?.lowCount || 0 },
  ];

  const trendData = metrics.trendLast7Days?.map((t: any) => ({
    name: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    Operações: t.operationsCreated,
    Chamados: t.ticketsCreated
  })) || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inteligência de Operações</h1>
          <p className="page-subtitle">Acompanhe os principais indicadores (KPIs) de performance e manutenção da fábrica.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
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
              <div style={{ fontSize: '32px', fontWeight: 700, color: card.color }}>{card.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>{card.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Trend Chart */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Produtividade vs Quebras (7 Dias)
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1e26', borderColor: '#333', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="Operações" stroke="#22c55e" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Chamados" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Problematic Machines */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} /> Top 5 Máquinas Problemáticas
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={metrics.topProblematicMachines} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="machineTag" type="category" stroke="rgba(255,255,255,0.8)" width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1e26', borderColor: '#333', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="failureCount" name="Frequência de Falhas" radius={[0, 4, 4, 0]}>
                  {metrics.topProblematicMachines?.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === 1 ? '#f97316' : '#38bdf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Criticality Donut */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Chamados Abertos por Severidade</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={criticalityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {criticalityData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1e26', borderColor: '#333', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Operators List */}
        <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Top Performers (Operadores)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>Maior quantidade de operações concluídas no prazo.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {metrics.topOperators?.map((op: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600 }}>{i + 1}. {op.operatorName}</span>
                <span className="badge success">{op.otdCount} entregas no prazo</span>
              </div>
            ))}
            {(!metrics.topOperators || metrics.topOperators.length === 0) && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>Sem dados suficientes.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
