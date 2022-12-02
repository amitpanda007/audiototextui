import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Utils } from '../lib/utils';

@Injectable({
  providedIn: 'root',
})
export class AudioUploadService {
  public languageDataChanged = new Subject<string>();
  constructor(private http: HttpClient) {}

  addAudioFile(blob: Blob) {
    var arr: any[] = [];
    var formData = new FormData();

    const folderName = Utils.genRanHex(16);

    formData.append('file', blob);
    formData.append('folder', folderName);

    this.triggerEvent(folderName);

    return this.http
      .post('http://localhost:80/transcribe-audio-blob', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorMgmt));
  }

  triggerEvent(folderName: string) {
    const evtSource = new EventSource(
      `http://localhost:80/language-detect/result?param=${folderName}`
    );
    evtSource.addEventListener('update', (event) => {
      console.log(event);
      this.languageDataChanged.next(event.data);
    });
    evtSource.addEventListener('end', (event) => {
      console.log('SSE Event end.');
      evtSource.close();
    });
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error`
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
