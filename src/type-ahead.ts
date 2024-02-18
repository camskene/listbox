const QUERY_TIMEOUT = 400;

export default class TypeAhead {
  private options: (string | null)[];
  private currentQuery: string = '';
  private searchTimeout: number | undefined;

  constructor(options: (string | null)[]) {
    if (!options) {
      throw new Error('TypeAhead requires options to be defined. Did you forget to pass them in?');
    }
    this.options = options;
  }

  findOptionIndex(e: KeyboardEvent, activeIndex: number) {
    if (!e.key.match(/[a-z0-9]/i)) {
      return -1;
    }

    this.currentQuery += e.key.toLowerCase();;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.currentQuery = '';
    }, QUERY_TIMEOUT);

    let { length } = this.options;

    for (let i = 0; i < length; i++) {
      let index = (activeIndex + i + 1) % length;
      let option = this.options[index] ?? '';

      if (option.toLowerCase().startsWith(this.currentQuery)) {
        return index;
      }
    }

    return activeIndex;
  }
}