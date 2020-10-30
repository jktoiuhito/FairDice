# FairDice

[![CodeFactor](https://www.codefactor.io/repository/github/jktoiuhito/fairdice/badge)](https://www.codefactor.io/repository/github/jktoiuhito/fairdice)

![screenshot of FairDice running on desktop and mobile. a d20 and d4 have been rolled with values 12 and 4.](https://github.com/jktoiuhito/FairDice/blob/main/example.png)

FairDice aspires to be a superior alternative to physical dice by offering extreme fairness and the capability to inspect your throw history. No more wondering if a dice is cursed, rethrowing when dice fall to the floor or trying to recall what the value of the last throw actually was.

FairDice is a web-based app that runs in your browser, and can be used equally well in both mobile and desktop devices. Electron-based app for Android is planned to be published in the future.

## Requirements

`node.js` is required for building the app from source.

Running the app requires any\* JavaScript capable browser with support for ECMAScript version 6.

## \*Notice on supported devices

FairDice works on all browsers, with the following exceptions:

-  All versions of Internet Explorer
-  All versions of desktop Safari
-  All versions of all iOS browsers.

Internet Explorer is considered legacy and support for it will not be provided, unless by accident.

Apple developers [vehemently](https://github.com/w3c/webcomponents/issues/509#issuecomment-222860736) [refuse](https://bugs.webkit.org/show_bug.cgi?id=182671#c5) to [implement](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry#Browser_compatibility) customized in-built element support for WebKit, causing FairDice to fail on their products. As defining custom elements is an extremely useful feature and is implemented by every other modern browser, the developer of FairDice considers this to be a situation of "you reap what you sow", and leave it up to Apple to implement support for custom elements in their products, rather than meekly [polyfilling](https://github.com/WebReflection/custom-elements-builtin) the core problem away.
