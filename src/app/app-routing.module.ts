import { Routes } from '@angular/router';
import { XCashDetailsComponent } from './pages/xcash-details/xcash-details.component';
import { DownloadsComponent } from './pages/downloads/downloads.component';

export const routes: Routes = [
  { path: '', component: XCashDetailsComponent },
  { path: 'downloads', component: DownloadsComponent },
  { path: '**', redirectTo: '' }
];