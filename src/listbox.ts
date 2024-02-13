import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

@customElement('cs-listbox')
export class Listbox extends LitElement {
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
    }
  }

  render() {
    return html`
      <div
        @keydown=${this.handleKeydown}
        aria-activedescendant=${this.activeIndex}
        aria-labelledby=""
        id="listbox"
        role="listbox"
        tabindex="0"
        part="listbox"
      >
        ${repeat(this.options, (option) => option, (option, index) => html`
          <div
            aria-selected=${this.isSelected(index)}
            role="option"
            part=${this.isSelected(index) ? 'option-selected' : 'option'}
          >
            ${this.optionTemplate(option)}
          </div>
        `)}
        <slot></slot>
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
