const Gpio = require('onoff').Gpio;

let DEFAULT_FREQ = 15;
let out1 = null;
let out2 = null;
let TIMES = [];
let FREQ = (process.argv[2] && parseInt(process.argv[2]) || parseInt(process.env.FREQ, 10) || DEFAULT_FREQ);
let TYPE = (process.argv[3] || parseInt(process.env.POSITION, 10) || 1);
let STEP = 1;

const getProcessParams = (buffer) => {
  const [key, valueStr] = buffer.toString().split(':');
  const value = parseInt(valueStr);
  if (!Number.isInteger(value)) {
    return [FREQ, TYPE]
  }
  if(key === 'f') {
    return [value, TYPE];
  }
  if(key === 't') {
    return [FREQ, value];
  }
  return  [FREQ, TYPE]
}


const setIterationTimes = (freq, position) => {
  console.log(`[RG_app]-> Set frequency [${freq}], position [${position}]`);
  const stepTime = Math.round((1000 / freq) / 6);
  const timeMap = {
    '1': [stepTime, stepTime , stepTime, stepTime, stepTime, stepTime],
    '2': [0, stepTime, stepTime, 0, stepTime, stepTime],
  };
  TIMES = timeMap[position] || timeMap['1'];
  FREQ = freq
  TYPE = position
}

const iterator = () => {
  if (STEP === 1) {
    // out1.writeSync(0)
    // out2.writeSync(0)
  }
  if (STEP === 2) {
    // out1.writeSync(1)
    // out2.writeSync(0)
  }
  if (STEP === 3) {
    // out1.writeSync(0)
    // out2.writeSync(0)
  }
  if (STEP === 4) {
    // out1.writeSync(0)
    // out2.writeSync(0)
  }
  if (STEP === 5) {
    // out1.writeSync(0)
    // out2.writeSync(1)
  }
  if (STEP === 6) {
    STEP = 1;
    // out2.writeSync(0);
    // out2.writeSync(0);
  }
  TIMES[STEP] - 1 && setTimeout(iterator, TIMES[STEP - 1]);
  STEP++;
}

const main = () => {
  const outNumber1 = process.argv[5] && parseInt(process.argv[6]) || 14;
  const outNumber2 = process.argv[6] && parseInt(process.argv[6]) || 15;

  try {
    console.log(`[RG_app]-> Start on GPIO [${outNumber1}] [${outNumber2}]`);
    out1 = new Gpio(outNumber1, 'out');
    out2 = new Gpio(outNumber2, 'out');
  } catch (err) {
    console.log('[RG_app]-> Error: GPIO is not detected!!!')
    try {
      console.log(`[RG_app]-> Try Start on GPIO [${outNumber1}] [${outNumber2}] for Raspberry Pi 5`);
      out1 = new Gpio(outNumber1 + 571, 'out');
      out2 = new Gpio(outNumber2 + 571, 'out');
    } catch (err) {
      console.log('[RG_app]-> Error: GPIO is not detected!!!');
      console.error(err)
      // process.exit();
    }
  }
  setIterationTimes(FREQ, TYPE);
  iterator();
}

// on parent process message
process.stdin
  .on('data', data => setIterationTimes(...getProcessParams(data)))

main();

