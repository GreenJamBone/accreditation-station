class DocumentModel
{
    constructor(name, course, type, rating, creation_date, modified_date, filepath, filename, assignment)
    {
        this.name = name;
        this.type = type;
        this.course = course;
        this.rating = rating;
        this.creation_date = creation_date;
        this.modified_date = modified_date;
        this.filepath = filepath;
        this.filename = filename;
        this.assignment = assignment;
    }
}

module.exports = DocumentModel;