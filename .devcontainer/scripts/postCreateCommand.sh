#!/bin/bash

pushd client
npm install

pushd api
npm install
npm run build
popd

popd
