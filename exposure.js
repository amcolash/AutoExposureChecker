#!/usr/bin/env node

const fs = require('fs');
const im = require('imagemagick');
const Rawly = require('rawly').default;

var imageFormat = ".CR2";
var underExposed = 0.25;
var overExposed = 1 - underExposed;

var args = [];

// Parse out the node path from the args (if supplied)
for (var i = 0; i < process.argv.length; i++) {
    var arg = process.argv[i];
    if (!arg.includes("/node")) {
        args.push(arg);
    }
}

function usage() {
    console.error("usage: exposure.js images_path [--underExposed 0.25] [--overExposed 0.75] [--format .CR2]");
    process.exit(1);
}

// If something went wrong with the usage
if (args.length < 2) {
    usage();
}

// Keep track of how long things take
var startTime = Date.now();


var imagePath = args[1];
// Add trailing / if not included in the path
if (!imagePath.endsWith("/")) {
    imagePath += "/";
}

if (args.length > 2) {
    for (var i = 2; i < args.length; i++) {
        switch(args[i]) {
            case "--underExposed":
                if (args.length > i) {
                    underExposed = Number.parseFloat(args[i + 1]);
                    i++;
                } else {
                    usage();
                }
                break;
            case "--overExposed":
                if (args.length > i) {
                    overExposed = Number.parseFloat(args[i + 1]);
                    i++;
                } else {
                    usage();
                }
                break;
            case "--format":
                if (args.length > i) {
                    imageFormat = args[i + 1];
                    if (!imageFormat.startsWith(".")) imageFormat = "." + imageFormat;
                    i++;
                } else {
                    usage();
                }
                break;
            default:
                break;
        }
    }
}

// Syncronously grab file list
var files = fs.readdirSync(imagePath);

var filtered = [];
for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if (file.endsWith(imageFormat)) {
        filtered.push(file);
    }
}

// Sort files in order of file name
files = filtered.sort(function(a, b) {
    return a.localeCompare(b);
});

// Set up some variables
var index = -1;
var regex = new RegExp(/\(\d*.?\d*\)/g);
var numMoved = 0;

// if we specified a threshold in the arguments, cap it at 0.45
console.log("Checking " + files.length + " " + imageFormat + " files with a threshold of [" + underExposed + " - " + overExposed + "]");

// Kick off the read process
next();

function next() {
    index++;

    // Loop through each file until done
    if (index < files.length) {
        var file = files[index];
        var image = imagePath + file;

        if (!image.endsWith(".jpg")) {
            var r = new Rawly(image);
            r.extractPreview('1200x900', '-preview') // Scale to more reasonable size and append -preview to the end 
                .then((extracted) => {
                    // if (extracted) console.log('Extracted a photo...');
                    // if (!extracted) console.log('Skipped this one because a preview was already extracted.');

                    var preview = image.replace(imageFormat, "-preview.jpg");

                    identify(preview, image, file);
                })
                .catch((err) => {
                    console.error(err.message);
                    next();
                });
        } else {
            identify(image, image, file);
        }
    } else {
        console.log("Processing images took " + (Date.now() - startTime) / 1000 + " seconds");
        console.log("Moved " + numMoved + " images to autoExposure/, out of " + files.length + " total files.");
    }
}

function identify(preview, image, file) {
    // run identify command from imagemagick
    im.identify(preview, function (err, features) {
        if (err) {
            console.error(err);
            next();
            return;
        };

        // Delete the preview after info has been obtained
        if (preview.endsWith("-preview.jpg")) {
            fs.unlinkSync(preview);
        }

        // Get the mean value of the image and do some regex magic
        var mean = features["image statistics"].overall.mean;
        var value = mean.match(regex);

        if (value.length == 1) {
            // replace () in the value
            value = value[0].replace("(", "").replace(")", "");

            var num = Number.parseFloat(value);

            if (num < underExposed || num > overExposed) {
                // If we need to move things
                var action = "moved to autoExposure/";

                if (!fs.existsSync(imagePath + "autoExposure")) {
                    fs.mkdirSync(imagePath + "autoExposure");
                }

                fs.renameSync(image, imagePath + "autoExposure/" + file);

                numMoved++;
            } else {
                // No action needed
                var action = "no action";
            }

            console.log("checked file: " + file + ", mean value: " + value + ", " + action);
        }

        next();
    });
}