/* Helpers */
import { parseCsvFile, CsvRes } from '../helpers/csv';
import { toInteger } from '../helpers/numbers';

/* Types */
interface HospProps { /* https://www.data.gouv.fr/fr/datasets/r/4900f53f-750d-4c5a-9df7-2d4ceb018acf */
  jour: Date  /* date */
  dep: string,   /* department. It should be an integer but Corse = [2A. 2B]. */
  hosp: number,  /* hospitalization. */
  rad: number,   /* returns to home. */
  rea: number,   /* reanimation. */
  dc: number,    /* deceseased. */
  // sexe: number,  /* {1: 'M', 2: 'F', 0: 'M + F' }. Not used. */
}

type DayMap = Map<Date, HospProps>;

type AggrHospProps = {
  dayMap: DayMap
} & HospProps;

type AggrMap = Map<string, AggrHospProps>;

/* Helpers */

function buildHospProps(data: CsvRes) {
  return {
    jour: new Date(data.jour),
    dep: data.dep as string,
    hosp: toInteger(data.incid_rad),
    rad: toInteger(data.incid_rad),
    rea: toInteger(data.incid_rea),
    dc: toInteger(data.incid_dc),
  };
}

export const fetchHospitalisationData = async () => {
  const url = 'https://www.data.gouv.fr/fr/datasets/r/6fadff46-9efd-4c53-942a-54aca783c30c';
  const data = await parseCsvFile(url, ';');

  /* TODO check if HospProps properties are present in csv results. */

  const res: AggrMap = new Map();

  data.forEach((curr: CsvRes) => {
    if (toInteger(curr.sexe) !== 0) {
      return;
    }

    let key = curr.dep;
    let day = new Date(curr.jour);
    const line = buildHospProps(curr);

    if (res.has(key)) {
      const dept = res.get(key);

      dept.dayMap.set(day, line);
      dept.hosp += line.hosp;
      dept.rad += line.rad;
      dept.rea += line.rea;
      dept.dc += line.dc;
    } else {
      res.set(key, {
        dayMap: new Map<Date, HospProps>([[day, line]]),
        ...line
      });
    } /* end else */
  });

  return res;
};
