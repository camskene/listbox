import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

@customElement('cs-listbox')
export class Listbox extends LitElement {
  @property({ type: Number })
  activeIndex = -1;

  @property({ type: Array })
  options = [];

  @property()
  selected = this.options[this.activeIndex];

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

  isSelected(index: number) {
    return this.activeIndex === index;
  }

  @property()
  optionTemplate = (option: unknown) => html`${option}`;

  render() {
    return html`
      <p>ActiveIndex: ${this.activeIndex}</p>
      <div
        @keydown=${this.handleKeydown}
        aria-activedescendant=${this.activeIndex}
        aria-labelledby=""
        id="listbox"
        tabindex="0"
        part="listbox"
      >
        ${repeat(this.options, (option) => option, (option, index) => html`
          <div
            aria-selected=${this.isSelected(index)}
            class=${this.isSelected(index) ? 'selected' : ''}
            role="option"
            part="option"
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
