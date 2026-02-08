import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, catchError, of } from 'rxjs';
import { httpReturn } from 'src/app/models/http-Return';

@Injectable({ providedIn: 'root' })
export class XcashDelegatesService {
  private readonly REGISTERED_DELEGATES_URL =
    'https://api.xcashseeds.us/v2/xcash/dpops/unauthorized/delegates/registered/';

  constructor(private http: HttpClient) {}

  private tryParseJson(text: string): any | null {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  async getRegisteredDelegates(): Promise<httpReturn> {
    try {
      // Return raw JSON string
      const raw: string = await firstValueFrom(
        this.http.get(this.REGISTERED_DELEGATES_URL, { responseType: 'text' }).pipe(
          catchError((error) => {
            console.error('[getRegisteredDelegates] HTTP error:', error);
            return of('');
          })
        )
      );

      if (!raw) {
        return { status: false, message: 'Error calling API.', data: null };
      }

      // If backend ever returns an object with Error field, surface it
      const parsed = this.tryParseJson(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.Error) {
        return { status: false, message: parsed.Error, data: raw };
      }

      return { status: true, message: 'Success.', data: raw };
    } catch (error) {
      console.error('[getRegisteredDelegates] unexpected error:', error);
      return { status: false, message: 'Unexpected error.', data: null };
    }
  }
}