/**
 * Adapted from:
 * https://webcake.co/object-properties-in-angular-2s-ngfor/
 * (Thanks!)
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appValues'
})
export class ValuesPipe implements PipeTransform {

  transform(value: any): Object[] {
    let keyArr: any[] = Object.keys(value);
    let dataArr = [];

    keyArr.forEach((key: any) => {
      let temp = {
        value: value[key],
        key: key
      };
      dataArr.push(temp);
    });
    return dataArr;
  }

}
