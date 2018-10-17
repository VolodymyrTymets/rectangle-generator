const _ = require('lodash');
const sleep = require('sleep');
const Gpio = require('onoff').Gpio;

let out1 = null;
let out2 = null;
const outNumber1  = process.argv[4] && parseInt(process.argv[4]) || 14;
const outNumber2  = process.argv[4] && parseInt(process.argv[5]) || 15;
const freqArg = process.argv[2] && parseInt(process.argv[2]) || 1;
const position = process.argv[3] || 1;
const stepTime = _.round((1000000 / freqArg) / 6);

try {
  console.log(`run on gpio [${outNumber1}] [${outNumber2}] with frequency [${freqArg}] and position [${position}]`);
  out1 = new Gpio(outNumber1, 'out');
  out2 = new Gpio(outNumber2, 'out');
} catch (err) {
  console.log('Error -> GPIO is not detected!!!');
  process.exit();
}

const positionMap = {
  '1': [stepTime, stepTime, stepTime, stepTime, stepTime, stepTime],
  '2': [0, stepTime * 2, stepTime, 0, stepTime * 2, stepTime],
  '3': [0, stepTime * 2, 0, 0, stepTime * 2, 0]
};

let step = 1;
const times = positionMap[position] || positionMap['1'];

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
