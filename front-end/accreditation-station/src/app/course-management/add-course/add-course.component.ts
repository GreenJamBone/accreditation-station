import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RequirementsService } from '../../services/requirements.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  addCourseForm: FormGroup;
  submitted = false;
  showMessage = false;
  requirements: any;
  users: any;
  instructors = [];
  theMessage = "";
  messages = {
    success: "Course Successfully Added",
    error: "Error Adding Course - Please try again later"
  }
  semesters = ["SP","SU","FA"];
  years = [];
  constructor(private fb: FormBuilder, private requirementsSvc: RequirementsService, private userSvc: UserService, private courseSvc: CourseService) { }

  ngOnInit() {
    this.addCourseForm = this.fb.group({
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
    this.getYears();
    this.getUsers();
    this.getRequirements();
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

  onSubmit() {
    console.warn(this.addCourseForm.value);
    let courseObj;
    this.submitted = true;
    this.showMessage = false;
    if (this.addCourseForm.valid) {

      courseObj = {
        name: this.addCourseForm.value.name,
        department: this.addCourseForm.value.department,
        course_number: this.addCourseForm.value.course_number,
        section: this.addCourseForm.value.section,
        semester: this.addCourseForm.value.semester,
        year: this.addCourseForm.value.year,
        description: this.addCourseForm.value.description,
        instructor: this.addCourseForm.value.instructor,
        preceded_by: this.addCourseForm.value.preceded_by,
        succeeded_by: this.addCourseForm.value.succeeded_by,
        audit_requirements: this.addCourseForm.value.audit_requirements,
      }
      this.courseSvc.addCourse(courseObj).subscribe(resp => {
        if (resp) {
          console.log(resp);
          if (resp.status === "S") {
            this.addCourseForm.reset();
            this.theMessage = this.messages.success;
            this.showMessage = true;
          } else {
            this.theMessage = this.messages.error;
            this.showMessage = true;
          }
          
        }
      });
    }
  }

  get addCourseFormControl() {
    return this.addCourseForm.controls;
  }
}
