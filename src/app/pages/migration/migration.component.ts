import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faPaste } from '@fortawesome/free-solid-svg-icons';
import { ValidatorsRegexService } from 'src/app/services/validators-regex.service';
import { ConstantsService } from 'src/app/services/constants.service';
import { XcashCurrencyPipe } from 'src/app/pipes/xcash-currency.pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XcashDelegatesService } from 'src/app/services/xcash-delegates.service';

@Component({
  selector: 'app-migration',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent,  XcashCurrencyPipe],
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.sass']
})
export class MigrationComponent implements OnInit {

  @Output() onClose = new EventEmitter<{}>();

  constructor(
    private validatorsRegexService: ValidatorsRegexService,
    private constantsService: ConstantsService,
    private xcashDelegatesService: XcashDelegatesService
  ) {}

  faPaste = faPaste;

  rpAddress: string = '';
  rpSignature: string = '';

  dataCk: string = '';
  addressCk: string = '';
  rpCk: string = '';
  messageLength: number = 0;

  message: string = '';
  messageType: string = 'is-danger';
  showSpinner: boolean = false;

  totalAmt: string = '';
  hideAmounts: boolean = true;

  ngOnInit(): void {
    this.dataCk = this.validatorsRegexService.message_settings;
    this.addressCk = this.validatorsRegexService.xcash_address;
    this.rpCk = this.validatorsRegexService.reserve_proof;
    this.messageLength = this.constantsService.message_settings_length;
  }

  cancelVerify(): void {
    this.onClose.emit({});
  }

  async selectVerify(event: Event): Promise<void> {
    event.preventDefault();
    this.showSpinner = true;
    this.hideAmounts = true;
    this.message = '';

    const response = await this.xcashDelegatesService.proveAddress(
      this.rpAddress,
      this.rpSignature
    );

    if (response.status) {
      const data = response.data;
      if (data && typeof data.amount === 'number') {
        const atomic = data.amount;
        const human = atomic / this.constantsService.xcash_decimal_places;
        if (human == 0) {
          this.messageType = 'is-danger';
          this.message = 'Reserve Proof is 0, nothing to transfer.';
        } else if (atomic == -1) {
          this.messageType = 'is-danger';
          this.message = 'Reserve Proof has verified and transfered.';
        } else {
          this.totalAmt = human.toString();
          this.hideAmounts = false;
          this.messageType = 'is-success';
          this.message = 'Reserve proof has already been verified and Transfered successfully.';
        }
      } else {
        this.messageType = 'is-danger';
        this.message = 'Unexpected response format.';
      }
    } else {
      this.messageType = 'is-danger';
      this.message = response.message || 'Failed to verify reserve proof.';
    }

    this.showSpinner = false;
  }

  showMessage(message: string): void {
    this.rpAddress = '';
    this.rpSignature = '';
    this.hideAmounts = true;
    this.message = message;
  }

  async onPaste(event: Event, infield: string): Promise<void> {
    event.preventDefault();
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (infield === 'addr') {
        this.rpAddress = clipboardText;
      } else {
        this.rpSignature = clipboardText;
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  }
}