#!/bin/bash

set -eu
cd `dirname $0`/..

if [[ -e vis.html ]]; then
  echo "./vis.html should not exist."
  exit 1
fi

for FILE in `ls stdin`; do
  ID="${FILE%%.*}"
  FILE_STDIN="stdin/$FILE"
  FILE_STDOUT="out/$ID.out.txt"
  FILE_STDERR="out/$ID.err.txt"

  echo $FILE
  ./bin/run.sh < $FILE_STDIN > $FILE_STDOUT 2> $FILE_STDERR

  # if CALC_SCORE_MYSELF; then
  tail -n1 $FILE_STDERR
  # else
  # ./third_party/tools/target/release/vis $FILE_STDIN $FILE_STDOUT
  # mv vis.html out/$ID.vis.html
  # fi
done
