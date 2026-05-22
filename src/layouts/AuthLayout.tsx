import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AuthLayout = () => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#042c53] via-[#185fa5] to-[#0f6e56] px-4 py-12">
    {[...Array.from({ length: 20 })].map((_, index) => (
      <span
        key={index}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          animationDelay: `${Math.random() * 6}s`,
        }}
      />
    ))}

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-md"
    >
      <Outlet />
    </motion.div>
  </div>
);

