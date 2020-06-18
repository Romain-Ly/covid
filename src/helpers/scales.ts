/* Libs */
import { quantile, ckmeans } from 'simple-statistics';

/* Interfaces. */
export type scaleColor = {
  key: number
  value: string
}

export function buildQuantileScale(data: number[], colors: string[]): scaleColor[] {
  const nbDivision = colors.length;
  const quantiles = [];

  for (let i = 0; i < nbDivision; i++) {
    quantiles.push((100/nbDivision*i)/100);
  }

  const scale = quantile(data, quantiles);

  return scale.reduce((acc, curr, i) => {
    acc.push({key: curr, value: colors[i]});
    return acc;
  }, []);
}

export function buildEqualsScale(data: number[], colors: string[]): scaleColor[] {
  const nbDivision = colors.length;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const equals = [];

  for (let i = 0; i < nbDivision; i++) {
    equals.push(min + (max-min)/nbDivision * i);
  }
  return equals.reduce((acc, curr, i) => {
    acc.push({key: curr, value: colors[i]});
    return acc;
  }, []);
}

/* ckmeans seems to be an improvement of jenks natural breaks which is
 * a common classifier used in choropleth maps.
 * https://simplestatistics.org/docs/#ckmeans
 */
export function buildCkmeansScale(data: number[], colors: string[]): scaleColor[] {
  const nbDivision = colors.length;
  const clusters = ckmeans(data, nbDivision);
  const breaks = [];

  /* clusters of similar numbersm, with nbDivision = 3:
   * [[-1, -1, -1, -1], [2, 2, 2], [4, 5, 6]]);
   */

  for (let i = 0; i < nbDivision ; i++) {
    breaks.push(Math.min(...clusters[i]));
  }

  return breaks.reduce((acc, curr, i) => {
    acc.push({key: curr, value: colors[i]});
    return acc;
  }, []);
}
