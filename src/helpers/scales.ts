/* Libs */
import { quantile, ckmeans } from 'simple-statistics';

/* Interfaces. */
/* Scale color example :
  0: {key: 1, value: "#FFEDA0"}
  1: {key: 19.5, value: "#FED976"}
  2: {key: 37, value: "#FEB24C"}
  3: {key: 55.5, value: "#FD8D3C"}
  4: {key: 84.5, value: "#FC4E2A"}
  5: {key: 133.5, value: "#E31A1C"}
  6: {key: 193, value: "#BD0026"}
  7: {key: 540, value: "#800026"}
*/
export type scaleColor = {
  key: number    /* minimum value */
  value: string  /* color value */
}

export function getQuantileDivision(data: number[], nbDivision: number): number[] {
  const quantiles = [];

  for (let i = 0; i < nbDivision; i++) {
    quantiles.push((100/nbDivision*i)/100);
  }

  return quantile(data, quantiles);
}

export function buildQuantileScale(data: number[], colors: string[]): scaleColor[] {
  const scale = getQuantileDivision(data, colors.length);

  return scale.reduce((acc, curr, i) => {
    acc.push({key: curr, value: colors[i]});
    return acc;
  }, []);
}

export function getEqualsDivision(data: number[], nbDivision: number): number[] {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const equals = [];

  for (let i = 0; i < nbDivision; i++) {
    equals.push(min + (max-min)/nbDivision * i);
  }

  return equals;
}

export function buildEqualsScale(data: number[], colors: string[]): scaleColor[] {
  const equals = getEqualsDivision(data, colors.length);

  return equals.reduce((acc, curr, i) => {
    acc.push({key: curr, value: colors[i]});
    return acc;
  }, []);
}

/* ckmeans seems to be an improvement of jenks natural breaks which is
 * a common classifier used in choropleth maps.
 * https://simplestatistics.org/docs/#ckmeans
 */
export function getCkmeansDivision(data: number[], nbDivision: number): number[] {
  const clusters = ckmeans(data, nbDivision);
  const breaks = [];

  /* clusters of similar numbersm, with nbDivision = 3:
   * [[-1, -1, -1, -1], [2, 2, 2], [4, 5, 6]]);
   */

  for (let i = 0; i < nbDivision ; i++) {
    breaks.push(Math.min(...clusters[i]));
  }

  return breaks;
}

export function buildCkmeansScale(data: number[], colors: string[]): scaleColor[] {
  const breaks = getCkmeansDivision(data, colors.length);

  return breaks.reduce((acc, curr, i) => {
    acc.push({key: curr, value: colors[i]});
    return acc;
  }, []);
}
