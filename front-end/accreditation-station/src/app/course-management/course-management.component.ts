import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.css']
})
export class CourseManagementComponent implements OnInit {
  public addCourse = false;
  public viewCourse = false;
  public addSemester = false;
  public viewSemester = false;
  constructor() { }

  ngOnInit(): void {
  }

  buttonFn(btn) {
    this.clearBtn();
    switch (btn) {
      case 'add-course':
        this.addCourse = true;
        break;
      case 'view-courses':
        this.viewCourse = true;
        break;
      // case 'add-semester':
      //   this.addSemester = true;
      //   break;
      // case 'view-semesters':
      //   this.viewSemester = true;
      default:
        break;
    }
  }
  clearBtn() {
    this.addCourse = false;
    this.viewCourse = false;
    // this.addSemester = false;
    // this.viewSemester = false;
  }
}
