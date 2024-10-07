"use strict";
let professors = [
    { id: 1, name: "John Doe", department: "Math" },
    { id: 2, name: "Jane Smith", department: "Physics" }
];
let classrooms = [
    { number: "101", capacity: 30, hasProjector: true },
    { number: "102", capacity: 25, hasProjector: false }
];
let courses = [
    { id: 1, name: "Math 101", type: "Lecture" },
    { id: 2, name: "Physics 202", type: "Lab" }
];
let schedule = [];
function addProfessor(professor) {
    professors.push(professor);
}
function addLesson(lesson) {
    // Add validation to check for conflicts
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.error(conflict);
        return false;
    }
    schedule.push(lesson);
    return true;
}
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const bookedClassrooms = schedule.filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
        .map(lesson => lesson.classroomNumber);
    return classrooms.filter(classroom => !bookedClassrooms.includes(classroom.number))
        .map(classroom => classroom.number);
}
function getProfessorSchedule(professorId) {
    return schedule.filter(lesson => lesson.professorId === professorId);
}
function validateLesson(lesson) {
    const professorConflict = schedule.find(l => l.professorId === lesson.professorId && l.dayOfWeek === lesson.dayOfWeek && l.timeSlot === lesson.timeSlot);
    if (professorConflict) {
        return { type: "ProfessorConflict", lessonDetails: professorConflict };
    }
    const classroomConflict = schedule.find(l => l.classroomNumber === lesson.classroomNumber && l.dayOfWeek === lesson.dayOfWeek && l.timeSlot === lesson.timeSlot);
    if (classroomConflict) {
        return { type: "ClassroomConflict", lessonDetails: classroomConflict };
    }
    return null;
}
// Functions that were in the task,
// but were not used in the example
// of the system usage on the HTMl page in
// GitHub Pages
function getClassroomUtilization(classroomNumber) {
    const totalLessons = schedule.length;
    const classroomLessons = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
    return (classroomLessons / totalLessons) * 100;
}
function getMostPopularCourseType() {
    const courseTypesCount = {
        "Lecture": 0,
        "Seminar": 0,
        "Lab": 0,
        "Practice": 0
    };
    schedule.forEach(lesson => {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course) {
            courseTypesCount[course.type]++;
        }
    });
    return Object.keys(courseTypesCount).reduce((a, b) => courseTypesCount[a] > courseTypesCount[b] ? a : b);
}
function reassignClassroom(lessonId, newClassroomNumber) {
    const lessonIndex = schedule.findIndex(lesson => lesson.courseId === lessonId);
    if (lessonIndex !== -1 && !validateLesson(Object.assign(Object.assign({}, schedule[lessonIndex]), { classroomNumber: newClassroomNumber }))) {
        schedule[lessonIndex].classroomNumber = newClassroomNumber;
        return true;
    }
    return false;
}
function cancelLesson(lessonId) {
    schedule = schedule.filter(lesson => lesson.courseId !== lessonId);
}
// DOM Manipulation and Form Handlers
document.getElementById('addProfessorForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('professorName').value;
    const department = document.getElementById('professorDepartment').value;
    const newProfessor = {
        id: professors.length + 1,
        name,
        department
    };
    addProfessor(newProfessor);
    updateProfessorsDropdowns();
    alert('Professor added successfully');
});
document.getElementById('addLessonForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const courseId = parseInt(document.getElementById('selectCourse').value);
    const professorId = parseInt(document.getElementById('selectProfessor').value);
    const classroomNumber = document.getElementById('classroomNumber').value;
    const dayOfWeek = document.getElementById('selectDay').value;
    const timeSlot = document.getElementById('selectTimeSlot').value;
    const newLesson = {
        courseId,
        professorId,
        classroomNumber,
        dayOfWeek,
        timeSlot
    };
    const success = addLesson(newLesson);
    if (success) {
        alert('Lesson added successfully');
    }
    else {
        alert('Lesson could not be added due to a conflict');
    }
});
document.getElementById('findClassroomsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const dayOfWeek = document.getElementById('searchDayOfWeek').value;
    const timeSlot = document.getElementById('searchTimeSlot').value;
    const availableClassrooms = findAvailableClassrooms(timeSlot, dayOfWeek);
    const classroomsList = document.getElementById('availableClassroomsList');
    classroomsList.innerHTML = '';
    availableClassrooms.forEach(classroom => {
        const li = document.createElement('li');
        li.textContent = classroom;
        classroomsList.appendChild(li);
    });
});
document.getElementById('getProfessorScheduleForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const professorId = parseInt(document.getElementById('selectProfessorSchedule').value);
    const professorSchedule = getProfessorSchedule(professorId);
    const scheduleList = document.getElementById('professorScheduleList');
    scheduleList.innerHTML = '';
    professorSchedule.forEach(lesson => {
        const li = document.createElement('li');
        li.textContent = `Course ID: ${lesson.courseId}, Classroom: ${lesson.classroomNumber}, Day: ${lesson.dayOfWeek}, Time: ${lesson.timeSlot}`;
        scheduleList.appendChild(li);
    });
});
// Update professor dropdowns
function updateProfessorsDropdowns() {
    const selectProfessor = document.getElementById('selectProfessor');
    const selectProfessorSchedule = document.getElementById('selectProfessorSchedule');
    selectProfessor.innerHTML = '';
    selectProfessorSchedule.innerHTML = '';
    professors.forEach(professor => {
        const option = document.createElement('option');
        option.value = professor.id.toString();
        option.textContent = professor.name;
        selectProfessor.appendChild(option);
        const optionSchedule = document.createElement('option');
        optionSchedule.value = professor.id.toString();
        optionSchedule.textContent = professor.name;
        selectProfessorSchedule.appendChild(optionSchedule);
    });
}
// Initial load of professor dropdowns
updateProfessorsDropdowns();
