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
      minHeight: '400px',
      width: '100%'
    }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        
        {/* Outer rotating dashed ring */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: -10, left: -10, right: -10, bottom: -10,
            borderRadius: '50%',
            border: '2px dashed rgba(0, 212, 170, 0.4)',
            boxShadow: '0 0 20px rgba(0, 212, 170, 0.2)'
          }}
        />

        {/* Inner rotating solid ring (opposite direction) */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: -2, left: -2, right: -2, bottom: -2,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: 'var(--primary)',
            borderBottomColor: 'var(--primary)'
          }}
        />

        {/* Floating Logo (Instant visibility) */}
        <motion.img 
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            y: [-5, 5, -5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          src={logoImg} 
          alt="CheckOps Logo" 
          style={{ 
            width: '80px', 
            height: '80px', 
            objectFit: 'contain', 
            filter: 'drop-shadow(0 0 25px rgba(0, 212, 170, 0.8))'
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ 
          color: 'var(--primary)', 
          fontSize: '18px', 
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          filter: 'drop-shadow(0 0 10px rgba(0,212,170,0.5))'
        }}
      >
        {message}
      </motion.div>
    </div>
  );
}
