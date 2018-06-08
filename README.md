# Rectangle generator

For generating rectangle impulses with different frequency

![](https://github.com/VolodymyrTymets/rectangle-generator/blob/master/private/schema.png =100x20)

![](https://github.com/VolodymyrTymets/rectangle-generator/blob/master/private/result.jpg =100x20)

## Start 

`npm start` or `node ./ <frequency> <mode>`, where

- frequency - number from 1 to 2000 (default 1Hz) - represent frequency of impulses from 1 to 2000 Hz;
- mode - 1 | 2 | 3 (default 1) - represent the form of impulses;

To run adjustment mode run `node ./adjustment.js` and pass 6 params each of them represent the time between rectangle
