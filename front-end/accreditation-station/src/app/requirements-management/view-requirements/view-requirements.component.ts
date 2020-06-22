import { Component, OnInit } from '@angular/core';
import { RequirementsService } from '../../services/requirements.service';

@Component({
  selector: 'app-view-requirements',
  templateUrl: './view-requirements.component.html',
  styleUrls: ['./view-requirements.component.css']
})
export class ViewRequirementsComponent implements OnInit {
  
  showMessage = false;
  displayMessage = "";
  messages = {
    success: "The requirement was successfully removed.",
    error: "There was an issue removing this requirement. Please try again later."
  };
  requirements = [
    {
      id: 1231242,
      name: "Requirement 1",
      type: "outcome",
      description: "This requirement enforces a student's ability to perform logical analysis to effectively test applications."
    }	
    
  ];

  constructor(private requirementsSvc: RequirementsService) { }

  ngOnInit(): void {
    this.getRequirements();
  }

  getRequirements() {
    this.requirementsSvc.getAllRequirements().subscribe(resp => {
      if (resp) {
        console.log(resp);
        this.requirements = resp.requirements;
      }
    });
  }

  removeRequirement(requirement) {
    this.showMessage = false;
    this.requirementsSvc.removeRequirement(requirement).subscribe(resp => {
      if (resp) {
        console.log(resp);
        if (resp.status === "S") {
          console.log("User Successfully Removed");
          this.showMessage = true;
          this.displayMessage = this.messages.success;
          this.getRequirements();
        } else {
          this.showMessage = true;
          this.displayMessage = this.messages.error;
        }
      }
    });
  }

}
