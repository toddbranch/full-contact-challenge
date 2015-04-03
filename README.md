# full contact challenge - bidirectional infinite scroll

## setup

```
npm install
bower install

npm test
//You'll need to open the testem URL (localhost:7357 for me) to connect and run.
```

## demo

index.html - you'll need an internet connection because I load the libraries from cdnjs and use pug images from the web to show it in action.

## notes

- The scrolling is smooth, but the pug images load as you scroll.  If I were to take this forward, I would improve that - probably by using moddims to display a low-res image first, then swapping in the high-res version once downloaded.
