import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appPhone'
})
export class PhonePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === null) { return; }
    return value.replace(/\D/g, '');
  }

}
