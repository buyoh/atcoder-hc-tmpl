#!/bin/bash

ARGS=$@

set -eu
cd `dirname $0`/

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
  ./bin/run.sh $ARGS < $FILE_STDIN > $FILE_STDOUT 2> $FILE_STDERR

  bash bin/score.sh $FILE_STDIN $FILE_STDOUT $FILE_STDERR out/$ID.vis.html
done
