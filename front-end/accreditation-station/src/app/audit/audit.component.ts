import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  viewSelfStudy = false;
  viewCourses = false;

  constructor() { }

  ngOnInit(): void {
  }

  buttonFn(btn) {
    this.clearBtn();
    switch (btn) {
      case 'view-self-study':
        this.viewSelfStudy = true;
        break;
      case 'view-courses':
        this.viewCourses = true;
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
    this.viewSelfStudy = false;
    this.viewCourses = false;
    // this.addSemester = false;
    // this.viewSemester = false;
  }

}
