// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Listing } from '@/types';

// Demo mode configuration
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Custom storage implementation for better SSR support
const customStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

// Initialize Supabase client with proper auth configuration and performance optimizations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: customStorage,
    storageKey: 'sb-auth-token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-client-info': 'bookster-web',
    },
  },
  db: {
    schema: 'public',
  },
  // Enable connection pooling for better performance
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Demo data for testing - Extensive listing data across all departments
export const DEMO_LISTINGS: Listing[] = [
  // Computer Science
  {
    id: '1',
    user_id: 'user-123',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    course_code: 'CS 161',
    book_title: 'Introduction to Computer Science',
    price: 65,
    contact_info: 'jsmith@iastate.edu',
    condition: 'Good',
    notes: 'Some highlighting on first three chapters, otherwise great condition',
    status: 'active'
  },
  {
    id: '2',
    user_id: 'user-456',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    course_code: 'CS 162',
    book_title: 'Object-Oriented Programming',
    price: 75,
    contact_info: '+1.515.294.1234',
    condition: 'Like New',
    notes: 'Used for one semester, minimal wear',
    status: 'active'
  },
  {
    id: '3',
    user_id: 'user-789',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    course_code: 'CS 227',
    book_title: 'Data Structures and Algorithms',
    price: 85,
    contact_info: 'cs_student@iastate.edu',
    condition: 'Good',
    notes: 'Some notes in margins, all pages intact',
    status: 'active'
  },
  {
    id: '4',
    user_id: 'user-234',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    course_code: 'CS 228',
    book_title: 'Introduction to Data Structures',
    price: 60,
    contact_info: 'datastructs@iastate.edu',
    condition: 'Good',
    notes: 'Previous edition but content is relevant',
    status: 'active'
  },
  {
    id: '5',
    user_id: 'user-567',
    created_at: new Date(Date.now() - 432000000).toISOString(),
    course_code: 'CS 261',
    book_title: 'Discrete Mathematics for CS',
    price: 90,
    contact_info: 'tech_cyclone@iastate.edu',
    condition: 'Like New',
    notes: 'Barely opened, excellent condition',
    status: 'active'
  },
  {
    id: '6',
    user_id: 'user-890',
    created_at: new Date(Date.now() - 518400000).toISOString(),
    course_code: 'CS 311',
    book_title: 'Design and Analysis of Algorithms',
    price: 95,
    contact_info: 'algorithms@iastate.edu',
    condition: 'Good',
    notes: 'Well-used but perfectly readable',
    status: 'active'
  },

  // Mathematics
  {
    id: '7',
    user_id: 'user-312',
    created_at: new Date(Date.now() - 604800000).toISOString(),
    course_code: 'MATH 165',
    book_title: 'Calculus I',
    price: 110,
    contact_info: 'mathcalc@iastate.edu',
    condition: 'Like New',
    notes: 'Barely used, no marks or highlights',
    status: 'active'
  },
  {
    id: '8',
    user_id: 'user-675',
    created_at: new Date(Date.now() - 691200000).toISOString(),
    course_code: 'MATH 166',
    book_title: 'Calculus II',
    price: 115,
    contact_info: 'math_wiz@iastate.edu',
    condition: 'Good',
    notes: 'Some practice problems completed',
    status: 'active'
  },
  {
    id: '9',
    user_id: 'user-245',
    created_at: new Date(Date.now() - 777600000).toISOString(),
    course_code: 'MATH 265',
    book_title: 'Elementary Differential Equations',
    price: 95,
    contact_info: '+1.515.294.5678',
    condition: 'Good',
    notes: 'Includes solution manual',
    status: 'active'
  },
  {
    id: '10',
    user_id: 'user-307',
    created_at: new Date(Date.now() - 864000000).toISOString(),
    course_code: 'MATH 266',
    book_title: 'Linear Algebra',
    price: 100,
    contact_info: 'cyclone_math@iastate.edu',
    condition: 'Like New',
    notes: 'Used for one semester only',
    status: 'active'
  },
  {
    id: '11',
    user_id: 'user-271',
    created_at: new Date(Date.now() - 950400000).toISOString(),
    course_code: 'MATH 267',
    book_title: 'Elementary Differential Equations and Laplace Transforms',
    price: 105,
    contact_info: 'diffeq@iastate.edu',
    condition: 'Good',
    notes: 'Clean copy with minimal highlighting',
    status: 'active'
  },

  // Natural Sciences - Chemistry
  {
    id: '12',
    user_id: 'user-543',
    created_at: new Date(Date.now() - 1036800000).toISOString(),
    course_code: 'CHEM 121',
    book_title: 'General Chemistry: Atoms First',
    price: 150,
    contact_info: 'chemistry@iastate.edu',
    condition: 'New',
    notes: 'Still in plastic wrap, never opened',
    status: 'active'
  },
  {
    id: '13',
    user_id: 'user-125',
    created_at: new Date(Date.now() - 1123200000).toISOString(),
    course_code: 'CHEM 122',
    book_title: 'General Chemistry II',
    price: 135,
    contact_info: 'chem_major@iastate.edu',
    condition: 'Like New',
    notes: 'Includes online access code unused',
    status: 'active'
  },
  {
    id: '14',
    user_id: 'user-261',
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    course_code: 'CHEM 177',
    book_title: 'Chemistry Laboratory',
    price: 55,
    contact_info: '+1.515.294.2345',
    condition: 'Good',
    notes: 'Lab manual in good condition',
    status: 'active'
  },

  // Natural Sciences - Biology
  {
    id: '15',
    user_id: 'user-370',
    created_at: new Date(Date.now() - 1296000000).toISOString(),
    course_code: 'BIO 101',
    book_title: 'Principles of Biology',
    price: 120,
    contact_info: 'bio_student@iastate.edu',
    condition: 'Good',
    notes: 'Some highlighting, all pages present',
    status: 'active'
  },
  {
    id: '16',
    user_id: 'user-525',
    created_at: new Date(Date.now() - 1382400000).toISOString(),
    course_code: 'BIO 211',
    book_title: 'Molecular Biology of the Cell',
    price: 140,
    contact_info: 'biology211@iastate.edu',
    condition: 'Like New',
    notes: 'Barely used, excellent condition',
    status: 'active'
  },
  {
    id: '17',
    user_id: 'user-971',
    created_at: new Date(Date.now() - 1468800000).toISOString(),
    course_code: 'BIO 212',
    book_title: 'Genetics and Evolution',
    price: 115,
    contact_info: 'cyclone_bio@iastate.edu',
    condition: 'Good',
    notes: 'Some notes in margins',
    status: 'active'
  },

  // Natural Sciences - Physics
  {
    id: '18',
    user_id: 'user-574',
    created_at: new Date(Date.now() - 1555200000).toISOString(),
    course_code: 'PHYS 201',
    book_title: 'University Physics Volume 1',
    price: 100,
    contact_info: 'physics201@iastate.edu',
    condition: 'Good',
    notes: 'Includes online access code unused',
    status: 'active'
  },
  {
    id: '19',
    user_id: 'user-728',
    created_at: new Date(Date.now() - 1641600000).toISOString(),
    course_code: 'PHYS 221',
    book_title: 'Physics for Scientists and Engineers',
    price: 125,
    contact_info: 'physics_fan@iastate.edu',
    condition: 'Like New',
    notes: 'Used one semester, great shape',
    status: 'active'
  },

  // Business & Economics
  {
    id: '20',
    user_id: 'user-638',
    created_at: new Date(Date.now() - 1728000000).toISOString(),
    course_code: 'ECON 101',
    book_title: 'Principles of Microeconomics',
    price: 65,
    contact_info: '+1.515.294.3456',
    condition: 'Good',
    notes: 'Standard textbook, good condition',
    status: 'active'
  },
  {
    id: '21',
    user_id: 'user-789',
    created_at: new Date(Date.now() - 1814400000).toISOString(),
    course_code: 'ECON 102',
    book_title: 'Principles of Macroeconomics',
    price: 70,
    contact_info: 'econ_student@iastate.edu',
    condition: 'Good',
    notes: 'Some highlighting in key chapters',
    status: 'active'
  },
  {
    id: '22',
    user_id: 'user-610',
    created_at: new Date(Date.now() - 1900800000).toISOString(),
    course_code: 'ACCT 284',
    book_title: 'Financial Accounting',
    price: 130,
    contact_info: 'accounting@iastate.edu',
    condition: 'Like New',
    notes: 'Purchased but switched majors',
    status: 'active'
  },
  {
    id: '23',
    user_id: 'user-373',
    created_at: new Date(Date.now() - 1987200000).toISOString(),
    course_code: 'FIN 301',
    book_title: 'Corporate Finance Essentials',
    price: 118,
    contact_info: 'finance_major@iastate.edu',
    condition: 'Good',
    notes: 'Well-maintained, no damage',
    status: 'active'
  },
  {
    id: '24',
    user_id: 'user-124',
    created_at: new Date(Date.now() - 2073600000).toISOString(),
    course_code: 'MGMT 370',
    book_title: 'Management and Organizations',
    price: 85,
    contact_info: 'management@iastate.edu',
    condition: 'Good',
    notes: 'Light use, good for class',
    status: 'active'
  },

  // Engineering
  {
    id: '25',
    user_id: 'user-163',
    created_at: new Date(Date.now() - 2160000000).toISOString(),
    course_code: 'E E 201',
    book_title: 'Electric Circuits Fundamentals',
    price: 145,
    contact_info: '+1.515.294.4567',
    condition: 'Like New',
    notes: 'Includes practice problems book',
    status: 'active'
  },
  {
    id: '26',
    user_id: 'user-673',
    created_at: new Date(Date.now() - 2246400000).toISOString(),
    course_code: 'ME 270',
    book_title: 'Thermodynamics',
    price: 125,
    contact_info: 'mech_eng@iastate.edu',
    condition: 'Good',
    notes: 'Some highlighting, all pages intact',
    status: 'active'
  },
  {
    id: '27',
    user_id: 'user-198',
    created_at: new Date(Date.now() - 2332800000).toISOString(),
    course_code: 'CPR E 288',
    book_title: 'Embedded Systems I',
    price: 110,
    contact_info: 'embeddedsys@iastate.edu',
    condition: 'Good',
    notes: 'Great resource for the class',
    status: 'active'
  },
  {
    id: '28',
    user_id: 'user-789',
    created_at: new Date(Date.now() - 2419200000).toISOString(),
    course_code: 'CE 274',
    book_title: 'Engineering Mechanics: Statics',
    price: 135,
    contact_info: 'civil_eng@iastate.edu',
    condition: 'Like New',
    notes: 'One semester use only',
    status: 'active'
  },

  // Humanities & Arts
  {
    id: '29',
    user_id: 'user-728',
    created_at: new Date(Date.now() - 2505600000).toISOString(),
    course_code: 'ENG 101',
    book_title: 'College Writing',
    price: 45,
    contact_info: 'engwriting@iastate.edu',
    condition: 'Good',
    notes: 'Standard writing textbook',
    status: 'active'
  },
  {
    id: '30',
    user_id: 'user-927',
    created_at: new Date(Date.now() - 2592000000).toISOString(),
    course_code: 'ENG 102',
    book_title: 'Norton Anthology of Literature',
    price: 65,
    contact_info: 'english_lit@iastate.edu',
    condition: 'Like New',
    notes: 'Purchased but switched majors, barely used',
    status: 'active'
  },
  {
    id: '31',
    user_id: 'user-640',
    created_at: new Date(Date.now() - 2678400000).toISOString(),
    course_code: 'HIST 201',
    book_title: 'American History Since 1877',
    price: 70,
    contact_info: '+1.515.294.5678',
    condition: 'Good',
    notes: 'Some highlighting in key chapters',
    status: 'active'
  },
  {
    id: '32',
    user_id: 'user-134',
    created_at: new Date(Date.now() - 2764800000).toISOString(),
    course_code: 'PHIL 201',
    book_title: 'Introduction to Philosophy',
    price: 52,
    contact_info: 'philosophy_buff@iastate.edu',
    condition: 'Acceptable',
    notes: 'Well-read but complete',
    status: 'active'
  },

  // Social Sciences
  {
    id: '33',
    user_id: 'user-653',
    created_at: new Date(Date.now() - 2851200000).toISOString(),
    course_code: 'PSY 101',
    book_title: 'Psychology: Core Concepts',
    price: 75,
    contact_info: 'psychology@iastate.edu',
    condition: 'Good',
    notes: 'Has some wear but all pages intact',
    status: 'active'
  },
  {
    id: '34',
    user_id: 'user-788',
    created_at: new Date(Date.now() - 2937600000).toISOString(),
    course_code: 'PSY 230',
    book_title: 'Developmental Psychology',
    price: 82,
    contact_info: 'psych_major@iastate.edu',
    condition: 'Like New',
    notes: 'Lightly used, excellent condition',
    status: 'active'
  },
  {
    id: '35',
    user_id: 'user-162',
    created_at: new Date(Date.now() - 3024000000).toISOString(),
    course_code: 'SOC 134',
    book_title: 'Introduction to Sociology',
    price: 68,
    contact_info: 'sociology@iastate.edu',
    condition: 'Good',
    notes: 'Minor highlighting, good for class',
    status: 'active'
  },
  {
    id: '36',
    user_id: 'user-169',
    created_at: new Date(Date.now() - 3110400000).toISOString(),
    course_code: 'POLS 215',
    book_title: 'Introduction to American Politics',
    price: 72,
    contact_info: 'poli_sci@iastate.edu',
    condition: 'Good',
    notes: 'Standard textbook, readable condition',
    status: 'active'
  },

  // More Computer Science
  {
    id: '37',
    user_id: 'user-672',
    created_at: new Date(Date.now() - 3196800000).toISOString(),
    course_code: 'CS 290',
    book_title: 'Discrete Computational Structures',
    price: 82,
    contact_info: '+1.515.294.6789',
    condition: 'Good',
    notes: 'Practice problems included',
    status: 'active'
  },
  {
    id: '38',
    user_id: 'user-342',
    created_at: new Date(Date.now() - 3283200000).toISOString(),
    course_code: 'CS 321',
    book_title: 'Computer Architecture and Machine-Level Programming',
    price: 105,
    contact_info: 'arch_student@iastate.edu',
    condition: 'Like New',
    notes: 'Barely opened, mint condition',
    status: 'active'
  },
  {
    id: '39',
    user_id: 'user-722',
    created_at: new Date(Date.now() - 3369600000).toISOString(),
    course_code: 'CS 325',
    book_title: 'Software Engineering Principles',
    price: 92,
    contact_info: 'sweng@iastate.edu',
    condition: 'Good',
    notes: 'Great for the course projects',
    status: 'active'
  },

  // More Mathematics
  {
    id: '40',
    user_id: 'user-662',
    created_at: new Date(Date.now() - 3456000000).toISOString(),
    course_code: 'MATH 195',
    book_title: 'Mathematics for Business and Social Sciences',
    price: 78,
    contact_info: 'business_math@iastate.edu',
    condition: 'Good',
    notes: 'Used but in good shape',
    status: 'active'
  },
  {
    id: '41',
    user_id: 'user-956',
    created_at: new Date(Date.now() - 3542400000).toISOString(),
    course_code: 'MATH 317',
    book_title: 'Theory of Linear Algebra',
    price: 92,
    contact_info: 'linearalg@iastate.edu',
    condition: 'Like New',
    notes: 'Advanced math text, excellent condition',
    status: 'active'
  },

  // More Natural Sciences
  {
    id: '42',
    user_id: 'user-578',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    course_code: 'CHEM 231',
    book_title: 'Organic Chemistry I',
    price: 165,
    contact_info: '+1.515.294.7890',
    condition: 'Like New',
    notes: 'Expensive new, great deal used',
    status: 'active'
  },
  {
    id: '43',
    user_id: 'user-451',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    course_code: 'BIO 255',
    book_title: 'Fundamentals of Biology',
    price: 108,
    contact_info: 'bio_nerd@iastate.edu',
    condition: 'Good',
    notes: 'Perfect for intro bio',
    status: 'active'
  },
  {
    id: '44',
    user_id: 'user-632',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    course_code: 'PHYS 222',
    book_title: 'Physics II with Calculus',
    price: 110,
    contact_info: 'physics222@iastate.edu',
    condition: 'Good',
    notes: 'Includes study guide',
    status: 'active'
  },

  // More Business
  {
    id: '45',
    user_id: 'user-565',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    course_code: 'ECON 201',
    book_title: 'Intermediate Microeconomics',
    price: 95,
    contact_info: 'econ_major@iastate.edu',
    condition: 'Like New',
    notes: 'Advanced econ text',
    status: 'active'
  },
  {
    id: '46',
    user_id: 'user-362',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    course_code: 'ACCT 285',
    book_title: 'Managerial Accounting',
    price: 125,
    contact_info: 'manacct@iastate.edu',
    condition: 'Good',
    notes: 'All chapters covered, readable',
    status: 'active'
  },
  {
    id: '47',
    user_id: 'user-991',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    course_code: 'MKT 340',
    book_title: 'Principles of Marketing',
    price: 88,
    contact_info: 'marketing_pro@iastate.edu',
    condition: 'Good',
    notes: 'Industry standard textbook',
    status: 'active'
  },

  // More Engineering
  {
    id: '48',
    user_id: 'user-768',
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    course_code: 'AER E 160',
    book_title: 'Introduction to Aerospace Engineering',
    price: 105,
    contact_info: '+1.515.294.8901',
    condition: 'Like New',
    notes: 'Great intro to aero engineering',
    status: 'active'
  },
  {
    id: '49',
    user_id: 'user-544',
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    course_code: 'IE 248',
    book_title: 'Engineering System Design',
    price: 98,
    contact_info: 'industrial_eng@iastate.edu',
    condition: 'Good',
    notes: 'Helpful for design projects',
    status: 'active'
  },
  {
    id: '50',
    user_id: 'user-722',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    course_code: 'MAT E 273',
    book_title: 'Materials Science and Engineering',
    price: 138,
    contact_info: 'materials@iastate.edu',
    condition: 'Like New',
    notes: 'Comprehensive materials guide',
    status: 'active'
  },

  // More Humanities
  {
    id: '51',
    user_id: 'user-780',
    created_at: new Date(Date.now() - 86400000 * 11).toISOString(),
    course_code: 'ENG 250',
    book_title: 'Written, Oral, Visual, and Electronic Composition',
    price: 55,
    contact_info: 'comm_student@iastate.edu',
    condition: 'Good',
    notes: 'Standard comm course book',
    status: 'active'
  },
  {
    id: '52',
    user_id: 'user-626',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    course_code: 'HIST 202',
    book_title: 'American History to 1877',
    price: 68,
    contact_info: 'history@iastate.edu',
    condition: 'Good',
    notes: 'Complete with all chapters',
    status: 'active'
  },

  // More Social Sciences
  {
    id: '53',
    user_id: 'user-357',
    created_at: new Date(Date.now() - 86400000 * 13).toISOString(),
    course_code: 'PSY 201',
    book_title: 'Introduction to Psychology',
    price: 72,
    contact_info: 'psych_101@iastate.edu',
    condition: 'Good',
    notes: 'Perfect for intro psych',
    status: 'active'
  },
  {
    id: '54',
    user_id: 'user-922',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    course_code: 'SOC 235',
    book_title: 'Sociology of Deviance',
    price: 78,
    contact_info: '+1.515.294.9012',
    condition: 'Like New',
    notes: 'Fascinating read, great condition',
    status: 'active'
  },
  {
    id: '55',
    user_id: 'user-606',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    course_code: 'ANTHR 201',
    book_title: 'Introduction to Anthropology',
    price: 70,
    contact_info: 'anthro_fan@iastate.edu',
    condition: 'Good',
    notes: 'Interesting course material',
    status: 'active'
  },

  // Additional popular courses
  {
    id: '56',
    user_id: 'user-680',
    created_at: new Date(Date.now() - 86400000 * 16).toISOString(),
    course_code: 'CS 340',
    book_title: 'Algorithms and Data Structures',
    price: 88,
    contact_info: 'csalgorithms@iastate.edu',
    condition: 'Good',
    notes: 'Essential CS textbook',
    status: 'active'
  },
  {
    id: '57',
    user_id: 'user-289',
    created_at: new Date(Date.now() - 86400000 * 17).toISOString(),
    course_code: 'MATH 385',
    book_title: 'Introduction to Probability Theory',
    price: 98,
    contact_info: 'stats_student@iastate.edu',
    condition: 'Like New',
    notes: 'Great for probability and stats',
    status: 'active'
  },
  {
    id: '58',
    user_id: 'user-722',
    created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
    course_code: 'CHEM 331',
    book_title: 'Organic Chemistry II',
    price: 170,
    contact_info: 'organchem@iastate.edu',
    condition: 'Good',
    notes: 'Expensive new, save money here',
    status: 'active'
  },
  {
    id: '59',
    user_id: 'user-662',
    created_at: new Date(Date.now() - 86400000 * 19).toISOString(),
    course_code: 'ECON 202',
    book_title: 'Intermediate Macroeconomics',
    price: 92,
    contact_info: 'macro_econ@iastate.edu',
    condition: 'Good',
    notes: 'Upper-level econ text',
    status: 'active'
  },
  {
    id: '60',
    user_id: 'user-950',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    course_code: 'CS 352',
    book_title: 'Operating Systems',
    price: 108,
    contact_info: '+1.515.294.0123',
    condition: 'Like New',
    notes: 'Comprehensive OS textbook',
    status: 'active'
  },
];

// Common course codes
export const COURSE_CODES = [
  'MATH 165', 'MATH 166', 'MATH 265', 'MATH 266',
  'CS 161', 'CS 162', 'CS 261', 'CS 290', 'CS 325', 'CS 340',
  'ECON 101', 'ECON 102', 'ECON 201', 'ECON 202',
  'CHEM 121', 'CHEM 122', 'CHEM 123', 'CHEM 231', 'CHEM 232',
  'PHYS 201', 'PHYS 202', 'PHYS 203', 'PHYS 211', 'PHYS 212',
  'BIO 101', 'BIO 102', 'BIO 203', 'BIO 211', 'BIO 212',
  'ENG 101', 'ENG 102', 'ENG 201', 'ENG 202', 'ENG 301',
  'PSY 101', 'PSY 201', 'PSY 202', 'PSY 301', 'PSY 302',
  'SOC 101', 'SOC 204', 'SOC 205', 'SOC 280', 'SOC 316',
  'HIST 101', 'HIST 102', 'HIST 201', 'HIST 202', 'HIST 301'
];

