import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequirementsService } from '../../services/requirements.service';

@Component({
  selector: 'app-add-requirement',
  templateUrl: './add-requirement.component.html',
  styleUrls: ['./add-requirement.component.css']
})
export class AddRequirementComponent implements OnInit {
  addRequirementForm: FormGroup;
  submitted = false;
  showMessage = false;
  theMessage = "";
  types = ["Outcome", "Objective"];
  default = "Outcome";
  messages = {
    success: "Requirement Successfully Added",
    error: "There was an error adding this requirement. Please try again later."
  }

  constructor(private fb: FormBuilder, private requirementsSvc: RequirementsService, private router: Router) { }

  ngOnInit() {
    this.addRequirementForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', Validators.required]
    });
    this.addRequirementForm.controls['type'].setValue(this.default, {onlySelf: true});
  }
  
  onSubmit() {
    let requirementObj;
    this.submitted = true;
    this.showMessage = false;
    if (this.addRequirementForm.valid) {
      console.log(this.addRequirementForm.value);
      requirementObj = {
        name: this.addRequirementForm.value.name,
        type: this.addRequirementForm.value.type,
        description: this.addRequirementForm.value.description,
      }

      this.requirementsSvc.addRequirement(requirementObj).subscribe(resp => {
        if (resp) {
          console.log(resp);
          if (resp.status === "S") {
            this.addRequirementForm.reset();
            this.addRequirementForm.controls['type'].setValue(this.default, {onlySelf: true});
            this.theMessage = this.messages.success;
            this.showMessage = true;
          } else {
            this.theMessage = this.messages.error;
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

  }

  get addUserFormControl() {
    return this.addRequirementForm.controls;
  }
}
