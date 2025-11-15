import React, { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuccessModal from '@/components/SuccessModal';
import { supabase, DEMO_MODE, COURSE_CODES } from '@/lib/supabase';
import { isValidCourseCode, isValidContact, formatCourseCode } from '@/lib/utils';
import { addDemoListing } from '@/lib/demoStorage';
import { useAuth } from '@/contexts/AuthContext';
import type { FormData, Listing } from '@/types';

export default function Post() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    course_code: '',
    book_title: '',
    price: 0,
    contact_info: '',
    condition: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // AI Enhancement states
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showAiTooltip, setShowAiTooltip] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (name === 'course_code') {
      processedValue = formatCourseCode(value);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name: keyof FormData): string => {
    const value = formData[name];

    if (!value && name !== 'condition' && name !== 'notes') {
      return 'This field is required';
    }

    switch (name) {
      case 'course_code':
        if (value && !isValidCourseCode(value as string)) {
          return 'Please enter a valid course code (e.g., CS 161, MATH 165)';
        }
        break;
      case 'price':
        if (value && (Number(value) <= 0 || Number(value) > 9999)) {
          return 'Please enter a valid price between $0.01 and $9999';
        }
        break;
      case 'contact_info':
        if (value && !isValidContact(value as string)) {
          return 'Please enter a valid phone number or email address';
        }
        break;
      case 'book_title':
        if (value && (value as string).length < 3) {
          return 'Book title must be at least 3 characters long';
        }
        break;
    }

    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const error = validateField(name as keyof FormData);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof FormData)[] = ['course_code', 'book_title', 'price', 'contact_info'];
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let isValid = true;

    requiredFields.forEach(field => {
      const error = validateField(field);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Security: Ensure user is authenticated
      if (!user && !DEMO_MODE) {
        throw new Error('You must be logged in to post a listing');
      }

      const listingData: Listing = {
        id: `demo-${Date.now()}`,
        user_id: user?.id,
        course_code: formData.course_code.trim().toUpperCase(),
        book_title: formData.book_title.trim(),
        price: Number(formData.price),
        contact_info: formData.contact_info.trim(),
        condition: formData.condition || null,
        notes: formData.notes?.trim() || null,
        status: 'active' as const,
        created_at: new Date().toISOString()
      };

      if (DEMO_MODE) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Save to session storage so it appears in marketplace!
        addDemoListing(listingData, []);
      } else {
        const { error } = await supabase
          .from('listings')
          .insert([listingData]);

        if (error) throw error;
      }

      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error posting listing:', error);
      alert('Failed to post listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnother = () => {
    setSuccessModalOpen(false);
    setFormData({
      course_code: '',
      book_title: '',
      price: 0,
      contact_info: '',
      condition: '',
      notes: ''
    });
    setErrors({});
    formRef.current?.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AI Enhancement feature
  const handleEnhanceDescription = async () => {
    if (!formData.course_code || !formData.book_title) {
      alert('Please enter course code and book title first');
      return;
    }

    setIsEnhancing(true);
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/ai/enhance-description', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({
          courseCode: formData.course_code,
          bookTitle: formData.book_title,
          currentNotes: formData.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enhance description');
      }

      const data = await response.json();
      if (data.enhancedDescription) {
        setFormData(prev => ({ ...prev, notes: data.enhancedDescription }));
        setShowAiTooltip(true);
        setTimeout(() => setShowAiTooltip(false), 3000);
      }
    } catch (error: any) {
      console.error('Enhancement error:', error);
      alert(error.message || 'Failed to enhance description. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };


  return (
    <>
      <Head>
        <title>Post an Item - Bookster</title>
        <meta name="description" content="List your item in 30 seconds. Reach all potential buyers on campus instantly." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative">
        {/* Subtle grain texture overlay */}
        <div className="fixed inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
        <Header subtitle="Post Your Item" />

        <main className="flex-1 py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-2">
                  Sell Your Item
                </h2>
                <p className="text-gray-600">
                  Fill out this quick form to list your item. It only takes 30 seconds!
                </p>
              </div>

              {/* Form */}
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Course Code */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="course_code" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Code <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">e.g., MATH 165, CS 161</span>
                  </label>
                  <input
                    type="text"
                    id="course_code"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter course code"
                    maxLength={20}
                    list="courseCodes"
                    className={`input ${errors.course_code ? 'input-error' : ''}`}
                  />
                  <datalist id="courseCodes">
                    {COURSE_CODES.map(code => (
                      <option key={code} value={code} />
                    ))}
                  </datalist>
                  {errors.course_code && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.course_code}
                    </motion.p>
                  )}
                </motion.div>

                {/* Book Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label htmlFor="book_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Book Title <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">Full title as shown on cover</span>
                  </label>
                  <input
                    type="text"
                    id="book_title"
                    name="book_title"
                    value={formData.book_title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter book title"
                    maxLength={200}
                    className={`input ${errors.book_title ? 'input-error' : ''}`}
                  />
                  {errors.book_title && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.book_title}
                    </motion.p>
                  )}
                </motion.div>

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">Your asking price</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      $
                    </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className={`input pl-8 ${errors.price ? 'input-error' : ''}`}
                    />
                  </div>
                  {errors.price && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.price}
                    </motion.p>
                  )}
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Info <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">Phone or email (will be hidden until buyer clicks)</span>
                  </label>
                  <input
                    type="text"
                    id="contact_info"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="555-123-4567 or student@university.edu"
                    className={`input ${errors.contact_info ? 'input-error' : ''}`}
                  />
                  {errors.contact_info && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.contact_info}
                    </motion.p>
                  )}
                </motion.div>

                {/* Condition */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                    Condition <span className="text-xs text-gray-500 ml-2">Optional</span>
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Acceptable">Acceptable</option>
                  </select>
                </motion.div>

                {/* Notes with AI enhancement */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes <span className="text-xs text-gray-500 ml-2">Optional - Any other details (max 500 characters)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="e.g., Includes study guide, some highlighting, etc."
                      maxLength={500}
                      rows={4}
                      className="input resize-none"
                    />
                    <motion.button
                      type="button"
                      onClick={handleEnhanceDescription}
                      disabled={isEnhancing || !formData.course_code || !formData.book_title}
                      className="absolute bottom-3 right-3 ai-badge"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Enhance with AI"
                    >
                      {isEnhancing ? (
                        <span className="spinner w-3 h-3 border-white" />
                      ) : (
                        <>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>Enhance</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: showAiTooltip ? 1 : 0 }}
                      className="text-xs text-purple-600 font-medium"
                    >
                      ✨ Enhanced with AI!
                    </motion.p>
                    <div className="text-right text-xs text-gray-500">
                      {formData.notes?.length || 0} / 500
                    </div>
                  </div>
                </motion.div>

                {/* Privacy Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-primary-50 p-4 rounded-lg flex items-start gap-3"
                >
                  <svg
                    className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M8 11V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V11"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                  </svg>
                  <p className="text-sm text-primary-900">
                    Your contact information will only be shown to interested buyers when they click &ldquo;Show Contact&rdquo;
                  </p>
                </motion.div>

                {/* Submit Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn btn-primary text-lg py-3"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="spinner w-5 h-5" />
                        Posting...
                      </span>
                    ) : (
                      'Post Listing'
                    )}
                  </motion.button>
                  <Link href="/marketplace" className="flex-1">
                    <motion.button
                      type="button"
                      className="w-full btn btn-secondary text-lg py-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </Link>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </main>

        <Footer />

        {/* Success Modal */}
        <SuccessModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          onPostAnother={handlePostAnother}
        />
      </div>
    </>
  );
}

