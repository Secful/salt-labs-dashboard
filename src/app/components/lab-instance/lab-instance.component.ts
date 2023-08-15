import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material.module';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as Icons from 'src/app/icons/icons';
import { ILab, ILabInfo } from 'src/app/interfaces/lab.interface';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';
import { take } from 'rxjs/operators'
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-lab-instance',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './lab-instance.component.html',
  styleUrls: ['./lab-instance.component.css']
})
export class LabInstanceComponent {

  @Input() labInfo: ILabInfo = {} as ILabInfo;
  lab: ILab | null = null;

  isOpen: boolean = false;

  chevronDownIcon: SafeHtml;
  chevronRightIcon: SafeHtml;
  copyIcon: SafeHtml;
  downloadIcon: SafeHtml;

  constructor(private sanitizer: DomSanitizer, private dataService: DashboardDataService, private exportService: ExportService) {
    this.chevronDownIcon = sanitizer.bypassSecurityTrustHtml(Icons.chevronDown);
    this.chevronRightIcon = sanitizer.bypassSecurityTrustHtml(Icons.chevronRight);
    this.copyIcon = sanitizer.bypassSecurityTrustHtml(Icons.copy);
    this.downloadIcon = sanitizer.bypassSecurityTrustHtml(Icons.download);
  }

  onLabInstanceOpen() {
    this.isOpen = true;
    if (this.lab === null) {
      this.dataService.getLab(this.labInfo.name).pipe(take(1)).subscribe(data => {
        console.log("data", data);
        this.lab = data;
      })
    }
  }

  onLabInstanceClose() {
    this.isOpen = false;
  }

  downloadInstanceDetails() {
    if (!this.lab)
      return;
    this.exportService.downloadInstanceDetails(this.lab, this.labInfo.name);
  }

  copyInstanceDetails() {
    if (!this.lab)
      return;
    this.exportService.copyInstanceDetails(this.lab);
  }

}
