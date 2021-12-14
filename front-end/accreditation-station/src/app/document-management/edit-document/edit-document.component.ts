import { Component, OnInit, ChangeDetectorRef, HostListener, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css']
})
export class EditDocumentComponent implements OnInit {
  editDocumentForm: FormGroup;

  submitted = false;
  showMessage = false;
  theMessage = "";
  messages = {
    success: "Document Successfully Added",
    error: "Error Adding Document - Please try again later",
    pdf: "Please upload a .pdf document. Other filetypes are not accepted."
  }
  isPdf = true;
  semesters = ["SP","SU","FA"];
  years = [];
  programs = [
    {
      abbr: "BSCS",
      name: "Bachelor of Science in Computer Science"
    },
    {
      abbr: "BSSE",
      name: "Bachelor of Science in Software Engineering"
    }
  ];
  chapters = [
    {
      chapter: "Background Information",
      section: "Contact Information",
      value_c: "1",
      value_s: "A"
    },
    {
      chapter: "Background Information",
      section: "Program History",
      value_c: "1",
      value_s: "B"
    },
    {
      chapter: "Background Information",
      section: "Options",
      value_c: "1",
      value_s: "C"
    },
    {
      chapter: "Background Information",
      section: "Program Delivery Modes",
      value_c: "1",
      value_s: "D"
    },
    {
      chapter: "Background Information",
      section: "Program Locations",
      value_c: "1",
      value_s: "E"
    },
    {
      chapter: "Background Information",
      section: "Public Disclosure",
      value_c: "1",
      value_s: "F"
    },
    {
      chapter: "Background Information",
      section: "Deficiencies, Weaknesses or Concerns from Previous Evaluation and the Actions taken to Address Them",
      value_c: "1",
      value_s: "G"
    },
    {
      chapter: "Criterion 1. Students",
      section: "Student Admissions",
      value_c: "2",
      value_s: "A"
    },
    {
      chapter: "Criterion 1. Students",
      section: "Evaluating Student Performance",
      value_c: "2",
      value_s: "B"
    },
    {
      chapter: "Criterion 1. Students",
      section: "Transfer Students and Transfer Courses",
      value_c: "2",
      value_s: "C"
    },
    {
      chapter: "Criterion 1. Students",
      section: "Advising and Career Guidance",
      value_c: "2",
      value_s: "D"
    },
    {
      chapter: "Criterion 1. Students",
      section: "Work in Lieu of Courses",
      value_c: "2",
      value_s: "E"
    },
    {
      chapter: "Criterion 1. Students",
      section: "Graduation Requirements",
      value_c: "2",
      value_s: "F"
    },
    {
      chapter: "Criterion 1. Students",
      section: "Transcripts of Recent Graduates",
      value_c: "2",
      value_s: "G"
    },
    {
      chapter: "Criterion 2. Program Educational Objectives",
      section: "Mission Statement",
      value_c: "3",
      value_s: "A"
    },
    {
      chapter: "Criterion 2. Program Educational Objectives",
      section: "Program Educational Objectives",
      value_c: "3",
      value_s: "B"
    },
    {
      chapter: "Criterion 2. Program Educational Objectives",
      section: "Consistency of the Program Educational Objectives with the Mission of the Institution",
      value_c: "3",
      value_s: "C"
    },
    {
      chapter: "Criterion 2. Program Educational Objectives",
      section: "Program Constituencies",
      value_c: "3",
      value_s: "D"
    },
    {
      chapter: "Criterion 2. Program Educational Objectives",
      section: "Process for Review of Educational Objectives",
      value_c: "3",
      value_s: "E"
    },
    {
      chapter: "Criterion 3. Student Outcomes",
      section: "Student Outcomes",
      value_c: "4",
      value_s: "A"
    },
    {
      chapter: "Criterion 3. Student Outcomes",
      section: "Relationship of Student Outcomes to Educational Objectives",
      value_c: "4",
      value_s: "B"
    },
    {
      chapter: "Criterion 3. Student Outcomes",
      section: "Process for the Establishment and Revision of Student Outcomes",
      value_c: "4",
      value_s: "C"
    },
    {
      chapter: "Criterion 3. Student Outcomes",
      section: "Enabled Student Characteristics",
      value_c: "4",
      value_s: "D"
    },
    {
      chapter: "Criterion 4. Continuous Improvement",
      section: "Student Outcomes",
      value_c: "5",
      value_s: "A"
    },
    {
      chapter: "Criterion 4. Continuous Improvement",
      section: "Continuous Improvement",
      value_c: "5",
      value_s: "B"
    },
    {
      chapter: "Criterion 4. Continuous Improvement",
      section: "Additional Information",
      value_c: "5",
      value_s: "C"
    },
    {
      chapter: "Criterion 5. Curriculum",
      section: "Program Curriculum",
      value_c: "6",
      value_s: "A"
    },
    {
      chapter: "Criterion 5. Curriculum",
      section: "Course Syllabi",
      value_c: "6",
      value_s: "B"
    },
    {
      chapter: "Criterion 5. Curriculum",
      section: "Table 5-1 Curriculum",
      value_c: "6",
      value_s: "C"
    },
    {
      chapter: "Criterion 6. Faculty",
      section: "Faculty Qualifications",
      value_c: "7",
      value_s: "A"
    },
    {
      chapter: "Criterion 6. Faculty",
      section: "Faculty Workload",
      value_c: "7",
      value_s: "B"
    },
    {
      chapter: "Criterion 6. Faculty",
      section: "Faculty Size",
      value_c: "7",
      value_s: "C"
    },
    {
      chapter: "Criterion 6. Faculty",
      section: "Professional Development",
      value_c: "7",
      value_s: "D"
    },
    {
      chapter: "Criterion 6. Faculty",
      section: "Authority and Responsibility of Faculty",
      value_c: "7",
      value_s: "E"
    },
    {
      chapter: "Criterion 6. Faculty",
      section: "Table 6-1 Faculty Qualifications",
      value_c: "7",
      value_s: "F"
    },
    {
      chapter: "Criterion 6. Faculty",
      section: "Table 6-2 Faculty Workload Summary",
      value_c: "7",
      value_s: "G"
    },
    {
      chapter: "Criterion 7. Facilities",
      section: "Space",
      value_c: "8",
      value_s: "A"
    },
    {
      chapter: "Criterion 7. Facilities",
      section: "Computing Resources",
      value_c: "8",
      value_s: "B"
    },
    {
      chapter: "Criterion 7. Facilities",
      section: "Guidance",
      value_c: "8",
      value_s: "C"
    },
    {
      chapter: "Criterion 7. Facilities",
      section: "Maintenance and Upgrading of Facilities",
      value_c: "8",
      value_s: "D"
    },
    {
      chapter: "Criterion 7. Facilities",
      section: "Library Services",
      value_c: "8",
      value_s: "E"
    },
    {
      chapter: "Criterion 7. Facilities",
      section: "Overall Comments of Facilities",
      value_c: "8",
      value_s: "F"
    },
    {
      chapter: "Criterion 8. Institutional Support",
      section: "Leadership",
      value_c: "9",
      value_s: "A"
    },
    {
      chapter: "Criterion 8. Institutional Support",
      section: "Program Budget and Financial Support",
      value_c: "9",
      value_s: "B"
    },
    {
      chapter: "Criterion 8. Institutional Support",
      section: "Staffing",
      value_c: "9",
      value_s: "C"
    },
    {
      chapter: "Criterion 8. Institutional Support",
      section: "Faculty Hiring and Retention",
      value_c: "9",
      value_s: "D"
    },
    {
      chapter: "Criterion 8. Institutional Support",
      section: "Support of Faculty Professional Development",
      value_c: "9",
      value_s: "E"
    },
    {
      chapter: "Program Criteria",
      section: "Appendix A - Course Syllabi",
      value_c: "10",
      value_s: "A"
    },
    {
      chapter: "Program Criteria",
      section: "Appendix B - Faculty Vitae",
      value_c: "10",
      value_s: "B"
    },
    {
      chapter: "Program Criteria",
      section: "Appendix C - Equipment",
      value_c: "10",
      value_s: "C"
    },
    {
      chapter: "Program Criteria",
      section: "Appendix D - Institutional Summary",
      value_c: "10",
      value_s: "D"
    },
    {
      chapter: "Program Criteria",
      section: "Appendix E - Cooperative Education Forms",
      value_c: "10",
      value_s: "E"
    },
    {
      chapter: "Program Criteria",
      section: "Appendix F - Senior Interview Questions",
      value_c: "10",
      value_s: "F"
    },
    {
      chapter: "Program Criteria",
      section: "Signature Attesting to Compliance",
      value_c: "10",
      value_s: "G"
    },
    {
      chapter: "Miscellaneous Documents",
      section: "",
      value_c: "11",
      value_s: "A"
    }
  ];

  filePreview;
  private file: File | null = null;

  // @HostListener('change', ['$event.target.files']) emitFiles( event: FileList ) {
  //   if (!this.file) {
  //     const file = event && event.item(0);
  //     this.file = file;
  //   }
  // }

  constructor(private docSvc: DocumentService, private fb: FormBuilder, private cd: ChangeDetectorRef, public dialogRef: MatDialogRef<EditDocumentComponent>, @Inject(MAT_DIALOG_DATA) public docData, private router: Router) { }

  ngOnInit() {
    this.editDocumentForm = this.fb.group({
      _id: [''],
      name: ['', [Validators.required, Validators.minLength(4)]],
      chapter_section: ['', Validators.required],
      year: [''],
      department: [''],
      program: [''],
      file: [null],
      filename: [''],
      type: [''],
      filesize: [Number],
      creation_date: ['']
    });
    this.getYears();
    this.fillInForm();
  }

  getYears() {
    const thisDate = new Date();
    let year = thisDate.getFullYear();
    for (let i = -4; i < 6; i++) {
      this.years.push((year + i).toString())
    }
  }

  compareFnChapter(r1: any, r2:any): boolean {     
    return r1 && r2 ? (r1.value_c === r2.value_c && r1.value_s === r2.value_s) : r1 === r2; 
  }

  compareFnPrograms(r1: any, r2:any) {
    return r1 && r2 ? (r1.abbr === r2.abbr && r1.name === r2.name) : r1 === r2;
  }

  onFileChange(event) {
    this.isPdf = true;
    const reader = new FileReader();
     if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const nameSegments = file.name.split('.');
        if (nameSegments[(nameSegments.length - 1)].indexOf('pdf') !== -1) {
          reader.readAsDataURL(file)
          reader.onload = () => {
            this.editDocumentForm.patchValue({
              file: reader.result
            });
          }
          this.editDocumentForm.patchValue({
            filename: file.name,
            type: file.type,
            filesize: file.size
          });
        } else {
          console.log("NOT A PDF");
          event.target.value = '';
          this.isPdf = false;
        }
     }
  }
  fillInForm(){
    if (this.editDocumentForm && this.docData.name) {
      this.editDocumentForm.patchValue({
        _id: this.docData._id,
        program: this.docData.program,
        name: this.docData.name,
        chapter_section: this.docData.chapter_section,
        year: this.docData.year,
        department: this.docData.department,
        file: this.docData.file,
        filename: this.docData.filename,
        type: this.docData.type,
        filesize: this.docData.filesize,
        creation_date: this.docData.creation_date
      });
    }
  }

  onSubmit() {
    
    this.submitted = true;
    if (this.editDocumentForm.valid) {
      const payload = this.editDocumentForm.value;
      this.docSvc.updateDocument(payload).subscribe(resp => {
        if (resp) {
          console.log(resp);
          if (resp.status === "S") {
            this.dialogRef.close({data: "submitted"});
            this.theMessage = this.messages.success;
            this.showMessage = true;
          } else {
            this.theMessage = this.messages.error;
            this.showMessage = true;
          }
        }
      }, (err) => {
        console.log(err);
        if (err.status === 400) {
          this.router.navigate(['/login'],{ queryParams: { error: 'true' } });
        }
      });
    }
  }

  cancel() {
    this.dialogRef.close({data: "cancelled"});
  }

  get editDocumentFormControl() {
    return this.editDocumentForm.controls;
  }
}
