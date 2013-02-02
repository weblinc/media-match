Media.match
===========

Test css media queries in javascript. A faster polyfill for matchMedia support. Follow the project on Twitter [@mediamatchjs](https://twitter.com/mediamatchjs).

Why?
---
* **Browser support**: Tested in IE 6-9, Chrome, Firefox, Opera, Safari, iOS and Android
* **Feature support**: Has all the basics + most of the spec http://www.w3.org/TR/css3-mediaqueries/
* **Speed**: In many browsers, ops/sec rival or exceed native matchMedia. See 'test' to run your own speed tests using JSLitmus or check out http://jsperf.com/matchmedia/11 and http://jsfiddle.net/wV9HZ/2/
* **Size**: 2.73KB minified (1.46KB gzipped)

Media type and feature support
---
* **type**:                 `all`, `screen`, `print`, `speech`, `projection`, `handheld`, `tv`, `braille`, `embossed`, `tty`
* **width**:                `width`, `min-width`, `max-width`
* **height**:               `height`, `min-height`, `max-height`
* **device-width**:         `device-width`, `min-device-width`, `max-device-width`
* **device-height**:        `device-height`, `min-device-height`, `max-device-height`
* **aspect-ratio**:         `aspect-ratio`, `min-aspect-ratio`, `max-aspect-ratio`
* **device-aspect-ratio**:  `device-aspect-ratio`, `min-device-aspect-ratio`, `max-device-aspect-ratio`
* **orientation**:          `orientation`
* **resolution**:           `resolution`, `min-resolution`, `max-resolution`
* **device-pixel-ratio**:   `device-pixel-ratio`, `min-device-pixel-ratio`, `max-device-pixel-ratio`
* **color**:                `color`, `min-color`, `max-color`
* **color-index**:          `color-index`, `min-color-index`, `max-color-index`

###Lacks support
* **monochrome**:           `monochrome`, `min-monochrome`, `max-monochrome`
* **scan**: `scan`
* **grid**: `grid`

Requirements
---
####media.match.min.js/media.match.js
* Provides core functionality. Does not contain external javascript library or css dependencies.
* Version 1 of this project contained a css dependency that is now solely handled by media.match.js. See branch, "version1" for previous iteration.

Example
---

Both code blocks are valid uses of ```matchMedia()```. The first example shows the caching of a ```MediaQueryList``` object and the second shows an alternative usage as well as ```addListener``` support.
The ```addListener``` method is part of the ```MediaQueryList``` object, therefore it can be added on the cached version or immediately after ```matchMedia()```.

```
<script type="text/javascript">
    var mql = window.matchMedia('screen and (color) and (orientation: landscape) and (min-width: 600px) and (min-height: 400px)');
    //console.log(mql);
    /*
        mql has the following properties:
        matches         : <Boolean>
        media           : <String>
        addListener     : <Function>
        removeListener  : <Function>
    */
</script>
```
```
<script type="text/javascript">
    window.matchMedia('screen and (min-width: 600px) and (min-height: 400px), screen and (min-height: 400px)')
        .addListener(function(mql) {
            if (mql.matches) {
                // Media query does match
            } else {
                // Media query does not match anymore
            }
        });
</script>
```

##Related projects
* [Nonresponsive](https://github.com/weblinc/nonresponsive): Media queries for the unsupportive IE6-8.
* [Picture](https://github.com/weblinc/picture): Responsive images based on the 'picture' element proposal.
* [Img-srcset](https://github.com/weblinc/img-srcset): Responsive images based on the 'srcset' attribute proposal.
