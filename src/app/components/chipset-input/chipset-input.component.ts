import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/modules/material.module';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as Icons from 'src/app/icons/icons';

@Component({
  selector: 'app-chipset-input',
  standalone: true,
  imports: [CommonModule, MaterialModule,ReactiveFormsModule,FormsModule],
  templateUrl: './chipset-input.component.html',
  styleUrls: ['./chipset-input.component.css']
})
export class ChipsetInputComponent implements OnInit, OnChanges{

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  vulnerable_applications: string[] = [];
  apiChipsCtrl = new FormControl<string[]>([]);
  filteredAPIs: string[]
  allAPIChips: string[] = ['Hackazon', 'Crapi'];
  
  @ViewChild('apiChipsInput') apiChipsInput: ElementRef<HTMLInputElement> = {} as ElementRef;
  @ViewChild('autoCompletePanel') autoCompletePanel: MatAutocomplete = {} as MatAutocomplete;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() required: boolean = false;
  @Input() inputValue: string = "";
  @Input() disable: boolean = false;

  chipsetValidator = chipsValidator();
  closeIcon: SafeHtml

  constructor(private sanitizer: DomSanitizer) {
    this.closeIcon = sanitizer.bypassSecurityTrustHtml(Icons.close)
    this.filteredAPIs = this.allAPIChips;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['required']) {
      if (changes['required'].currentValue) {
        this.parentForm.get('vulnerable_applications')?.addValidators(this.chipsetValidator);
        this.parentForm.get('vulnerable_applications')?.updateValueAndValidity();
      }
      else {
        this.parentForm.get('vulnerable_applications')?.removeValidators(this.chipsetValidator);
        this.parentForm.get('vulnerable_applications')?.updateValueAndValidity();
      }
    }
  }

  ngOnInit(): void {
    this.parentForm.addControl('vulnerable_applications', this.apiChipsCtrl)
  }

  remove(api: string): void {
    const index = this.vulnerable_applications.indexOf(api);
    const formControlIndex = this.apiChipsCtrl.value?.indexOf(api);
    this.allAPIChips.push(this.vulnerable_applications[index]);
    this.filteredAPIs = this.allAPIChips;

    if (index >= 0) {
      this.vulnerable_applications.splice(index, 1);
    }
    if (formControlIndex != undefined && formControlIndex >= 0 && this.apiChipsCtrl.value ) {
      this.apiChipsCtrl.setValue(this.apiChipsCtrl.value.filter(apiName => apiName !== api));
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.vulnerable_applications.push(event.option.viewValue);
    this.apiChipsInput.nativeElement.value = '';
    this.allAPIChips = this.allAPIChips.filter(api => api !== event.option.viewValue);
    this.filteredAPIs = this.allAPIChips;
    if (this.apiChipsCtrl.value) {
      this.apiChipsCtrl.setValue([...this.apiChipsCtrl.value, event.option.viewValue]);
    }
    else {
      this.apiChipsCtrl.setValue([event.option.viewValue]);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allAPIChips.filter(apiChips => apiChips.toLowerCase().includes(filterValue));
  }

  onChipInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.filteredAPIs = this._filter(input);
  }

  get apisInput() {
    return this.apiChipsCtrl.value && this.apiChipsCtrl.value.join(', ');
  }

}

export function chipsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value.length > 0 ? null : {chipsetValidationError: 'required'};
  };
}