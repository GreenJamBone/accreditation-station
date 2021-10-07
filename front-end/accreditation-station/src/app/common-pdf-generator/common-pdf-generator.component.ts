import { Component, OnInit, Input, AfterViewInit, Inject } from "@angular/core";
import { CommonPdfGeneratorService } from "./common-pdf-generator.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { environment } from "../../environments/environment";
@Component({
  selector: "studio-common-pdf-generator",
  templateUrl: "./common-pdf-generator.component.html",
  styleUrls: ["./common-pdf-generator.component.scss"]
})
export class CommonPdfGeneratorComponent implements OnInit {
  public pdfName: any;
  public theFile: any;
  public decodedPDF: any;
  public fileURL: any;
  public errorMessage: any;
  public errorFlag: any;
  public errorStatusMessage =
    "There is a problem in retrieving document. Please contact the administrator.";
  constructor(
    private commonPdfService: CommonPdfGeneratorService,
    public dialogRef: MatDialogRef<CommonPdfGeneratorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    
    console.log(this.data);
    this.errorFlag = false;
    this.pdfName = this.data.filename;
    if (isArrayBuffer(this.data.file)) {
      this.decodedPDF = this.data.file;
    } else if (isObject(this.data.file)) {
      this.decodedPDF = this.base64ToArrayBuffer(this.data.file);
    } else {
      this.theFile = this.data.file.split(',')[1];
      // this.errorFlag = true;
      // this.errorMessage = this.errorStatusMessage;
    }
   
    
  }
  base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  closeButton() {
    this.dialogRef.close();
  }
}

export interface DialogData {}

function isObject(obj) {
  let flag = false;
  //if( obj != null && obj.constructor.name === "Object"){
  if (obj != null && obj.constructor === Object) {
    flag = true;
  }
  return flag;
}
function isArrayBuffer(str) {
  let flag = false;
  if (str != null && str.constructor === ArrayBuffer) {
    flag = true;
  }
  return flag;
}