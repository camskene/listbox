import { LitElement, TemplateResult, html } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import TypeAhead from './type-ahead';

export type OptionTemplate<T> = (option: T) => TemplateResult;
export type OptionValue = string | Record<string, unknown>;

@customElement('cs-listbox')
export class Listbox extends LitElement {
  typeAhead: TypeAhead | undefined;

  constructor() {
    super();
    this.updateComplete.then(() => {
      const value = Array.isArray(this.value) ? this.value[0] : this.value;
      this.activeIndex = this.options.findIndex((option) => option === value);

      if (this.multiple && !Array.isArray(this.value)) {
        this.value = [this.value];
      }
    })

  }

  @state()
  activeIndex = -1;

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Array })
  options: OptionValue[] = [];

  @property()
  optionTemplate: OptionTemplate<any> = (option) => html`${option}`;

  @property()
  value: any = [];

  @queryAll('[role="option"]')
  optionNodes: NodeListOf<HTMLOptionElement> | undefined;

  get selected() {
    return this.options[this.activeIndex];
  }

  get optionsTextContent() {
    if (!this.optionNodes) return [];

    return [...this.optionNodes].map((node) => node.textContent && node.textContent.trim());
  }

  isActiveDescendant(index: number) {
    return this.activeIndex === index;
  }

  isSelected(option: any, index: number) {
    if (!this.multiple) {
      return this.isActiveDescendant(index);
    }

    return this.value.length && this.value.includes(option);
  }

  handleKeydown(event: KeyboardEvent) {
    // Prevent page scrolling
    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
    }
    if (event.key === 'Tab') {
      return this.activeIndex;
    } else if (event.key === 'ArrowDown') {
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
        this.value = this.selected;
      } else if (event.key === 'Enter' || event.key === ' ') {
        if (!this.value.includes(this.selected)) {
          this.value.push(this.selected);
        } else {
          this.value = this.value.filter((option: OptionValue) => option !== this.selected);
        }
      }
      dispatchCustomEvent(event, 'cs-change', this.value);
    });
  }

  handleClick(event: PointerEvent) {
    const { value } = event.target as HTMLOptionElement;
    this.activeIndex = this.options.findIndex((option) => option === value);

    this.updateComplete.then(() => {
      if (!this.multiple) {
        this.value = this.selected;
      } else {
        if (!this.value.includes(this.selected)) {
          this.value.push(this.selected);
        } else {
          this.value = this.value.filter((option: OptionValue) => option !== this.selected);
        }
      }
      dispatchCustomEvent(event, 'cs-change', this.value);
    });
  }

  render() {
    return html`
      <div
        @click=${this.handleClick}
        @keydown=${this.handleKeydown}
        aria-activedescendant=${this.activeIndex}
        aria-multiselectable=${this.multiple}
        part="listbox"
        role="listbox"
        tabindex="0"
      >
        ${this.options.map((option, index) => html`
          <div
            aria-selected=${this.isSelected(option, index)}
            id=${index}
            part="option ${whilst(this.isActiveDescendant(index), 'option-active')} ${whilst(this.isSelected(option, index), 'option-selected')} "
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

function nextIndex(activeIndex: number, numOptions: number) {
  return (activeIndex + 1) % numOptions;
}

function previousIndex(activeIndex: number, numOptions: number) {
  if (activeIndex === -1) {
    return numOptions - 1;
  }

  return (activeIndex - 1 + numOptions) % numOptions;
}

function whilst(condition: boolean, value: string) {
  if (condition) {
    return value;
  }
}

function dispatchCustomEvent(event: Event, name: string, detail: unknown) {
  event.target?.dispatchEvent(new CustomEvent(name, {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail,
  }));
}

declare global {
  interface HTMLElementTagNameMap {
    'cs-listbox': Listbox
  }

  interface HTMLElementEventMap {
    'cs-change': CustomEvent
  }
}
