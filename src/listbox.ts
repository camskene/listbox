import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import TypeAhead from './type-ahead';

export type OptionTemplate<T> = (option: T) => TemplateResult;

@customElement('cs-listbox')
export class Listbox extends LitElement {
  typeAhead: TypeAhead | undefined;

  constructor() {
    super();
    this.updateComplete.then(() => {
      this.activeIndex = this.options.findIndex((option) => option === this.value);
    })
  }

  @state()
  activeIndex = -1;

  @property({ type: Boolean })
  multiple = false;

  @property()
  options: unknown[] = [];

  @property()
  optionTemplate: OptionTemplate<any> = (option) => html`${option}`;

  @property()
  value: unknown;

  @queryAll('[role="option"]')
  optionNodes: NodeListOf<HTMLOptionElement> | undefined;

  get selected() {
    return this.options[this.activeIndex];
  }

  get optionsTextContent() {
    if (!this.optionNodes) return [];

    return [...this.optionNodes].map((node) => node.textContent && node.textContent.trim());
  }

  isSelected(index: number) {
    return this.activeIndex === index;
  }

  handleKeydown(event: KeyboardEvent) {
    // Prevent page scrolling
    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
    }

    if (event.key === 'ArrowDown') {
      this.activeIndex = nextIndex(this.activeIndex, this.options.length);
    } else if (event.key === 'ArrowUp') {
      this.activeIndex = previousIndex(this.activeIndex, this.options.length);
    } else if (event.key === 'Home') {
      this.activeIndex = 0;
    } else if (event.key === 'End') {
      this.activeIndex = this.options.length - 1;
    } else if (event.key.match(/[a-z0-9]/i)) {
      if (!this.typeAhead) {
        this.typeAhead = new TypeAhead(this.optionsTextContent);
      }

      this.activeIndex = this.typeAhead.findOptionIndex(event, this.activeIndex);
    }

    this.updateComplete.then(() => {
      if (!this.multiple) {
        dispatchCustomEvent(event, 'cs-change', this.selected);
      } else if (event.key === 'Enter' || event.key === ' ') {
        dispatchCustomEvent(event, 'cs-change', this.selected);
      }
    });
  }

  handleClick(event: Event) {
    const { value } = event.target as HTMLOptionElement;
    this.activeIndex = this.options.findIndex((option) => option === value);

    this.updateComplete.then(() => {
      dispatchCustomEvent(event, 'cs-change', this.selected);
    });
  }

  render() {
    return html`
      <div
        @click=${this.handleClick}
        @keydown=${this.handleKeydown}
        aria-activedescendant=${this.activeIndex}
        aria-labelledby=""
        part="listbox"
        role="listbox"
        tabindex="0"
      >
        ${this.options.map((option, index) => html`
          <div
            aria-selected=${this.isSelected(index)}
            part="option ${when(this.isSelected(index), () => 'option-selected')}"
            role="option"
            .value=${option}
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

  interface HTMLElementEventMap {
    'cs-change': CustomEvent
  }
}

function nextIndex(activeIndex: number, numOptions: number) {
  return (activeIndex + 1) % numOptions;
}

function previousIndex(activeIndex: number, numOptions: number) {
  if (activeIndex === -1) {
    return numOptions - 1;
  }

  return (activeIndex - 1 + numOptions) % numOptions;
}

function dispatchCustomEvent(event: Event, name: string, detail: unknown) {
  event.target?.dispatchEvent(new CustomEvent(name, {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail,
  }));
}
