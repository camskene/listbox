import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './listbox';

const options = [
  'John',
  'Paul',
  'George',
  'Ringo',
  'Cam'
];

@customElement('select-single')
export default class SelectSingle extends LitElement {
  @state()
  selectedOption = options[4];

  handleListboxChange(event: CustomEvent) {
    this.selectedOption = event.detail;
  };

  render() {
    return html`
      <div style="display: flex; gap: 1rem">
        <div style="width: 240px">
          <p>✔️ Array of strings demo ✨</p>
          <p>✔️ Single select ✨</p>
          <p>${this.selectedOption}</p>
        </div>
        <cs-listbox
          @cs-change=${this.handleListboxChange}
          .options=${options}
          .value=${this.selectedOption}
        >
        </cs-listbox>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'select-single': SelectSingle
  }
}