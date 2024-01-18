const sleep = require('sleep');
const Gpio = require('onoff').Gpio;

let out1 = null;
let out2 = null;
const outNumber1  = process.argv[5] && parseInt(process.argv[6]) || 14;
const outNumber2  = process.argv[6] && parseInt(process.argv[6]) || 15;
const freqArg = (process.argv[2] && parseInt(process.argv[2]) || parseInt(process.env.FREQ, 10) || 200);
const position = process.argv[3] ||  parseInt(process.env.POSITION, 10) || 1;
const corelation = process.argv[4] && parseFloat(process.argv[4]) || parseFloat(process.env.COR) || 1;
// todo: remove * 1000 need only for test reason (frequ in Hz need to be in kHz)
const stepTime = Math.round((1000000 / freqArg) / 6) * 100;

try {
  console.log(`run on gpio [${outNumber1}] [${outNumber2}] with frequency [${freqArg}] and position [${position}] and corelation [${corelation}]`);
  out1 = new Gpio(outNumber1, 'out');
  out2 = new Gpio(outNumber2, 'out');
} catch (err) {
  console.log('Error -> GPIO is not detected!!!');
  process.exit();
}

const positionMap = {
  '1': [stepTime, Math.round(stepTime * corelation), stepTime, stepTime, Math.round(stepTime * corelation), stepTime],
  '2': [0, Math.round(stepTime * corelation), stepTime, 0, Math.round(stepTime * corelation), stepTime],
};

let step = 1;
const times = positionMap[position] || positionMap['1'];

do {
  if (step === 1) {
    out1.writeSync(0)
    out2.writeSync(0)
  }
  if(step === 2) {
    out1.writeSync(1)
    out2.writeSync(0)
  }
  if(step === 3) {
    out1.writeSync(0)
    out2.writeSync(0)
  }
  if (step === 4){
    out1.writeSync(0)
    out2.writeSync(0)
  }
  if(step === 5) {
    out1.writeSync(0)
    out2.writeSync(1)
  }
  if(step === 6) {
    step = 1;
    out2.writeSync(0);
    out2.writeSync(0);
  }
  times[step] - 1 && sleep.usleep(times[step -1]);
  step ++;
} while (true);
