import { Routes } from '@angular/router';
import { XCashDetailsComponent } from './pages/xcash-details/xcash-details.component';
import { DownloadsComponent } from './pages/downloads/downloads.component';
import { DelegatesComponent } from './pages/delegates/delegates.component';

export const routes: Routes = [
  { path: '', component: XCashDetailsComponent },
  { path: 'downloads', component: DownloadsComponent },
  { path: 'delegates', component: DelegatesComponent },
  { path: '**', redirectTo: '' }
];