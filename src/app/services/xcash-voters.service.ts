import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, catchError, of } from 'rxjs';
import { httpReturn } from 'src/app/models/http-Return';

@Injectable({ providedIn: 'root' })
export class XcashVotersService {
  private readonly BASE_URL =
    'https://api.xcashseeds.us/v2/xcash/dpops/unauthorized/delegates/voters';

  constructor(private http: HttpClient) {}

  private tryParseJson(text: string): any | null {
    try { return JSON.parse(text); } catch { return null; }
  }

  async getDelegateVoters(delegateName: string): Promise<httpReturn> {
    const name = (delegateName ?? '').trim();
    if (!name) {
      return { status: false, message: 'Missing delegate name.', data: null };
    }

    const url = `${this.BASE_URL}/${encodeURIComponent(name)}`;

    try {
      const raw: string = await firstValueFrom(
        this.http.get(url, { responseType: 'text' }).pipe(
          catchError((error) => {
            console.error('[getDelegateVoters] HTTP error:', error);
            return of('');
          })
        )
      );

      if (!raw) {
        return { status: false, message: 'Error calling VoterService API.', data: null };
      }

      const parsed = this.tryParseJson(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.Error) {
        return { status: false, message: parsed.Error, data: raw };
      }

      return { status: true, message: 'Success.', data: raw };
    } catch (error) {
      console.error('[getDelegateVoters] unexpected error:', error);
      return { status: false, message: 'Unexpected error.', data: null };
    }
  }
}