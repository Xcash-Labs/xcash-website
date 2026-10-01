import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-downloads',
  standalone: true,
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.sass'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FontAwesomeModule],
})
export class DownloadsComponent {
  constructor() {}
}
