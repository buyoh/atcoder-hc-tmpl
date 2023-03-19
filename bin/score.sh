#!/bin/bash

set -eu
cd `dirname $0`/..

FILE_STDIN=$1
FILE_STDOUT=$2
FILE_STDERR=$3
FILE_VIS=$4

if [[ -z $FILE_STDIN ]] || [[ -z $FILE_STDOUT ]] || [[ -z $FILE_STDERR ]] || [[ -z $FILE_VIS ]]; then
  echo "$0 file_stdin file_stdout file_stderr" >&2
  exit 1
fi

# if CALC_SCORE_MYSELF; then
# tail -n1 $FILE_STDERR
# else
./third_party/tools/target/release/vis $FILE_STDIN $FILE_STDOUT
#cat vis.html src/vistool.html > $FILE_VIS # out/$ID.vis.html
#rm vis.html
mv vis.html $FILE_VIS
# fi

