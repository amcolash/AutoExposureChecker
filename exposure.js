#!/usr/bin/env node

const fs = require('fs');
const im = require('imagemagick');
const Rawly = require('rawly').default;

var imageFormat = "CR2";
var args = [];

// Parse out the node path from the args (if supplied)
for (var i = 0; i < process.argv.length; i++) {
    var arg = process.argv[i];
    if (!arg.includes("/node")) {
        args.push(arg);
    }
}

// If something went wrong with the usage
if (args.length < 2) {
    console.error("usage: exposure.js [images_path] (optional: exposure threshold, i.e. 0.2)");
    process.exit(1);
}

// Keep track of how long things take
var startTime = Date.now();


var imagePath = args[1];
// Add trailing / if not included in the path
if (!imagePath.endsWith("/")) {
    imagePath += "/";
}

// Syncronously grab file list
var files = fs.readdirSync(imagePath);

// Sort files in order of file name
files = files.sort(function(a, b) {
    return a.localeCompare(b);
});

// Set up some variables
var index = -1;
var regex = new RegExp(/\(\d*.?\d*\)/g);
var numMoved = 0;

// if we specified a threshold in the arguments, cap it at 0.45
var threshold = Math.min(0.45, args.length > 2 ? Number.parseFloat(args[2]) : 0.25);
console.log("Checking " + files.length + " files with a threshold of " + threshold);

// Kick off the read process
next();

function next() {
    index++;

    // Loop through each file until done
    if (index < files.length) {
        var file = files[index];
        var image = imagePath + file;

        if (!image.endsWith(imageFormat)) {
            next();
            return;
        }

        var r = new Rawly(image);
        r.extractPreview('1200x900') // Scale to more reasonable size and append -preview to the end 
            .then((extracted) => {
                // if (extracted) console.log('Extracted a photo...');
                // if (!extracted) console.log('Skipped this one because a preview was already extracted.');

                var preview = image.replace(imageFormat, "jpg");

                // run identify command from imagemagick
                im.identify(preview, function (err, features) {
                    if (err) {
                        console.error(err);
                        next();
                        return;
                    };

                    // Delete the preview after info has been obtained
                    fs.unlinkSync(preview);

                    // Get the mean value of the image and do some regex magic
                    var mean = features["image statistics"].overall.mean;
                    var value = mean.match(regex);

                    if (value.length == 1) {
                        // replace () in the value
                        value = value[0].replace("(", "").replace(")", "");

                        var num = Number.parseFloat(value);

                        if (num < threshold || num > 1.0 - threshold) {
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
            })
            .catch((err) => {
                console.error(err.message);
                next();
            });
    } else {
        console.log("Processing images took " + (Date.now() - startTime) / 1000 + " seconds");
        console.log("Moved " + numMoved + " images to autoExposure/");
    }
}