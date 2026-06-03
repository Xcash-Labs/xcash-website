import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { XcashPendingpaymentsService } from 'src/app/services/xcash-pendingpayments.service';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

declare const $: any;

@Component({
  selector: 'app-pendingpayments',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './pendingpayments.component.html',
  styleUrl: './pendingpayments.component.sass'
})
export class PendingpaymentsComponent implements OnDestroy {
  @Input() delegate: any;
  @Output() close = new EventEmitter<void>();

  faCopy = faCopy;

  loading = false;
  error = '';
  copied = '';

  PendingPayments: any[] = [];

  constructor(private pendingPaymentsSvc: XcashPendingpaymentsService) {}

  @ViewChild('table', { static: false }) table!: ElementRef;

  private dt: any = null;

  private initOrRefreshDT(): void {
    if (!this.table?.nativeElement) return;

    if ($.fn.DataTable.isDataTable(this.table.nativeElement)) {
      $(this.table.nativeElement).DataTable().destroy();
    }

    this.dt = $(this.table.nativeElement).DataTable({
      lengthMenu: [7, 25, 50, 100],
      pageLength: 7,
      order: [[2, 'desc']],
      language: { emptyTable: 'No pending payments found' },
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
      await this.loadPendingPayments();
    }
  }

  async loadPendingPayments(): Promise<void> {
    this.loading = true;
    this.error = '';
    this.PendingPayments = [];

    const IPAddress = this.delegate?.IPAddress;

    if (!IPAddress) {
      this.error = 'Missing delegate IP address (IPAddress).';
      this.loading = false;
      return;
    }

    try {
      const res: any =
        await this.pendingPaymentsSvc.getDelegatePendingPayments(IPAddress);

      console.log('[PendingpaymentsComponent] API response:', res);

      let payload: any = null;

      if (res?.status === 'success') {
        payload = res;
      } else if (res?.status === true) {
        payload = typeof res?.data === 'string' ? JSON.parse(res.data) : res.data;
      } else {
        this.error = res?.message || res?.error || 'Failed to load pending payments.';
        this.PendingPayments = [];
        this.destroyDT();
        return;
      }

      this.PendingPayments = Array.isArray(payload?.pending_payouts)
        ? payload.pending_payouts
        : [];

      if (!this.PendingPayments.length) {
        this.error = 'No pending payments returned.';
        this.destroyDT();
        return;
      }

      setTimeout(() => this.initOrRefreshDT(), 0);
    } catch (e: any) {
      console.error('[PendingpaymentsComponent] loadPendingPayments error:', e);
      this.error = e?.message || 'Unexpected error loading pending payments.';
      this.PendingPayments = [];
      this.destroyDT();
    } finally {
      this.loading = false;
    }
  }

  onClose(): void {
    this.destroyDT();
    this.close.emit();
  }

  shortAddr(addr: string, head = 12, tail = 8): string {
    if (!addr) return '';
    if (addr.length <= head + tail + 3) return addr;
    return `${addr.slice(0, head)}...${addr.slice(-tail)}`;
  }

  copy(text: string): void {
    if (!text) return;

    navigator.clipboard.writeText(text);
    this.copied = text;

    setTimeout(() => {
      if (this.copied === text) {
        this.copied = '';
      }
    }, 1200);
  }
}