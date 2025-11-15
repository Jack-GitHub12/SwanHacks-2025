// Department categories for better organization
export interface Department {
  id: string;
  name: string;
  color: string;
  icon: string;
  courses: string[];
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    color: 'from-blue-500 to-blue-600',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    courses: ['CS 161', 'CS 162', 'CS 227', 'CS 228', 'CS 261', 'CS 290', 'CS 311', 'CS 321', 'CS 325', 'CS 340', 'CS 352', 'CS 362'],
  },
  {
    id: 'math',
    name: 'Mathematics',
    color: 'from-purple-500 to-purple-600',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    courses: ['MATH 165', 'MATH 166', 'MATH 195', 'MATH 265', 'MATH 266', 'MATH 267', 'MATH 317', 'MATH 385', 'MATH 481'],
  },
  {
    id: 'science',
    name: 'Natural Sciences',
    color: 'from-green-500 to-green-600',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    courses: ['CHEM 121', 'CHEM 122', 'CHEM 177', 'CHEM 231', 'CHEM 331', 'BIO 101', 'BIO 211', 'BIO 212', 'BIO 255', 'PHYS 201', 'PHYS 221', 'PHYS 222'],
  },
  {
    id: 'business',
    name: 'Business & Economics',
    color: 'from-amber-500 to-amber-600',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    courses: ['ECON 101', 'ECON 102', 'ECON 201', 'ACCT 284', 'ACCT 285', 'FIN 301', 'MGMT 370', 'MKT 340'],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    color: 'from-orange-500 to-orange-600',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    courses: ['E E 201', 'ME 270', 'CPR E 288', 'AER E 160', 'CE 274', 'IE 248', 'MAT E 273'],
  },
  {
    id: 'humanities',
    name: 'Humanities & Arts',
    color: 'from-pink-500 to-pink-600',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    courses: ['ENG 101', 'ENG 102', 'ENG 250', 'HIST 201', 'HIST 202', 'PHIL 201', 'ART 230', 'MUS 102'],
  },
  {
    id: 'social',
    name: 'Social Sciences',
    color: 'from-teal-500 to-teal-600',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    courses: ['PSY 101', 'PSY 230', 'SOC 134', 'SOC 235', 'POLS 215', 'ANTHR 201', 'COM S 207'],
  },
];

export function getDepartmentByCourse(courseCode: string): Department | undefined {
  return DEPARTMENTS.find(dept => 
    dept.courses.some(course => 
      course.toLowerCase() === courseCode.toLowerCase()
    )
  );
}

export function getDepartmentById(id: string): Department | undefined {
  return DEPARTMENTS.find(dept => dept.id === id);
}

export function getCoursesByDepartment(departmentId: string): string[] {
  const dept = getDepartmentById(departmentId);
  return dept ? dept.courses : [];
}

export function groupCoursesByDepartment(courses: string[]): Map<string, string[]> {
  const grouped = new Map<string, string[]>();
  
  DEPARTMENTS.forEach(dept => {
    const deptCourses = courses.filter(course =>
      dept.courses.some(c => c.toLowerCase() === course.toLowerCase())
    );
    if (deptCourses.length > 0) {
      grouped.set(dept.id, deptCourses);
    }
  });
  
  // Add "Other" category for unmatched courses
  const uncategorized = courses.filter(course =>
    !DEPARTMENTS.some(dept =>
      dept.courses.some(c => c.toLowerCase() === course.toLowerCase())
    )
  );
  
  if (uncategorized.length > 0) {
    grouped.set('other', uncategorized);
  }
  
  return grouped;
}

