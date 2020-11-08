class AssignmentModel
{
    constructor(title, department, course, course_number, section, semester, year, description, category, fulfilled_requirements, assignment_document, student_documents)
    {
        this.title = title;
        this.department = department;
        this.course = course;
        this.course_number = course_number;
        this.section = section;
        this.semester = semester;
        this.year = year;
        this.description = description;
        this.category = category;
        this.fulfilled_requirements = fulfilled_requirements;
        this.assignment_document = assignment_document;
        this.student_documents = student_documents;
    }
}

module.exports = AssignmentModel;