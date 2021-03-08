class CourseModel
{
	constructor(name, department, course_number, section, semester, year, description, instructor, preceded_by, succeeded_by, audit_requirements, creation_date, modified_date, filename, file, filesize, type)
	{
		this.name = name;
        this.department = department;
        this.course_number = course_number;
        this.section = section;
        this.semester = semester;
        this.year = year;
        this.description = description;
        this.instructor = instructor;
        this.preceded_by = preceded_by;
        this.succeeded_by = succeeded_by;
        this.audit_requirements = audit_requirements;
        this.creation_date = creation_date;
        this.modified_date = modified_date;
        this.filename = filename;
        this.file = file;
        this.filesize = filesize;
        this.type = type;
	}
}

module.exports = CourseModel;

