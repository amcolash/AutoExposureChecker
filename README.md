# AutoExposureChecker
Check the (approximate) exposure of a folder of images and move under/over exposed images out

## Getting Started
To run this tool, you will need a few other things first:
- git
- node
- imagemagick
- exiftools

## Clone the tool repo and set things up
``` bash
git clone https://github.com/amcolash/AutoExposureChecker
cd AutoExposureChecker
npm install
```

## Usage
`exposure.js images_path [--underExposed 0.25] [--overExposed 0.75] [--format .CR2]`

| Argument                      | Default | Description                                                                                                       |
|-------------------------------|---------|-------------------------------------------------------------------------------------------------------------------|
| <nobr>`image_path`</nobr>     | -----   | Required (ex: ~/Photos/test). |
| <nobr>`--underExposed`</nobr> | 0.25    | Lower bound threshold of the average of the image pixel values (from 0-1.0). Anything below this value will be considered underexposed and moved. |
| <nobr>`--overExposed`</nobr>  | 0.75    | Upper bound threshold of the average of the image pixel values (from 0-1.0). Anything above this value will be considered overexposed and moved. |
| <nobr>`--format`</nobr>       | CR2     | Image format to process and check. |