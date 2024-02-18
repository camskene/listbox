import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

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

interface Option {
  name: string;
}

@customElement('cs-app')
export class App extends LitElement {
  optionTemplate = (option: Record<string, string>) => html`${option.name}`;

  @state()
  selectedOption: Option | undefined = optionsObj[6];

  protected render(): unknown {
    return html`
      <p>Selected item: ${this.selectedOption?.name}</p>
      <cs-listbox
        @cs-change=${({ detail }: CustomEvent) => this.selectedOption = detail.value}
        .options=${optionsObj}
        .optionTemplate=${this.optionTemplate}
        .value=${this.selectedOption}
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