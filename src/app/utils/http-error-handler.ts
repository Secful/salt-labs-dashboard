import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs'
import { InstanceStatus } from '../components/new-instance-dialog/new-instance-dialog-enum';
import { DashboardDataService } from '../services/dashboard-data.service';


export const handleError = ({ error, status }: HttpErrorResponse) => {
    if (status == 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.log('An error occurred.');
    } else {
        // The backend returned an unsuccessful response code.
        console.log(`Backend returned code ${status}, body was: `, error.message);
    }
    return throwError(() => { });
}
