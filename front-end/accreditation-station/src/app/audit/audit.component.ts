import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  viewSelfStudy = false;
  viewCourses = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  buttonFn(btn) {
    this.clearBtn();
    switch (btn) {
      case 'view-self-study':
        // this.viewSelfStudy = true;
        this.router.navigate(['audit/documents']);
        break;
      case 'view-courses':
        // this.viewCourses = true;
        this.router.navigate(['audit/courses']);
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
