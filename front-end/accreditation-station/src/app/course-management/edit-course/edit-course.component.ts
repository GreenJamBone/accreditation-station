import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { RequirementsService } from 'src/app/services/requirements.service';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  courseData = {
    name: "",
    department: "",
    course_number: "",
    section: "",
    semester: "",
    year: "",
    description: "",
    instructor: "",
    preceded_by: "",
    succeeded_by: "",
    audit_requirements: [],
    id: ""
  };
 
  requirements = [];
  users = [];
  instructors = [];
  audit_requirements;
  semesters = ["SP","SU","FA"];
  years = [];

  editCourseForm: FormGroup;
  submitted = false;

  constructor(public userSvc: UserService, private requirementsSvc: RequirementsService, public dialogRef: MatDialogRef<EditCourseComponent>, @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder, private courseSvc: CourseService) { }

  ngOnInit(): void {
    this.getYears();
    this.getRequirements();
    this.getUsers();
    this.courseData.name = this.data.name;
    this.courseData.department = this.data.department;
    this.courseData.course_number = this.data.course_number;
    this.courseData.section = this.data.section;
    this.courseData.semester = this.data.semester;
    this.courseData.year = this.data.year;
    this.courseData.description = this.data.description;
    this.courseData.instructor = this.data.instructor;
    this.courseData.preceded_by = this.data.preceded_by;
    this.courseData.succeeded_by = this.data.succeeded_by;
    this.courseData.audit_requirements = this.data.audit_requirements;
    this.courseData.id = this.data._id;

    this.editCourseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      department: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      course_number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      section: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      semester: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]],
      year: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      description: ['', [Validators.required, Validators.minLength(1)]],
      instructor: ['', [Validators.required]],
      preceded_by: [''],
      succeeded_by: [''],
      audit_requirements: ['', [Validators.required]],
    });
    this.fillInForm();
  }

  getYears() {
    const thisDate = new Date();
    let year = thisDate.getFullYear();
    this.years.push(year.toString());
    this.years.push((year + 1).toString())
  }

  getRequirements() {
    this.requirementsSvc.getAllRequirements().subscribe(resp => {
      if (resp) {
        this.requirements = resp.requirements;
      }
    });
  }

  getUsers() {
    this.userSvc.getAllUsers().subscribe((resp) => {
      if (resp) {
        if (resp.status === "S") {
          console.log(resp);
          this.users = resp.users;
          for (let i = 0; i < this.users.length; i++) {
            let theUser = this.users[i];
            let theRoles = theUser.roles;
            for (let j = 0; j < theRoles.length; j++) {
              let theRole = theRoles[j];
              if (theRole === 'instructor') {
                this.instructors.push(this.users[i]);
                console.log(this.instructors);
              }
            }
          }
        } else {
          // this.displayMessage = this.messages.errMsg;
          // this.showMessage = true;
        }
      }
    });
  }

  fillInForm(){
    if (this.editCourseForm && this.courseData.name) {
      this.editCourseForm.patchValue({
        name: this.courseData.name,
        department: this.courseData.department,
        course_number: this.courseData.course_number,
        section: this.courseData.section,
        semester: this.courseData.semester,
        year: this.courseData.year,
        description: this.courseData.description,
        instructor: this.courseData.instructor,
        preceded_by: this.courseData.preceded_by,
        succeeded_by: this.courseData.succeeded_by,
        audit_requirements: this.courseData.audit_requirements,
      });
    }
  }
  submit() {
    let courseObj;
    this.submitted = true;
    if (this.editCourseForm.valid) {
      
      courseObj = {
        _id: this.courseData.id,
        name: this.editCourseForm.value.name,
        department: this.editCourseForm.value.department,
        course_number: this.editCourseForm.value.course_number,
        section: this.editCourseForm.value.section,
        semester: this.editCourseForm.value.semester,
        year: this.editCourseForm.value.year,
        description: this.editCourseForm.value.description,
        instructor: this.editCourseForm.value.instructor,
        preceded_by: this.editCourseForm.value.preceded_by,
        succeeded_by: this.editCourseForm.value.succeeded_by,
        audit_requirements: this.editCourseForm.value.audit_requirements
      }
      console.log(courseObj);
      this.courseSvc.updateCourse(courseObj).subscribe(resp => {
        if (resp) {
          console.log(resp);
          this.dialogRef.close({data: "submitted"});
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close({data: "cancelled"});
  }

  get addUserFormControl() {
    return this.editCourseForm.controls;
  }

}
