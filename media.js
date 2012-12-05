/* Media - Testing css media queries in Javascript. Authors & copyright (c) 2012: WebLinc, David Knight, Zac Owen. */

// Media
(function(win) {
    'use strict';

    var _doc             = win.document,
        _mediaInfo       = _doc.getElementsByTagName('head')[0],
        _mediaInfoStyle = (win.getComputedStyle && win.getComputedStyle(_mediaInfo, null)) || _mediaInfo.currentStyle,
        _viewport        = _doc.documentElement,
        _typeList        = 'all, screen, print, speech, projection, handheld, tv, braille, embossed, tty',
        _mqlID           = 0,
        _timer           = 0;

    // Helper methods

    /*
        MediaType
        A single instance of a media type, ex. not screen or screen
    */
    function MediaType(name) {
        return {
            name    : name || 'all', // screen, print, ...
            test    : function() {
                return this.name === Media.type;
            }
        };
    };

    /*
        MediaExpr
        A single instance of a media expression, ex. (max-width: 400px)
    */
    function MediaExpr(name, value, type) {
        var feature = Media.features[name];

        return {
            name    : name,
            value   : value,
            type    : type,
            test    : function() {
                var absValue = Media.getAbsValue(this.value);

                if (this.type === 'min') {
                    return feature >= absValue;
                }

                if (this.type === 'max') {
                    return feature <= absValue;
                }

                if (this.value !== 'undefined') {
                    return feature === absValue;
                }

                return Number(feature);
            }
        };
    };

    /*
        MediaQueryList
        A list of parsed media queries, ex. screen and (max-width: 400px), screen and (max-width: 800px)
    */
    function MediaQueryList(media) {
        var _id = _mqlID;

        _mqlID++;

        return {
            matches         : Media.parseMatch(media, false),
            media           : media,
            addListener     : function addListener(listener) {
                Media.queries[_id] || (Media.queries[_id] = {mql: this, listeners: []});
                Media.queries[_id].listeners.push(listener);
            },
            removeListener  : function removeListener(listener) {
                var query = Media.queries[_id];

                if (!query) {
                    return;
                }

                for (var i = 0, il = query.listeners.length; i < il; i++) {
                    if (query.listeners[i] === listener) {
                        query.listeners.splice(i, 1);
                    }
                }
            }
        };
    };

    win.Media = {
        // Properties
        supported   : parseFloat(_mediaInfoStyle.height) === 1,
        type        : _typeList.split(', ')[parseFloat(_mediaInfoStyle.zIndex)],
        queries     : [],
        features    : {
            "width"                 : 0, /* Update on resize */
            "height"                : 0, /* Update on resize */
            "aspect-ratio"          : 0, /* Update on resize */
            "color"                 : screen.colorDepth,
            "color-index"           : Math.pow(2, screen.colorDepth),
            "device-aspect-ratio"   : win.devicePixelRatio || (screen.width / screen.height).toFixed(2),
            "device-width"          : screen.width,
            "device-height"         : screen.height,
            "monochrome"            : Number(screen.colorDepth == 2),
            "orientation"           : "landscape", /* Update on resize/orientation change */
            "resolution"            : screen.deviceXDPI || parseFloat(_mediaInfoStyle.width)
        },

        // Methods

        /*
            getAbsValue
         */
        getAbsValue: function(data) {
            var match;

            // Convert length unit to pixels
            if ((match = data.match(/([\d\.]+)(px|em|rem|%|in|cm|mm|ex|pt|pc)/))) {
                if (match[2] == 'em') {
                    // Assumed base font size is 16px
                    return 16 * match[1];
                }

                if (match[2] == 'pt') {
                    return (Media.features.resolution / 72) * match[1];
                }

                return parseFloat(match[1]);
            }

            // Convert aspect ratio to decimals
            if ((match = data.match(/(\d+)[\/:](\d+)/))) {
                return match[1] / match[2];
            }

            // Convert resolution unit to pixels
            if ((match = data.match(/([\d]+)(dpi|dppx|dpcm)/))) {
                if (match[2] == 'dpcm') {
                    return match[1] * 0.3937;
                }

                if (match[2] == 'dppx') {
                    return match[1] * 96;
                }

                return match[1];
            }

            return data;
        },

        /*
            parseMatch
         */
        parseMatch: function(media, matched) {
            var list    = typeof media === 'string' ? media.split(', ') : media,
                negate  = list[list.length - 1].indexOf('not ') !== -1,
                mq      = list.pop(),
                mt      = 'all',
                expr    = mq.split(' and '),
                exprl   = expr.length - 1,
                match   = !negate;

            do {
                var item = null;

                // Test for 'not screen' and (max-width: 400px).
                // Evaluate each item, then call parseMatch() if there are more media queries or return value of negate.
                if (expr[exprl].indexOf('(') === -1) {
                    mt = MediaType(expr[exprl].match(/(not)?\s*(\w*)/)[2]);

                    if (!mt.test()) {
                        return (list.length ? this.parseMatch(list, matched) : negate);
                    } else {
                        continue;
                    }
                }

                if ((item = expr[exprl].match(/\(\s*(min|max)?-?([^:\s]+)\s*:\s*([^\s]+)\s*\)/)) && (!MediaExpr(item[2], item[3], item[1]).test())) {
                    return (list.length ? this.parseMatch(list, matched) : negate);
                }
            } while(exprl--);

            return (matched && match && {matches: match, type: (negate ? _typeList.split(mt).join(', ').replace(/(,\s){2}/, '') : mt), media: mq}) || match;
        },

        /*
            match
         */
        match: function(media) {
            return new MediaQueryList(media);
        },

        /*
            watch
         */
        watch: function(evt) {
            clearTimeout(_timer);

            _timer = setTimeout(function() {
                var id = _mqlID;

                Media.setMutableFeatures();

                do {
                    var query = Media.queries[id],
                        match = false;

                    if (typeof query === 'undefined') { continue; }

                    match = Media.parseMatch(query.mql.media);

                    if ((match && !query.mql.matches) || (!match && query.mql.matches)) {
                        query.mql.matches = match;

                        for (var i = 0, il = query.listeners.length; i < il; i++) {
                            if (query.listeners[i]) {
                                query.listeners[i].call(win, query.mql, evt);
                            }
                        }
                    }

                } while(id--);
            }, 10);
        },

        /*
            Sets properties of Media that change on resize and/or orientation.
        */
        setMutableFeatures: function() {
            Media.features.width            = win.innerWidth || _viewport.clientWidth;
            Media.features.height           = win.innerHeight || _viewport.clientHeight;
            Media.features['aspect-ratio']  = (Media.features.width / Media.features.height).toFixed(2);
            Media.features.orientation      = Media.features.height >= Media.features.width ? 'portrait' : 'landscape';
        },

        listen: function(listener) {
            if (win.addEventListener) {
                win.addEventListener('resize', listener);
                win.addEventListener('orientationchange', listener);
            } else if (win.attachEvent) {
                win.attachEvent('onresize', listener);
                win.attachEvent('onorientationchange', listener);
            }
        }
    };

    Media.setMutableFeatures();
    Media.listen(Media.watch);
})(window);