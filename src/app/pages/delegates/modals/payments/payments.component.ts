import { Component, EventEmitter, Input, Output, SimpleChanges, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XcashPaymentsService } from 'src/app/services/xcash-payments.service';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
declare const $: any;

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.sass'
})
export class PaymentsComponent implements OnDestroy {
  @Input() delegate: any;
  @Output() close = new EventEmitter<void>();
  faCopy = faCopy;
  loading = false;
  error = '';
  copied = '';
  days = 7;
  Payments: any[] = [];

  constructor(private paymentsSvc: XcashPaymentsService) { }

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
      language: { emptyTable: 'No payments found' },
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
    this.Payments = [];

    const IPAddress = this.delegate?.IPAddress;
    if (!IPAddress) {
      this.error = 'Missing delegate IP address (IPAddress).';
      this.loading = false;
      return;
    }

    try {
      const res: any = await this.paymentsSvc.getDelegatePayments(IPAddress);
      console.log('[PaymentsComponent] API response:', res);

      // Normalize payload into the actual data object that contains payout_receipts
      let payload: any = null;

      // Case A: raw API
      //   { status:"success", payout_receipts:[...] }
      if (res?.status === 'success') {
        payload = res;
      }

      // Case B: wrapped service
      //   { status:true, data:"{...json...}" } OR data is already an object
      else if (res?.status === true) {
        payload = typeof res?.data === 'string' ? JSON.parse(res.data) : res.data;
      }

      // Unknown shape
      else {
        this.error = res?.message || res?.error || 'Failed to load payments.';
        this.Payments = [];
        this.destroyDT();
        return;
      }

      // Save days for the modal title (works for both raw + wrapped)
      this.days = Number(payload?.days ?? 7);

      // Your real array field is payout_receipts (NOT payments)
      this.Payments = Array.isArray(payload?.payout_receipts) ? payload.payout_receipts : [];

      if (!this.Payments.length) {
        this.error = 'No payments returned.';
        this.destroyDT();
        return;
      }

      // Rebuild the DataTable after DOM updates
      setTimeout(() => this.initOrRefreshDT(), 0);
    } catch (e: any) {
      console.error('[PaymentsComponent] loadDelegates error:', e);
      this.error = e?.message || 'Unexpected error loading payments.';
      this.Payments = [];
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