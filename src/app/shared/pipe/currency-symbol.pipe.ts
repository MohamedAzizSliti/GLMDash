import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SettingState } from '../state/setting.state';
import { Values } from '../interface/setting.interface';

@Pipe({
  name: 'currencySymbol'
})
export class CurrencySymbolPipe implements PipeTransform {

  @Select(SettingState.setting) setting$: Observable<Values>;

  public symbol: string = '$';
  public setting: Values;

  constructor(private currencyPipe: CurrencyPipe) {
    this.setting$.subscribe(setting => this.setting = setting);
  }

  transform(value: number, position: 'before_price' | 'after_price' | string = 'before_price'): string {
    
    value = Number(value);

    value = value * this.setting?.general?.default_currency?.exchange_rate!;
    
    this.symbol = this.setting?.general?.default_currency?.symbol || this.symbol;
    position = this.setting?.general?.default_currency?.symbol_position || position;
     console.log('------this.currencyPipe-------');
     console.log(this.currencyPipe);
    let formattedValue = this.currencyPipe ? this.currencyPipe?.transform(value?.toFixed(2), this.symbol) :"";
    formattedValue = formattedValue?.replace(this.symbol, '')!;
    
    if (position === 'before_price') {
      return `${this.symbol}${formattedValue}`;
    } else {
      return `${formattedValue}${this.symbol}`;
    }
  }
}
