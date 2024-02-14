import { LitElement, css, html } from 'lit';
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

@customElement('cs-app')
export class App extends LitElement {
  optionTemplate = (option: Record<string, string>) => html`${option.name}`;

  protected render(): unknown {
    return html`
      <cs-listbox
        id="listbox"
        .options=${optionsObj}
        .optionTemplate=${this.optionTemplate}
      >
      </cs-listbox>
    `
  }

  static styles = css`
    cs-listbox {
      &::part(listbox) {
        width: 300px;
        margin: 0 auto;
        border: 1px solid gray;
      }
      &::part(option):hover,
      &::part(option-selected) {
        color: white;
        background: rebeccapurple;
      }
      &::part(option) {
        padding: 0.25rem 0.5rem;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'cs-app': App
  }
}