class CourseModel
{
	constructor(name, dept, course_number, section, semester, year, description, instructor, preceded_by, succeeded_by, audit_requirements)
	{
		this.name = name;
        this.dept = dept;
        this.course_number = course_number;
        this.section = section;
        this.semester = semester;
        this.year = year;
        this.description = description;
        this.instructor = instructor;
        this.preceded_by = preceded_by;
        this.succeeded_by = succeeded_by;
        this.audit_requirements = audit_requirements;
	}
}

module.exports = CourseModel;

