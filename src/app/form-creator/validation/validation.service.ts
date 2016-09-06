import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class ValidationService {

  static errorMessages = {
    required: 'This field is required',
    invalidEmailAddress: 'It doesn\'t look like that\'s a valid email',
    notEquivalent: 'Passwords should match',
    minlength: 'Should have at least 10 characters',
    maxlength: 'Shouldn\'t have more than 120 characters',
    needsLowercase: 'Should have a lower case letter',
    needsUppercase: 'Should have a upper case letter',
    needsNumber: 'Should have a number',
    needsSpecial: 'Should have one of these special characters: '
      + '- ! @ ^ " § $ % & / ( ) = ? + * ~ # \' _ : . , ;',
    invalidDate: 'Should have a valid date',
    needsFutureDate: 'Should have a future date',
    earlyDate: 'Make sure your event ends after it starts'
  };

  static validDate(control) {
    if (control.value.length === 0) { return null; }
    if (moment( control.value, 'M/D/YYYY' ).isValid()
      || moment( control.value, 'YYYY-MM-DD' ).isValid() ) {
      return null;
    } else {
      return { 'invalidDate': true };
    }
  }

  static futureDate(control) {
    if (control.value.length === 0) { return null; }
    let after = moment().subtract(1, 'day');
    let thisMoment;
    if (moment( control.value, 'M/D/YYYY' ).isValid()) {
      thisMoment = moment( control.value, 'M/D/YYYY' );
    } else if (moment( control.value, 'YYYY-MM-DD' ).isValid()) {
      thisMoment = moment( control.value, 'YYYY-MM-DD' );
    } else {
      return { 'needsFutureDate': true };
    }
    if ( thisMoment.isAfter(after) ) {
      return null;
    } else {
      return { 'needsFutureDate': true };
    }
  }

  // Thanks!: http://mlitzinger.com/articles/password-validator-js/ 

  static oneLowercase(control) {
    let regex = /^(?=.*[a-z]).+$/;
    if ( regex.test(control.value) ) {
      return null;
    } else {
      return { 'needsLowercase': true };
    }
  }

  static oneUppercase(control) {
    let regex = /^(?=.*[A-Z]).+$/;
    if ( regex.test(control.value) ) {
      return null;
    } else {
      return { 'needsUppercase': true };
    }
  }

  static oneNumber(control) {
    let regex = /\d/;
    if ( regex.test(control.value) ) {
      return null;
    } else {
      return { 'needsNumber': true };
    }
  }

  static oneSpecial(control) {
    let regex = /[-!@^"§$%&/()=?+*~#'_:.,;]/;
    if ( regex.test(control.value) ) {
      return null;
    } else {
      return { 'needsSpecial': true };
    }
  }

  static matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true});
      }
    };
  }

  static validDates(dateInfo) {
    return (group) => {
      let d1 = group.controls[dateInfo.d1];
      let t1 = group.controls[dateInfo.t1];
      let d2 = group.controls[dateInfo.d2];
      let t2 = group.controls[dateInfo.t2];
      if (d1.value === '' || t1.value === ''
        || d2.value === '' || t2.value === '') {
        return null;
      }
      let startString = d1.value + ' ' + t1.value;
      let endString = d2.value + ' ' + t2.value;

      let start = moment( startString, 'M/D/YYYY h:mma' );
      let end = moment( endString, 'M/D/YYYY h:mma' );

      if (!start.isValid() || !end.isValid()) {
        start = moment( startString, 'YYYY-MM-DD h:mma' );
        end = moment( endString, 'YYYY-MM-DD h:mma' );
      }
      if (!start.isValid() || !end.isValid()) { return null; }

      if (end.isSameOrBefore( start )) {
        return group.controls[dateInfo.d2].setErrors({earlyDate: true});
      }
      return group.controls[dateInfo.d2].setErrors(null);
    };
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    /* tslint:disable */ if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) { /* tslint:enable */
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

}
