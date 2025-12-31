import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { httpReturn } from 'src/app/models/http-Return';
import { faUserPlus, faCircleInfo, faServer, faCheckToSlot, faMoneyBill, faCopy } from '@fortawesome/free-solid-svg-icons';
import { LoadconfigService } from 'src/app/services/loadconfig.service';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-delegate-details',
  standalone: true,
  templateUrl: './xcash-details.component.html',
  styleUrls: ['./xcash-details.component.sass'],
  imports: [
    CommonModule,
    FormsModule,
    NgxTippyModule,
    FontAwesomeModule 
  ]
})
export class XCashDetailsComponent {
  constructor(
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