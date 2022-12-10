import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';
import { AudioUploadService } from '../audio-upload.service';
import {
  ContentDialogComponent,
  ContentDialogResult,
} from '../common/content/content-dialog.component';

@Component({
  selector: 'audio-detect',
  templateUrl: 'audio-detect.component.html',
  styleUrls: ['audio-detect.component.scss'],
})
export class AudioDetectComponent implements OnInit {
  public detectedAudio: string;

  constructor(
    private domSanitizer: DomSanitizer,
    private audioUploadService: AudioUploadService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.audioUploadService.languageDataChanged.subscribe((data) => {
      this.detectedAudio = data;
      const dialogRef = this.dialog.open(ContentDialogComponent, {
        width: '280px',
        data: {
          header: 'Transcripted Data',
          message: `Language Detected: ${this.detectedAudio}`,
        },
      });
      dialogRef.afterClosed().subscribe((result: ContentDialogResult) => {
        console.log(result);
      });
    });
  }

  //Lets declare Record OBJ
  record: any;
  //Will use this flag for toggeling recording
  recording = false;
  //URL of Blob
  url: any;
  error: any;
  blob: any;

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  /**
   * Start recording.
   */
  initiateRecording() {
    this.blob = null;
    this.record = null;
    this.url = null;
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  /**
   * Will be called automatically.
   */
  successCallback(stream: any) {
    var options: any = {
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
      // sampleRate: 16000,
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  /**
   * Stop recording.
   */
  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }

  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob: Blob) {
    this.blob = blob;
    this.url = URL.createObjectURL(blob);
    console.log('blob', blob);
    console.log('url', this.url);
  }

  /**
   * Process Error.
   */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }

  uploadAudioRecording() {
    // Upload to server
    this.audioUploadService
      .addAudioFile(this.blob)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            // this.msg = 'Upload started!';
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            // if (event.total) {
            //   this.progress = Math.round((event.loaded / event.total) * 100);
            //   console.log(`Uploaded! ${this.progress}%`);
            //   this.msg = `Uploaded: ${this.progress}%`;
            // }
            break;
          case HttpEventType.Response:
            console.log('File uploaded successfully!', event.body);
            // this.msg = 'File uploaded successfully!';
            setTimeout(() => {
              // this.progress = 0;
              // this.fileArr = [];
              // this.fileObj = [];
              // this.msg = event.body.message;
            }, 3000);
        }
      });
  }
}
