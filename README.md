Media.match
===========

Test css media queries in javascript. A faster polyfill for matchMedia support. Follow the project on Twitter [@mediamatchjs](https://twitter.com/mediamatchjs).

Why?
---
* **Browser support**: Tested in IE 6-9, Chrome, Firefox, Opera, Safari, iOS and Android
* **Feature support**: Has all the basics + most of the spec http://www.w3.org/TR/css3-mediaqueries/
* **Speed**: In many browsers, ops/sec rival or exceed native matchMedia. See 'test' to run your own speed tests using JSLitmus or check out http://jsperf.com/matchmedia/11 and http://jsfiddle.net/wV9HZ/2/
* **Size**: 3kb minified

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
* **color**:                `color`, `min-color`, `max-color`
* **color-index**:          `color-index`, `min-color-index`, `max-color-index`

###Lacks support
* **monochrome**:           `monochrome`, `min-monochrome`, `max-monochrome`
* **scan**: `scan`
* **grid**: `grid`

Requirements
---
####media.min.js/media.js
Provides core functionality. Does not contain external javascript library dependencies.
####media.css
Contains rules used to determine media query support and get media type. Copy the contents of media.css to include with in your base style sheet or link to media.css.
* **z-index** : Used to access Media _typeList array as index. ["screen", "print", "speech", ...]
* **width**   : Used to retrieve dpi for non-IE broswers. IE supports screen.DPIX.
* **height**  : Used to test media query support. IE <9 handle media type but not query expression.

Optional
---
####media.extension.js
Provides method of extending Media.features support. For example, Media supports device-pixel-ratio using the more standard resolution dppx but some projects may have implementations already using device-pixel-ratio. media.extension.js provides the space for this kind of feature support.  

Example
---
```
<script type="text/javascript">
    var mql = Media.match('screen and (color) and (orientation: landscape) and (min-width: 600px) and (min-height: 400px)');
    //console.log(mql);
    /*
        mql has the following properties:
        matches         : <Boolean>
        media           : <String>
        addListener     : <Function>
        removeListener  : <Function>
    */
    
    Media
        .match('screen and (min-width: 600px) and (min-height: 400px), screen and (min-height: 400px)')
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
