import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class DragdropService {
  constructor(private http: HttpClient) {}

  addFiles(file: File) {
    var arr: any[] = [];
    var formData = new FormData();
    arr.push(file);

    arr[0].forEach((item: any, i: any) => {
      formData.append('file', arr[0][i]);
      formData.append('folder', "abc657dsmdskcm");
    });

    return this.http
      .post('http://localhost:8000/transcribe-upload', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorMgmt));
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