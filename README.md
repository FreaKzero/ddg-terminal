# ddg-termial
[![Build Status](https://travis-ci.org/FreaKzero/ddg-terminal.svg?branch=master)](https://travis-ci.org/FreaKzero/ddg-terminal)
[![npm version](https://badge.fury.io/js/ddg-terminal.svg)](https://badge.fury.io/js/ddg-terminal)

NodeJS Application to view scraped results from http://duckduckgo.com in your Terminal - also
includes *Instant Answers*

Really useful with the CMD+Click feature of iTerm2

![alt text](https://github.com/FreaKzero/ddg-terminal/blob/master/readme/ddg.gif "Demo GIF")

## Install:
`npm install -g ddg-terminal`

Or download and use one of the [Binary Releases](https://github.com/FreaKzero/ddg-terminal/releases)

## Usage:
```
Usage:
  ddg [FLAGS]... [SEARCHTERM]...

Flags:
  -v [--version]   Outputs Version
  -h [--help]      Show this Help
  -l [--limit]     Limit Results, default 10
  -d [--desc]      Show Descriptions
  -u [--only-urls] Show only urls
  -o [--open]      Open found urls in Browser automatically
  -f [--first-hit] Opens First Link in Browser

Examples:
  $ ddg applepie recipie           # Only headlines and urls
  $ ddg -l 5 javascript Promise    # Limit to 5, common programming question it will show instant answer
  $ ddg -l 10 -d blog programming  # Limit to 10, display also Descriptions
  $ ddg -l 3 -u wat meme           # Limit to 3 only show urls
```
