export type CsvRes = {
  [key: string]: string
}

type CsvParserRes = (text: string, delimiter: string) => CsvRes[];

const parseCsv: CsvParserRes = (text: string, delimiter: string) => {
  /* Very simple and not optimised csv parser.
   * We supposed that there is a header on the first line
   */
  const Lines = text.split(/\r\n|\n/);
  let headers = Lines[0].split(delimiter).map((col) => {
    /* Trim " or ' at beginning or at the end of column. */
    return col.replace(/^["']+|["']+$/g, '');
  });
  const res = [];

  for (let i=1; i < Lines.length; i++) {
    let cols = Lines[i].split(delimiter);
    cols = cols.map((x) => x.replace(/^["']+|["']+$/g, ''));

    if (cols.length == headers.length) {
      let line = {};
      for (let j=0; j < headers.length; j++) {
        line = {
          [headers[j]] : cols[j],
          ...line
        };
      }
      res.push(line);
    } else
    if (Lines[i].length !== 0) {
      /**
       * Catch only non empty lines.
       */
      console.info(
        `csv parse: column missing on line ${i}:
          ${headers}
          -----------
          ${cols}
        `
      );
      console.info(`csv parse: column missing on line ${i}`);
    }
  }
  return res;
};

const fetchCSv = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    return await response.text();
  } catch (error) {
    console.error(error);
  }
};

export const parseCsvFile = async (url: string, delimiter: string)  => {
  const data = await fetchCSv(url);
  return parseCsv(data, delimiter);
};
