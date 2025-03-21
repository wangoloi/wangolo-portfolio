import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import profilePic from './wb.jpg';  // Update to correct path
import CourseManager from './components/CourseManager';

const Portfolio = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    // Load courses from localStorage
    const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]');
    setCourses(savedCourses);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  // Calculate GPA
  const calculateGPA = () => {
    if (courses.length === 0) return 0;

    const gradePoints = {
      'A': 5.0,
      'B+': 4.5,
      'B': 4.0,
      'C+': 3.5,
      'C': 3.0,
      'D+': 2.5,
      'D': 2.0,
      'F': 0
    };

    const totalPoints = courses.reduce((sum, course) => {
      return sum + (gradePoints[course.grade] * parseFloat(course.credits));
    }, 0);

    const totalCredits = courses.reduce((sum, course) => {
      return sum + parseFloat(course.credits);
    }, 0);

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  return (
    <div className={`portfolio-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="portfolio-header">
        <button 
          className="theme-toggle"
          onClick={toggleDarkMode}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        <div className="header-content">
          <h1>Wangolo Bachawa's Personal Portfolio</h1>
          <p className="subtitle">Computer Science Student | Cybersecurity Enthusiast | Future Military Cyber Expert</p>
        </div>
      </header>

      <nav className="portfolio-nav">
        <ul>
          <li><a href="#about-me">About Me</a></li>
          <li><a href="#personal-details">Personal Details</a></li>
          <li><a href="#my-hobby">Video</a></li>
          <li><a href="#results">Results</a></li>
          <li><a href="#course-manager">Course Manager</a></li>
          <li><a href="#useful-links">Links</a></li>
        </ul>
      </nav>

      <main className="portfolio-main">
        <section id="about-me" className="section">
          <h2>About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                Hello! I'm Wangolo Bachawa, a passionate Computer Science student at Uganda Christian University. 
                I specialize in Python, JavaScript, and React, with a strong focus on networking, cybersecurity, 
                digital forensics, and web development. My goal is to become a cybersecurity expert and serve in 
                the military, securing and protecting digital systems.
              </p>
            </div>
            <div className="profile-image-container">
              <img 
                src={profilePic}
                alt="Wangolo Bachawa" 
                className="profile-pic"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section id="personal-details" className="section">
          <h2>Personal Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <h3>Student ID</h3>
              <p>M23B23/042</p>
            </div>
            <div className="detail-item">
              <h3>Course</h3>
              <p>Bachelor of Science in Computer Science</p>
            </div>
            <div className="detail-item">
              <h3>Year</h3>
              <p>Year 2:2</p>
            </div>
            <div className="detail-item">
              <h3>Interests</h3>
              <ul>
                <li>Python Development</li>
                <li>JavaScript & React</li>
                <li>Networking & Cybersecurity</li>
                <li>Digital Forensics</li>
                <li>Web Development</li>
                <li>Computer Vision</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="my-hobby" className="section">
          <h2>My Hobby Video</h2>
          <div className="video-container">
            <iframe 
              src="https://www.youtube.com/embed/SW6AE76Pi50"
              title="My Hobby Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        <section id="results" className="section">
          <h2>Academic Results</h2>
          <div className="results-summary">
            <h3>Current GPA: {calculateGPA()}</h3>
            <p>Total Courses: {courses.length}</p>
          </div>
          <div className="table-container">
            {courses.length === 0 ? (
              <p>No courses added yet. Use the Course Manager below to add your courses.</p>
            ) : (
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Grade</th>
                    <th>Credit Units</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.code}</td>
                      <td>{course.title}</td>
                      <td>{course.grade}</td>
                      <td>{course.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section id="course-manager" className="section">
          <h2>Course Manager</h2>
          <CourseManager />
        </section>

        <section id="useful-links" className="section">
          <h2>Useful Links</h2>
          <div className="links-grid">
            <a 
              href="https://scholar.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-card"
            >
              Google Scholar
            </a>
            <a 
              href="https://en.wikipedia.org/wiki/Uganda_Christian_University" 
              target="_blank" 
              rel="noopener noreferrer"
              className="link-card"
            >
              Uganda Christian University
            </a>
          </div>
        </section>
      </main>

      <footer className="portfolio-footer">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="contact-grid">
            <a href="mailto:wangolobachawa9@gmail.com" className="contact-item">
              <span className="icon">📧</span>
              <span>Email</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/wangolo-bachawa-2b6315317" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-item"
            >
              <span className="icon">💼</span>
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://github.com/wangolo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-item"
            >
              <span className="icon">💻</span>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;