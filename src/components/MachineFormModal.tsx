import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';

export default function MachineFormModal({ machine, onClose, onSaved }: { machine?: any, onClose: () => void, onSaved: () => void }) {
  const [tag, setTag] = useState(machine?.tag || '');
  const [description, setDescription] = useState(machine?.name || machine?.description || '');
  const [location, setLocation] = useState(machine?.location || '');
  const [categoryId, setCategoryId] = useState(machine?.categoryId || '');
  const [canOperateWithoutChecklists, setCanOperateWithoutChecklists] = useState(machine?.canOperateWithoutChecklists || false);
  const [preChecklistId, setPreChecklistId] = useState(machine?.preOperationChecklistTemplateId || '');
  const [postChecklistId, setPostChecklistId] = useState(machine?.postOperationChecklistTemplateId || '');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/machinecategories'),
      api.get('/checklisttemplates')
    ]).then(([catRes, tplRes]) => {
      setCategories(catRes.data);
      setTemplates(tplRes.data);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      id: machine?.id,
      tag,
      description,
      location,
      categoryId: categoryId || null,
      canOperateWithoutChecklists,
      preOperationChecklistTemplateId: preChecklistId || null,
      postOperationChecklistTemplateId: postChecklistId || null
    };

    try {
      if (machine?.id) {
        await api.put(`/machines/${machine.id}`, payload);
      } else {
        await api.post('/machines', payload);
      }
      onSaved();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar máquina');
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
        style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '24px', maxWidth: '500px', width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', color: 'var(--text-muted)' }}
        >
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '24px' }}>{machine ? 'Editar Máquina' : 'Nova Máquina'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>TAG</label>
            <input type="text" value={tag} onChange={e => setTag(e.target.value)} style={{ width: '100%' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Descrição / Nome</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Localização</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Categoria</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}>
              <option value="" style={{ color: '#000' }}>Selecione uma categoria...</option>
              {categories.map(c => <option key={c.id} value={c.id} style={{ color: '#000' }}>{c.name}</option>)}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginTop: '8px' }}>
            <input 
              type="checkbox" 
              checked={canOperateWithoutChecklists} 
              onChange={e => setCanOperateWithoutChecklists(e.target.checked)} 
              style={{ width: '20px', height: '20px' }}
            />
            <span style={{ fontSize: '14px' }}>Pode operar sem checklists</span>
          </label>

          {!canOperateWithoutChecklists && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Checklist Pré-Operação</label>
                <select value={preChecklistId} onChange={e => setPreChecklistId(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}>
                  <option value="" style={{ color: '#000' }}>Nenhum...</option>
                  {templates.filter(t => t.type === 0).map(t => <option key={t.id} value={t.id} style={{ color: '#000' }}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Checklist Pós-Operação</label>
                <select value={postChecklistId} onChange={e => setPostChecklistId(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}>
                  <option value="" style={{ color: '#000' }}>Nenhum...</option>
                  {templates.filter(t => t.type === 1).map(t => <option key={t.id} value={t.id} style={{ color: '#000' }}>{t.name}</option>)}
                </select>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }} disabled={loading}>
            <Save size={18} /> {loading ? 'Salvando...' : 'Salvar Máquina'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
