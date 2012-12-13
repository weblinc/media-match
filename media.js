/* Media - Testing css media queries in Javascript. Authors & copyright (c) 2012: WebLinc, David Knight, Zac Owen. */

// Media
(function(win) {
    'use strict';

    var _doc            = win.document,
        _mediaInfo      = _doc.getElementsByTagName('head')[0],
        _mediaInfoStyle = (win.getComputedStyle && win.getComputedStyle(_mediaInfo, null)) || _mediaInfo.currentStyle,
        _viewport       = _doc.documentElement,
        _typeList       = 'all, screen, print, speech, projection, handheld, tv, braille, embossed, tty',
        _mediaExpr      = /\(\s*(min|max)?-?([^:\s]+)\s*:\s*([^\s]+)\s*\)/,
        _mqlID          = 0,
        _timer          = 0;

    // Helper methods

    /*
        MediaQueryList
        A list of parsed media queries, ex. screen and (max-width: 400px), screen and (max-width: 800px)
    */
    function MediaQueryList(media) {
        var id = _mqlID,
            mql = {
                matches         : Media.parseMatch(media, false),
                media           : media,
                addListener     : function addListener(listener) {
                    Media.queries[id].listeners || (Media.queries[id].listeners = []);
                    listener && Media.queries[id].listeners.push(listener);
                },
                removeListener  : function removeListener(listener) {
                    var query = Media.queries[id];

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

        _mqlID++;

        Media.queries[id] = {
            mql: mql,
            listeners: null
        };

        return mql;
    };

    win.Media = {
        // Properties
        supported   : false,
        type        : 'all',
        queries     : {},
        features    : {
            "width"                 : 0, // Update on resize
            "height"                : 0, // Update on resize
            "aspect-ratio"          : 0, // Update on resize
            "color"                 : screen.colorDepth,
            "color-index"           : Math.pow(2, screen.colorDepth),
            "device-aspect-ratio"   : (screen.width / screen.height).toFixed(2),
            "device-width"          : screen.width,
            "device-height"         : screen.height,
            "monochrome"            : Number(screen.colorDepth == 2),
            "orientation"           : "landscape", // Update on resize/orientation change
            "resolution"            : 96
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

                return match[1];
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
                mq      = list.pop(),
                negate  = mq.indexOf('not ') !== -1,
                mt      = 'all',
                expr    = mq.split(' and '),
                exprl   = expr.length - 1,
                match   = !negate;

            do {
                var item = null, itemMatch = null;

                // Test for 'not screen' and (max-width: 400px).
                // Evaluate each item, then call parseMatch() if there are more media queries or return value of negate.
                if (expr[exprl].indexOf('(') === -1 || (item = expr[exprl].match(_mediaExpr))) {
                    if (item) {
                        var feature     = this.features[item[2]],
                            absValue    = this.getAbsValue(item[3]);

                        if (item[1] === 'min') {
                            itemMatch = feature >= absValue;
                        } else if (item[1] === 'max') {
                            itemMatch = feature <= absValue;
                        } else if (item[3] !== 'undefined') {
                            itemMatch = feature === absValue;
                        } else {
                            itemMatch = Number(feature);
                        }
                    } else {
                        mt = expr[exprl].match(/(not)?\s*(\w*)/)[2] || mt;
                    }
                    
                    if ((item && !itemMatch) || (!mt === Media.type && mt !== 'all')) {
                        return (list.length ? this.parseMatch(list, matched) : negate);
                    }
                }
            } while(exprl--);

            return (matched && match && {matches: match, type: (negate ? _typeList.split(mt).join(', ').replace(/(,\s){2}/, '') : mt), media: mq}) || match;
        },

        /*
            match
         */
        match: MediaQueryList,

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

                        if (query.listeners) {
                            for (var i = 0, il = query.listeners.length; i < il; i++) {
                                if (query.listeners[i]) {
                                    query.listeners[i].call(win, query.mql, evt);
                                }
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
            this.features.width            = win.innerWidth || _viewport.clientWidth;
            this.features.height           = win.innerHeight || _viewport.clientHeight;
            this.features['aspect-ratio']  = (this.features.width / this.features.height).toFixed(2);
            this.features.orientation      = this.features.height >= this.features.width ? 'portrait' : 'landscape';
        },

        listen: function(listener) {
            if (win.addEventListener) {
                win.addEventListener('resize', listener);
                win.addEventListener('orientationchange', listener);
            } else if (win.attachEvent) {
                win.attachEvent('onresize', listener);
                win.attachEvent('onorientationchange', listener);
            }
        },

        init: function() {
            this.supported = parseFloat(_mediaInfoStyle.height) === 1;
            this.type      = _typeList.split(', ')[parseFloat(_mediaInfoStyle.zIndex)];

            this.features.resolution = screen.deviceXDPI || parseFloat(_mediaInfoStyle.width);

            this.setMutableFeatures();
            this.listen(this.watch);
        }
    };

    Media.init();
})(window);