import React from 'react';
//import './courseList.css';

const CourseList = ({ courses, onSelectCourse }) => {
    return (
        <div className='course-list'>
            <h2 className='course-list-title'>Courses</h2>
            <ul className='course-list-items'>
                {courses.map(course => (
                    <li key={course.id} className='course-list-item' onClick={() => onSelectCourse(course)}>
                        <h3 className='course-list-item-title'>{course.name}</h3>
                        <ul className='course-list-item-assignments'>
                            {course.assignments.map(assignment => (
                                <li key={assignment.id} className='course-list-item-assignment'>
                                    <span className='course-list-item-assignment-title'>{assignment.title}</span>
                                    <span className='course-list-item-assignment-due-date'>{assignment.dueDate}</span>
                                    <span className='course-list-item-assignment-grade'>{assignment.grade}</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseList;
