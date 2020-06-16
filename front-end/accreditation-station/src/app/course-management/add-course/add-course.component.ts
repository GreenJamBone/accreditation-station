import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  addCourseForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) { }

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
