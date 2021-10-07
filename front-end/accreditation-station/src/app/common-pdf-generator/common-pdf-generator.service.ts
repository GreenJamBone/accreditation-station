import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class CommonPdfGeneratorService {
  public encodedPDF = new Subject();
  showHeaderFooter = false;
  showFooter = false;
  constructor(private router: Router) {
    this.showHeaderFooter = false;
    this.showFooter = false;
  }
  viewPdf(encodedPDF: any) {
    this.encodedPDF.next(encodedPDF);
    localStorage.setItem("encodedPDF", encodedPDF);
    if (this.router.url.includes("localhost")) {
      window.open(window.location.origin + "/#/viewpdf");
    } else {
      window.open(
        window.location.origin +
          "/viewpdf"
      );
    }
  }
}