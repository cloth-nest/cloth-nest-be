import * as _ from 'lodash';

export function hasDuplicates(arr: Array<any>): boolean {
  return _.uniq(arr).length !== arr.length;
}
