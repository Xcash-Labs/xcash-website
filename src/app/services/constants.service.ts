import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConstantsService {
  public readonly xcash_public_address_length : number = 98;
  public readonly xcash_sub_address_length : number = 95;
  public readonly xcash_sub_address_prefix : string = "8";
  public readonly xcash_integrated_address_length : number = 110;
  public readonly xcash_public_address_prefix : string = 'XCA';
  public readonly xcash_integrated_address_prefix : string = "XCB";
  public readonly xcash_integrated_address_length_settings : number = this.xcash_integrated_address_length - this.xcash_integrated_address_prefix.length;
  public readonly xcash_sub_address_length_settings : number = this.xcash_sub_address_length - this.xcash_sub_address_prefix.length;
  public readonly delegatesVersionInfo: string = '1.0.0';
  public readonly xcash_decimal_places = 1000000;
  public readonly message_settings_length: number = 128;
  public readonly xcash_total_supply : number = 100000000000;
  public readonly text_settings_minlength:number = 4;
  public readonly xcash_public_address_length_settings : number = this.xcash_public_address_length - this.xcash_public_address_prefix.length;
  public readonly text_settings_length : number = 30;
}