#!/usr/bin/env node

const fs = require('fs');
const im = require('imagemagick');

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
})

// Set up some variables
var index = 0;
var regex = new RegExp(/\(\d*.?\d*\)/g);

// if we specified a threshold in the arguments
var threshold = args.length > 2 ? Number.parseFloat(args[2]) : 0.2;

// Kick off the read process
next();

function next() {
    // Loop through each file until done
    if (index < files.length) {
        var file = files[index];

        // run identify command from imagemagick
        im.identify(imagePath + file, function (err, features) {
            if (err) throw err;

            // Get the mean value of the image and do some regex magic
            var mean = features["image statistics"].overall.mean;
            var value = mean.match(regex);

            if (value.length == 1) {
                // replace () in the value
                value = value[0].replace("(", "").replace(")", "");
                
                var num = Number.parseFloat(value);

                if (num < threshold || num > 1.0 - threshold) {
                    // If we need to move things
                    var action = "moving file";

                    if (!fs.existsSync(imagePath + "autoExposure")) {
                        fs.mkdirSync(imagePath + "autoExposure");
                    }

                    fs.renameSync(imagePath + file, imagePath + "autoExposure/" + file);
                } else {
                    // No action needed
                    var action = "aok";
                }
                console.log(file + ", mean value: " + value + ", " + action);
            }

            index++;
            next();
        });
    }
}