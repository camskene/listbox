import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import './listbox.ts';

// const options = [
//   'John',
//   'Paul',
//   'George',
//   'Ringo',
//   'Cam'
// ]

const optionsObj = [
  { name: 'John' },
  { name: 'Paul' },
  { name: 'George' },
  { name: 'Ringo' },
];

@customElement('cs-app')
export class App extends LitElement {
  optionTemplate = (option: Record<string, string>) => html`<div>${option.name}</div>`;

  protected render(): unknown {
    return html`
      <cs-listbox id="listbox" .options=${optionsObj} .optionTemplate=${this.optionTemplate}></cs-listbox>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cs-app': App
  }
}