import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/modules/material.module';
import { LabInstanceComponent } from '../lab-instance/lab-instance.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ExportService } from 'src/app/services/export.service';
import * as Icons from 'src/app/icons/icons';
import { ILab, ILabInfo } from 'src/app/interfaces/lab.interface';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-lab-accordion',
  standalone: true,
  imports: [CommonModule, MaterialModule, LabInstanceComponent],
  templateUrl: './lab-accordion.component.html',
  styleUrls: ['./lab-accordion.component.css']
})
export class LabAccordionComponent {
  @Input() labInfo: ILabInfo = {} as ILabInfo;
  @Input() lab: ILab | null = null;

  isOpen: boolean = false;
  chevronDownIcon: SafeHtml;
  chevronRightIcon: SafeHtml;


  constructor(private sanitizer: DomSanitizer, private exportService: ExportService, private dataService: DashboardDataService) {
    this.chevronDownIcon = sanitizer.bypassSecurityTrustHtml(Icons.chevronDown);
    this.chevronRightIcon = sanitizer.bypassSecurityTrustHtml(Icons.chevronRight);
  }


  onLabInstanceOpen() {
    this.isOpen = true;
    if (this.lab === null) {
      this.dataService.getLab(this.labInfo.name).pipe(take(1)).subscribe(data => {
        this.lab = data;
      })

    }
  }

  onLabInstanceClose() {
    this.isOpen = false;
  }
}
