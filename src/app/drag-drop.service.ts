import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Utils } from '../lib/utils';

@Injectable({
  providedIn: 'root',
})

export class DragdropService {
  public transcriptionDataChanged = new Subject<string>();
  constructor(private http: HttpClient) {}

  addFiles(file: File) {
    var arr: any[] = [];
    var formData = new FormData();
    arr.push(file);

    const folderName = Utils.genRanHex(16);

    arr[0].forEach((item: any, i: any) => {
      formData.append('file', arr[0][i]);
      formData.append('folder', folderName);
    });

    this.triggerEvent(folderName);

    return this.http
      .post('http://localhost:8000/transcribe-upload', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorMgmt));
  }

  triggerEvent(folderName: string) {
    const evtSource = new EventSource(`http://localhost:8000/transcribe/result?param=${folderName}`);
    evtSource.addEventListener("update", (event) => {
        console.log(event);
        this.transcriptionDataChanged.next(event.data);
    });
    evtSource.addEventListener("end", (event) => {
        console.log('SSE Event end.')
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