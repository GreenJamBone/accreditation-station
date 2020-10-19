import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {
  @Input() courseInfo: any = {};
  addAssignmentForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.addAssignmentForm = this.fb.group({
      title: ['', [Validators.required]],
      course: ['', [Validators.required]],
      section: ['', [Validators.required]],
      semester: ['', [Validators.required]],
      year: [''],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      authorized_roles: ["", [Validators.required]],
      fulfilled_requirements: ["", [Validators.required]],
      assignment_document_name: [""],
      assignment_document: [null],
      student_document_name: [""],
      student_document_rating: [""],
      student_document:[null]
    });
    this.fillInForm();
  }
  ngOnChanges() {
    this.fillInForm();
  }
  fillInForm(){
    if (this.addAssignmentForm && this.courseInfo) {
      this.addAssignmentForm.patchValue({
        course: this.courseInfo.course_number,
        semester: this.courseInfo.semester,
        year: this.courseInfo.year,
        section: this.courseInfo.section
      });
      if (this.courseInfo.course_number){
        this.addAssignmentForm.controls['course'].disable();
        this.addAssignmentForm.controls['semester'].disable();
        this.addAssignmentForm.controls['year'].disable();
        this.addAssignmentForm.controls['section'].disable();
      }
    }
  }
  onFileChange(event) {
    const reader = new FileReader();
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.addAssignmentForm.patchValue({
          file: reader.result
       });
      
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }
  onStudentFileChange(event) {
    const reader = new FileReader();
 
    if(event.target.files && event.target.files.length) {
      const [student_file] = event.target.files;
      reader.readAsDataURL(student_file);
  
      reader.onload = () => {
        this.addAssignmentForm.patchValue({
          student_file: reader.result
       });
      
        // need to run CD since student_file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }
  onSubmit() {
    console.warn(this.addAssignmentForm.value);
    this.submitted = true;
    if (!this.addAssignmentForm.invalid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.addAssignmentForm.value);

    }
  }

  get addAssignmentFormControl() {
    return this.addAssignmentForm.controls;
  }
}
