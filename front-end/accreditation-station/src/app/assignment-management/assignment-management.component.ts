import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assignment-management',
  templateUrl: './assignment-management.component.html',
  styleUrls: ['./assignment-management.component.css']
})
export class AssignmentManagementComponent implements OnInit {

  public addAssignment = false;
  public viewAssignments = false;
  constructor() { }

  ngOnInit(): void {
  }

  buttonFn(btn) {
    this.clearBtn();
    switch (btn) {
      case 'add-assignment':
        this.addAssignment = true;
        break;
      case 'view-assignments':
        this.viewAssignments = true;
        break;
      default:
        break;
    }
  }
  clearBtn() {
    this.addAssignment = false;
    this.viewAssignments = false;
  }

}
