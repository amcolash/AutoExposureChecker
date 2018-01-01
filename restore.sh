#!/bin/sh

BASE_PATH=/home/andrew/Desktop/test/December25
BACKUP_PATH=/home/andrew/Desktop/test/December25_bak/

rm -rf $BASE_PATH/autoExposure
rm $BASE_PATH/*.jpg
rsync -v -a $BACKUP_PATH $BASE_PATH