import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-are-you-sure-modal',
  templateUrl: './are-you-sure-modal.component.html',
  styleUrls: ['./are-you-sure-modal.component.css']
})
export class AreYouSureModalComponent implements OnInit {
  modalContent = "Are you sure";
  constructor(private dialogRef: MatDialogRef<AreYouSureModalComponent>) { }

  ngOnInit(): void {
  }

  yes() {
    this.dialogRef.close({data: "yes"});
  }

  no() {
    this.dialogRef.close({data: "no"});
  }
}
