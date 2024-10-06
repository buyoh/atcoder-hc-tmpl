#!/bin/bash

cd `dirname $0`

A_URL=$1

set -eu

[[ -e third_party_tmp ]] && echo "third_party_tmp exists. abort!" && exit 1

if [[ -n $A_URL ]]; then

  mkdir third_party_tmp
  pushd third_party_tmp > /dev/null

  wget $A_URL
  ZIP_FILENAME=`ls`

  unzip $ZIP_FILENAME
  rm $ZIP_FILENAME
  TOOL_NAME=`ls`
  echo $TOOL_NAME
  TOOL_NAME=`readlink -f $TOOL_NAME`

  popd > /dev/null

  mkdir -p third_party

  pushd third_party > /dev/null

  mv $TOOL_NAME .
  TOOL_NAME=`basename $TOOL_NAME`
  echo "$TOOL_NAME/target" >> .gitignore
  echo "$TOOL_NAME/in" >> .gitignore

  popd > /dev/null
  rm -rf third_party_tmp
else
  TOOL_NAME=tools
fi

echo "Suppose that it's traditional AtCoder tools and try to build" # but we will not build :(


cp bin/atcoder/generate_input_and_list.sh bin/generate_input_and_list.sh

pushd third_party/$TOOL_NAME > /dev/null

cargo build --release

popd > /dev/null

if [[ -d third_party/$TOOL_NAME/in/ ]]; then
  echo "third_party/$TOOL_NAME/in/ exists."
fi

./generate_testcases.sh 100
rm stdin/* ||:
ls out/cases/ | head -n3 | xargs -I{} cp out/cases/{} stdin
mkdir -p analysis/input
(cd out/cases && ls) > analysis/input/_all.txt

echo "complete!"
