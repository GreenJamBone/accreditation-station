class DocumentModel
{
    constructor(name, type, creation_date, modified_date, filepath, filename, year, department, chapter_section, file, filesize)
    {
        this.name = name;
        this.type = type;
        this.creation_date = creation_date;
        this.modified_date = modified_date;
        this.filepath = filepath;
        this.filename = filename;
        this.file = file;
        this.filesize = filesize;
        this.year = year;
        this.department = department;
        this.chapter_section = chapter_section;
    }
}

module.exports = DocumentModel;

