import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase, DEMO_MODE, COURSE_CODES, DEMO_LISTINGS } from '@/lib/supabase';
import { isValidCourseCode, isValidContact, formatCourseCode } from '@/lib/utils';
import { getDemoListings, updateDemoListing } from '@/lib/demoStorage';
import { useAuth } from '@/contexts/AuthContext';
import type { FormData } from '@/types';

export default function EditListing() {
  const router = useRouter();
  const { id } = router.query;
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
  const [isLoading, setIsLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // AI Enhancement states
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showAiTooltip, setShowAiTooltip] = useState(false);

  // Load existing listing
  useEffect(() => {
    if (id && user) {
      loadListing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const loadListing = async () => {
    try {
      if (DEMO_MODE) {
        // Load from demo storage
        const listings = getDemoListings(DEMO_LISTINGS);
        const listing = listings.find(l => l.id === id);

        if (!listing) {
          alert('Listing not found');
          router.push('/marketplace');
          return;
        }

        // Load data into form
        setFormData({
          course_code: listing.course_code,
          book_title: listing.book_title,
          price: listing.price,
          contact_info: listing.contact_info,
          condition: listing.condition || '',
          notes: listing.notes || '',
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Verify ownership
      if (data.user_id !== user?.id) {
        alert('You can only edit your own listings');
        router.push('/marketplace');
        return;
      }

      // Load data into form
      setFormData({
        course_code: data.course_code,
        book_title: data.book_title,
        price: data.price,
        contact_info: data.contact_info,
        condition: data.condition || '',
        notes: data.notes || '',
      });
    } catch (error) {
      console.error('Error loading listing:', error);
      alert('Failed to load listing');
      router.push('/marketplace');
    } finally {
      setIsLoading(false);
    }
  };

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
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error('You must be logged in to edit listings');
      }

      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update in demo storage
        updateDemoListing(id as string, {
          course_code: formData.course_code.trim().toUpperCase(),
          book_title: formData.book_title.trim(),
          price: Number(formData.price),
          contact_info: formData.contact_info.trim(),
          condition: formData.condition || null,
          notes: formData.notes?.trim() || null,
        }, DEMO_LISTINGS);

        // Redirect to marketplace
        router.push('/marketplace');
        return;
      }

      const { error } = await supabase
        .from('listings')
        .update({
          course_code: formData.course_code.trim().toUpperCase(),
          book_title: formData.book_title.trim(),
          price: Number(formData.price),
          contact_info: formData.contact_info.trim(),
          condition: formData.condition || null,
          notes: formData.notes?.trim() || null,
        })
        .eq('id', id);

      if (error) throw error;

      // Redirect to marketplace
      router.push('/marketplace');
    } catch (error: any) {
      console.error('Error updating listing:', error);
      alert(error.message || 'Failed to update listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostAnother = () => {
    setSuccessModalOpen(false);
    router.push('/post');
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4" />
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Item - Bookster</title>
        <meta name="description" content="Edit your item listing." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative">
        {/* Subtle grain texture overlay */}
        <div className="fixed inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
        <Header subtitle="Edit Your Item" />

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
                  Edit Your Item
                </h2>
                <p className="text-gray-600">
                  Update your listing details below
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
                    <span className="text-xs text-gray-500 ml-2">e.g., CS 161, MATH 165</span>
                  </label>
                  <input
                    type="text"
                    id="course_code"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter course code"
                    list="course-codes"
                    maxLength={20}
                    className={`input ${errors.course_code ? 'input-error' : ''}`}
                  />
                  <datalist id="course-codes">
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
                    Item Title <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 ml-2">Full title or description</span>
                  </label>
                  <input
                    type="text"
                    id="book_title"
                    name="book_title"
                    value={formData.book_title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter item title"
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
                    placeholder="555-123-4567 or student@iastate.edu"
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

                {/* Submit Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn btn-secondary flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary flex-1"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="spinner w-5 h-5 border-white" />
                        Saving Changes...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </main>

        <Footer />

        {successModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => router.push('/marketplace')}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
              >
                <svg
                  className="w-20 h-20 mx-auto mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" fill="#d1fae5" />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Updated!</h2>
              <p className="text-gray-600 mb-6">Your changes have been saved successfully.</p>
              <button
                onClick={() => router.push('/marketplace')}
                className="btn btn-primary w-full"
              >
                Back to Listings
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}

