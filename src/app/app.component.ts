import { Component } from '@angular/core';
import { SpeechSynthesisService } from './services/speech-synthesis.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private speechSynthesisService: SpeechSynthesisService) {
    speechSynthesisService.init('ru');
  }
}
