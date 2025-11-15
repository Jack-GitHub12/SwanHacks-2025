import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const FloatingActionButton: React.FC = () => {
  return (
    <Link href="/post">
      <motion.div
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl font-light cursor-pointer z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: 0.5
        }}
        whileHover={{
          scale: 1.1,
          rotate: 90,
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)'
        }}
        whileTap={{ scale: 0.9 }}
        title="Post a Textbook"
      >
        <motion.span
          initial={{ rotate: 0 }}
          whileHover={{ rotate: -90 }}
        >
          +
        </motion.span>
      </motion.div>
    </Link>
  );
};

export default FloatingActionButton;

