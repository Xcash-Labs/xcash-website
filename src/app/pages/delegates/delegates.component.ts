import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XcashDelegatesService } from 'src/app/services/xcash-delegates.service';

@Component({
  selector: 'app-delegates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delegates.component.html',
  styleUrl: './delegates.component.sass'
})
export class DelegatesComponent implements OnInit {
  loading = false;
  error = '';
  delegates: any[] = [];

  constructor(private delegatesSvc: XcashDelegatesService) {}

  private readonly SEED_LOCATIONS: Record<string, string> = {
    seeds_xcashseeds_us: 'North America',
    seeds_xcashseeds_uk: 'Europe',
    seeds_xcashseeds_cc: 'Asia',
    seeds_xcashseeds_me: 'South America'
  };

  // Returns location only for seeds; empty string otherwise
  seedLocation(d: any): string {
    if (!d || d.DelegateType !== 'seed') return '';
    return this.SEED_LOCATIONS[d.delegateName] || '';
  }

  async ngOnInit(): Promise<void> {
    await this.loadDelegates();
  }

  async loadDelegates(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      // Service now calls the fixed /registered/ endpoint internally
      const res = await this.delegatesSvc.getRegisteredDelegates();

      if (!res.status) {
        this.error = res.message || 'Failed to load delegates.';
        this.delegates = [];
        return;
      }

      const raw = (res.data ?? '').toString().trim();

      // Expect JSON array string: [...]
      if (!raw.startsWith('[')) {
        this.error = raw || 'Unexpected response from API.';
        this.delegates = [];
        return;
      }

      this.delegates = JSON.parse(raw);
    } catch (e: any) {
      console.error('[DelegatesComponent] loadDelegates error:', e);
      this.error = 'Unexpected error loading delegates.';
      this.delegates = [];
    } finally {
      this.loading = false;
    }
  }
}