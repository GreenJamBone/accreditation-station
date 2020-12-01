import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { MatDialog } from '@angular/material/dialog';
import { EditCourseComponent } from '../edit-course/edit-course.component';
import { AreYouSureModalComponent } from '../../are-you-sure-modal/are-you-sure-modal.component';
import { UserService } from '../../services/user.service';
import { RequirementsService } from '../../services/requirements.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-courses',
  templateUrl: './view-courses.component.html',
  styleUrls: ['./view-courses.component.css']
})
export class ViewCoursesComponent implements OnInit {
  loading = false;
  userRole = '';
  dialogRef;
  areYouSureDialogRef;
  messages = {
    updatedCourseMsg: "Course successfully updated.",
    removedCourseMsg: "Course successfully removed.",
    errMsg: "There has been an error processing your request. Please try again later."
  }
  showMessage = false;
  displayMessage = "";
  courses = [];
  constructor(private courseSvc: CourseService, private router: Router, private reqSvc: RequirementsService, private userSvc: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.showMessage = false;
    this.getCourses();
    
  }

  getCourses() {
    this.loading = true;
    this.userRole = sessionStorage.getItem('user_role');
    this.courseSvc.getAllCourses().subscribe((resp) => {
      if (resp) {
        this.loading = false;
        if (resp.status === "S") {
          this.courses = resp.courses;
          this.userSvc.getAllUsers().subscribe(resp => {
            if (resp) {
              if (resp.status === "S") {
                this.matchUserNames(resp.users);
              } else {
                console.log("Error retrieving user names");
              }
            }
          });
          this.reqSvc.getAllRequirements().subscribe(resp => {
            if (resp) {
              this.matchReqs(resp.requirements);
            } else {
              console.log("Error retrieving requirements data");
            }
          });
        } else {
          this.displayMessage = this.messages.errMsg;
          this.showMessage = true;
        }
      }
    });
  }

  matchUserNames(users) {
    console.log(users);
    for (let i = 0; i < this.courses.length; i++) {
      let theCourse = this.courses[i];
      for (let j = 0; j < users.length; j++) {
        let theUser = users[j];
        if (theCourse.instructor === theUser._id) {
          this.courses[i].instructor_name = theUser.first_name + ' ' + theUser.last_name;
        }
      }
    }
    console.log(this.courses);
  }

  viewAssignments(courseId) {
    console.log(courseId);
    this.router.navigate(['view-assignments', courseId]);
  }

  matchReqs(reqs) {
    console.log(reqs);
    for (let i = 0; i < this.courses.length; i++) {
      let theCourse = this.courses[i];
      let tempArray = [];
      console.log(theCourse);
      for (let k = 0; k < theCourse.audit_requirements.length; k++) {
        let courseReq = theCourse.audit_requirements[k];

        for (let j = 0; j < reqs.length; j++) {
          let theReq = reqs[j];

          if (theReq._id === courseReq) {
            tempArray.push(theReq.name);
          }
        }
      }

      this.courses[i].req_names = tempArray;
    }
  }
  
  editCourseModal(course) {
    this.showMessage = false;
    this.messages.updatedCourseMsg = course.department + ' ' + course.course_number + ' has been successfully updated!';
    this.dialogRef = this.dialog.open(EditCourseComponent, {
      height: "",
      width: "600px",
      data: course
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result.data === 'submitted') {
        this.courseSvc.getAllCourses().subscribe((resp) => {
          if (resp) {
            if (resp.status === "S") {
              console.log(resp.statusMessage);
              this.displayMessage = this.messages.updatedCourseMsg;
              this.showMessage = true;
              this.courses = resp.courses;
              this.getCourses();
            } else {
              this.displayMessage = this.messages.errMsg;
              this.showMessage = true;
            }
          }
        });
      }
    });
  }

  removeCourse(user) {
    this.showMessage = false;
    console.log(user);
    this.areYouSureDialogRef = this.dialog.open(AreYouSureModalComponent, {
      height: "",
      width: "600px",
      data: {data:"Are You Sure You Want To Delete This Course?"}
    });
    this.areYouSureDialogRef.afterClosed().subscribe((result) => {
      if (result.data === 'yes') {
        this.courseSvc.removeCourse(user).subscribe(resp => {
          if (resp) {
            console.log(resp);
            if (resp.status === "S") {
              console.log("User Successfully Removed");
              this.showMessage = true;
              this.displayMessage = this.messages.removedCourseMsg;
              this.getCourses();
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
