import React from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  const safetyTips = [
    'Meet in public places on campus (library, student center)',
    'Inspect books before paying',
    'Trust your instincts - if something feels off, it probably is',
    'Never share personal financial information',
    'Consider bringing a friend to meetups',
    'Verify course requirements before purchasing'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Safety Tips for Buying & Selling">
      <ul className="space-y-3">
        {safetyTips.map((tip, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 text-gray-700"
          >
            <span className="text-primary-600 font-bold text-lg flex-shrink-0">▸</span>
            <span>{tip}</span>
          </motion.li>
        ))}
      </ul>
    </Modal>
  );
};

export default SafetyModal;

