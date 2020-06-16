import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-courses',
  templateUrl: './view-courses.component.html',
  styleUrls: ['./view-courses.component.css']
})
export class ViewCoursesComponent implements OnInit {
  courses = [
    {
      id: 111111,
      course_number: "MIS 520",
      section: "A",
      semester: "Spring",
      year: "2020",
      name: "Intro to Thesisizing",
      description: "An introduction to the methodologies involved in creating a thesis.",
      instructor: "Dr. Rosca",
      audit_requirements:["1.5", "1.4"],
      preceded_by: "",
      succeeded_by: ""
    },
    {
      id: 111112,
      course_number: "MIS 521",
      section: "A",
      semester: "Spring",
      year: "2020",
      name: "Angular 6",
      description: "An course on building Angular applications.",
      instructor: "Some student",
      audit_requirements:["1.8", "2.4"],
      preceded_by: "",
      succeeded_by: ""
    }
    
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
