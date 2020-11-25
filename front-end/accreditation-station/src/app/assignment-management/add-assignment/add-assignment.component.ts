import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { AssignmentService } from '../../services/assignment.service';
import { RequirementsService } from '../../services/requirements.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css']
})
export class AddAssignmentComponent implements OnInit {
  @Input() courseInfo: any;
  @Input() theAssignmentID: any = "";
  prefillAssignment;

  addAssignmentForm: FormGroup;
  submitted = false;
  showMessage = false;
  theMessage = "";
  theReqs = [];
  courses = [];
  messages = {
    success: "Assignment Successfully Added",
    error: "Error Adding Assignment - Please try again later",
    pdf: "Please upload a .pdf document. Other filetypes are not accepted."
  }
  isPdf = true;
  semesters = ["SP","SU","FA"];
  categories = ["Paper", "Group Project", "Quiz", "Test", "Midterm Exam", "Final Exam"];
  years = [];
  filePreview;
  private file: File | null = null;

  constructor(private assignmentSvc: AssignmentService, private courseSvc: CourseService, private reqSvc: RequirementsService, private docSvc: DocumentService, private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    
    this.addAssignmentForm = this.fb.group({
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
      assignment_document: [null, Validators.required],
      student_document1:[null, Validators.required],
      student_document2:[null, Validators.required],
      student_document3:[null, Validators.required]
    });

    this.getReqs();
    this.getCourses();
    this.getYears();
    this.fillInForm();
  }
  ngOnChanges() {
    this.fillInForm();
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
  getYears() {
    const thisDate = new Date();
    let year = thisDate.getFullYear();
    for (let i = -6; i < 2; i++) {
      this.years.push((year + i).toString())
    }
  }
  fillInForm(){
    console.log(this.courseInfo);
    if (this.addAssignmentForm && this.courseInfo) {
      this.addAssignmentForm.patchValue({
        course: this.courseInfo,
      });
      this.addAssignmentForm.controls.course.disable();
    }
  }
  compareFnCrs(c1: any, c2:any): boolean {     
    return c1 && c2 ? c1._id === c2._id : c1 === c2; 
  }
  onFileChange(event, whichDoc) {
    this.isPdf = true;
    const reader = new FileReader();
     if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const nameSegments = file.name.split('.');
      if (nameSegments[(nameSegments.length - 1)].indexOf('pdf') !== -1) {
        reader.readAsDataURL(file)
        if (whichDoc === 'a') {
          reader.onload = () => {
            this.addAssignmentForm.patchValue({
              assignment_document: reader.result
            });
          }
          this.addAssignmentForm.patchValue({
            assignment_document_name: file.name,
            assignment_document_type: file.type,
            assignment_document_filesize: file.size
          });
        }

        if (whichDoc === 's1') {
          reader.onload = () => {
            this.addAssignmentForm.patchValue({
              student_document1: reader.result
            });
          }
          this.addAssignmentForm.patchValue({
            student_document_name1: file.name,
            student_document_type1: file.type,
            student_document_filesize1: file.size,
            student_document_rating1: "Above Average"
          });
        }

        if (whichDoc === 's2') {
          reader.onload = () => {
            this.addAssignmentForm.patchValue({
              student_document2: reader.result
            });
          }
          this.addAssignmentForm.patchValue({
            student_document_name2: file.name,
            student_document_type2: file.type,
            student_document_filesize2: file.size,
            student_document_rating2: "Average"
          });
        }

        if (whichDoc === 's3') {
          reader.onload = () => {
            this.addAssignmentForm.patchValue({
              student_document3: reader.result
            });
          }
          this.addAssignmentForm.patchValue({
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
    if (!this.addAssignmentForm.invalid) {
      let theCourse = this.addAssignmentForm.controls['course'].value;
      let assignmentPayload = {
        title: this.addAssignmentForm.controls['title'].value,
        course: theCourse,
        description: this.addAssignmentForm.controls['description'].value,
        category: this.addAssignmentForm.controls['category'].value,
        fulfilled_requirements: this.addAssignmentForm.controls['fulfilled_requirements'].value,
        assignment_document:  {
          name: this.addAssignmentForm.controls['assignment_document_title'].value,
          rating: "",
          file: this.addAssignmentForm.controls['assignment_document'].value,
          filename: this.addAssignmentForm.controls['assignment_document_name'].value,
          type: this.addAssignmentForm.controls['assignment_document_type'].value,
          filesize: this.addAssignmentForm.controls['assignment_document_filesize'].value
        },
        student_documents: [{
          name: this.addAssignmentForm.controls['student_document_title1'].value,
          rating: this.addAssignmentForm.controls['student_document_rating1'].value,
          file: this.addAssignmentForm.controls['student_document1'].value,
          filename: this.addAssignmentForm.controls['student_document_name1'].value,
          type: this.addAssignmentForm.controls['student_document_type1'].value,
          filesize: this.addAssignmentForm.controls['student_document_filesize1'].value,
        },
        {
          name: this.addAssignmentForm.controls['student_document_title2'].value,
          rating: this.addAssignmentForm.controls['student_document_rating2'].value,
          file: this.addAssignmentForm.controls['student_document2'].value,
          filename: this.addAssignmentForm.controls['student_document_name2'].value,
          type: this.addAssignmentForm.controls['student_document_type2'].value,
          filesize: this.addAssignmentForm.controls['student_document_filesize2'].value,
        },
        {
          name: this.addAssignmentForm.controls['student_document_title3'].value,
          rating: this.addAssignmentForm.controls['student_document_rating3'].value,
          file: this.addAssignmentForm.controls['student_document3'].value,
          filename: this.addAssignmentForm.controls['student_document_name3'].value,
          type: this.addAssignmentForm.controls['student_document_type3'].value,
          filesize: this.addAssignmentForm.controls['student_document_filesize3'].value,
        }]
      }


      this.assignmentSvc.addAssignment(assignmentPayload).subscribe(resp => {
        if (resp) {
          if (resp.status === "S") {
            this.addAssignmentForm.reset();
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

  get addAssignmentFormControl() {
    return this.addAssignmentForm.controls;
  }
}
