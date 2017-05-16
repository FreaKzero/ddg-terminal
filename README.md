# ddg-termial

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
  -d [1/-1]: Show Descriotions (1 or -1), default -1
  -u [1/-1]: Show only urls
  -h: Show this Help

Examples:
  $ ddg applepie recipie             # Only headlines and urls
  $ ddg -l 5 javascript Promise      # Limit to 5, common programming question it will show instant answer
  $ ddg -l 10 -d 1 blog programming  # Limit to 10, display also Descriptions
  $ ddg -l 3  -u 1 wat meme          # Limit to 3 only show urls (useful for xargs)
```

## Most common usage for me:
This will open the first 5 searchresults automatically in your defaultbrowser  
`ddg -l 5 -u 1 stackoverflow question | xargs open`
