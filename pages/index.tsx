import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ListingCard from '@/components/ListingCard';
import CategoryFilter from '@/components/CategoryFilter';
import { supabase, DEMO_MODE, DEMO_LISTINGS } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getCoursesByDepartment } from '@/lib/categories';
import type { Listing, SortOption } from '@/types';

// Lazy load heavy components for better initial page load
const ContactModal = dynamic(() => import('@/components/ContactModal'), { ssr: false });
const SafetyModal = dynamic(() => import('@/components/SafetyModal'), { ssr: false });
const FloatingActionButton = dynamic(() => import('@/components/FloatingActionButton'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Use replace to avoid adding to browser history
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  // Load listings after user is authenticated
  useEffect(() => {
    if (user) {
      loadListings();
    }
  }, [user]);

  // Filter and sort whenever dependencies change
  useEffect(() => {
    filterAndSortListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings, departmentFilter, courseFilter, sortBy, searchQuery]);

  const loadListings = async () => {
    try {
      if (DEMO_MODE) {
        console.log('Using DEMO_MODE');
        setListings(DEMO_LISTINGS);
      } else {
        console.log('Fetching listings from Supabase...');
        // Simplified query - just use * to get all columns for now
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        
        console.log('Listings loaded:', data?.length || 0);
        setListings(data || []);
      }
    } catch (error) {
      console.error('Error loading listings:', error);
      console.log('Falling back to DEMO_LISTINGS');
      setListings(DEMO_LISTINGS);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortListings = () => {
    let filtered = [...listings];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.book_title.toLowerCase().includes(query) ||
        l.course_code.toLowerCase().includes(query) ||
        l.notes?.toLowerCase().includes(query)
      );
    }

    // Filter by department
    if (departmentFilter) {
      const deptCourses = getCoursesByDepartment(departmentFilter);
      filtered = filtered.filter(l => 
        deptCourses.some(course => course.toLowerCase() === l.course_code.toLowerCase())
      );
    }

    // Filter by specific course
    if (courseFilter) {
      filtered = filtered.filter(l => l.course_code === courseFilter);
    }

    // Sort
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'course':
        filtered.sort((a, b) => a.course_code.localeCompare(b.course_code));
        break;
    }

    setFilteredListings(filtered);
  };

  const uniqueCourses = Array.from(new Set(listings.map(l => l.course_code))).sort();
  
  // Calculate listing counts per course
  const listingCounts = useMemo(() => {
    const counts = new Map<string, number>();
    listings.forEach(listing => {
      const current = counts.get(listing.course_code) || 0;
      counts.set(listing.course_code, current + 1);
    });
    return counts;
  }, [listings]);

  const handleShowContact = (contactInfo: string) => {
    setSelectedContact(contactInfo);
    setContactModalOpen(true);
  };

  const handleEdit = (listingId: string) => {
    router.push(`/edit/${listingId}`);
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      if (DEMO_MODE) {
        setListings(prev => prev.filter(l => l.id !== listingId));
        return;
      }

      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) throw error;

      // Remove from local state
      setListings(prev => prev.filter(l => l.id !== listingId));
      alert('Listing deleted successfully!');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>Bookster - Student Item Exchange</title>
        <meta name="description" content="Buy and sell items with fellow students. Post in 30 seconds, find items instantly. Better prices than campus bookstores!" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Bookster - Student Item Exchange" />
        <meta property="og:description" content="Buy and sell items with fellow students. Post in 30 seconds, find items instantly." />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50/20 relative">
        {/* Subtle grain texture overlay */}
        <div className="fixed inset-0 bg-noise opacity-[0.02] pointer-events-none"></div>
        <Header />

        {/* Enhanced Search & Filter Bar */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="glass-enhanced border border-gray-200/50 rounded-2xl mx-4 my-4 py-8"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by book title, course code, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-enhanced w-full pl-12 pr-4"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Enhanced Category Filter */}
            <CategoryFilter
              selectedDepartment={departmentFilter}
              selectedCourse={courseFilter}
              onDepartmentChange={setDepartmentFilter}
              onCourseChange={setCourseFilter}
              availableCourses={uniqueCourses}
              listingCounts={listingCounts}
            />

            {/* Sort Options */}
            <div className="mt-4">
              <label htmlFor="sortBy" className="block text-sm font-semibold text-gray-700 mb-2">
                Sort by:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'date', label: 'Newest First', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { value: 'price-low', label: 'Price: Low to High', icon: 'M7 11l5-5m0 0l5 5m-5-5v12' },
                  { value: 'price-high', label: 'Price: High to Low', icon: 'M17 13l-5 5m0 0l-5-5m5 5V6' },
                  { value: 'course', label: 'Course Code', icon: 'M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4' },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => setSortBy(option.value as SortOption)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                        : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-primary-300'
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={option.icon} />
                    </svg>
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between text-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-gray-600 font-medium">
                  {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} available
                </span>
              </motion.div>
              {(searchQuery || departmentFilter || courseFilter) && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    setSearchQuery('');
                    setDepartmentFilter('');
                    setCourseFilter('');
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Clear All Filters
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content */}
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="card-enhanced p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <svg
                  className="w-20 h-20 mx-auto text-gray-400 mb-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No items found</h2>
                <p className="text-gray-600 mb-6">Be the first to post an item for this course!</p>
                <motion.a
                  href="/post"
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Post an Item
                </motion.a>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing, index) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    index={index}
                    onShowContact={handleShowContact}
                    currentUserId={user?.id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <FloatingActionButton />
        <Footer onSafetyClick={() => setSafetyModalOpen(true)} />

        {/* Modals */}
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          contactInfo={selectedContact}
        />
        <SafetyModal
          isOpen={safetyModalOpen}
          onClose={() => setSafetyModalOpen(false)}
        />
      </div>
    </>
  );
}

