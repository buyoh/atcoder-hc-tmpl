#!/bin/bash

set -eu
cd `dirname $0`/..

target/debug/main

# An interactive problem style for Atcoder heuristic contest
# TARGET=$(realpath target/debug/main)
# (cd third_party/tools && cargo run --release --bin tester $TARGET)
