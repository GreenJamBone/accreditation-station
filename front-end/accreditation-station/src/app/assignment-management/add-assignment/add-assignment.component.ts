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
  @Input() courseInfo: any = {};
  addAssignmentForm: FormGroup;
  submitted = false;
  showMessage = false;
  theMessage = "";
  theReqs = [];
  courses = [];
  messages = {
    success: "Assignment Successfully Added",
    error: "Error Adding Assignment - Please try again later"
  }
  semesters = ["SP","SU","FA"];
  categories = ["Paper", "Group Project", "Quiz", "Test", "Midterm Exam", "Final Exam"];
  years = [];
  filePreview;
  private file: File | null = null;

  constructor(private assignmentSvc: AssignmentService, private courseSvc: CourseService, private reqSvc: RequirementsService, private docSvc: DocumentService, private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    
    this.addAssignmentForm = this.fb.group({
      title: ['', [Validators.required]],
      department: [''],
      course: ['', [Validators.required]],
      course_number: [''],
      section: [''],
      semester: [''],
      year: [''],
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
    this.years.push(year.toString());
    this.years.push((year + 1).toString())
  }
  fillInForm(){
    if (this.addAssignmentForm && this.courseInfo) {
      this.addAssignmentForm.patchValue({
        department: this.courseInfo.department,
        course_number: this.courseInfo.course_number,
        semester: this.courseInfo.semester,
        year: this.courseInfo.year,
        section: this.courseInfo.section
      });
      if (this.courseInfo.course_number){
        this.addAssignmentForm.controls['department'].disable();
        this.addAssignmentForm.controls['course_number'].disable();
        this.addAssignmentForm.controls['semester'].disable();
        this.addAssignmentForm.controls['year'].disable();
        this.addAssignmentForm.controls['section'].disable();
      }
    }
  }
  onFileChange(event, whichDoc) {
    const reader = new FileReader();
     if (event.target.files.length > 0) {
      const file = event.target.files[0];
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
      
     }
  }
  onStudentFileChange(event) {
    const reader = new FileReader();
     if (event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.addAssignmentForm.patchValue({
          file: reader.result
        });
      }
      this.addAssignmentForm.patchValue({
        filename: file.name,
        type: file.type,
        filesize: file.size
      });
     }
  }
  onSubmit() {
    this.submitted = true;
    if (!this.addAssignmentForm.invalid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.addAssignmentForm.value);
      let theCourse = this.addAssignmentForm.controls['course'].value;
      this.addAssignmentForm.patchValue({
        department: theCourse.department,
        course_number: theCourse.course_number,
        section: theCourse.section,
        semester: theCourse.semester,
        year: theCourse.year
      });
      let assignmentPayload = {
        title: this.addAssignmentForm.controls['title'].value,
        department: theCourse.department,
        course_number: theCourse.course_number,
        section: theCourse.section,
        semester: theCourse.semester,
        year: theCourse.year,
        course: theCourse,
        description: this.addAssignmentForm.controls['description'].value,
        category: this.addAssignmentForm.controls['category'].value,
        fulfilled_requirements: this.addAssignmentForm.controls['fulfilled_requirements'].value,
        assignment_document: "",
        student_documents: []
      }

      this.assignmentSvc.addAssignment(assignmentPayload).subscribe(resp => {
        if (resp) {
          if (resp.status === 'S') {
            
            const assID = resp.assignmentInfo._id;

            const docPayload = this.createDocPayload(this.addAssignmentForm.value, assID);

            console.log(docPayload);
            this.docSvc.addDocument(docPayload).subscribe(resp => {
              if (resp) {
                if (resp.status === 'S') {
                  let docInfo = resp.documentInfo;
                  let assDoc;
                  let stDocs = [];
                  for (let i = 0; i < docInfo.length; i++) {
                    if (docInfo[i].filepath.indexOf('assignments') !== -1) {
                      assDoc = docInfo[i]._id;
                    } else {
                      stDocs.push(docInfo[i]._id);
                    }
                  }
                  assignmentPayload['_id'] = assID;
                  assignmentPayload.assignment_document = assDoc;
                  assignmentPayload.student_documents = stDocs;
                  this.assignmentSvc.updateAssignment(assignmentPayload).subscribe(resp => {
                    if (resp) {
                      if (resp.status === 'S') {
                        if (resp.status === "S") {
                          this.addAssignmentForm.reset();
                          this.theMessage = this.messages.success;
                          this.showMessage = true;
                        } else {
                          this.theMessage = this.messages.error;
                          this.showMessage = true;
                        }
                      }
                    }
                  });

                }
              }
            });
            
          }
        }
      });

      


    }
  }
  createDocPayload(doc, assignmentID) {

    let theDocPL = { documents:[
      {
        name: doc.assignment_document_title,
        year: doc.year,
        semester: doc.semester,
        department: doc.department,
        course_number: doc.course_number,
        section: doc.section,
        rating: "",
        file: doc.assignment_document,
        filename: doc.assignment_document_name,
        type: doc.assignment_document_type,
        filesize: doc.assignment_document_filesize,
        fileDir: 'assignment',
        assignment: assignmentID
      },
      {
        name: doc.student_document_title1,
        year: doc.year,
        semester: doc.semester,
        department: doc.department,
        course_number: doc.course_number,
        section: doc.section,
        rating: doc.student_document_rating1,
        file: doc.student_document1,
        filename: doc.student_document_name1,
        type: doc.student_document_type1,
        filesize: doc.student_document_filesize1,
        fileDir: 'document',
        assignment: assignmentID
      },
      {
        name: doc.student_document_title2,
        year: doc.year,
        semester: doc.semester,
        department: doc.department,
        course_number: doc.course_number,
        section: doc.section,
        rating: doc.student_document_rating2,
        file: doc.student_document2,
        filename: doc.student_document_name2,
        type: doc.student_document_type2,
        filesize: doc.student_document_filesize2,
        fileDir: 'document',
        assignment: assignmentID
      },
      {
        name: doc.student_document_title3,
        year: doc.year,
        semester: doc.semester,
        department: doc.department,
        course_number: doc.course_number,
        section: doc.section,
        rating: doc.student_document_rating3,
        file: doc.student_document3,
        filename: doc.student_document_name3,
        type: doc.student_document_type3,
        filesize: doc.student_document_filesize3,
        fileDir: 'document',
        assignment: assignmentID
      }
    ]}
    return theDocPL;
  }


  get addAssignmentFormControl() {
    return this.addAssignmentForm.controls;
  }
}
