/* 
 * This componenet takes an object of
 * form information and creates a form.
 */
import {
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Renderer,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ValidationService } from '../validation/validation.service';

import { Validators } from '@angular/forms';
declare var google: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-form',
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.scss']
})
export class FormComponent implements OnInit {
  @Input() modeInit;
  @Input() allFormInfo;
  @Input() tabIndex;
  @Input() formErrorMessage: string;
  @Input() formComponentId: string;
  @Output() currentFocus = new EventEmitter();
  @Output() special = new EventEmitter();
  @Output() formComplete = new EventEmitter();
  public mode;
  public formInfo;
  public active: boolean = true;
  public registerForm: any;
  public focusTimeout;
  public addListenerQueue = {};
  public errorMessages = {};
  public selectData = {
    time: [
      '12:00am', '12:30am', '1:00am', '1:30am', '2:00am', '2:30am',
      '3:00am', '3:30am', '4:00am', '4:30am', '5:00am', '5:30am',
      '6:00am', '6:30am', '7:00am', '7:30am', '8:00am', '8:30am',
      '9:00am', '9:30pm', '10:00am', '10:30pm', '11:00am', '11:30pm',
      '12:00pm', '12:30pm', '1:00pm', '1:30pm', '2:00pm', '2:30pm',
      '3:00pm', '3:30pm', '4:00pm', '4:30pm', '5:00pm', '5:30pm',
      '6:00pm', '6:30pm', '7:00pm', '7:30pm', '8:00pm', '8:30pm',
      '9:00pm', '9:30pm', '10:00pm', '10:30pm', '11:00pm', '11:30pm'
    ]
  };
  // Non-exhaustive autocomplete mapping (lowercase)
  public autocompleteMap = {
    'name': 'name',
    'first name': 'given-name',
    'last name': 'family-name',
    'email': 'email',
    'street': 'street-address',
    'city': 'address-level2',
    'state': 'address-level1',
    'postal code': 'postal-code',
    'zip': 'postal-code',
    'country': 'country',
    'birthday': 'bday'
  };
  public inputTypes = ['input', 'select', 'textarea'];
  public otherTypes = ['option', 'submit', 'special', 'instructions'];

  constructor(
    private renderer: Renderer,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.setFormComponenetId();
    this.mode = this.modeInit;
    this.formInfo = this.allFormInfo[this.mode];
    this.sortInput();
    this.errorMessages = ValidationService.errorMessages;
  }

  public reset(): Promise<string> {
    // Angular 2 workaround (as of 2.0.0-rc.4)
    // https://angular.io/docs/ts/latest/guide/forms.html
    this.active = false;
    this.sortInput();
    return new Promise( resolve => {
      setTimeout( () => {
        this.active = true;
        // Wait for digest cycle to apply active
        setTimeout(resolve, 0);
      }, 0);
    });
  }

  public itemInObject(item, object): boolean {
    return item in object;
  }

  public onSpecial(event) {
    if (event.action === 'switch') {
      this.switchModes(event.newForm);
    } else {
      this.special.emit(event);
    }
  }

  public showFieldErrors(field): boolean {
    if (!this.registerForm.pristine
      && (this.registerForm.controls[field.id].touched
        || (field.inputType === 'file' && !this.registerForm.controls[field.id].pristine))
      && this.registerForm.controls[field.id].errors
      && (field.passwordType !== 'password' || field.focused === false)) {
      return true;
    }
  }

  public setFocus(delay: number): void {
    let throutleDelay = 500;
    if (delay < throutleDelay) { delay = throutleDelay; }
    clearTimeout(this.focusTimeout);
    this.focusTimeout = setTimeout( () => { // wait for animation if needed
      let focused = false;
      for (let i = 0; i < this.formInfo.fields.length; i++) {
        let thisId = this.formInfo.fields[i].id;
        if (
          // make sure focused wasn't called earlier in the loop
          !focused &&
          // check if the input is currently visible
          this.formInfo.fields[i].show &&
          // check if the input is empty
          this.formInfo.fields[i].length === 0 &&
          // make sure the input exists
          document.getElementById( thisId ) !== null) {
          // call focus using Angular 2's renderer
          this.renderer.invokeElementMethod(
            document.getElementById( thisId ), 'focus', []);
          focused = true;
        }
      }
    }, delay);
  }

  public showGroup(groupName): void {
    for (let i = 0; i < this.formInfo.fields.length; i++) {
      if (this.formInfo.fields[i].group === groupName) {
        this.formInfo.fields[i].show = true;
      }
    }
    this.setFocus(0);
  }

  public onPlaceAutocomplete(event, id: string, index: number) {
    let preInputId: string = this.formComponentId + '-id-';
    let preInputIdLength: number = preInputId.length;
    let inputId: number = Number( id.substr(preInputIdLength) );
    // Reference object - for improved readability
    let ref = {
      street: {
        id: id,
        index: index
      },
      city: {
        id: preInputId + (inputId + 1),
        index: index + 1
      },
      zip: {
        id: preInputId + (inputId + 2),
        index: index + 2
      },
      country: {
        id: preInputId + (inputId + 3),
        index: index + 3
      },
    };
    // Default address object
    let address = {
      street: '',
      streetNumber: '',
      streetName: '',
      city: '',
      zip: '',
      country: ''
    };
    for (let i = 0; i < event.address_components.length; i++) {
      let type = event.address_components[i].types[0];
      if (type === 'street_number') { // Street number
        address.streetNumber = event.address_components[i].short_name;
      } else if (type === 'route') { // Street name
        address.streetName = event.address_components[i].short_name;
      } else if (type === 'locality') { // City
        address.city = event.address_components[i].short_name;
        this.formInfo.fields[ ref.city.index ].length = address.city.length;
        this.registerForm.controls[ ref.city.id ].updateValue( address.city );
      } else if (type === 'postal_code') { // Zip
        address.zip = event.address_components[i].short_name;
        this.formInfo.fields[ ref.zip.index ].length = address.zip.length;
        this.registerForm.controls[ ref.zip.id ].updateValue( address.zip );
      } else if (type === 'country') { // Country
        address.country = event.address_components[i].short_name;
        this.formInfo.fields[ ref.country.index ].length = address.country.length;
        this.registerForm.controls[ ref.country.id ].updateValue( address.country );
      }
    }
    // Format street
    if (address.streetNumber.length > 0 && address.streetName.length > 0) {
      address.street = address.streetNumber + ' ' + address.streetName;
    } else if (address.streetNumber.length > 0 ) {
      address.street = address.streetNumber;
    } else if (address.streetName.length > 0 ) {
      address.street = address.streetName;
    }
    // Set street
    this.formInfo.fields[ ref.street.index ].length = address.street.length;
    this.registerForm.controls[ ref.street.id ].updateValue( address.street );
    // Update DOM - http://stackoverflow.com/a/34829089/5357459
    this.ref.detectChanges();
  }

  public onInput(event, type): number {
    if (type === 'select') {
      return event.length;
    } else {
      return event.target.value.length;
    }
  }

  public getSelectData(selectType): Array<string> { // ng-select
    if (selectType in this.selectData) {
      return this.selectData[selectType];
    }
  }

  public isAnInputType(type): boolean {
    return this.inputTypes.indexOf(type) !== -1;
  }

  public formSubmit() {
    if (this.registerForm.valid || true)  {
      let formValue = this.registerForm.value;
      let formOutput = {
        action: this.mode
      };
      let uniqueId = 1;
      let i = -1;
      for (let key in formValue) {
        if (formValue.hasOwnProperty(key)) {
           i++;
          if (this.isAnInputType(this.formInfo.fields[i].type) ) {
            let label = this.formInfo.fields[i].name;
            if (label in formOutput) {
              label += uniqueId++;
            }
            label = this.camelize(label);
            formOutput[label] = formValue[key];
          }
        }
      }
      this.formComplete.emit( formOutput );
    }
  }

  private switchModes(newForm) {
    this.mode = newForm;
    this.formInfo = this.allFormInfo[this.mode];
    this.currentFocus.emit(this.formInfo.title);
    this.formErrorMessage = null;
    this.reset().then(() => this.setFocus(0));
  }

  // This helps insure that there are unique input Ids
  // when there are multiple form components.
  private setFormComponenetId() {
    if (this.formComponentId === undefined) {
      this.formComponentId = 'form-' + Math.floor( Math.random() * 10000);
    }
  }

  private sortInput(): void {
    let inputId = 0;
    let fbGroup = {}; // Form builder group object
    let passwordId, confirmPasswordId;
    let dateGroup = { d1: null, t1: null, d2: null, t2: null };
    let allowedTypes = [...this.inputTypes, ...this.otherTypes];
    for (let i = 0; i < this.formInfo.fields.length; i++) {
      // Check type
      if (allowedTypes.indexOf(this.formInfo.fields[i].type) !== -1) {
        // Create unique id
        inputId++;
        let idString = this.formComponentId + '-id-' + inputId;
        // Get group
        let group = null;
        if ('group' in this.formInfo.fields[i]) { group = this.formInfo.fields[i].group; }
        // Get default show
        let show = true;
        if (group !== null &&  this.formInfo.fields[i].type !== 'option') { show = false; }
        // Set field info
        this.formInfo.fields[i].id = idString;
        this.formInfo.fields[i].show = show;
        this.formInfo.fields[i].length = 0;
        /**
         * Aria label 
         * (if not present this will add an empty string
         *  so that it doesn't use 'undefined' or 'null')
         */
        if (!('ariaLabel' in this.formInfo.fields[i])) {
          this.formInfo.fields[i].ariaLabel = '';
        }
        // Autocomplete
        if (!('autocomplete' in this.formInfo.fields[i])) {
          this.formInfo.fields[i].autocomplete = '';
        }
        if ('name' in this.formInfo.fields[i]) {
          /**
           * Autocomplete mappings
           * If the name matches a name from the autocompleteMap
           */
          let lName: string = this.formInfo.fields[i].name.toLowerCase();
          if (lName in this.autocompleteMap) {
            this.formInfo.fields[i].autocomplete  = this.autocompleteMap[lName];
          }
          /**
           * Patterns - override mappings with patterns
           */
          if (this.nameInField(i, 'email')
            && this.nameInField(i + 1, 'password')) {
            if (!this.nameInField(i + 2, 'confirm password')) {
              // If sequence: email, password, and not confirm password,  
              // then it's a login form
              this.formInfo.fields[i].autocomplete  = 'username';
              this.formInfo.fields[i + 1].autocomplete = 'current-password';
            }
          } else if (this.nameInField(i, 'password')
            && this.nameInField(i + 1, 'confirm password')) {
            // If sequence: password, confirm password,
            // then it's a sign up form
            this.formInfo.fields[i].autocomplete  = 'new-password';
            this.formInfo.fields[i + 1].autocomplete = 'new-password';
          }
        }
        // Add Required Attribute
        if ('control' in this.formInfo.fields[i]) {
          this.formInfo.fields[i].required = this.isRequired( this.formInfo.fields[i].control[1] );
        }
        // Save password info
        if ('passwordType' in this.formInfo.fields[i]) {
          if (this.formInfo.fields[i].passwordType === 'password') { passwordId = idString; }
          if (this.formInfo.fields[i].passwordType === 'confirm') { confirmPasswordId = idString; }
        }
        // Save date validation info
        if ('dateGroup' in this.formInfo.fields[i]) {
          if (this.formInfo.fields[i].dateGroup === 'd1') { dateGroup.d1 = idString; }
          if (this.formInfo.fields[i].dateGroup === 't1') { dateGroup.t1 = idString; }
          if (this.formInfo.fields[i].dateGroup === 'd2') { dateGroup.d2 = idString; }
          if (this.formInfo.fields[i].dateGroup === 't2') { dateGroup.t2 = idString; }
        }
        // Add to form builder group object
        fbGroup[idString] = this.formInfo.fields[i].control;
      } else {
        // Warn if invalid type
        console.warn('Skipping invalid form field type "' + this.formInfo.fields[i].type + '"');
      }
    }
    // Add confirm password validation
    if (confirmPasswordId !== undefined) {
      // Form builder
      this.registerForm = this.formBuilder.group(fbGroup,
        {validator: ValidationService.matchingPasswords(passwordId, confirmPasswordId)});
    } else if (dateGroup.d1 !== null) {
      // Form builder
      this.registerForm = this.formBuilder.group(fbGroup,
        {validator: ValidationService.validDates(dateGroup)});
    } else {
      // Form builder
      this.registerForm = this.formBuilder.group(fbGroup);
    }
  }

  private isRequired(control): boolean {
    if (control === undefined) { return; }
    if (!this.isArray( control )) { control = [control]; }
    for (let i = 0; i < control.length; i++) {
      if (control[i] === Validators.required) { return true; }
    }
  }

  // http://stackoverflow.com/a/4775737/5357459
  private isArray(input: any): boolean {
    if( Object.prototype.toString.call( input ) === '[object Array]' ) {
      return true;
    }
  }

  private nameInField(index: number, name: string): boolean {
    if (index <= this.formInfo.fields.length
      && ('name' in this.formInfo.fields[index])
      && this.formInfo.fields[index].name.toLowerCase() === name) {
      return true;
    }
  }

  private camelize(str) { // http://stackoverflow.com/a/2970667/5357459
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

}
