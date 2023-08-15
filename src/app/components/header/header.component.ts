import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { saltIcon } from 'src/app/icons/icons'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() pageTitle: string = "";

  saltIcon: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.saltIcon = sanitizer.bypassSecurityTrustHtml(saltIcon);
  }

}
