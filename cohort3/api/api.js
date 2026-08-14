// src/app.js
const express = require('express');
const app = express();
const PORT = 3000;

// MIDDLEWARE: Parse JSON in request body
app.use(express.json());

// ============================================
// DATA STORE (In-memory database)
// ============================================
let students = [
    { id: 1, name: 'Alice', age: 20, course: 'Computer Science' },
    { id: 2, name: 'Bob', age: 22, course: 'Mathematics' },
    { id: 3, name: 'Charlie', age: 21, course: 'Physics' }
];
let nextId = 4;

// ============================================
// API ENDPOINTS
// ============================================

// 1. GET /students - Get all students
app.get('/students', (req, res) => {
    res.status(200).json({
        success: true,
        data: students
    });
});

// 2. GET /students/:id - Get student by ID
app.get('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);
    
    if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }
    
    res.status(200).json({
        success: true,
        data: student
    });
});

// 3. POST /students - Create a new student
app.post('/students', (req, res) => {
    const { name, age, course } = req.body;
    
    // Validate request body
    if (!name || !age || !course) {
        return res.status(400).json({
            success: false,
            message: 'Name, age, and course are required'
        });
    }
    
    const newStudent = {
        id: nextId++,
        name: name,
        age: age,
        course: course
    };
    
    students.push(newStudent);
    
    res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: newStudent
    });
});

// 4. PUT /students/:id - Update a student
app.put('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, course } = req.body;
    
    // Find student index
    const index = students.findIndex(s => s.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }
    
    // Update only provided fields
    if (name) students[index].name = name;
    if (age) students[index].age = age;
    if (course) students[index].course = course;
    
    res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: students[index]
    });
});

// 5. DELETE /students/:id - Delete a student
app.delete('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }
    
    const deletedStudent = students.splice(index, 1)[0];
    
    res.status(200).json({
        success: true,
        message: 'Student deleted successfully',
        data: deletedStudent
    });
});

// 6. GET /api-docs - API Documentation
app.get('/api-docs', (req, res) => {
    res.json({
        title: 'Student API Documentation',
        description: 'A simple API to manage students',
        baseURL: 'http://localhost:3000',
        endpoints: {
            'GET /students': {
                method: 'GET',
                description: 'Get all students',
                auth: 'None',
                response: 'Array of student objects'
            },
            'GET /students/:id': {
                method: 'GET',
                description: 'Get a specific student by ID',
                auth: 'None',
                params: { id: 'Student ID (number)' },
                response: 'Student object'
            },
            'POST /students': {
                method: 'POST',
                description: 'Create a new student',
                auth: 'None',
                body: {
                    name: 'string (required)',
                    age: 'number (required)',
                    course: 'string (required)'
                },
                response: 'Created student object'
            },
            'PUT /students/:id': {
                method: 'PUT',
                description: 'Update a student',
                auth: 'None',
                params: { id: 'Student ID (number)' },
                body: {
                    name: 'string (optional)',
                    age: 'number (optional)',
                    course: 'string (optional)'
                },
                response: 'Updated student object'
            },
            'DELETE /students/:id': {
                method: 'DELETE',
                description: 'Delete a student',
                auth: 'None',
                params: { id: 'Student ID (number)' },
                response: 'Deleted student object'
            }
        },
        httpMethods: {
            GET: 'Retrieve data',
            POST: 'Create new data',
            PUT: 'Update existing data',
            DELETE: 'Remove data'
        },
        statusCodes: {
            '200': 'OK - Success',
            '201': 'Created - New resource created',
            '400': 'Bad Request - Missing or invalid data',
            '404': 'Not Found - Resource not found',
            '500': 'Internal Server Error'
        },
        exampleRequests: {
            'Create Student': {
                method: 'POST',
                url: 'http://localhost:3000/students',
                headers: { 'Content-Type': 'application/json' },
                body: { name: 'David', age: 23, course: 'Engineering' }
            },
            'Get All Students': {
                method: 'GET',
                url: 'http://localhost:3000/students'
            }
        }
    });
});

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Student API!',
        documentation: 'Visit /api-docs for complete documentation',
        endpoints: {
            'GET /students': 'Get all students',
            'GET /students/:id': 'Get student by ID',
            'POST /students': 'Create new student',
            'PUT /students/:id': 'Update student',
            'DELETE /students/:id': 'Delete student'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`\n📝 Test the API using:`);
    console.log(`   GET  http://localhost:${PORT}/students`);
    console.log(`   POST http://localhost:${PORT}/students`);
});