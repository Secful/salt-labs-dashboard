import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, throwError } from 'rxjs'
import { InstanceStatus } from '../components/new-instance-dialog/new-instance-dialog-enum';
import { IDomain, INewDomain, IOptions } from '../interfaces/domain.interface';
import { ILab } from '../interfaces/lab.interface';
import { IInstanceStatus } from '../interfaces/status.interface';
import { HttpClient } from '@angular/common/http';
import { handleError } from '../utils/http-error-handler';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  private domainsSubject = new Subject<IDomain[]>();
  domains$ = this.domainsSubject.asObservable();

  instanceStatusSubject = new BehaviorSubject<IInstanceStatus>({ status: InstanceStatus.FORM });
  instanceStatus$ = this.instanceStatusSubject.asObservable();

  private vulnerableApisSubject = new BehaviorSubject<string[]>([]);
  vulnerableApis$ = this.vulnerableApisSubject.asObservable();

  private instanceTypesSubject = new BehaviorSubject<string[]>([]);
  instanceTypes$ = this.instanceTypesSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  getAllDomains() {
    this.httpClient.get<IDomain[]>(`${environment.apiBaseUrl}/domains`, {}).pipe(catchError(handleError))
      .subscribe(response => {
        this.domainsSubject.next(response.sort((a, b) => {
          return new Date(a.creation_date).getTime() - new Date(b.creation_date).getTime()
        }))
      })
  }

  createDomain(newDomain: INewDomain) {
    this.changeInstanceStatus({ status: InstanceStatus.LOADING })
    return this.httpClient.post(`${environment.apiBaseUrl}/domains`, newDomain, { responseType: 'text' })
      .pipe(
        catchError(({ error }) => {
          let reqError = error;
          try {
            reqError = JSON.parse(error);
          }
          catch { }
          this.changeInstanceStatus({ status: InstanceStatus.ERROR, message: reqError?.error ?? error });
          return throwError(() => { });
        }))
  }

  deleteDomain(domain: IDomain) {
    return this.httpClient.delete(`${environment.apiBaseUrl}/domains`, { body: { domainName: domain.domain_name, owner: domain.owner }, responseType: 'text' }).pipe(catchError(handleError))
  }

  getLab(name: string) {
    return this.httpClient.get<ILab>(`${environment.apiBaseUrl}/lab?labName=${name}`).pipe(catchError(handleError));
  }

  getOptions() {
    this.httpClient.get<IOptions>(`${environment.apiBaseUrl}/options`).pipe(catchError(handleError)).subscribe(res => {
      this.vulnerableApisSubject.next(res.vulnerable_apis);
      this.instanceTypesSubject.next(res.instance_types);
    });
  }

  changeInstanceStatus(status: IInstanceStatus) {
    this.instanceStatusSubject.next(status);
  }

}