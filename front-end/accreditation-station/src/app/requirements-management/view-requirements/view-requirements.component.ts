import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequirementsService } from '../../services/requirements.service';

@Component({
  selector: 'app-view-requirements',
  templateUrl: './view-requirements.component.html',
  styleUrls: ['./view-requirements.component.css']
})
export class ViewRequirementsComponent implements OnInit {
  
  showMessage = false;
  theMessage = "";
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

  constructor(private requirementsSvc: RequirementsService, private router: Router) { }

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
          this.theMessage = this.messages.success;
          this.getRequirements();
        } else {
          this.showMessage = true;
          this.theMessage = this.messages.error;
        }
      }
    }, (err) => {
      console.log(err);
      if (err.status === 400) {
        this.router.navigate(['/login'],{ queryParams: { error: 'true' } });
      }
    });
  }

}
