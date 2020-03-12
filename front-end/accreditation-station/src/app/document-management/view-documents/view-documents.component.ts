import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css']
})
export class ViewDocumentsComponent implements OnInit {
  documents = [
    {
      id: 123234,
      name: "document_name.pdf",
      rating: "Excellent",
      filepath: "documents/course/semester/section/assignment/assignment2_average.pdf",
      type: "pdf",
      creation_date: "Mon Feb 10 2020 11:35:11 GMT-0500 (Eastern Standard Time)",
      modified_date: "Mon Feb 10 2020 11:35:39 GMT-0500 (Eastern Standard Time)",
    }    
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
