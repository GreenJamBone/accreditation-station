import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
import { FILE } from 'dns';

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
  filePreview;
  private file: File | null = null;

  // @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
  //   if (!this.file) {
  //     const file = event && event.item(0);
  //     this.file = file;
  //   }
  // }

  constructor(private docSvc: DocumentService, private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.addDocumentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      year: [''],
      semester: [''],
      department: [''],
      course_number: [''],
      section: [''],
      rating: [''],
      file: [null, Validators.required],
      filename: [''],
      type: [''],
      filesize: [Number]
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
     if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.addDocumentForm.patchValue({
          file: reader.result
        });
      }
      this.addDocumentForm.patchValue({
        filename: file.name,
        type: file.type,
        filesize: file.size
      });
     }
  }
  onSubmit() {
    console.log(this.addDocumentForm.value);
    this.submitted = true;
    if (this.addDocumentForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.addDocumentForm.value);
      const payload = this.addDocumentForm.value;
      this.docSvc.addDocument(payload).subscribe(resp => {
        if (resp) {
          console.log(resp);
        }
      });
    }
  }

  get addDocumentFormControl() {
    return this.addDocumentForm.controls;
  }
}
