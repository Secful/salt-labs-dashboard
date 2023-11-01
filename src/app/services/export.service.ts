import { Injectable } from '@angular/core';
import { ILab } from '../interfaces/lab.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CopySnackbarComponent } from '../components/copy-snackbar/copy-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private _snackBar: MatSnackBar) { }

  private formatText(lab: ILab) {
    const labDetails = this.getInstanceDetails(lab);
    const formattedText = labDetails.map(detail => {
      const detailList = detail.list.map(detailListItem => `${detailListItem.title}: ${detailListItem.value}`).join('\r\n');
      return `${detail.title}\r\n\r\n${detailList}`;
    }).join('\r\n\r\n-------------------------\r\n\r\n');

    return formattedText;
  }

  downloadInstanceDetails(lab: ILab, labName: string) {
    const formattedText = this.formatText(lab);
    var data = new Blob([formattedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(data);
    const ancher = document.createElement("a");
    ancher.href = url;
    ancher.download = `${labName} Details`;
    ancher.click();
  }

  copyInstanceDetails(lab: ILab) {
    const formattedText = this.formatText(lab);
    navigator.clipboard.writeText(formattedText);
    this._snackBar.openFromComponent(CopySnackbarComponent, {
      duration: 1500,
    });
  }

  private getInstanceDetails(lab: ILab) {
    return [
      {
        title: 'Vulnerable Applications',
        list: lab.vulnerable_applications.map(applications => ({ title: applications.name, value: applications.url }))
      },
      {
        title: 'Salt Lab Login',
        list: [
          {
            title: 'Username',
            value: lab.salt_login_details.username
          },
          {
            title: 'Password',
            value: lab.salt_login_details.password
          }
        ]
      },
      {
        title: 'AWS Console Login',
        list: [
          {
            title: 'URL',
            value: lab.aws_console_login.url
          },
          {
            title: 'Username',
            value: lab.aws_console_login.username
          },
          {
            title: 'Password',
            value: lab.aws_console_login.password
          }
        ]
      }
    ]
  }

}

