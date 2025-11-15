import React, { useState } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEPARTMENTS, type Department } from '@/lib/categories';

interface CategoryFilterProps {
  selectedDepartment: string;
  selectedCourse: string;
  onDepartmentChange: (deptId: string) => void;
  onCourseChange: (course: string) => void;
  availableCourses: string[];
  listingCounts: Map<string, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedDepartment,
  selectedCourse,
  onDepartmentChange,
  onCourseChange,
  availableCourses,
  listingCounts,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate department listing counts
  const getDepartmentCount = (dept: Department): number => {
    return dept.courses.reduce((sum, course) => {
      return sum + (listingCounts.get(course) || 0);
    }, 0);
  };

  const handleDepartmentClick = (deptId: string) => {
    if (selectedDepartment === deptId) {
      onDepartmentChange('');
      onCourseChange('');
    } else {
      onDepartmentChange(deptId);
      onCourseChange('');
    }
  };

  const getDepartmentCourses = (dept: Department) => {
    return dept.courses.filter(course => availableCourses.includes(course));
  };

  const selectedDept = DEPARTMENTS.find(d => d.id === selectedDepartment);

  return (
    <Box className="space-y-4">
      {/* Department Filter Header */}
      <Flex justify="space-between" align="center">
        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
          Filter by Department:
        </Text>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExpanded ? 'Show Less' : 'Show All'}
          <motion.svg
            style={{ width: '16px', height: '16px' }}
            viewBox="0 0 24 24"
            fill="none"
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        </motion.button>
      </Flex>

      {/* Department Chips */}
      <Flex flexWrap="wrap" gap={2}>
        {/* All Departments Chip */}
        <motion.button
          onClick={() => {
            onDepartmentChange('');
            onCourseChange('');
          }}
          className={`group relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            !selectedDepartment
              ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
              : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-primary-300'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            All Departments
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              !selectedDepartment ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              {availableCourses.length}
            </span>
          </span>
        </motion.button>

        {/* Department Chips */}
        {(isExpanded ? DEPARTMENTS : DEPARTMENTS.slice(0, 4)).map((dept, index) => {
          const count = getDepartmentCount(dept);
          if (count === 0) return null;

          return (
            <motion.button
              key={dept.id}
              onClick={() => handleDepartmentClick(dept.id)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all overflow-hidden ${
                selectedDepartment === dept.id
                  ? `bg-gradient-to-r ${dept.color} text-white shadow-lg`
                  : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={dept.icon} />
                </svg>
                {dept.name}
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  selectedDepartment === dept.id ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {count}
                </span>
              </span>
              
              {/* Shine effect on hover */}
              {selectedDepartment !== dept.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              )}
            </motion.button>
          );
        })}
      </Flex>

      {/* Course Filter (shows when department is selected) */}
      <AnimatePresence>
        {selectedDepartment && selectedDept && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Box className="pt-2 space-y-2">
              <Text fontSize="xs" fontWeight="semibold" color="gray.600" textTransform="uppercase" letterSpacing="wide">
                {selectedDept.name} Courses:
              </Text>
              <Flex flexWrap="wrap" gap={2}>
                {getDepartmentCourses(selectedDept).map((course, index) => {
                  const count = listingCounts.get(course) || 0;
                  return (
                    <motion.button
                      key={course}
                      onClick={() => onCourseChange(course === selectedCourse ? '' : course)}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedCourse === course
                          ? `bg-gradient-to-r ${selectedDept.color} text-white shadow-md`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {course}
                      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${
                        selectedCourse === course ? 'bg-white/30 text-white' : 'bg-white text-gray-700'
                      }`}>
                        {count}
                      </span>
                    </motion.button>
                  );
                })}
              </Flex>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Summary */}
      {(selectedDepartment || selectedCourse) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm"
        >
          <Text color="gray.600">Active filters:</Text>
          {selectedDept && (
            <span className={`px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${selectedDept.color}`}>
              {selectedDept.name}
            </span>
          )}
          {selectedCourse && (
            <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
              {selectedCourse}
            </span>
          )}
        </motion.div>
      )}
    </Box>
  );
};

export default CategoryFilter;
