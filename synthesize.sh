#! /bin/bash

input=$@
echo $input

curl --get --data-urlencode "phrase=${input}" -o output.wav http://cloudbit-to-speech.mybluemix.net/synthesize

play output.wav
