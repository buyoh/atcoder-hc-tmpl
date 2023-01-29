#!/bin/bash

set -eu
cd `dirname $0`/..

if [[ -e vis.html ]]; then
  echo "./vis.html should not exist."
  exit 1
fi

mkdir -p out/cases_out

TOTAL_P=0

for FILE in `ls out/cases`; do
  FILE_STDIN="out/cases/$FILE"
  FILE_STDOUT="out/cases_out/$FILE.out.txt"
  FILE_STDERR="out/cases_out/$FILE.err.txt"
  echo $FILE

  ./bin/run.sh < $FILE_STDIN 1> $FILE_STDOUT 2> $FILE_STDERR &
  
  TOTAL_P=$(($TOTAL_P+1))
  if [[ 10 -le $TOTAL_P ]]; then
    wait
    TOTAL_P=0
  fi
done
wait

TOTAL_SCORE=0

for FILE in `ls out/cases`; do
  FILE_STDIN="out/cases/$FILE"
  FILE_STDOUT="out/cases_out/$FILE.out.txt"
  FILE_STDERR="out/cases_out/$FILE.err.txt"

  # if CALC_SCORE_MYSELF; then
  SCORE=`tail $FILE_STDERR -n1 | tr -cd "^0-9"`
  # else
  # RES=`./third_party/tools/target/release/vis $FILE_STDIN $FILE_STDOUT 2>&1`
  # SCORE=`echo $RES | tail -n1 | tr -cd "^0-9"`
  # mv vis.html out/cases_out/$FILE.vis.html
  # fi
  echo "case '$FILE': score=$SCORE"
  TOTAL_SCORE=$(($TOTAL_SCORE+$SCORE))
done
# echo "total score:"
printf "%.4e" $TOTAL_SCORE
