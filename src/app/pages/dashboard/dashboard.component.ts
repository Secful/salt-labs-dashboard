import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as Icons from 'src/app/icons/icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { NewInstanceDialogComponent } from 'src/app/components/new-instance-dialog/new-instance-dialog.component';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/modules/material.module';
import { IDomain } from 'src/app/interfaces/domain.interface';
import { LabInstanceComponent } from 'src/app/components/lab-instance/lab-instance.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, HeaderComponent, LabInstanceComponent],
  templateUrl: './dashboard.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dataSource: IDomain[] = [];
  domainsSubscription: Subscription = new Subscription();

  expandedElement: IDomain | null = null;

  defaultColumnsToDisplay = defaultColumnsToDisplay;
  dateColumnsToDisplay = dateColumnsToDisplay;
  columnsToDisplayWithExpand = columnsToDisplayWithExpand;

  chevronDownIcon: SafeHtml;
  chevronRightIcon: SafeHtml;
  boltIcon: SafeHtml;
  cloneIcon: SafeHtml;
  trashIcon: SafeHtml;

  plusIcon: SafeHtml;

  constructor(private sanitizer: DomSanitizer, public dialog: MatDialog, private dataService: DashboardDataService, private changeDetectorRefs: ChangeDetectorRef) {
    this.chevronDownIcon = sanitizer.bypassSecurityTrustHtml(Icons.chevronDown);
    this.chevronRightIcon = sanitizer.bypassSecurityTrustHtml(Icons.chevronRight);
    this.boltIcon = sanitizer.bypassSecurityTrustHtml(Icons.bolt);
    this.cloneIcon = sanitizer.bypassSecurityTrustHtml(Icons.clone);
    this.trashIcon = sanitizer.bypassSecurityTrustHtml(Icons.trash);
    this.plusIcon = sanitizer.bypassSecurityTrustHtml(Icons.plus);
  }

  ngOnInit(): void {
    this.domainsSubscription = this.dataService.domains$.subscribe(data => {
      this.dataSource = data.map(dataItem => {
        const difference = dataItem.expiration_date.getTime() - new Date().getTime();
        const ttl_expiration_date = Math.ceil(difference / (1000 * 3600 * 24));
        return { ...dataItem, ttl_expiration_date }
      });
      this.changeDetectorRefs.detectChanges();
    });
    this.dataService.getAllDomains();
  }

  ngOnDestroy(): void {
    this.domainsSubscription.unsubscribe();
  }

  openNewInstanceDialog() {
    this.dialog.open(NewInstanceDialogComponent, { panelClass: 'new-instance-dialog' });
  }

  cloneDomain(domain: IDomain) {
    this.dialog.open(NewInstanceDialogComponent, { panelClass: 'new-instance-dialog', data: domain });
  }

  deleteDomain(domain: IDomain) {
    this.dataService.deleteDomain(domain);
  }

}

const defaultColumnsToDisplay = [
  {
    header: "Name",
    field: "domain_name"
  },
  {
    header: "Type",
    field: "type"
  },
  {
    header: "Created By",
    field: "owner"
  },
  {
    header: "TTL - expiration date",
    field: "ttl_expiration_date"
  },
]

const dateColumnsToDisplay = [
  {
    header: "Creation Date",
    field: "creation_date"
  },
]

const columnsToDisplayWithExpand = ['expand', 'domain_name', 'type', 'learned_apis', 'owner', "creation_date", "ttl_expiration_date", 'extra_buttons'];