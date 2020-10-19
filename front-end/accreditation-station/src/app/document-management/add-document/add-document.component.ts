import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {
  addDocumentForm: FormGroup;
  submitted = false;
  semesters = ["SP","SU","FA"];
  years = [];
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.addDocumentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      year: [''],
      semester: [''],
      department: [''],
      course_number: [''],
      section: [''],
      rating: [''],
      file: [null, Validators.required]
    });
    this.getYears();
  }

  getYears() {
    const thisDate = new Date();
    let year = thisDate.getFullYear();
    this.years.push(year.toString());
    this.years.push((year + 1).toString())
  }

  onFileChange(event) {
    const reader = new FileReader();
 
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        this.addDocumentForm.patchValue({
          file: reader.result
       });
      
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }
  onSubmit() {
    console.warn(this.addDocumentForm.value);
    this.submitted = true;
    if (this.addDocumentForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.addDocumentForm.value);

    }
  }

  get addDocumentFormControl() {
    return this.addDocumentForm.controls;
  }
}
