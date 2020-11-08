class DocumentModel
{
    constructor(name, department, course_number, section, semester, year, type, rating, creation_date, modified_date, filepath, filename, assignment)
    {
        this.name = name;
        this.department = department;
        this.course_number = course_number;
        this.section = section;
        this.semester = semester;
        this.year = year;
        this.type = type;
        this.rating = rating;
        this.creation_date = creation_date;
        this.modified_date = modified_date;
        this.filepath = filepath;
        this.filename = filename;
        this.assignment = assignment;
    }
}

module.exports = DocumentModel;