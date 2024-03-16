import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './listbox.ts';
import type { OptionTemplate } from './listbox.ts';

interface Option {
  name: string;
}

const options = [
  { name: 'John' },
  { name: 'Jude' },
  { name: 'June' },
  { name: 'Paul' },
  { name: 'Phil' },
  { name: 'Prince' },
  { name: 'George' },
  { name: 'Geoff' },
  { name: 'Gary' },
  { name: 'Ringo' },
  { name: 'Rodney' },
  { name: 'Rick' },
];

@customElement('select-multiple')
export default class SelectMultiple extends LitElement {
  optionTemplate: OptionTemplate<Option> = (option) => html`${option.name}`;

  @state()
  selectedOptions: Option[] = [options[0], options[6]];

  handleListboxChange(event: CustomEvent) {
    this.selectedOptions = event.detail;
    this.requestUpdate();
  }

  protected render() {
    return html`
      <div style="display: flex; gap: 1rem">
        <div style="width: 240px">
          <p>✔️ Array of objects</p>
          <p>✔️ Multiple select</p>
          <p>✔️ Custom option template</p>
          <p>Values: ${this.selectedOptions.map(option => option.name).join(', ')}</p>
        </div>
        <cs-listbox
          @cs-change=${this.handleListboxChange}
          multiple
          .options=${options}
          .optionTemplate=${this.optionTemplate}
          .value=${this.selectedOptions}
        >
        </cs-listbox>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'select-multiple': SelectMultiple
  }
}