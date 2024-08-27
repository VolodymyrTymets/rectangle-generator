# Rectangle generator

For generating rectangle impulses with different frequency

<img src="https://github.com/VolodymyrTymets/rectangle-generator/blob/master/private/schema.png?raw=true" alt="schema" height="250">


<img src="https://github.com/VolodymyrTymets/rectangle-generator/blob/master/private/result.jpg?raw=t" alt="result" height="250">

## Start 

`npm start` or `node ./ <frequency> <mode>`, where

- frequency - number from 1 to 2000 (default 1Hz) - represent frequency of impulses from 1 to 2000 Hz;
- mode - 1 | 2 | 3 (default 1) - represent the form of impulses;

To run adjustment mode run `node ./adjustment.js` and pass 6 params each of them represent the time between rectangle

## Autorun 
```
npm run autorun-redis
npm run autorun
pm2 save
``` 