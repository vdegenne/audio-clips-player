import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import map from './map.json';
import { playAudio } from './audio.js';

@customElement('s-player')
export class SPlayer extends LitElement {
  protected projectName = '';
  protected _audioFiles = [];

  @state()
  protected audioIndex = 0;

  _playOnChange = true;

  constructor(projectName: string) {
    super();
    this.projectName = projectName;
    this._audioFiles = map[this.projectName];
  }

  static styles = css`
    :host {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      max-width: 600px;
      margin: 0 auto;
      background-color: black;
      color: white;
      --mdc-theme-primary: black;
      --mdc-theme-on-primary: white;
      --mdc-theme-text-primary-on-background: white;
    }
    header,
    [controls] {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    [controls] {
      padding: 24px;
    }
  `;

  getAudioName() {
    return this._audioFiles[this.audioIndex];
  }

  render() {
    return html`
      <header>
        <!-- <span>${this.audioIndex + 1}/${this._audioFiles.length}</span> -->
        <mwc-formfield label="play on change">
          <mwc-checkbox
            ?checked=${this._playOnChange}
            @change=${(e) => {
              this._playOnChange = e.target.checked;
            }}
          ></mwc-checkbox>
        </mwc-formfield>
      </header>

      <div
        style="flex:1;display:flex;justify-content:center;align-items:center;"
        @click=${(e) => {
          if (e.target.nodeName == 'MWC-ICON-BUTTON') {
            return;
          }
          this.play();
        }}
      >
        <mwc-icon-button
          icon="arrow_back"
          @click=${this.previous}
        ></mwc-icon-button>
        <div style="margin:0 32px;text-align:center;">
          <div>${this.audioIndex + 1}/${this._audioFiles.length}</div>
          <h3>${this.getAudioName()}</h3>
        </div>
        <mwc-icon-button
          icon="arrow_forward"
          @click=${this.next}
        ></mwc-icon-button>
      </div>

      <div>
        <mwc-icon-button icon="casino" @click=${this.random} style="margin:24px"></mwc-icon-button>
      </div>

      <div controls>
        <mwc-icon-button
          icon="volume_up"
          @click=${() => {
            this.play();
          }}
        ></mwc-icon-button>
        <mwc-icon-button
          @click=${() => {
            this.play(1);
          }}
          >1</mwc-icon-button
        >
        <mwc-icon-button
          @click=${() => {
            this.play(2);
          }}
          >2</mwc-icon-button
        >
        <mwc-icon-button
          @click=${() => {
            this.play(3);
          }}
          >3</mwc-icon-button
        >
      </div>
    `;
  }

  random() {
    this.audioIndex = Math.floor(Math.random() * this._audioFiles.length);
    this.afterChange();
  }

  previous() {
    if (this.audioIndex - 1 < 0) {
      this.audioIndex = this._audioFiles.length - 1;
    } else {
      this.audioIndex--;
    }
    this.afterChange();
  }
  next() {
    if (this.audioIndex + 1 > this._audioFiles.length - 1) {
      this.audioIndex = 0;
    } else {
      this.audioIndex++;
    }
    this.afterChange();
  }

  async afterChange() {
    await this.updateComplete;
    if (this._playOnChange) {
      this.play();
    }
  }

  async play(index?: number) {
    const prefix =
      import.meta.env.MODE == 'development' ? './docs/files' : './files';
    const audio = await playAudio(
      `${prefix}/${this.projectName}/${this.getAudioName()}`,
      0.8,
      index ? { index, total: 3 } : null
    );
  }
}
