import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { copyToClipboard } from '@/lib/utils';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, contactInfo }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(contactInfo);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Seller">
      <div className="space-y-4">
        <motion.div
          className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <p className="text-lg font-semibold text-gray-900 break-all">
            {contactInfo}
          </p>
        </motion.div>

        <motion.button
          onClick={handleCopy}
          className={`w-full btn ${copied ? 'btn-secondary' : 'btn-primary'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {copied ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </span>
          ) : (
            'Copy to Clipboard'
          )}
        </motion.button>

        <p className="text-sm text-gray-600 italic text-center">
          Remember to mention you found this listing on Bookster!
        </p>
      </div>
    </Modal>
  );
};

export default ContactModal;

