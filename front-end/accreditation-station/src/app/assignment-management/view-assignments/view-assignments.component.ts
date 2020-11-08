import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentService } from '../../services/assignment.service';
import { RequirementsService } from '../../services/requirements.service';
import { DocumentService } from '../../services/document.service';
import { AreYouSureModalComponent } from '../../are-you-sure-modal/are-you-sure-modal.component';

@Component({
  selector: 'app-view-assignments',
  templateUrl: './view-assignments.component.html',
  styleUrls: ['./view-assignments.component.css']
})
export class ViewAssignmentsComponent implements OnInit {
  @Input() courseId = '';
  dialogRef;
  areYouSureDialogRef;
  messages = {
    updatedAssignmentMsg: "Assignment successfully updated.",
    removedAssignmentMsg: "Assignment successfully removed.",
    errMsg: "There has been an error processing your request. Please try again later."
  }
  showMessage = false;
  displayMessage = "";
  requirements = [];
  assignments = [];

  constructor(private assignmentSvc: AssignmentService, private reqSvc: RequirementsService, private documentSvc: DocumentService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.showMessage = false;
    this.getAssignments();
    //getAssignments
    if (this.courseId !== '') {
      //get assignment for this course
    } else {
      // get all assignments
    }

  }

  ngOnChanges() {
    if (this.courseId !== '') {
      //get assignment for this course
      } else {
        // get all assignments
    }
  }

  getAssignments() {
    this.assignmentSvc.getAllAssignments().subscribe((resp) => {
      if (resp) {
        if (resp.status === "S") {
          this.assignments = resp.assignments;

    
          
        } else {
          this.displayMessage = this.messages.errMsg;
          this.showMessage = true;
        }
      }
    });
  }

  getDocuments() {
    this.documentSvc.getAllDocuments().subscribe( resp => {
      if (resp && resp.status === 'S') {
        console.log("GET DOCS");
        console.log(resp);
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

}
