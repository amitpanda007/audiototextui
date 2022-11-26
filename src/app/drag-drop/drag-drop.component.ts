import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DragdropService } from '../drag-drop.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {
  fileArr: any[] = [];
  fileObj: any[] = [];
  form: FormGroup;
  msg!: string;
  progress: any = 0;

  constructor(
    public fb: FormBuilder,
    private sanitizer: DomSanitizer,
    public dragdropService: DragdropService
  ) {
    this.form = this.fb.group({
      file: [null],
    });
  }

  ngOnInit() {}

  upload(e: any) {
    const fileListAsArray = Array.from(e);
    fileListAsArray.forEach((item, i) => {
    //   const file = e as HTMLInputElement;
      const file = e as any;
      const url = URL.createObjectURL(file[i]);
      this.fileArr.push({ item, url: url });
    });

    this.fileArr.forEach((item) => {
      this.fileObj.push(item.item);
    });

    // Set files form control
    this.form.patchValue({
      file: this.fileObj,
    });

    this.form.get('file')?.updateValueAndValidity();

    // Upload to server
    this.dragdropService
      .addFiles(this.form.value.file)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            this.msg = 'Upload started!';
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            if(event.total) {
                this.progress = Math.round((event.loaded / event.total) * 100);
                console.log(`Uploaded! ${this.progress}%`);
                this.msg = `Uploaded: ${this.progress}%`
            }
            break;
          case HttpEventType.Response:
            console.log('File uploaded successfully!', event.body);
            this.msg = 'File uploaded successfully!';
            setTimeout(() => {
              this.progress = 0;
              this.fileArr = [];
              this.fileObj = [];
              this.msg = event.body.message;
            }, 3000);
        }
      });
  }

  // Clean Url
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}