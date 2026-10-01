import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Router } from '@angular/router';
import { ConstantsService } from '../services/constants.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class HeaderComponent {
  constructor(
    private constantsService: ConstantsService,
    private router: Router
  ) {}

  goHome() {
    this.closeNavbar();
    this.router.navigateByUrl(' ');
  }

  goDownloads() {
    this.closeNavbar();
    this.router.navigateByUrl('/downloads');
  }

  goDelegates() {
    this.closeNavbar();
    this.router.navigateByUrl('/delegates');
  }

  goMigration() {
    this.closeNavbar();
    this.router.navigateByUrl('/migration');
  }

  title = 'xcash';
  versionInfo: string = '';
  isActive: boolean = false;

  async ngOnInit(): Promise<void> {
    this.versionInfo = this.constantsService.delegatesVersionInfo;
  }

  toggleNavbar() {
    this.isActive = !this.isActive;
  }

  closeNavbar() {
    this.isActive = false;
  }
}
