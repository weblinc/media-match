Media.match
===========

Testing css media queries in javascript faster than native window.matchMedia, perhaps.

Why?
---
* **Browser support**: Tested in IE 6-9, Chrome, Firefox, Opera and Safari
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
