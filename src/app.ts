import { LitElement, css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import './listbox.ts';
import type { Listbox } from './listbox.ts';

const options = [
  'John',
  'Paul',
  'George',
  'Ringo',
  'Cam'
]

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

import type { OptionTemplate } from './listbox';

@customElement('cs-app')
export class App extends LitElement {
  optionTemplate: OptionTemplate<Option> = (option) => html`${option.name}`;

  @state()
  selectedOption = 'John';

  @state()
  selectedOptions: Option[] = [];

  @query('#listbox-multiple')
  listboxMultiple!: Listbox;

  constructor() {
    super();
    this.updateComplete.then(() => {
      this.listboxMultiple.options = optionsObj;
      this.listboxMultiple.value = this.listboxMultiple.options[3];
      this.listboxMultiple.optionTemplate = this.optionTemplate;
      this.listboxMultiple.addEventListener('cs-change', ({ detail }: CustomEvent) => {
        this.selectedOptions.push(detail);
        this.requestUpdate();
      });
    })
  }

  protected render() {
    return html`
      <p>Values: ${this.selectedOptions.map(option => option.name)}</p>
      <cs-listbox multiple id="listbox-multiple"></cs-listbox>

      <p>Value:  ${this.selectedOption}</p>
      <cs-listbox
        @cs-change=${({ detail }: CustomEvent) => this.selectedOption = detail}
        .options=${options}
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