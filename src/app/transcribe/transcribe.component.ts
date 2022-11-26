import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DragdropService } from '../drag-drop.service';

@Component({
  selector: 'transcribe',
  templateUrl: 'transcribe.component.html',
  styleUrls: ['transcribe.component.scss'],
})
export class TranscribeComponent implements OnInit {
  public transcription: string;

  constructor(private dragdropService: DragdropService) { }

  async ngOnInit() { 
    this.dragdropService.transcriptionDataChanged.subscribe(data => {
      this.transcription = data;
    });
  }
}