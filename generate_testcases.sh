#!/bin/bash

set -eu
cd `dirname $0`/

NUM_TESTCASES=$1

if [[ -z $NUM_TESTCASES ]]; then
  NUM_TESTCASES=100
fi

mkdir -p out/cases/

i=0
for f in `./bin/generate_input_and_list.sh $NUM_TESTCASES`; do
  cp $f out/cases/in_$(printf "%06d" $i).txt
  i=$(($i+1))
done
