import React, { useState } from 'react';
import './App.css';
import Header from './components/header';
import CourseList from './components/courseList';
import Footer from './components/footer';

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    { id: 1, name: 'Math 101', assignments: [{ title: 'Homework 1', dueDate: '2025-05-10', grade: 90 }] },
    { id: 2, name: 'History 201', assignments: [{ title: 'Essay', dueDate: '2025-05-15', grade: 85 }] },
  ];

  return (
    <div className="App">
      <Header />
      <courseList courses={courses} onSelectCourse={setSelectedCourse} />
      <Footer />
    </div>
  );
}

export default App;