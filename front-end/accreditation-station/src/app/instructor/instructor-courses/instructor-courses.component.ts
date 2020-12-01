import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CourseService } from '../../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.css']
})
export class InstructorCoursesComponent implements OnInit {
  userData;
  name;
  theCourse;
  courseId;
  courses = [];
  
  constructor(private courseSvc: CourseService, private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('user_info')) {
      this.userData = JSON.parse(atob(sessionStorage.getItem('user_info')));
      this.name = this.userData.first_name;
      this.courseSvc.getCoursesByUser(this.userData._id).subscribe(resp => {
        if (resp && resp.status === 'S') {
          console.log(resp);
          this.courses = resp.courses;
        }
      });
    } else {
      this.router.navigate(['login']);
    }
  }

  showAssignments(theId) {
    this.router.navigate(['instructor/manage-assignments', theId]);
  }

  addAssignment(course) {
    let theCourse = btoa(JSON.stringify(course));
    this.router.navigate(['instructor/add-assignment', theCourse]);
  }

}
