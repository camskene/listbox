import { LitElement, html } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import TypeAhead from './type-ahead';

@customElement('cs-listbox')
export class Listbox extends LitElement {
  typeAhead: TypeAhead | undefined;

  @state()
  activeIndex = -1;

  @property()
  options = [];

  @property()
  optionTemplate = (option: unknown) => html`${option}`;

  @property()
  selected = this.options[this.activeIndex];

  isSelected(index: number) {
    return this.activeIndex === index;
  }

  handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex = nextIndex(this.activeIndex, this.options.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex = previousIndex(this.activeIndex, this.options.length);
        break;
      default:
        if (!this.typeAhead) {
          this.typeAhead = new TypeAhead(this.optionsTextContent);
        }
        this.activeIndex = this.typeAhead.findOptionIndex(event, this.activeIndex);
    }
  }

  @queryAll('[role="option"]')
  optionNodes: HTMLOptionElement[] | undefined;

  get optionsTextContent() {
    if (!this.optionNodes) return [];

    return [...this.optionNodes].map((node) => node.textContent && node.textContent.trim());
  }

  render() {
    return html`
      <div
        @keydown=${this.handleKeydown}
        aria-activedescendant=${this.activeIndex}
        aria-labelledby=""
        id="listbox"
        part="listbox"
        role="listbox"
        tabindex="0"
      >
        ${repeat(this.options, (option) => option, (option, index) => html`
          <div
            aria-selected=${this.isSelected(index)}
            part="option ${when(this.isSelected(index), () => 'option-selected')}"
            role="option"
          >
            ${this.optionTemplate(option)}
          </div>
        `)}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cs-listbox': Listbox
  }
}

function nextIndex(activeIndex: number, numOptions: number) {
  return (activeIndex + 1) % numOptions;
}

function previousIndex(activeIndex: number, numOptions: number) {
  return (activeIndex - 1 + numOptions) % numOptions;
}
