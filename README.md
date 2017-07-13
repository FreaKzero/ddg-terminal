# ddg-termial
[![Build Status](https://travis-ci.org/FreaKzero/ddg-terminal.svg?branch=master)](https://travis-ci.org/FreaKzero/ddg-terminal)
[![npm version](https://badge.fury.io/js/ddg-terminal.svg)](https://badge.fury.io/js/ddg-terminal)
NodeJS Application to view scraped results from http://duckduckgo.com in your Terminal - also
includes *Instant Answers*

Really useful with the CMD+Click feature of iTerm2

![alt text](https://github.com/FreaKzero/ddg-terminal/blob/master/readme/ddg.gif "Demo GIF")

## Install:
`npm install -g ddg-terminal`

## Usage:
```
Usage:
  ddg [FLAGS]... [SEARCHTERM]...

Flags:
  -l [integer]: Limit Results, default 30
  -d Show Descriptions
  -u Show only urls
  -h Show this Help

Examples:
  $ ddg applepie recipie           # Only headlines and urls
  $ ddg -l 5 javascript Promise    # Limit to 5, common programming question it will show instant answer
  $ ddg -l 10 -d blog programming  # Limit to 10, display also Descriptions
  $ ddg -l 3 -u wat meme          # Limit to 3 only show urls (useful for xargs)
```

## Most common usage for me:
This will open the first 5 searchresults automatically in your defaultbrowser
`ddg -l 5 -u stackoverflow question | xargs open`
