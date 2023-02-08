/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
// eslint-disable-next-line
export default function shuffle(a: Array<any>): Array<any> {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a
}
