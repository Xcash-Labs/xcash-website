import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ConstantsService {
  public readonly delegatesVersionInfo: string = '1.0.2';
}