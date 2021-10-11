#!/bin/bash

pushd client
npm install

pushd api
npm install
popd

popd
