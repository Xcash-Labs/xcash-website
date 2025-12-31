import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'xcash',
  standalone: true
})
export class XcashCurrencyPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number, args?: any): string {
    const formatted = this.decimalPipe.transform(value, args);
    return (formatted ?? '') + ' XCASH';
  }
}