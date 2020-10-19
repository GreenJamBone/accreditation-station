import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-view-assignments',
  templateUrl: './view-assignments.component.html',
  styleUrls: ['./view-assignments.component.css']
})
export class ViewAssignmentsComponent implements OnInit {
  @Input() courseId = '';
  assignments = [
    {
      id: 1232345,
      title: "Research Paper #1",
      course: "MIS 123",
      description: "this research paper was assigned to test the students' abilities in research papering",
      category: "paper",
      authorized_roles: ["Audit","Admin","Instructor"],
      fulfilled_requirements: ["Audit104","Audit102"],
      assignment_documents:[
        {
          id: 123234,
          name: "document_name.pdf",
          rating: "Excellent",
          filepath: "documents/course/semester/section/assignment/assignment2_average.pdf",
          type: "pdf",
          creation_date: "Mon Feb 10 2020 11:35:11 GMT-0500 (Eastern Standard Time)",
          modified_date: "Mon Feb 10 2020 11:35:39 GMT-0500 (Eastern Standard Time)",
        }
      ],
      student_documents:[
        {
          id: 463463,
          name: "document_name.pdf",
          rating: "Excellent",
          filepath: "documents/course/semester/section/assignment/assignment2_average.pdf",
          type: "pdf",
          creation_date: "Mon Feb 10 2020 11:35:11 GMT-0500 (Eastern Standard Time)",
          modified_date: "Mon Feb 10 2020 11:35:39 GMT-0500 (Eastern Standard Time)",
        }
      ]
    }        
  ];
  constructor() { }

  ngOnInit(): void {
    //getAssignments
    if (this.courseId !== '') {
      //get assignment for this course
    } else {
      // get all assignments
    }

  }

  ngOnChanges() {
    if (this.courseId !== '') {
      //get assignment for this course
      } else {
        // get all assignments
    }
  }

}
