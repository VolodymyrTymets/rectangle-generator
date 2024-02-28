const redis = require('redis');
const { fork } = require('node:child_process');

let frequency = 20
let position = 1
let corelation = 1
let chield = null

const getParams = (client) =>
  Promise.all([
    client.get('settings:frequency'),
    client.get('settings:frequency-type'),
    client.get('settings:frequency-corelation')
  ])

const start = (freq, pos, cor) => {
  console.debug(`START generator freq:${freq} pos:${pos} cor:${cor}`)
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork('./generator.js', [freq, pos, cor], { signal });
  child.on('error', (error) => {
    console.error('Erro on start generatoe')
  });
  return controller
}

redis.createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect().then(client => {
    console.log('Redis is connected:')
    getParams(client).then((res) => {
      console.debug(res)
      chield = start(...res)
      frequency = res[0]
      position = res[1]
      corelation = res[2]
    })

    setInterval(() => {
      getParams(client).then((res) => {
        if (frequency !== res[0] || position !== res[1] || corelation !== res[2]) {
          console.debug('STOP generator')
          chield.abort();
          setTimeout(() => {chield = start(...res)}, 10)
        }
        frequency = res[0]
        position = res[1]
        corelation = res[2]
      })
    }, 500)
  })



