# dmi-to-png

This project converts weather icons from [DMI](https://www.dmi.dk/) to a PNG format, so they can be used for [pillow](https://pillow.readthedocs.io/en/stable/) on an RPi ink screen.

## How to use

### Requirements

1. node 16+
1. yarn

### Running

Run the following 2 commands in the project root:

```
yarn install
yarn start
```

After the last command have finished running, there should be a folder in the project root called "out" that will contain all the generated PNGs.
