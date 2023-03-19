#!/bin/bash

set -eu
cd `dirname $0`/

set +e

TARGET_DIR=out/cases_out
mkdir -p $TARGET_DIR
sudo umount $TARGET_DIR ||:
rm -rf $TARGET_DIR
mkdir $TARGET_DIR
sudo mount -t tmpfs -o size=1g tmpfs $TARGET_DIR

TARGET_DIR=out/cases
mkdir -p $TARGET_DIR
sudo umount $TARGET_DIR ||:
rm -rf $TARGET_DIR
mkdir $TARGET_DIR
sudo mount -t tmpfs -o size=1g tmpfs $TARGET_DIR
