import { LitElement, css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import './listbox.ts';
import type { Listbox } from './listbox.ts';

const optionsStr = [
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
  optionTemplateMultiple: OptionTemplate<Option> = (option) => html`${option.name}`;

  constructor() {
    super();
    this.updateComplete.then(() => {
      this.listboxMultiple.options = optionsObj;
      this.selectedOptions = [optionsObj[1], optionsObj[4]];
      this.listboxMultiple.value = this.selectedOptions;
      this.listboxMultiple.optionTemplate = this.optionTemplateMultiple;
      this.listboxMultiple.addEventListener('cs-change', ({ detail }: CustomEvent) => {
        this.selectedOptions = detail;
        this.requestUpdate();
      });
    })
  }

  @state()
  selectedOption = 'John';

  @state()
  selectedOptions: Option[] = [];

  @query('#listbox-multiple')
  listboxMultiple!: Listbox;

  protected render() {
    return html`
      <div style="display: flex; justify-content: center; gap: 3rem">
        <div>
          <p>Value: ${this.selectedOption}</p>
          <cs-listbox
            @cs-change=${({ detail }: CustomEvent) => {
                this.selectedOption = detail
              }
            }
            .options=${optionsStr}
            .value=${this.selectedOption}
            >
          </cs-listbox>
        </div>
        <div>
          <p>Values: ${this.selectedOptions.map(option => option.name).join(', ')}</p>
          <cs-listbox label="names" multiple id="listbox-multiple"></cs-listbox>
        </div>
      </div>
    `
  }

  static styles = css`
    cs-listbox {
      &::part(listbox) {
        width: 300px;
        margin: 0 auto;
        border: 1px solid gray;
      }
      &::part(option) {
        padding: 0.25rem 0.5rem;
      }
      &::part(option):hover,
      &::part(option-active) {
        background: aqua;
      }
      &::part(option-selected) {
        color: white;
        background: rebeccapurple;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'cs-app': App
  }
}