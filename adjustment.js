const _ = require('lodash');
const sleep = require('sleep');
const Gpio = require('onoff').Gpio;

let out1 = null;
let out2 = null;

let step = 1;

const params = [2, 3, 4, 5, 6, 7].map(p => parseInt(process.argv[p]));
const times = params.map(t => _.isNumber(t) && ! _.isNaN(t) ? t : 166 * 1000);;

try {
  console.log(`run on gpio [14] [15]`);
  out1 = new Gpio(14, 'out');
  out2 = new Gpio(15, 'out');
} catch (err) {
  console.log('Error -> GPIO is not detected!!!');
  process.exit();
}

do {
  if(step === 6) {
    step = 1;
    out2.writeSync(1);
  }
  if(step === 2) {
    out1.writeSync(1)
  }
  if(step === 3) {
    out1.writeSync(0)
  }
  if(step === 5) {
    out2.writeSync(0)
  }
  times[step] - 1 && sleep.usleep(times[step -1]);
  step ++;
} while (true);
