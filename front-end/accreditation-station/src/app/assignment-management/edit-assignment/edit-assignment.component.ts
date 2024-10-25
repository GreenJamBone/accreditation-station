import { Component, OnInit, ChangeDetectorRef, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { AssignmentService } from '../../services/assignment.service';
import { RequirementsService } from '../../services/requirements.service';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css']
})
export class EditAssignmentComponent implements OnInit {
  theAssignmentID;
  @Input() courseInfo: any = {};

  prefillAssignment;
  assDoc;
  stDocs = [];
  editAssignmentForm: FormGroup;
  submitted = false;
  showMessage = false;
  theMessage = "";
  userRole;
  theReqs = [];
  courses = [];
  messages = {
    success: "Assignment Successfully Edited",
    error: "Error Editing Assignment - Please try again later",
    pdf: "Please upload a .pdf document. Other filetypes are not accepted."
  }
  isPdf = true;
  semesters = ["SP","SU","FA"];
  categories = ["Homework", "Paper", "Group Project", "Quiz", "Test", "Midterm Exam", "Final Exam"];
  years = [];
  filePreview;
  private file: File | null = null;

  constructor(private route: ActivatedRoute, public dialogRef: MatDialogRef<EditAssignmentComponent>, @Inject(MAT_DIALOG_DATA) public assData, private assignmentSvc: AssignmentService, private courseSvc: CourseService, private reqSvc: RequirementsService, private docSvc: DocumentService, private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.theAssignmentID = this.assData;
    console.log(this.theAssignmentID);
    this.getReqs();
    this.getCourses();
    this.editAssignmentForm = this.fb.group({
      title: ['', [Validators.required]],
      course: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      fulfilled_requirements: ["", [Validators.required]],
      assignment_document_title: [""],
      assignment_document_name: [""],      
      assignment_document_type: [""],
      assignment_document_filesize: [Number],
      student_document_name1: [""],
      student_document_title1: [""],
      student_document_rating1: [""],
      student_document_type1: [""],
      student_document_filesize1: [Number],
      student_document_title2: [""],
      student_document_name2: [""],
      student_document_rating2: [""],
      student_document_type2: [""],
      student_document_filesize2: [Number],
      student_document_name3: [""],
      student_document_title3: [""],
      student_document_rating3: [""],
      student_document_type3: [""],
      student_document_filesize3: [Number],
      assignment_document: [null],
      student_document1:[null],
      student_document2:[null],
      student_document3:[null]
    });

    if (this.theAssignmentID) {
      console.log(this.theAssignmentID);
      this.assignmentSvc.getAssignment(this.theAssignmentID).subscribe(resp => {
        if (resp) {
          this.prefillAssignment = resp.assignments[0];
          this.fillInForm();
        } 
      })
    }

    this.userRole = atob(sessionStorage.getItem('user_role'));
  }

  getReqs() {
    this.reqSvc.getAllRequirements().subscribe(resp => {
      if (resp) {
        console.log(resp);
        this.theReqs = resp.requirements;
      }
    });
  }
  getCourses() {
    this.courseSvc.getAllCourses().subscribe(resp => {
      if (resp) {
        this.courses = resp.courses;
      }
    });
  }
  printValue() {
    console.log(this.editAssignmentForm.get('fulfilled_requirements'))
  }
  compareFnReq(r1: any, r2:any): boolean {     
    return r1 && r2 ? r1.name === r2.name : r1 === r2; 
  }
  compareFnCrs(c1: any, c2:any): boolean {     
    return c1 && c2 ? c1._id === c2._id : c1 === c2; 
  }
  fillInForm(){
        
    if (this.prefillAssignment) {
      this.editAssignmentForm.patchValue({
        title: this.prefillAssignment.title,
        department: this.prefillAssignment.department,
        course: this.prefillAssignment.course,
        description: this.prefillAssignment.description,
        category: this.prefillAssignment.category,
        fulfilled_requirements: this.prefillAssignment.fulfilled_requirements,
        assignment_document_title: this.prefillAssignment.assignment_document.name,
        assignment_document_name: this.prefillAssignment.assignment_document.filename,      
        assignment_document_type: this.prefillAssignment.assignment_document.type,
        assignment_document_filesize: this.prefillAssignment.assignment_document.filesize,
        student_document_name1: this.prefillAssignment.student_documents[0].filename,
        student_document_title1: this.prefillAssignment.student_documents[0].name,
        student_document_rating1: this.prefillAssignment.student_documents[0].rating,
        student_document_type1: this.prefillAssignment.student_documents[0].type,
        student_document_filesize1: this.prefillAssignment.student_documents[0].filesize,
        student_document_title2: this.prefillAssignment.student_documents[1].name,
        student_document_name2: this.prefillAssignment.student_documents[1].filename,
        student_document_rating2: this.prefillAssignment.student_documents[1].rating,
        student_document_type2: this.prefillAssignment.student_documents[1].type,
        student_document_filesize2: this.prefillAssignment.student_documents[1].filesize,
        student_document_name3: this.prefillAssignment.student_documents[2].filename,
        student_document_title3: this.prefillAssignment.student_documents[2].name,
        student_document_rating3: this.prefillAssignment.student_documents[2].rating,
        student_document_type3: this.prefillAssignment.student_documents[2].type,
        student_document_filesize3: this.prefillAssignment.student_documents[2].filesize,
        assignment_document: this.prefillAssignment.assignment_document.file,
        student_document1: this.prefillAssignment.student_documents[0].file,
        student_document2: this.prefillAssignment.student_documents[1].file,
        student_document3: this.prefillAssignment.student_documents[2].file
      });
      
      this.editAssignmentForm.get('fulfilled_requirements').setValue(this.prefillAssignment.fulfilled_requirements);
      console.log(this.editAssignmentForm.value);
    }
  }

  

  onFileChange(event, whichDoc) {
    console.log(event);
    this.isPdf = true;
    const reader = new FileReader();
     if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const nameSegments = file.name.split('.');
      if (nameSegments[(nameSegments.length - 1)].indexOf('pdf') !== -1) {
        reader.readAsDataURL(file)
        if (whichDoc === 'a') {
          reader.onload = () => {
            this.editAssignmentForm.patchValue({
              assignment_document: reader.result
            });
          }
          this.editAssignmentForm.patchValue({
            assignment_document_name: file.name,
            assignment_document_type: file.type,
            assignment_document_filesize: file.size
          });
        }

        if (whichDoc === 's1') {
          reader.onload = () => {
            this.editAssignmentForm.patchValue({
              student_document1: reader.result
            });
          }
          this.editAssignmentForm.patchValue({
            student_document_name1: file.name,
            student_document_type1: file.type,
            student_document_filesize1: file.size,
            student_document_rating1: "Above Average"
          });
        }

        if (whichDoc === 's2') {
          reader.onload = () => {
            this.editAssignmentForm.patchValue({
              student_document2: reader.result
            });
          }
          this.editAssignmentForm.patchValue({
            student_document_name2: file.name,
            student_document_type2: file.type,
            student_document_filesize2: file.size,
            student_document_rating2: "Average"
          });
        }

        if (whichDoc === 's3') {
          reader.onload = () => {
            this.editAssignmentForm.patchValue({
              student_document3: reader.result
            });
          }
          this.editAssignmentForm.patchValue({
            student_document_name3: file.name,
            student_document_type3: file.type,
            student_document_filesize3: file.size,
            student_document_rating3: "Below Average"
          });
        }
      } else {
        console.log("NOT A PDF");
        event.target.value = '';
        this.isPdf = false;
        
      }
     }
  }
 
  
  onSubmit() {
    this.submitted = true;
    if (!this.editAssignmentForm.invalid) {
      let theCourse = this.editAssignmentForm.controls['course'].value;
      let studentDocs = [];
      let assignmentPayload = {
        _id: this.prefillAssignment._id,
        title: this.editAssignmentForm.controls['title'].value,
        course: theCourse,
        description: this.editAssignmentForm.controls['description'].value,
        category: this.editAssignmentForm.controls['category'].value,
        fulfilled_requirements: this.editAssignmentForm.controls['fulfilled_requirements'].value,
        assignment_document:  {
          name: this.editAssignmentForm.controls['assignment_document_title'].value,
          rating: "",
          file: this.editAssignmentForm.controls['assignment_document'].value,
          filename: this.editAssignmentForm.controls['assignment_document_name'].value,
          type: this.editAssignmentForm.controls['assignment_document_type'].value,
          filesize: this.editAssignmentForm.controls['assignment_document_filesize'].value
        },
        student_documents: [{
          name: this.editAssignmentForm.controls['student_document_title1'].value,
          rating: this.editAssignmentForm.controls['student_document_rating1'].value,
          file: this.editAssignmentForm.controls['student_document1'].value,
          filename: this.editAssignmentForm.controls['student_document_name1'].value,
          type: this.editAssignmentForm.controls['student_document_type1'].value,
          filesize: this.editAssignmentForm.controls['student_document_filesize1'].value,
        },
        {
          name: this.editAssignmentForm.controls['student_document_title2'].value,
          rating: this.editAssignmentForm.controls['student_document_rating2'].value,
          file: this.editAssignmentForm.controls['student_document2'].value,
          filename: this.editAssignmentForm.controls['student_document_name2'].value,
          type: this.editAssignmentForm.controls['student_document_type2'].value,
          filesize: this.editAssignmentForm.controls['student_document_filesize2'].value,
        },
        {
          name: this.editAssignmentForm.controls['student_document_title3'].value,
          rating: this.editAssignmentForm.controls['student_document_rating3'].value,
          file: this.editAssignmentForm.controls['student_document3'].value,
          filename: this.editAssignmentForm.controls['student_document_name3'].value,
          type: this.editAssignmentForm.controls['student_document_type3'].value,
          filesize: this.editAssignmentForm.controls['student_document_filesize3'].value,
        }]
      }

      this.assignmentSvc.updateAssignment(assignmentPayload).subscribe(resp => {
        if (resp) {
          if (resp.status === "S") {
            this.dialogRef.close({data: "submitted"});
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
  closeButton() {
    this.dialogRef.close({data: "cancelled"});
  }

  get editAssignmentFormControl() {
    return this.editAssignmentForm.controls;
  }
}
