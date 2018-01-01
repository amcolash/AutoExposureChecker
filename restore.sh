#!/bin/sh

BASE_PATH=/home/andrew/Desktop/test/December25
BACKUP_PATH=/home/andrew/Desktop/test/December25_bak/

rsync -v -a $BACKUP_PATH $BASE_PATH