/* Media - Testing css media queries in Javascript. Authors & copyright (c) 2012: WebLinc, David Knight, Zac Owen. */

// Media
(function(win) {
    'use strict';

    // Internal globals
    var _doc            = win.document,
        _mediaInfo      = _doc.getElementsByTagName('head')[0],
        _mediaInfoStyle = (win.getComputedStyle && win.getComputedStyle(_mediaInfo, null)) || _mediaInfo.currentStyle,
        _deviceWidth    = screen.width,
        _deviceHeight   = screen.height,
        _color          = screen.colorDepth,
        _viewport       = _doc.documentElement,
        _typeList       = 'screen, print, speech, projection, handheld, tv, braille, embossed, tty',
        _mediaExpr      = /\(\s*(not)?\s*(min|max)?-?([^:\s]+)\s*:\s*([^\s]+)\s*\)/,
        _typeExpr       = /(not)?\s*(\w*)/,
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

        Media.queries.push({
            mql: mql,
            listeners: null
        });

        return mql;
    };

    win.Media = {
        // Properties
        supported   : false,
        type        : 'all',
        queries     : [],
        features    : {
            "width"                 : 0, // Update on resize
            "height"                : 0, // Update on resize
            "aspect-ratio"          : 0, // Update on resize
            "color"                 : _color,
            "color-index"           : Math.pow(2, _color),
            "device-aspect-ratio"   : (_deviceWidth / _deviceHeight).toFixed(2),
            "device-width"          : _deviceWidth,
            "device-height"         : _deviceHeight,
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
                    return (this.features.resolution / 72) * match[1];
                }

                return match[1] * 1;
            }

            // Convert aspect ratio to decimals
            if ((match = data.match(/(\d+)[\/:](\d+)/))) {
                return (match[1] / match[2]).toFixed(2);
            }

            // Convert resolution unit to pixels
            if ((match = data.match(/([\d]+)(dpi|dppx|dpcm)/))) {
                if (match[2] == 'dpcm') {
                    return match[1] * 0.3937;
                }

                if (match[2] == 'dppx') {
                    return match[1] * 96;
                }

                return match[1] * 1;
            }

            return data;
        },

        /*
            parseMatch
         */
        parseMatch: function(media, matched) {
            var mql         = typeof media === 'string' ? media.split(', ') : media,
                mq          = mql.pop(),
                negate      = mq.indexOf('not ') !== -1,
                mt          = 'all',
                exprList    = mq.split(' and '),
                exprl       = exprList.length - 1,
                match       = !negate;

            do {
                var expr        = null,
                    exprMatch   = true,
                    type        = null,
                    typeMatch   = true;

                // Test for 'not screen' and (max-width: 400px).
                // Evaluate each expr, then call parseMatch() if there are more media queries or return value of negate.
                if (exprList[exprl].indexOf('(') === -1 || (expr = exprList[exprl].match(_mediaExpr))) {

                    if (expr) {
                        var feature     = this.features[expr[3]],
                            absValue    = this.getAbsValue(expr[4]);

                        if (expr[2] === 'min') {
                            exprMatch = feature >= absValue;
                        } else if (expr[2] === 'max') {
                            exprMatch = feature <= absValue;
                        } else if (expr[4] !== 'undefined') {
                            exprMatch = feature === absValue;
                        } else {
                            exprMatch = feature;
                        }
                    } else {
                        type        = exprList[exprl].match(_typeExpr) || ['', 'all'];
                        mt          = type[2];
                        typeMatch   = mt === this.type || mt === 'all';

                        matched && negate && mt !== 'all' && (mt = _typeList.split(mt).join(', ').replace(/(,\s){2}/, ''));
                    }

                    if (
                        //(expr && ((negate && exprMatch) || (!negate && !exprMatch))) || 
                        //(!expr && ((negate && typeMatch) || (!negate && !typeMatch)))
                        ((expr && !exprMatch) || (!expr && !typeMatch))
                    ) {
                        return (mql.length ? this.parseMatch(mql, matched) : negate);
                    }
                }
            } while(exprl--);

            return (matched && match && {matches: match, type: mt, media: mq}) || match;
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
            var w = win.innerWidth || _viewport.clientWidth,
                h = win.innerHeight || _viewport.clientHeight;

            this.features.width            = w;
            this.features.height           = h;
            this.features['aspect-ratio']  = (w / h).toFixed(2);
            this.features.orientation      = (h >= w ? 'portrait' : 'landscape');
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
            var x           = win.devicePixelRatio;

            this.supported  = parseFloat(_mediaInfoStyle.height) === 1;
            this.type       = _typeList.split(', ')[parseFloat(_mediaInfoStyle.zIndex) - 1] || 'all'; 

            this.features.resolution = (x && x * 96) || screen.deviceXDPI || parseFloat(_mediaInfoStyle.width);

            this.setMutableFeatures();
            this.listen(this.watch);
        }
    };

    win.Media.init();

    window.matchMedia || (window.matchMedia = Media.match);
})(window);