#!/usr/bin/env bash

PATH_TO_APP="$1"

if [ -z $PATH_TO_APP ] ; then
  echo "Please provide relative path to the app; eg  ../chaaipani as the last parameter. Like `npm run sync-files-to ../chaipani/`"
  exit 1
fi

npm run build

rsync -r \
  dist \
  "$PATH_TO_APP/node_modules/@quintype/components/" \
  && touch "$PATH_TO_APP/app/isomorphic/pick-component.js"