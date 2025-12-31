import { Routes } from '@angular/router';
import { XCashDetailsComponent } from './pages/xcash-details/xcash-details.component';
import { DownloadsComponent } from './pages/downloads/downloads.component';
import { MigrationComponent } from './pages/migration/migration.component';

export const routes: Routes = [
  { path: '', component: XCashDetailsComponent },
  { path: 'downloads', component: DownloadsComponent },
  { path: 'migration', component: MigrationComponent },
  { path: '**', redirectTo: '' }
];