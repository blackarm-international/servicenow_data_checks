let exampleBoolean: boolean | null;
let exampleFloat: number | null;
let exampleInteger: number | null;
let exampleString: string | null;
let exampleUnixTime: number | null;
let test: any;
//
// @ts-ignore
const gr = GlideRecord('xxxxxxxx');
gr.query();
while(gr.next()) {
  //
  exampleBoolean = null;
  test = gr.getValue('xxxxx');
  if (test === '0') {
    exampleBoolean = false;
  }
  if (test === '1') {
    exampleBoolean = true;
  }
  //
  exampleFloat = null;
  test = gr.getValue('xxxxx');
  if (!isNaN(parseFloat(test))) {
    exampleFloat = parseFloat(test);
  }
  //
  exampleInteger = null;
  test = gr.getValue('xxxxx');
  if (!isNaN(parseInt(test))) {
    exampleInteger = parseInt(test);
  }
  //
  exampleString = null;
  test = gr.getValue('xxxxx');
  if (typeof test === 'string' && test !== '') {
    exampleString = test;
  }
  //
  exampleUnixTime = null;
  test = gr.getValue('xxxxx');
  // @ts-ignore
  if (new GlideDateTime(testData).getNumericValue() !== 0) {
    // @ts-ignore
    exampleUnixTime = new GlideDateTime(testData).getNumericValue();
  }
}