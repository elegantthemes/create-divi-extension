#!/bin/bash
# Copyright (c) 2015-present, Facebook, Inc.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# ******************************************************************************
# This is an end-to-end test intended to be run via screencast.js
# Dependencies: asciinema, pv, core-utils
# ******************************************************************************
set -e

printf '\e[32m%s\e[m' "λ "
echo "npx create-divi-extension my-extension" | pv -qL $[10+(-2 + RANDOM%5)]
npx create-divi-extension my-extension --skip-questions=1
#repo_root="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
#cd $(dirname "${repo_root}") >/dev/null \
#  && rm -rf my-extension \
#  && yarn create-divi-extension my-extension --skip-questions=1 --scripts-version=file:./packages/divi-scripts

printf '\u001b[32m?\u001b[39m \u001b[1mExtension Name? (Shown in the WP Dashboard).\u001b[22m\u001b[0m \u001b[0m\u001b[2m(My Extension) \u001b[22m'
sleep 1
echo ""

printf '\u001b[32m?\u001b[39m \u001b[1mExtension URL?\u001b[22m\u001b[0m \u001b[0m\u001b[2m() \u001b[22m'
echo "https://divi-dev.com/my-extension" | pv -qL $[10+(-2 + RANDOM%5)]

printf '\u001b[32m?\u001b[39m \u001b[1mDescription?\u001b[22m\u001b[0m \u001b[0m\u001b[2m() \u001b[22m'
echo "Adds a custom module to the Divi Builder." | pv -qL $[10+(-2 + RANDOM%5)]

printf '\u001b[32m?\u001b[39m \u001b[1mAuthor?\u001b[22m\u001b[0m \u001b[0m\u001b[2m() \u001b[22m\u001b[13D\u001b[13C'
echo "Divi Developer" | pv -qL $[10+(-2 + RANDOM%5)]

printf '\u001b[32m?\u001b[39m \u001b[1mAuthor URL?\u001b[22m\u001b[0m \u001b[0m\u001b[2m() \u001b[22m'
echo "https://divi-dev.com" | pv -qL $[10+(-2 + RANDOM%5)]

printf '\u001b[32m?\u001b[39m \u001b[1mPrefix? (Unique identifier for variables, functions, and classes)\u001b[22m\u001b[0m \u001b[0m\u001b[2m(myex) \u001b[22m'
sleep 1
echo ""
echo ""

printf '\e[32m%s\e[m' "λ "
sleep 1
echo "cd my-extension" | pv -qL $[10+(-2 + RANDOM%5)]
cd my-extension

printf '\e[32m%s\e[m' "λ "
sleep 1
echo "yarn start" | pv -qL $[10+(-2 + RANDOM%5)]

BROWSER="none" node "$(dirname $0)/screencast-start.js" \
    --command="yarn start" \
    --pattern="Compiled successfully*" \
    --pattern-count=1 \
    --error-pattern="*already running on port" \
    --timeout=10

echo ""
