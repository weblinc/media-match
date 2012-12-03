media-match
===========

Testing css media queries in Javascript

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