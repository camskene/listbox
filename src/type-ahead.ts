export default class TypeAhead {
  private namesByLetter: { [key: string]: string[] } = {};
  private currentIndexes: { [key: string]: number } = {};
  private previousLetter: string | null = null;
  private options: (string | null)[] | undefined;

  constructor(options: (string | null)[]) {
    if (options) {
      this.options = options;

      for (let text of options) {
        if (!text) {
          continue;
        }

        let firstLetter = text[0].toLowerCase();

        if (!this.namesByLetter[firstLetter]) {
          this.namesByLetter[firstLetter] = [];
        }

        this.namesByLetter[firstLetter].push(text);
      }
    }
  }

  findOptionIndex(e: KeyboardEvent, activeIndex: number) {
    let letter = e.key.toLowerCase();

    if (!this.namesByLetter[letter]) {
      return -1;
    }

    if(this.previousLetter !== null && this.previousLetter !== letter) {
      this.currentIndexes[this.previousLetter] = 0;
    }

    this.previousLetter = letter;

    if (this.currentIndexes[letter] === undefined) {
      this.currentIndexes[letter] = 0;
    }

    let name = this.namesByLetter[letter][this.currentIndexes[letter]];

    if (!this.options) return -1;

    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i] === name) {
        activeIndex = i;
        break;
      }
    }

    this.currentIndexes[letter] = (this.currentIndexes[letter] + 1) % this.namesByLetter[letter].length;

    return activeIndex;
  }
}