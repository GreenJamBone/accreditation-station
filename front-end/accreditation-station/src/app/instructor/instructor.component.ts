import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css']
})
export class InstructorComponent implements OnInit {
  viewAssignments = false;
  addAssign = false;
  courseId = '';
  courseInfo = {
    id: '',
    year: '',
    semester: '',
    course_number: '',
    section: '',
  }
  
  courses = [
    {
      id: "124124124",
      course_number: "MIS 520",
      section: "A",
      semester: "SP",
      year: "2020",
      name: "Intro to Thesisizing",
      description: "An introduction to the methodologies involved in creating a thesis.",
      instructor: "John Doe",
      audit_requirements:["asfasf", "asfasg"],
      preceded_by: "MIS 519",
      succeeded_by: ""
    },
    {
      id: "124124124",
      course_number: "MIS 521",
      section: "A",
      semester: "SP",
      year: "2020",
      name: "Intro to Angular",
      description: "An introduction to Angular.",
      instructor: "John Doe",
      audit_requirements:["asfasf", "asfasg"],
      preceded_by: "",
      succeeded_by: ""
    }
]
  
  constructor() { }

  ngOnInit(): void {
  }

  showAssignments(theId) {
    this.viewAssignments = true;
    this.addAssign = false;
    this.courseId = theId;
  }

  addAssignment(theId, num, section, semester, year) {
    this.viewAssignments = false;
    this.addAssign = true;
    this.courseId = theId;
    this.courseInfo = {
      id: theId,
      year: year,
      semester: semester,
      course_number: num,
      section: section,
    }
  }
}
