const _ = require('lodash');
const sleep = require('sleep');
const Gpio = require('onoff').Gpio;

let out1 = null;
let out2 = null;
const outNumber1  = process.argv[4] && parseInt(process.argv[4]) || 14;
const outNumber2  = process.argv[4] && parseInt(process.argv[5]) || 15;

const freqArg = process.argv[2] && parseInt(process.argv[2]) || parseInt(process.env.FREQ, 10) || 200;
const position = process.argv[3] ||  parseInt(process.env.POSITION, 10) || 1;
const ratting = process.argv[4] ||  parseInt(process.env.POSITION, 10) || 50;

const stepTime = _.round((1000000 / freqArg) / 6);

try {
  console.log(`run on gpio [${outNumber1}] [${outNumber2}] with frequency [${freqArg}] and position [${position}]`);
  out1 = new Gpio(outNumber1, 'out');
  out2 = new Gpio(outNumber2, 'out');
} catch (err) {
  console.log('Error -> GPIO is not detected!!!');

  const stepTimeRatting = stepTime * (ratting / 100);
  const positionMap = {
    '1': [stepTime, stepTime, stepTime, stepTime, stepTime, stepTime], // _|^|_ _|^|_
    '2': [0, stepTime * 2, stepTime, 0, stepTime * 2, stepTime], // |^^|_ |^^|_
    '3': [0, stepTime * 3, 0, 0, stepTime * 3, 0], // |^^^| |^^^|
    '4': [0, stepTime, stepTime * 2, 0, stepTime, stepTime * 2], // |^|__ |^|__
    '5': [0, stepTimeRatting, stepTime - stepTimeRatting, 0, stepTimeRatting, stepTime - stepTimeRatting], // |^|__ |^|__ R
  };

  console.log('with positions ->', positionMap);
  process.exit();
}

const stepTimeRatting = stepTime * (ratting / 100);
const positionMap = {
  '1': [stepTime, stepTime, stepTime, stepTime, stepTime, stepTime], // _|^|_ _|^|_
  '2': [0, stepTime * 2, stepTime, 0, stepTime * 2, stepTime], // |^^|_ |^^|_
  '3': [0, stepTime * 3, 0, 0, stepTime * 3, 0], // |^^^| |^^^|
  '4': [0, stepTime, stepTime * 2, 0, stepTime, stepTime * 2], // |^|__ |^|__
  '5': [0, stepTimeRatting, stepTime - stepTimeRatting, 0, stepTimeRatting, stepTime - stepTimeRatting], // |^|__ |^|__ R
};

console.log('with positions ->', positionMap);

let step = 1;
const times = positionMap[position] || positionMap['1'];

do {
  if(step === 1) {
    out2.writeSync(0);
    out1.writeSync(0);
  }
  if(step === 2) {
    out1.writeSync(1)
  }
  if(step === 3) {
    out1.writeSync(0)
  }
  if(step === 4) {
    out1.writeSync(0);
    out2.writeSync(0)
  }
  if(step === 5) {
    out2.writeSync(1)
  }
  if(step === 6) {
    step = 1;
    out2.writeSync(0);
  }
  times[step] - 1 && sleep.usleep(times[step -1]);
  step ++;
} while (true);
