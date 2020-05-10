/* Helpers */
import { parseCsvFile, CsvRes } from '../helpers/csv';
import { toInteger } from '../helpers/numbers';

/* Interfaces */
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

interface DeptHospProps {
  dayMap: DayMap,
  total: HospProps
}

type DeptMap = Map<string, DeptHospProps>;

export interface HospData {
  deptData: DeptMap,
  countryTotal: HospProps,
}

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

function computeHospProps(
  a: HospProps, b: HospProps, cb: (x: number, y: number) => number): HospProps
{
  return ({
    jour: a.jour,
    dep: a.dep,
    hosp: cb(a.hosp, b.hosp),
    rad: cb(a.rad, b.rad),
    rea: cb(a.rea, b.rea),
    dc: cb(a.dc, b.dc)
  });
}

function addHospProps(a: HospProps, b: HospProps) {
  return computeHospProps(a, b, (x: number, y: number) => x + y);
}

export const fetchHospitalisationData = async () => {
  const url = 'https://www.data.gouv.fr/fr/datasets/r/6fadff46-9efd-4c53-942a-54aca783c30c';
  const data = await parseCsvFile(url, ';');

  /* TODO check if HospProps properties are present in csv results. */

  const deptmap: DeptMap = new Map();
  let countryTotal: HospProps = {
    jour: new Date(), /* TODO take last date. */
    dep: 'france',
    hosp: 0,
    rad: 0,
    rea: 0,
    dc: 0
  };

  data.forEach((curr: CsvRes) => {
    if (toInteger(curr.sexe) !== 0) {
      return;
    }

    let key = curr.dep;
    let day = new Date(curr.jour);
    const line = buildHospProps(curr);

    countryTotal = addHospProps(countryTotal, line);

    if (deptmap.has(key)) {
      const dept = deptmap.get(key);

      dept.dayMap.set(day, line);
      dept.total = addHospProps(dept.total, line);

    } else {
      deptmap.set(key, {
        dayMap: new Map<Date, HospProps>([[day, line]]),
        total: line
      });
    } /* end else */
  });

  return ({
    deptData: deptmap,
    countryTotal: countryTotal
  });
};
