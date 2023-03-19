#!/bin/bash

set -eu
cd `dirname $0`/..

NUM_TESTCASES=$1

DIR_FILES=third_party/tools/in

if [[ -z $NUM_TESTCASES ]]; then
  ls $DIR_FILES/* -1
  exit 0
fi

MAX_TESTCASES=$(ls -U1 $DIR_FILES/* | wc -l)

if [[ $MAX_TESTCASES -lt $NUM_TESTCASES ]]; then
  pushd third_party/tools > /dev/null
  seq 0 $NUM_TESTCASES > ./seeds.txt
  cargo run -q --release --bin gen ./seeds.txt
  popd > /dev/null
fi

ls $DIR_FILES/* -1 | head -n$NUM_TESTCASES
