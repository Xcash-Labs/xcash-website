import { Component, EventEmitter, Input, Output, SimpleChanges, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XcashVotersService } from 'src/app/services/xcash-voters.service';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
declare const $: any;

@Component({
  selector: 'app-voters',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './voters.component.html',
})
export class VotersComponent implements OnDestroy {
  @Input() delegate: any;
  @Output() close = new EventEmitter<void>();
  faCopy = faCopy;
  loading = false;
  error = '';
  copied = '';
  Voters: any[] = [];

  constructor(private votersSvc: XcashVotersService) { }

  @ViewChild('table', { static: false }) table!: ElementRef;
  private dt: any = null;

  private initOrRefreshDT(): void {
    if (!this.table?.nativeElement) return;

    // destroy if already initialized
    if ($.fn.DataTable.isDataTable(this.table.nativeElement)) {
      $(this.table.nativeElement).DataTable().destroy();
    }

    // init
    this.dt = $(this.table.nativeElement).DataTable({
      lengthMenu: [7, 25, 50, 100],
      pageLength: 7,
      order: [[1, 'desc']], // optional: sort by Total Votes desc
      // optional empty message (since we moved empty state outside table)
      language: { emptyTable: 'No voters found' },
    });
  }

  private destroyDT(): void {
    if (this.table?.nativeElement && $.fn.DataTable.isDataTable(this.table.nativeElement)) {
      $(this.table.nativeElement).DataTable().destroy();
    }
    this.dt = null;
  }

  ngOnDestroy(): void {
    this.destroyDT();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['delegate'] && this.delegate) {
      await this.loadDelegates();
    }
  }

  async loadDelegates(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.Voters = [];

    const delegateName = this.delegate?.delegateName;
    console.log('[VotersComponent] delegate input:', this.delegate);
    console.log('[VotersComponent] delegateName:', delegateName);

    if (!delegateName) {
      this.error = 'Missing delegate name (delegateName).';
      this.loading = false;
      return;
    }

    try {
      const res: any = await this.votersSvc.getDelegateVoters(delegateName);
      console.log('[VotersComponent] API response:', res);

      // Case A: service returns raw API: { status:"success", voters:[...] }
      if (res?.status === 'success') {
        this.Voters = Array.isArray(res?.voters) ? res.voters : [];
        setTimeout(() => this.initOrRefreshDT(), 0);
        return;
      }

      // Case B: service wraps: { status:true, data:"{...json...}" } or data is already an object
      if (res?.status === true) {
        const dataObj = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        this.Voters = Array.isArray(dataObj?.voters) ? dataObj.voters : [];
        setTimeout(() => this.initOrRefreshDT(), 0);
        if (!this.Voters.length) this.error = 'No voters returned.';
        return;
      }

      // Otherwise show an error
      this.error = res?.message || 'Failed to load voters.';
      this.Voters = [];
      this.destroyDT();
    } catch (e: any) {
      console.error('[VotersComponent] loadDelegates error:', e);
      this.error = 'Unexpected error loading voters.';
      this.Voters = [];
      this.destroyDT();
    } finally {
      this.loading = false;
    }
  }

  onClose() {
    this.destroyDT();
    this.close.emit();
  }

  shortAddr(addr: string, head = 12, tail = 8): string {
    if (!addr) return '';
    if (addr.length <= head + tail + 3) return addr;
    return `${addr.slice(0, head)}...${addr.slice(-tail)}`;
  }

  copy(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
  }
}