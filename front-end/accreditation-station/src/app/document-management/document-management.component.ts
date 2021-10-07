import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.css']
})
export class DocumentManagementComponent implements OnInit {
  public addDocument = false;
  public viewDocuments = false;
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
      default:
        break;
    }
  }
  clearBtn() {
    this.addDocument = false;
    this.viewDocuments = false;
  }
}
