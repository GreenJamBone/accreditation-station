import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  userData;
  viewAssignments = false;
  addAssign = false;
  theCourse;
  courseId;
  courses = [];
  
  constructor(private courseSvc: CourseService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(atob(sessionStorage.getItem('user_info')));
    console.log(this.userData);
    this.courseSvc.getCoursesByUser(this.userData._id).subscribe(resp => {
      if (resp && resp.status === 'S') {
        console.log(resp);
        this.courses = resp.courses;
      }
    });
  }

  showAssignments(theId) {
    this.viewAssignments = true;
    this.addAssign = false;
    this.courseId = theId;
  }

  addAssignment(course) {
    this.viewAssignments = false;
    this.addAssign = true;
    this.theCourse = course;
  }
}
