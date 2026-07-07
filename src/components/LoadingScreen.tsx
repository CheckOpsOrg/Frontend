import { motion } from 'framer-motion';
import logoImg from '../assets/checkops_logo.png';

export default function LoadingScreen({ message = 'Carregando dados...' }: { message?: string }) {
  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '48px',
      height: '100%',
      minHeight: '300px'
    }}>
      <motion.img 
        src={logoImg} 
        alt="CheckOps Logo" 
        style={{ 
          width: '100px', 
          height: '100px', 
          objectFit: 'contain', 
          filter: 'drop-shadow(0 0 25px rgba(0, 212, 170, 0.6))',
          marginBottom: '24px'
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 500 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.div>
    </div>
  );
}
