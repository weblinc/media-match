media-match
===========

Testing css media queries in Javascript

Media feature support
---
* width
* min-width
* max-width
* height
* min-height
* max-height
* device-width
* min-device-width
* max-device-width
* device-height
* min-device-height
* max-device-height
* orientation
* aspect-ratio
* min-aspect-ratio
* max-aspect-ratio
* device-aspect-ratio
* min-device-aspect-ratio
* max-device-aspect-ratio

Supports but needs further testing to verify
---
* color
* min-color
* max-color
* color-index
* min-color-index
* max-color-index
* monochrome
* min-monochrome
* max-monochrome
* resolution
* min-resolution
* max-resolution

Example
---
```
<script type="text/javascript">
    Media
        .match('screen and (min-width: 600px) and (min-height: 400px), screen and (min-height: 400px)')
        .addListener(function(mql) {
            console.log('Media.match ' + mql.matches);
        });
</script>
```