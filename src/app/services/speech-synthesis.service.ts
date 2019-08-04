import { Injectable } from '@angular/core';

@Injectable()
export class SpeechSynthesisService {
  private speechVoice: SpeechSynthesisVoice;

  init(lang: string) {
    if (!window.speechSynthesis) {
      console.warn('No Speech Synthesis support.');
      return;
    }
    this.setSpeechVoice(lang);
    window.speechSynthesis.onvoiceschanged = () => this.setSpeechVoice(lang);
  }

  setSpeechVoice(lang: string) {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      return;
    }
    const speechVoice = voices.find((voice) => voice.lang.startsWith(lang));
    if (!speechVoice) {
      console.warn('This browser doesn not support russian speech synthesis');
      return;
    }
    this.speechVoice = speechVoice;
  }

  getSpeechVoice() {
    return this.speechVoice;
  }

  hasSpeechSupport(): boolean {
    return this.getSpeechVoice() != null;
  }
}
