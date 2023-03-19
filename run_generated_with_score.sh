#!/bin/bash

FILE_LIST=analysis/input/_all.txt
LOGGING=echo
LOGGING_F=printf

NUM_PARALLEL=16

while [[ $# > 0 ]]
do
arg="$1"
case $arg in
    --list)
    FILE_LIST=$2
    shift
    ;;
    --quiet)
    LOGGING=:
    LOGGING_F=:
    ;;
    --)
    # ./cmd.sh --list path.txt -- --arg1 --arg2 とすると
    # 実行ファイルに --arg1 --arg2 を渡せる
    shift
    break
    ;;
    *)
    echo "Unknow option "$arg
    exit 3
    ;;
esac
shift
done

ARGS=$@

set -eu
cd `dirname $0`/

if [[ -e vis.html ]]; then
  echo "./vis.html should not exist."
  exit 1
fi

mkdir -p out/cases_out

TOTAL_P=0

for FILE in `cat $FILE_LIST`; do
  FILE_STDIN="out/cases/$FILE"
  FILE_STDOUT="out/cases_out/$FILE.out.txt"
  FILE_STDERR="out/cases_out/$FILE.err.txt"
  $LOGGING $FILE

  ./bin/run.sh $ARGS < $FILE_STDIN 1> $FILE_STDOUT 2> $FILE_STDERR &
  
  TOTAL_P=$(($TOTAL_P+1))
  if [[ $NUM_PARALLEL -le $TOTAL_P ]]; then
    wait
    TOTAL_P=0
  fi
done
wait

TOTAL_P=0

for FILE in `cat $FILE_LIST`; do
  FILE_STDIN="out/cases/$FILE"
  FILE_STDOUT="out/cases_out/$FILE.out.txt"
  FILE_STDERR="out/cases_out/$FILE.err.txt"
  FILE_SCORE="out/cases_out/$FILE.score.txt"
  $LOGGING $FILE

  cat $FILE_STDERR > $FILE_SCORE
  # ./third_party/tools/target/release/qvis $FILE_STDIN $FILE_STDOUT > $FILE_SCORE &
  
  TOTAL_P=$(($TOTAL_P+1))
  if [[ $NUM_PARALLEL -le $TOTAL_P ]]; then
    wait
    TOTAL_P=0
  fi
done
wait

TOTAL_SCORE=0

for FILE in `cat $FILE_LIST`; do
  FILE_STDIN="out/cases/$FILE"
  FILE_STDOUT="out/cases_out/$FILE.out.txt"
  FILE_STDERR="out/cases_out/$FILE.err.txt"
  FILE_SCORE="out/cases_out/$FILE.score.txt"

  # if CALC_SCORE_MYSELF; then
  SCORE=`tail $FILE_STDERR -n1 | tr -cd "^0-9"`
  # else
  # SCORE=`cat $FILE_SCORE | tail -n1 | tr -cd "^0-9"`
  # mv vis.html out/cases_out/$FILE.vis.html
  # fi
  $LOGGING_F "case %12s: score=%15.2f\n" $FILE $SCORE
  TOTAL_SCORE=$(($TOTAL_SCORE+$SCORE))
done
# echo "total score:"
printf "%.4e\n" $TOTAL_SCORE
