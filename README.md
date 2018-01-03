# AutoExposureChecker
This is a simple tool that I made for myself to make the process of weeding through hundereds of photos a bit easier. Often I use exposure bracketing which gives me more chances for my shots (lighting, focus, etc) but also results in images that are often very over/underexposed in some conditions.

This tool will allow you to scan a folder of images and move the ones that you would normally weed out into a different place.

If you have never used a terminal/cmd line, I am sorry but no gui is planned for this tool - but now is a great time to learn (it is super easy to use).

I have tested this tool on linux (ubuntu 16.04) and should work on all *nix/osx distros without a hiccup. I have not and will not be testing on windows. If you run into errors, send along the log to the [issue tracker](https://github.com/amcolash/AutoExposureChecker/issues) and maybe we can figure it out!

> You use this tool at YOUR OWN RISK. I have tested it and it works for my needs, but as with anything that can manipulate your precious photos - make a backup just in case. It _should not_ delete anything, and only moves things around, but better safe than sorry. Cheers!

## Getting Started
To run this tool, you will need a few things first:
- [nodejs](https://nodejs.org/)
- [imagemagick](https://www.imagemagick.org/)
- [exiftool](https://www.sno.phy.queensu.ca/~phil/exiftool/)

## Clone the tool repo and set things up
Let's open up a terminal and get things rolling! If you have never used a terminal/cmd line, I am sorry but no gui is planned for this tool.

``` bash
$ git clone https://github.com/amcolash/AutoExposureChecker
$ cd AutoExposureChecker
$ npm install
```

**Note:** You can just download the repo in a zip from github if you are not familiar with git.

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