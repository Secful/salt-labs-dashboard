import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { InstanceStatus } from '../components/new-instance-dialog/new-instance-dialog-enum';
import { IDomain, INewDomain } from '../interfaces/domain.interface';
import { ILab } from '../interfaces/lab.interface';
import { IInstanceStatus } from '../interfaces/status.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  private domainsSubject = new Subject<IDomain[]>();
  domains$ = this.domainsSubject.asObservable();

  instanceStatusSubject = new BehaviorSubject<IInstanceStatus>({ status: InstanceStatus.FORM });
  instanceStatus$ = this.instanceStatusSubject.asObservable();

  constructor() {}

  getAllDomains() {
    // Sending GET request to {salt-url}/labs-domains
  }

  createDomain(newDomain: INewDomain) {
    // Sending POST request to {salt-url}/labs-domain
  }

  deleteDomain(domain: IDomain) {
    // Sending Request to the server with the domain id
  }

  getLab(name: string) {
    // Sending GET request to {salt-url}/lab?name={lab-name}
    return new Observable<ILab>();
  }

}
