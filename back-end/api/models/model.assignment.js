class AssignmentModel
{
    constructor(title, course, description, category, fulfilled_requirements, assignment_document, student_documents)
    {
        this.title = title;
        this.course = course;
        this.description = description;
        this.category = category;
        this.fulfilled_requirements = fulfilled_requirements;
        this.assignment_document = assignment_document;
        this.student_documents = student_documents;
    }
}

module.exports = AssignmentModel;