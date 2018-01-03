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

```
required arguments:
    image_path              Path of the folder to scan, ex: ~/Photos/test.
                            Note: this tool does not recursively scan folders and I don't think it should (for image safety).

optional arguments:
    --underExposed, -u      Lower bound threshold of the average pixel value of the image (from 0-1.0).
                            Anything below this value will be considered underexposed and moved.
                            (Default: 0.25)

    --overExposed, -o       Upper bound threshold of the average pixel value of the image (from 0-1.0).
                            Anything above this value will be considered overexposed and moved.
                            (Default: 0.75)

    --format, -f            Image format that the tool will process and check.
                            (Default: .CR2)
```