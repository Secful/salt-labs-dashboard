import { Component, Input, OnInit } from '@angular/core';
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
export class LabInstanceComponent implements OnInit{

  @Input() labInfo: ILabInfo = {} as ILabInfo;
  @Input() lab: ILab | null = null;


  copyIcon: SafeHtml;
  downloadIcon: SafeHtml;

  constructor(private sanitizer: DomSanitizer, private exportService: ExportService) {
    this.copyIcon = sanitizer.bypassSecurityTrustHtml(Icons.copy);
    this.downloadIcon = sanitizer.bypassSecurityTrustHtml(Icons.download);
  }
  ngOnInit(): void {
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
