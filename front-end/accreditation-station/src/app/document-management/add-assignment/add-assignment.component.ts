import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {
  addAssignmentForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.addAssignmentForm = this.fb.group({
      title: ['', [Validators.required]],
      course: ['', [Validators.required]],
      semester: [''],
      year: [''],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      authorized_roles: ["ABET","Admin","Instructor"],
      fulfilled_requirements: ["ABET104","ABET102"],
      assignment_documents:[
        {
          name: "document_name.pdf",
          rating: "Excellent",
          file: [null, Validators.required]
        }
      ],
      student_documents:[
        {
          name: "document_name.pdf",
          rating: "Excellent",
          student_file: [null, Validators.required]
        }
      ]
    });
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
    if (this.addAssignmentForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.addAssignmentForm.value);

    }
  }

  get addAssignmentFormControl() {
    return this.addAssignmentForm.controls;
  }
}
