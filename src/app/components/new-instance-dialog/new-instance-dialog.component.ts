import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material.module';
import { ChipsetInputComponent } from '../chipset-input/chipset-input.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as Icons from 'src/app/icons/icons';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';
import { Observable } from 'rxjs';
import { InstanceStatus } from './new-instance-dialog-enum';
import { IDomain, INewDomain } from 'src/app/interfaces/domain.interface';
import { IInstanceStatus } from 'src/app/interfaces/status.interface';

@Component({
  selector: 'app-new-instance-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, ChipsetInputComponent],
  templateUrl: './new-instance-dialog.component.html',
  styleUrls: ['./new-instance-dialog.component.css'],
})
export class NewInstanceDialogComponent implements OnInit {

  form: FormGroup = new FormGroup({
    domain_name: new FormControl<string>('', [Validators.required]),
    amount: new FormControl<number>(1, [Validators.required, Validators.min(1), Validators.max(50)]),
    type: new FormControl<string>('', [Validators.required]),
    ttl_in_days: new FormControl<number>(30, [Validators.required, Validators.min(1)]),
  })

  @Input() instanceTitle = 'New Instance';

  isApiRequired = false;
  inputValue = "";

  instanceStatus$: Observable<IInstanceStatus> = new Observable();
  instanceStatus: IInstanceStatus = { status: InstanceStatus.FORM };
  instanceStatusEnum = InstanceStatus;

  closeIcon: SafeHtml;
  successTickIcon: SafeHtml;
  errorCircle: SafeHtml;
  triangleExclamationMark: SafeHtml;
  circleExclamationMark: SafeHtml;

  constructor(public dialogRef: MatDialogRef<NewInstanceDialogComponent>, private sanitizer: DomSanitizer, private dataService: DashboardDataService, @Inject(MAT_DIALOG_DATA) public data: IDomain) {
    this.closeIcon = sanitizer.bypassSecurityTrustHtml(Icons.close);
    this.successTickIcon = sanitizer.bypassSecurityTrustHtml(Icons.successTick);
    this.errorCircle = sanitizer.bypassSecurityTrustHtml(Icons.errorCircle);
    this.triangleExclamationMark = sanitizer.bypassSecurityTrustHtml(Icons.triangleExclamationMark);
    this.circleExclamationMark = sanitizer.bypassSecurityTrustHtml(Icons.circleExclamationMark);

    if (data) {
      if (data.type) {
        this.form.get('type')?.setValue(data.type);
        this.form.get('type')?.disable();
      }
      if (data.learned_apis) {
        this.inputValue = data.learned_apis.join(', ');
      }
    }

  }

  ngOnInit(): void {
    this.form.get('type')?.valueChanges.subscribe(newValue => {
      this.isApiRequired = newValue === 'Detection';
    })
    this.instanceStatus$ = this.dataService.instanceStatus$;
    this.instanceStatus$.subscribe(status => {
      this.instanceStatus = status
    })
  }

  formSubmit() {
    if (this.data && this.data.learned_apis) {
      this.form.get('vulnerable_applications')?.setValue(this.data.learned_apis);
    }

    const newDomain: INewDomain = this.form.getRawValue();

    this.dataService.createDomain(newDomain);

    //TODO: change it to Instance interface that gets sent to the server
  }

  closeDialog() {
    this.dialogRef.close();
    setTimeout(() => this.dataService.instanceStatusSubject.next({ status: InstanceStatus.FORM }), 150); // Due to 150ms of dialog closing animation
  }

}
