import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, catchError, of } from 'rxjs';
import { httpReturn } from 'src/app/models/http-Return';

@Injectable({ providedIn: 'root' })
export class XcashPaymentsService {
  private readonly BASE_URL =
    'https://api.xcashseeds.us/v2/xcash/dpops/unauthorized/payouts';

  constructor(private http: HttpClient) {}

  private tryParseJson(text: string): any | null {
    try { return JSON.parse(text); } catch { return null; }
  }

  async getDelegatePayments(IPAddress: string): Promise<httpReturn> {
    const IPname = (IPAddress ?? '').trim();
    if (!IPname) {
      return { status: false, message: 'Missing delegate IP.', data: null };
    }

    const url = `${this.BASE_URL}/${encodeURIComponent(IPname)}`;

    try {
      const raw: string = await firstValueFrom(
        this.http.get(url, { responseType: 'text' }).pipe(
          catchError((error) => {
            console.error('[getDelegatePayments] HTTP error:', error);
            return of('');
          })
        )
      );

      if (!raw) {
        return { status: false, message: 'Error calling PaymentsService API.', data: null };
      }

      const parsed = this.tryParseJson(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.Error) {
        return { status: false, message: parsed.Error, data: raw };
      }

      return { status: true, message: 'Success.', data: raw };
    } catch (error) {
      console.error('[getDelegatePayments] unexpected error:', error);
      return { status: false, message: 'Unexpected error.', data: null };
    }
  }
}