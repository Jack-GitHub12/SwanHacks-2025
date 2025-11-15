import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Modal from './Modal';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostAnother: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, onPostAnother }) => {
  useEffect(() => {
    if (isOpen) {
      // Create confetti effect
      const colors = ['#C8102E', '#f59e0b', '#ef4444', '#b91c1c', '#d97706'];
      const confettiCount = 50;

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${color};
          top: 50%;
          left: 50%;
          z-index: 9999;
          pointer-events: none;
          border-radius: 2px;
        `;

        document.body.appendChild(confetti);

        const tx = (Math.random() - 0.5) * window.innerWidth;
        const ty = Math.random() * -window.innerHeight;
        const rotation = Math.random() * 720 - 360;

        confetti.animate([
          {
            transform: 'translate(-50%, -50%) rotate(0deg)',
            opacity: 1
          },
          {
            transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rotation}deg)`,
            opacity: 0
          }
        ], {
          duration: 3000,
          easing: 'cubic-bezier(0, .9, .57, 1)'
        });

        setTimeout(() => {
          document.body.removeChild(confetti);
        }, 3000);
      }
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        >
          <svg
            className="w-24 h-24 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="#d1fae5" />
            <motion.path
              d="M8 12L11 15L16 9"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </svg>
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600">Your textbook has been listed successfully.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <motion.button
              className="w-full btn btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Listings
            </motion.button>
          </Link>
          <motion.button
            onClick={onPostAnother}
            className="flex-1 btn btn-secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Post Another Book
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;

