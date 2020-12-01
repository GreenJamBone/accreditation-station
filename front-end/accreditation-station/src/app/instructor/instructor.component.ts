import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  userData;
  name;
  theCourse;
  courseId;
  courses = [];
  
  constructor(private courseSvc: CourseService, private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('user_info')) {
      this.userData = JSON.parse(atob(sessionStorage.getItem('user_info')));
    } else {
      this.router.navigate(['login']);
    }
    
  }

}
