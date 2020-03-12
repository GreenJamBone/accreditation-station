import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-requirements',
  templateUrl: './view-requirements.component.html',
  styleUrls: ['./view-requirements.component.css']
})
export class ViewRequirementsComponent implements OnInit {
  requirements = [
    {
      id: 1231242,
      name: "Requirement 1",
      description: "This requirement enforces a student's ability to perform logical analysis to effectively test applications."
    }	
    
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
