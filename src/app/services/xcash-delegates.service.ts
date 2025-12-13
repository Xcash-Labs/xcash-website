import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, catchError, of } from 'rxjs';
import { httpReturn } from 'src/app/models/http-Return';

@Injectable({
  providedIn: 'root'
})
export class XcashDelegatesService {

  constructor(private http: HttpClient) { }

  async getDelegates(url: any): Promise<httpReturn> {
    let wserror = false;
    try {
      const response = this.http.get(url, { responseType: 'json' });
      const wsdata: any = await firstValueFrom(response.pipe(
        catchError(error => {
          // Return an observable with the desired error object
          wserror = true;
          return of({ status: false, message: 'Error calling API.', data: null });
        })
      ));
      if (wserror) {
        return wsdata;
      } else {
        if (wsdata.hasOwnProperty("Error")) {
          return { status: false, message: wsdata.Error + ' (check the delegates name).', data: wsdata };
        } else {
          return { status: true, message: 'Success.', data: wsdata };
        }
      }
    } catch (error) {
      return { status: false, message: 'Unexpected error.', data: null };
    }
  }
}