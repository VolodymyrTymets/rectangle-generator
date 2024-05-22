const redis = require('redis');
const Gpio = require('onoff').Gpio;

let out1 = null;
let out2 = null;
let TIMES = [];
let STEP = 1;
let REDIS_ARGS = [];

const getRedisParams = (client) =>
  Promise.all([
    client.get('settings:frequency'),
    client.get('settings:frequency-type'),
    client.get('settings:frequency-corelation')
  ])

const setIterationTimes = (freq, position = 1, correlation = 1) => {
  console.log(`-> Set frequency [${freq}], position [${position}], correlation [${correlation}]`);
  const stepTime = Math.round((1000 / freq) / 6);
  const timeMap = {
    '1': [stepTime, Math.round(stepTime * correlation), stepTime, stepTime, Math.round(stepTime * correlation), stepTime],
    '2': [0, Math.round(stepTime * correlation), stepTime, 0, Math.round(stepTime * correlation), stepTime],
  };
  TIMES = timeMap[position] || timeMap['1'];
}

const iterator = () => {
  if (STEP === 1) {
    out1.writeSync(0)
    out2.writeSync(0)
  }
  if (STEP === 2) {
    out1.writeSync(1)
    out2.writeSync(0)
  }
  if (STEP === 3) {
    out1.writeSync(0)
    out2.writeSync(0)
  }
  if (STEP === 4) {
    out1.writeSync(0)
    out2.writeSync(0)
  }
  if (STEP === 5) {
    out1.writeSync(0)
    out2.writeSync(1)
  }
  if (STEP === 6) {
    STEP = 1;
    out2.writeSync(0);
    out2.writeSync(0);
  }
  TIMES[STEP] - 1 && setTimeout(iterator, TIMES[STEP - 1]);
  STEP++;
}

const main = () => {
  const outNumber1 = process.argv[5] && parseInt(process.argv[6]) || 14;
  const outNumber2 = process.argv[6] && parseInt(process.argv[6]) || 15;
  const freqArg = (process.argv[2] && parseInt(process.argv[2]) || parseInt(process.env.FREQ, 10) || 15);
  const freqPositionArg = process.argv[3] || parseInt(process.env.POSITION, 10) || 1;
  const freqCorrelationArg = process.argv[4] && parseFloat(process.argv[4]) || parseFloat(process.env.COR) || 1;

  try {
    console.log(`-> Start on GPIO [${outNumber1}] [${outNumber2}]`);
    out1 = new Gpio(outNumber1, 'out');
    out2 = new Gpio(outNumber2, 'out');
  } catch (err) {
    console.log('Error -> GPIO is not detected!!!')
    try {
      console.log(`-> Try Start on GPIO [${outNumber1}] [${outNumber2}] for Raspberry Pi 5`);
      out1 = new Gpio(outNumber1 + 571, 'out');
      out2 = new Gpio(outNumber2 + 571, 'out');
    } catch (err) {
      console.log('Error -> GPIO is not detected!!!');
      console.error(err)
      process.exit();
    }
  }
  setIterationTimes(freqArg, freqPositionArg, freqCorrelationArg);
  iterator();

  redis.createClient()
    .on('error', err => console.error('-> Redis Client Error', err))
    .connect().then(client => {
    console.log('-> Redis successfully connected:');
    getRedisParams(client).then((res) => {
      REDIS_ARGS = res;
    })

    setInterval(() => {
      getRedisParams(client).then((res) => {
        if (REDIS_ARGS[0] !== res[0] || REDIS_ARGS[1] !== res[1] || REDIS_ARGS[2] !== res[2]) {
          setIterationTimes(res[0], res[1], res[2]);
          REDIS_ARGS = res;
        }
      })
    }, 50)
  })
}

main();
