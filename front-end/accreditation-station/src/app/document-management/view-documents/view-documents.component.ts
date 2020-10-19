import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { AreYouSureModalComponent } from '../../are-you-sure-modal/are-you-sure-modal.component';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css']
})
export class ViewDocumentsComponent implements OnInit {
  dialogRef;
  areYouSureDialogRef;
  messages = {
    updatedDocumentMsg: "Document successfully updated.",
    removedDocumentMsg: "Document successfully removed.",
    errMsg: "There has been an error processing your request. Please try again later."
  }
  showMessage = false;
  displayMessage = "";
  documents = [
    {
      id: 123234,
      name: "document_name.pdf",
      rating: "Excellent",
      filepath: "documents/course/semester/section/assignment/assignment2_average.pdf",
      type: "pdf",
      department: "MIS",
      course_number: "101",
      section: "B",
      year: "2020",
      semester: "FA",
      creation_date: "Mon Feb 10 2020 11:35:11 GMT-0500 (Eastern Standard Time)",
      modified_date: "Mon Feb 10 2020 11:35:39 GMT-0500 (Eastern Standard Time)",
    }    
  ];
  constructor(private docSvc: DocumentService) { }

  ngOnInit(): void {
    this.showMessage = false;
    this.getDocuments();
  }

  getDocuments() {
    this.docSvc.getAllDocuments().subscribe((resp) => {
      if (resp) {
        if (resp.status === "S") {
          this.documents = resp.documents;
        } else {
          this.displayMessage = this.messages.errMsg;
          this.showMessage = true;
        }
      }
    });
  }

  removeDocument(document) {
    this.showMessage = false;
    console.log(document);
    this.areYouSureDialogRef = this.dialogRef.open(AreYouSureModalComponent, {
      height: "",
      width: "600px",
      data: {data: "Are you sure you want to delete this document?"}
    });
    this.areYouSureDialogRef.afterClosed().subscribe((result) => {
      if (result.data === 'yes') {
        this.docSvc.removeDocument(document).subscribe(resp => {
          if (resp) {
            console.log(resp);
            if (resp.status === "S") {
              console.log("Document Successfully Removed");
              this.showMessage = true;
              this.displayMessage = this.messages.removedDocumentMsg;
              this.getDocuments();
            } else {
              this.showMessage = true;
              this.displayMessage = this.messages.errMsg;
            }
          }
        });
      } else {
        //do nothing
        console.log("Not Removing Document");
      }
    });
  }
}
