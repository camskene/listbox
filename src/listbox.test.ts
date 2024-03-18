import { expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import './listbox';
import { Listbox } from './listbox';
import { previousIndex, nextIndex } from './listbox';

const options = [
  'John',
  'Paul',
  'George',
  'Ringo',
  'Cam'
];

describe('single select listbox', async () => {
  async function listboxComponent() {
    return await fixture<Listbox>(html`<cs-listbox .options=${options}></cs-listbox>`);
  }

  async function listboxElement() {
    let el = await listboxComponent();
    return el.shadowRoot?.querySelector<HTMLElement>('[role="listbox"]');
  }

  it('is accessible', async () => {
    const el = await listboxElement();
    await expect(el).to.be.accessible();
  });

  it('renders options', async () => {
    const el = await listboxElement();
    const optionNodes = el?.querySelectorAll('[role="option"]');
    expect(optionNodes?.length).to.equal(options.length);
  });

  it('has expected attributes if no active option', async () => {
    const el = await listboxElement();
    expect(el).to.have.attribute('part', 'listbox');
    expect(el).to.have.attribute('role', 'listbox');
    expect(el).to.have.attribute('tabindex', '0');
    expect(el).to.not.have.attribute('aria-multiselectable');
    expect(el).to.not.have.attribute('aria-activedescendant');
  });

  it('has expected activeIndex if value *not* preselected', async () => {
    const el = await listboxComponent();
    expect(el.activeIndex).to.equal(-1);
  });

  it('has expected activeIndex if value *is* preselected', async () => {
    const selectedOption = options[1];
    const el = await fixture<Listbox>(html`<cs-listbox .options=${options} value=${selectedOption}></cs-listbox>`);
    expect(el.activeIndex).to.equal(options.indexOf(selectedOption));
  });

  it('has expected preselected value', async () => {
    const selectedOption = options[1];
    const el = await fixture<Listbox>(html`<cs-listbox .options=${options} .value=${selectedOption}></cs-listbox>`);
    expect(el.value).to.equal(selectedOption);
  });

  it('handles key ArrowDown event correctly', async () => {
    const el = await listboxComponent();
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

    for (let index = 0; index < options.length; index++) {
      el.handleKeydown(event);
      await expect(el.activeIndex).to.equal(index);
      await el.updateComplete;
      await expect(el.value).to.equal(options[index]);
    }
  });

  it('handles key ArrowUp event correctly', async () => {
    const el = await listboxComponent();
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });

    for (let index = options.length; index > options.length; index--) {
      el.handleKeydown(event);
      await expect(el.activeIndex).to.equal(index);
      await el.updateComplete;
      await expect(el.value).to.equal(options[index]);
    }
  });

  it('handles key Home event correctly', async () => {
    const el = await listboxComponent();
    const event = new KeyboardEvent('keydown', { key: 'Home' });

    el.handleKeydown(event);
    await expect(el.activeIndex).to.equal(0);
    await el.updateComplete;
    await expect(el.value).to.equal(options[0]);
  });

  it('handles key End event correctly', async () => {
    const el = await listboxComponent();
    const event = new KeyboardEvent('keydown', { key: 'End' });

    el.handleKeydown(event);
    await expect(el.activeIndex).to.equal(options.length - 1);
    await el.updateComplete;
    await expect(el.value).to.equal(options[options.length - 1]);
  });

  it('handles click events correctly', async () => {
    const el = await listboxComponent();
    const event = new MouseEvent('click', { bubbles: true });
    const option1 = el.shadowRoot?.querySelector('#option-1');
    option1?.dispatchEvent(event);
    await el.updateComplete;
    expect(el.activeIndex).to.equal(1);
    expect(el.value).to.equal('Paul');
  });

  it('dispatches "cs-change" event when key is pressed', async () => {
    const changeHandler = sinon.spy();
    document.body.addEventListener('cs-change', changeHandler);
    const el = await listboxElement();
    el?.focus();
    await sendKeys({ press: 'ArrowDown' });
    expect(changeHandler).to.have.been.calledOnce;
    expect(changeHandler).to.have.been.calledWith(sinon.match.has('detail', 'John'));
    document.body.removeEventListener('cs-change', changeHandler);
  });
});

describe('nextIndex', () => {
  it('returns the first index in array if no activedescendant', () => {
    const activeIndex = -1;
    const numOptions = options.length;
    const result = nextIndex(activeIndex, numOptions);
    expect(result).to.equal(0);
  });

  it('returns the first index in array if last option is activedescendant', () => {
    const activeIndex = options.length - 1;
    const numOptions = options.length;
    const result = nextIndex(activeIndex, numOptions);
    expect(result).to.equal(0);
  });
});

describe('previousIndex', () => {
  it('returns the last index in array if no activedescendant', () => {
    const activeIndex = -1;
    const numOptions = options.length;
    const lastOptionIndex = numOptions - 1;
    const result = previousIndex(activeIndex, numOptions);
    expect(result).to.equal(lastOptionIndex);
  });

  it('returns the last index in array if first option is activedescendant', () => {
    const activeIndex = 0;
    const numOptions = options.length;
    const lastOptionIndex = numOptions - 1;
    const result = previousIndex(activeIndex, numOptions);
    expect(result).to.equal(lastOptionIndex);
  });
});