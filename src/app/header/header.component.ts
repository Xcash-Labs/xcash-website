import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConstantsService } from '../services/constants.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
  imports: [
    CommonModule
    // Add more here if the template needs them later
    // e.g. RouterModule, FontAwesomeModule, etc.
  ]
})
export class HeaderComponent {

  constructor(private constantsService: ConstantsService,
    private router: Router
  ) { }

  goHome() {
    this.closeNavbar();
    this.router.navigateByUrl(' ');
  }

  goDownloads() {
    this.closeNavbar();
    this.router.navigateByUrl('/downloads');
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