import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentService } from '../../services/assignment.service';
import { RequirementsService } from '../../services/requirements.service';
import { DocumentService } from '../../services/document.service';
import { AreYouSureModalComponent } from '../../are-you-sure-modal/are-you-sure-modal.component';
import { CommonPdfGeneratorComponent } from 'src/app/common-pdf-generator/common-pdf-generator.component';
import { EditAssignmentComponent } from '../edit-assignment/edit-assignment.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-view-assignments',
  templateUrl: './view-assignments.component.html',
  styleUrls: ['./view-assignments.component.css']
})
export class ViewAssignmentsComponent implements OnInit {
  @Input() courseId = '';
  loading = true;
  userRole = '';
  dialogRef;
  areYouSureDialogRef;
  messages = {
    updatedAssignmentMsg: "Assignment successfully updated.",
    removedAssignmentMsg: "Assignment successfully removed.",
    errMsg: "There has been an error processing your request. Please try again later.",
    errMsg2: "There has been an error retrieving related assignments, or no related assignments exist. Please try again later."
  }
  showMessage = false;
  displayMessage = "";
  requirements = [];
  assignments = [];
  lastCourse;
  fullAssignmentList: any;
  theCourses = [{_id: "All", department: "All"}];

  constructor(private assignmentSvc: AssignmentService, private router: Router, private reqSvc: RequirementsService, private route: ActivatedRoute, private documentSvc: DocumentService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.showMessage = false;
    if (sessionStorage.getItem('user_role')) {
      this.userRole = atob(sessionStorage.getItem('user_role'));
    } else {
      this.router.navigate(['login']);
    }
    
    if (this.courseId.length === 0) {      
      this.courseId = this.route.snapshot.paramMap.get('courseId');
      console.log(this.courseId)
    }
    this.getAssignments();
    
  }

  ngOnChanges() {
    if (this.courseId && (this.courseId !== this.lastCourse)) {
      this.getAssignments();
    }
  }

  filterAssignmentsByCourse(event) {
    let tempAssignments = this.fullAssignmentList;
      let val = event.target.value;
      if (val === 'All') {
        this.assignments = this.fullAssignmentList;
      } else {
        console.log(val);
        this.assignments = _.map(tempAssignments, function(o) {
          let course = o.course;
          console.log(course._id);
          if (course._id === val) {
            return o;
          }
        });
        this.assignments = _.without(this.assignments, undefined);
        // this.users = _.filter(tempUsers, { 'roles': val});
      }
  }

  getAssignments() {
    this.loading = true;
    this.assignments = [];
    this.showMessage = false;
    
    if (this.courseId) {
      this.assignmentSvc.getAssignmentsByCourse(this.courseId).subscribe(resp => {
        if (resp) {
          if (resp.status === "S") {
            this.assignments = resp.assignments;
            this.fullAssignmentList = resp.assignments;
            this.loading = false;
          } else if (resp.status === "I") {
            this.displayMessage = resp.statusMessage;
            this.showMessage = true;
            this.loading = false;
          } else {
            console.log(resp);
            this.displayMessage = this.messages.errMsg2;
            this.showMessage = true;
            this.loading = false;
          }
        } 
      });
    } else {
      this.assignmentSvc.getAllAssignments().subscribe((resp) => {
        if (resp) {
          if (resp.status === "S") {
            this.assignments = resp.assignments;
            this.fullAssignmentList = resp.assignments;
            this.getCourses();
            this.loading = false;
          } else {
            this.displayMessage = this.messages.errMsg;
            this.showMessage = true;
            this.loading = false;
          }
        }
      });
    }
  }

  getCourses() {
    for (let i = 0; i < this.assignments.length; i++) {
      let theCourse = this.assignments[i].course;
      if (this.theCourses.filter(e => e._id === theCourse._id).length > 0) {}
      else {
        this.theCourses.push(theCourse);
      }
    }
  }

  getDocuments() {
    this.documentSvc.getAllDocuments().subscribe( resp => {
      if (resp && resp.status === 'S') {
        console.log("GET DOCS");
        console.log(resp);
      }
    });
  }

  showFile(fileData){    
    const commonPdfDialogReg = this.dialog.open(CommonPdfGeneratorComponent, {
      height: 'auto',
      width: '150%',
      data: fileData
    });
    commonPdfDialogReg.afterClosed().subscribe(result => {
      console.log(result);
    })

  }
  
  editAssignment(assignment) {
    
    this.showMessage = false;
    this.messages.updatedAssignmentMsg = 'This document has been successfully updated!';
    this.dialogRef = this.dialog.open(EditAssignmentComponent, {
      width: "600px",
      height: "90%",
      data: assignment
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result.data === 'submitted') {
        this.displayMessage = this.messages.updatedAssignmentMsg;
        this.showMessage = true;
        this.getAssignments();
      }
    });
  }


  removeAssignment(assignment) {
    this.showMessage = false;
    console.log(assignment);
    this.areYouSureDialogRef = this.dialog.open(AreYouSureModalComponent, {
      height: "",
      width: "600px",
      data: {data:"Are You Sure You Want To Delete This assignment?"}
    });
    this.areYouSureDialogRef.afterClosed().subscribe((result) => {
      if (result.data === 'yes') {
        this.assignmentSvc.removeAssignment(assignment).subscribe(resp => {
          if (resp) {
            console.log(resp);
            if (resp.status === "S") {
              console.log("assignment Successfully Removed");
              this.showMessage = true;
              this.displayMessage = this.messages.removedAssignmentMsg;
              this.getAssignments();
            } else {
              this.showMessage = true;
              this.displayMessage = this.messages.errMsg;
            }
          }
        });
      } else {
        //do nothing
        console.log('Not Removing Course');
      }
    });
  }

  routeTo(theRoute) {
    this.router.navigate([theRoute]);
  }

}
