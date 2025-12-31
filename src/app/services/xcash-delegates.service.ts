import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, catchError, of } from 'rxjs';
import { httpReturn } from 'src/app/models/http-Return';

@Injectable({
  providedIn: 'root'
})
export class XcashDelegatesService {

  constructor(private http: HttpClient) {}

  async getDelegates(url: any): Promise<httpReturn> {
    let wserror = false;
    try {
      const response = this.http.get(url, { responseType: 'json' });
      const wsdata: any = await firstValueFrom(response.pipe(
        catchError(error => {
          wserror = true;
          return of({ status: false, message: 'Error calling API.', data: null });
        })
      ));
      if (wserror) {
        return wsdata;
      } else {
        if (wsdata.hasOwnProperty('Error')) {
          return { status: false, message: wsdata.Error + ' (check the delegates name).', data: wsdata };
        } else {
          return { status: true, message: 'Success.', data: wsdata };
        }
      }
    } catch (error) {
      return { status: false, message: 'Unexpected error.', data: null };
    }
  }

  async proveAddress(address: string, signature: string): Promise<httpReturn> {
    const url = 'https://api.xcash.live/v1/xcash/blockchain/unauthorized/address/prove/';
    const body = { address, signature };

    let hadHttpError = false;
    let httpErrorMessage = 'Error calling API.';

    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      const wsdata: any = await firstValueFrom(
        this.http.post(url, body, { headers, responseType: 'json' }).pipe(
          catchError((error: any) => {
            hadHttpError = true;
            console.error('[proveAddress] HTTP error:', error);

            // Build a more useful message
            if (error.status === 0) {
              httpErrorMessage = 'Network / CORS error calling API.';
            } else if (error.status) {
              httpErrorMessage = `HTTP ${error.status}: ${error.statusText || 'Error calling API.'}`;
            }

            // If backend sent a JSON error with "Error" field, surface it
            if (error.error && typeof error.error === 'object' && error.error.Error) {
              httpErrorMessage += ` – ${error.error.Error}`;
            }

            // We return null here; the outer code will see hadHttpError === true
            return of(null);
          })
        )
      );

      if (hadHttpError) {
        return {
          status: false,
          message: httpErrorMessage,
          data: null
        };
      }

      // Backend-level error in a successful HTTP response
      if (wsdata && wsdata.Error) {
        return {
          status: false,
          message: wsdata.Error,
          data: wsdata
        };
      }

      return {
        status: true,
        message: 'Success.',
        data: wsdata
      };

    } catch (error: any) {
      console.error('[proveAddress] unexpected error:', error);
      return {
        status: false,
        message: 'Unexpected error.',
        data: null
      };
    }
  }

}