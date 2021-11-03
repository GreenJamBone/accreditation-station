import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { AreYouSureModalComponent } from '../../are-you-sure-modal/are-you-sure-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EditDocumentComponent } from '../edit-document/edit-document.component';
import { CommonPdfGeneratorComponent } from 'src/app/common-pdf-generator/common-pdf-generator.component';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css']
})
export class ViewDocumentsComponent implements OnInit {
  loading = false;
  dialogRef;
  areYouSureDialogRef;
  messages = {
    updatedDocumentMsg: "Document successfully updated.",
    removedDocumentMsg: "Document successfully removed.",
    errMsg: "There has been an error processing your request. Please try again later."
  }
  showMessage = false;
  displayMessage = "";
  documents = [];
  allDocs = [];
  theYears = [];
  userRole;
  constructor(private docSvc: DocumentService, private dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.showMessage = false;
    this.userRole = sessionStorage.getItem('user_role');
    console.log(this.userRole);
    this.getDocuments();
  }

  getDocuments() {
    this.loading = true;
    this.docSvc.getAllDocuments().subscribe((resp) => {
      if (resp) {
        this.loading = false;
        if (resp.status === "S") {
          this.documents = resp.documents;
          this.documents = this.documents.sort(
            function(a, b) {          
               if (a.chapter_section.value_c === b.chapter_section.value_c) {
                  return b.chapter_section.value_s - a.chapter_section.value_s;
               }
               return a.chapter_section.value_c > b.chapter_section.value_c ? 1 : -1;
            });
            this.allDocs = JSON.parse(JSON.stringify(this.documents));;
            this.theYears = this.getDropdownYears(this.documents);
            this.theYears.unshift('All');
            this.theYears.sort();
        } else {
          this.displayMessage = this.messages.errMsg;
          this.showMessage = true;
        }
      }
    }, (err) => {
      console.log(err);
      if (err.status === 400) {
        this.router.navigate(['/login'],{ queryParams: { error: 'true' } });
      }
    });
  }

  getDropdownYears(docs) {
    const unique = [...new Set(docs.map(item => item.year))];
    return unique;
  }

  filterYears(event) {
    let tempDocs = JSON.parse(JSON.stringify(this.allDocs));
    let val = event.target.value;
    console.log(tempDocs);
    console.log(val);
    if (val === 'All') {
      this.documents = tempDocs;
    } else {
      this. documents = _.filter(tempDocs, { 'year': val});
    }
    console.log(this.documents);
  }

  showFile(fileData){    
    const commonPdfDialogReg = this.dialog.open(CommonPdfGeneratorComponent, {
      height: 'auto',
      width: '150%',
      data: fileData
    });
    commonPdfDialogReg.afterClosed().subscribe(result => {
      console.log(result);
    })

  }

  editDocument(document) {
    this.showMessage = false;
    this.messages.updatedDocumentMsg = 'This document has been successfully updated!';
    this.dialogRef = this.dialog.open(EditDocumentComponent, {
      height: "",
      width: "600px",
      data: document
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result.data === 'submitted') {
        this.docSvc.getAllDocuments().subscribe((resp) => {
          if (resp) {
            if (resp.status === "S") {
              console.log(resp.statusMessage);
              this.displayMessage = this.messages.updatedDocumentMsg;
              this.showMessage = true;
              this.documents = resp.documents;
            } else {
              this.displayMessage = this.messages.errMsg;
              this.showMessage = true;
            }
          }
        });
      }
    });
  }

  removeDocument(document) {
    this.showMessage = false;
    console.log(document);
    this.areYouSureDialogRef = this.dialog.open(AreYouSureModalComponent, {
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
