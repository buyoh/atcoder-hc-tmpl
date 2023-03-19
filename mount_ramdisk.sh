#!/bin/bash

set -eu
cd `dirname $0`/


if [[ "`whoami`" != "root" ]]; then
  echo "root is required"
  exit 1
fi

set +e


TARGET_DIR=out/cases_out
umount $TARGET_DIR ||:
rm -rf $TARGET_DIR
mkdir $TARGET_DIR
mount -t tmpfs -o size=1g tmpfs $TARGET_DIR

TARGET_DIR=out/cases
umount $TARGET_DIR ||:
rm -rf $TARGET_DIR
mkdir $TARGET_DIR
mount -t tmpfs -o size=1g tmpfs $TARGET_DIR
