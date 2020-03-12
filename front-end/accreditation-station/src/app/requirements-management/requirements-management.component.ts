import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requirements-management',
  templateUrl: './requirements-management.component.html',
  styleUrls: ['./requirements-management.component.css']
})
export class RequirementsManagementComponent implements OnInit {
  public addRequirement = false;
  public viewRequirements = false;
  constructor() { }

  ngOnInit(): void {
  }

  buttonFn(btn) {
    this.clearBtn();
    switch (btn) {
      case 'add-requirement':
        this.addRequirement = true;
        break;
      case 'view-requirements':
        this.viewRequirements = true;
        break;
      default:
        break;
    }
  }

  clearBtn() {
    this.addRequirement = false;
    this.viewRequirements = false;
  }
}
