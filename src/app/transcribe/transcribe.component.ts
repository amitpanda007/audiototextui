import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ContentDialogComponent,
  ContentDialogResult,
} from '../common/content/content-dialog.component';
import { DragdropService } from '../drag-drop.service';

@Component({
  selector: 'transcribe',
  templateUrl: 'transcribe.component.html',
  styleUrls: ['transcribe.component.scss'],
})
export class TranscribeComponent implements OnInit {
  public transcription: string;

  constructor(
    private dragdropService: DragdropService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.dragdropService.transcriptionDataChanged.subscribe((data) => {
      this.transcription = data;
      const dialogRef = this.dialog.open(ContentDialogComponent, {
        width: '280px',
        data: {
          header: 'Transcripted Data',
          message: this.transcription,
        },
      });
      dialogRef.afterClosed().subscribe((result: ContentDialogResult) => {
        console.log(result);
      });
    });
  }
}
