import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { XcashDelegatesService } from 'src/app/services/xcash-delegates.service';
import { httpReturn } from 'src/app/models/http-Return';
import { faUserPlus, faCircleInfo, faServer, faCheckToSlot, faMoneyBill, faCopy } from '@fortawesome/free-solid-svg-icons';
import { LoadconfigService } from 'src/app/services/loadconfig.service';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-delegate-details',
  standalone: true,
  templateUrl: './delegate-details.component.html',
  styleUrls: ['./delegate-details.component.sass'],
  imports: [
    CommonModule,
    FormsModule,
    NgxTippyModule,
    FontAwesomeModule
  ]
})
export class DelegateDetailsComponent {
  constructor(
    private xcashdelegatesService: XcashDelegatesService,
    private loadconfigService: LoadconfigService
  ) { }

  faUserPlus = faUserPlus;
  faCircleInfo = faCircleInfo;
  faServer = faServer;
  faCheckToSlot = faCheckToSlot;
  faMoneyBill = faMoneyBill;
  faCopy = faCopy;
  showInfo: boolean = false;
  wcount: number = 0;
  message: string = '';
  about: string = '';
  team: string = '';
  onlinePercent: number = 0;
  specifications: string = '';
  fee: number = 0;
  delegateType: string = '';
  voteCmd1: string = '';
  voteCmd2: string = '';
  showSpinner: boolean = true;
  sharedDelegate: boolean = false;
  websiteURL: string = '';
  websiteName: string = '';
  online: string = '';
  texttype: string = '';
  tippyOptions = {
    trigger: 'click',
    hideOnClick: false,
    onShow: (instance: any) => {
      setTimeout(() => {
        instance.hide();
      }, 700);
    }
  };

  async ngOnInit() {
    this.websiteURL = window.location.hostname.toUpperCase();
    const config = this.loadconfigService.getConfig();
    this.websiteName = config.websiteName;

    if (this.websiteName) {
      const wsurl = 'https://api.xcash.live/v1/xcash/dpops/unauthorized/delegates/' + this.websiteName;
      const response: httpReturn = await this.xcashdelegatesService.getDelegates(wsurl);

      if (response.status) {
        this.about = response.data.about;
        this.team = response.data.team;
        this.specifications = response.data.specifications;
        this.onlinePercent = response.data.onlinePercentage;
        this.fee = response.data.fee;

        if (response.data.sharedDelegate) {
          this.delegateType = 'Shared Delegate';
          this.sharedDelegate = true;
        } else {
          this.delegateType = 'Solo Delegate';
        }

        // vote <delegates_public_address|delegates_name> <amount | "all">
        this.voteCmd1 = 'vote ' + response.data.delegateName + ' <amount | "all">';
        this.voteCmd2 = 'vote ' + response.data.publicAddress + ' <amount | "all">';

        if (response.data.online) {
          this.online = 'On-Line';
          this.texttype = 'has-text-success has-text-weight-semibold';
        } else {
          this.online = 'Off-Line';
          this.texttype = 'has-text-danger has-text-weight-semibold';
        }

        this.showInfo = true;
      } else {
        this.showMessage(response.message);
      }
    } else {
      this.showMessage('Update the weconfig.json with your delegate name.');
    }

    this.showSpinner = false;
  }

  showMessage(message: string): void {
    this.message = message;
  }

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value)
      .then(() => { })
      .catch(err => {
        this.showMessage('Failed to copy text: ' + err);
      });
  }
}