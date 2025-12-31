import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsRegexService {
  public readonly xcash_address: string = '';
  public readonly xcash_only_address: string = '';
  public readonly text_settings: string = '';
  public readonly payment_id: string = '';
  public readonly xcash_amount: string = '';
  public readonly password_format: string = '';
  public readonly mnemonic_seed: string = '';
  public readonly private_key: string = '';
  public readonly encrypted_payment_id: string = '';
  public readonly signature: string = '';
  public readonly xcash_reserve_proof_amount: string = '';
  public readonly reserve_proof: string = '';
  public readonly message_settings: string = '';
  public readonly delegate_name: string = '';
  public readonly text_name: string = '';
  
  constructor(private constantsService: ConstantsService) {
    this.xcash_address = `^(${this.constantsService.xcash_public_address_prefix}[a-zA-Z0-9]{${this.constantsService.xcash_public_address_length_settings}}|${this.constantsService.xcash_integrated_address_prefix}[a-zA-Z0-9]{${this.constantsService.xcash_integrated_address_length_settings}}|${this.constantsService.xcash_sub_address_prefix}[a-zA-Z0-9]{${this.constantsService.xcash_sub_address_length_settings}})$`;
    this.xcash_only_address = `^(${this.constantsService.xcash_public_address_prefix}[a-zA-Z0-9]{${this.constantsService.xcash_public_address_length_settings}})$`;
    this.text_settings = `^[a-zA-Z0-9]{${this.constantsService.text_settings_minlength},${this.constantsService.text_settings_length}}$`;
    this.text_name = `^[a-zA-Z0-9 ]{${this.constantsService.text_settings_minlength},${this.constantsService.text_settings_length}}$`;
    this.xcash_amount = `\\b(^[0-9]{1,11}.[0-9]{0,5}[1-9]{1}$|^[1-9]{1}[0-9]{0,10}$|${this.constantsService.xcash_total_supply})\\b$`;
    this.xcash_reserve_proof_amount = `\\b(^[0-9]{1,11}.[0-9]{0,5}[1-9]{1}$|^[1-9]{1}[0-9]{0,10}$|${this.constantsService.xcash_total_supply}|^ALL$)\\b$`;
    this.reserve_proof = `^ReserveProofV1[a-zA-Z0-9]+$`;
    this.message_settings = `^([a-zA-Z0-9 ]{1,${this.constantsService.message_settings_length}})$`;
    this.delegate_name = `^[a-zA-Z0-9._-]+$`;
  }
}