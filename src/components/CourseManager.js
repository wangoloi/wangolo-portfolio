import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './CourseManager.css';

function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    grade: '',
    credits: '',
    semester: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [gpaStats, setGpaStats] = useState({
    overall: 0,
    bySemester: {}
  });

  // Memoize the grade points mapping
  const gradePoints = useMemo(() => ({
    'A': 5.0,
    'B+': 4.5,
    'B': 4.0,
    'C+': 3.5,
    'C': 3.0,
    'D+': 2.5,
    'D': 2.0,
    'F': 0
  }), []); // Empty dependency array since this object never changes

  // Memoize the calculateGPAStats function
  const calculateGPAStats = useCallback(() => {
    const stats = {
      overall: 0,
      bySemester: {}
    };

    // Helper function to calculate GPA for a set of courses
    const calculateGPA = (courseList) => {
      if (courseList.length === 0) return 0;
      const totalPoints = courseList.reduce((sum, course) => 
        sum + (gradePoints[course.grade] * parseFloat(course.credits)), 0);
      const totalCredits = courseList.reduce((sum, course) => 
        sum + parseFloat(course.credits), 0);
      return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    };

    // Calculate overall GPA
    stats.overall = calculateGPA(courses);

    // Calculate GPA by semester
    const semesterGroups = courses.reduce((groups, course) => {
      const sem = course.semester || 'Unassigned';
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(course);
      return groups;
    }, {});

    Object.entries(semesterGroups).forEach(([semester, semesterCourses]) => {
      stats.bySemester[semester] = {
        gpa: calculateGPA(semesterCourses),
        courses: semesterCourses.length,
        credits: semesterCourses.reduce((sum, course) => sum + parseFloat(course.credits), 0)
      };
    });

    setGpaStats(stats);
  }, [courses, gradePoints]); // Add dependencies

  useEffect(() => {
    // Load courses from localStorage when component mounts
    const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(savedCourses);
  }, []);

  useEffect(() => {
    // Calculate GPA whenever courses change
    calculateGPAStats();
  }, [calculateGPAStats]); // Add calculateGPAStats as a dependency

  const saveCourses = (updatedCourses) => {
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing course
      const updatedCourses = courses.map(course => 
        course.id === editingId ? { ...newCourse, id: editingId } : course
      );
      saveCourses(updatedCourses);
      setIsEditing(false);
      setEditingId(null);
    } else {
      // Add new course
      const courseToAdd = {
        ...newCourse,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      saveCourses([...courses, courseToAdd]);
    }

    // Reset form and selection
    setNewCourse({
      code: '',
      title: '',
      grade: '',
      credits: '',
      semester: ''
    });
    setSelectedCourseId(null);
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setEditingId(course.id);
    setNewCourse({
      code: course.code,
      title: course.title,
      grade: course.grade,
      credits: course.credits,
      semester: course.semester || ''
    });
    setSelectedCourseId(null);
  };

  const handleDelete = (courseId) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    saveCourses(updatedCourses);
    setSelectedCourseId(null);
  };

  const handleRowDoubleClick = (courseId) => {
    setSelectedCourseId(courseId === selectedCourseId ? null : courseId);
  };

  // Handle clicking outside the table to reset selection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.courses-table')) {
        setSelectedCourseId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Get unique semesters for filter dropdown
  const semesters = ['all', ...new Set(courses.map(course => course.semester).filter(Boolean))].sort();

  // Filter courses based on selected semester
  const filteredCourses = selectedSemester === 'all' 
    ? courses 
    : courses.filter(course => course.semester === selectedSemester);

  return (
    <div className="course-manager">
      <h2>{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
      
      <div className="gpa-summary">
        <h3>GPA Summary</h3>
        <div className="gpa-overall">
          <strong>Overall GPA:</strong> {gpaStats.overall}
        </div>
        <div className="gpa-by-semester">
          {Object.entries(gpaStats.bySemester).map(([semester, stats]) => (
            <div key={semester} className="semester-stats">
              <h4>{semester}</h4>
              <p>GPA: {stats.gpa}</p>
              <p>Courses: {stats.courses}</p>
              <p>Total Credits: {stats.credits}</p>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="semester">Semester:</label>
          <input
            type="text"
            id="semester"
            name="semester"
            value={newCourse.semester}
            onChange={handleInputChange}
            placeholder="e.g., Year 1 Semester 1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="code">Course Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={newCourse.code}
            onChange={handleInputChange}
            placeholder="e.g., CS101"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Course Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newCourse.title}
            onChange={handleInputChange}
            placeholder="e.g., Introduction to Computer Science"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="grade">Grade:</label>
          <select
            id="grade"
            name="grade"
            value={newCourse.grade}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Grade</option>
            <option value="A">A</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="D+">D+</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="credits">Credit Units:</label>
          <input
            type="number"
            id="credits"
            name="credits"
            value={newCourse.credits}
            onChange={handleInputChange}
            min="1"
            max="6"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          {isEditing ? 'Update Course' : 'Add Course'}
        </button>
        
        {isEditing && (
          <button 
            type="button" 
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setNewCourse({ code: '', title: '', grade: '', credits: '', semester: '' });
            }}
            className="cancel-button"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="courses-list">
        <div className="list-header">
          <h3>Course List</h3>
          <select 
            value={selectedSemester} 
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="semester-filter"
          >
            {semesters.map(semester => (
              <option key={semester} value={semester}>
                {semester === 'all' ? 'All Semesters' : semester}
              </option>
            ))}
          </select>
        </div>
        <p className="help-text">Double-click a course to show actions</p>
        {filteredCourses.length === 0 ? (
          <p>No courses added yet. Add your first course above.</p>
        ) : (
          <table className="courses-table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Grade</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => (
                <tr 
                  key={course.id}
                  onDoubleClick={() => handleRowDoubleClick(course.id)}
                  className={selectedCourseId === course.id ? 'selected-row' : ''}
                >
                  <td>{course.semester || 'Unassigned'}</td>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.grade}</td>
                  <td>{course.credits}</td>
                  <td className="actions-cell">
                    {selectedCourseId === course.id && (
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEdit(course)}
                          className="edit-button"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CourseManager; 