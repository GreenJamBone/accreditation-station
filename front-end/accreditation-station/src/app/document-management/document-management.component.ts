import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.css']
})
export class DocumentManagementComponent implements OnInit {
  public addDocument = false;
  public viewDocuments = false;
  public addAssignment = false;
  public viewAssignments = false;
  constructor() { }

  ngOnInit(): void {
  }

  buttonFn(btn) {
    this.clearBtn();
    switch (btn) {
      case 'add-document':
        this.addDocument = true;
        break;
      case 'view-documents':
        this.viewDocuments = true;
        break;
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
    this.addDocument = false;
    this.viewDocuments = false;
    this.addAssignment = false;
    this.viewAssignments = false;
  }
}
