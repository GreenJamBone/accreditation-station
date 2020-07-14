import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RequirementsService } from '../../services/requirements.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  addCourseForm: FormGroup;
  submitted = false;
  requirements: any;
  users: any;
  instructors = [];

  constructor(private fb: FormBuilder, private requirementsSvc: RequirementsService, private userSvc: UserService) { }

  ngOnInit() {
    this.addCourseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      course_number: [''],
      section: [''],
      semester: [''],
      year: [''],
      description: [''],
      instructor: [''],
      preceded_by: [''],
      succeeded_by: [''],
      audit_requirements: [''],
    });
    this.getUsers();
    this.getRequirements();
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
    this.submitted = true;
    if (this.addCourseForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.addCourseForm.value);
    }
  }

  get addCourseFormControl() {
    return this.addCourseForm.controls;
  }
}
