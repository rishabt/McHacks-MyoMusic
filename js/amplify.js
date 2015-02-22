/*!
 * AmplifyJS 1.1.0 - Core, Store, Request
 * 
 * Copyright 2011 appendTo LLC. (http://appendto.com/team)
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 * 
 * http://amplifyjs.com
 */
(function(a, b) {
    var c = [].slice, d = {}, e = a.amplify = {
        publish: function(a) {
            var b = c.call(arguments, 1), e, f, g, h = 0, i;
            if (!d[a])
                return !0;
            e = d[a].slice();
            for (g = e.length; h < g; h++) {
                f = e[h], i = f.callback.apply(f.context, b);
                if (i===!1)
                    break
            }
            return i!==!1
        },
        subscribe: function(a, b, c, e) {
            arguments.length === 3 && typeof c == "number" && (e = c, c = b, b = null), arguments.length === 2 && (c = b, b = null), e = e || 10;
            var f = 0, g = a.split(/\s/), h = g.length, i;
            for (; f < h; f++) {
                a = g[f], i=!1, d[a] || (d[a] = []);
                var j = d[a].length - 1, k = {
                    callback: c,
                    context: b,
                    priority: e
                };
                for (; j >= 0; j--)
                    if (d[a][j].priority <= e) {
                        d[a].splice(j + 1, 0, k), i=!0;
                        break
                    }
                i || d[a].unshift(k)
            }
            return c
        },
        unsubscribe: function(a, b) {
            if (!!d[a]) {
                var c = d[a].length, e = 0;
                for (; e < c; e++)
                    if (d[a][e].callback === b) {
                        d[a].splice(e, 1);
                        break
                    }
            }
        }
    }
})(this), function(a, b) {
    function e(a, e) {
        c.addType(a, function(f, g, h) {
            var i, j, k, l, m = g, n = (new Date).getTime();
            if (!f) {
                m = {}, l = [], k = 0;
                try {
                    f = e.length;
                    while (f = e.key(k++))
                        d.test(f) && (j = JSON.parse(e.getItem(f)), j.expires && j.expires <= n ? l.push(f) : m[f.replace(d, "")] = j.data);
                    while (f = l.pop())
                        e.removeItem(f)
                    } catch (o) {}
                return m
            }
            f = "__amplify__" + f;
            if (g === b) {
                i = e.getItem(f), j = i ? JSON.parse(i) : {
                    expires: - 1
                };
                if (j.expires && j.expires <= n)
                    e.removeItem(f);
                else 
                    return j.data
            } else if (g === null)
                e.removeItem(f);
            else {
                j = JSON.stringify({
                    data: g,
                    expires: h.expires ? n + h.expires: null
                });
                try {
                    e.setItem(f, j)
                } catch (o) {
                    c[a]();
                    try {
                        e.setItem(f, j)
                    } catch (o) {
                        throw c.error()
                    }
                }
            }
            return m
        })
    }
    var c = a.store = function(a, b, d, e) {
        var e = c.type;
        d && d.type && d.type in c.types && (e = d.type);
        return c.types[e](a, b, d || {})
    };
    c.types = {}, c.type = null, c.addType = function(a, b) {
        c.type || (c.type = a), c.types[a] = b, c[a] = function(b, d, e) {
            e = e || {}, e.type = a;
            return c(b, d, e)
        }
    }, c.error = function() {
        return "amplify.store quota exceeded"
    };
    var d = /^__amplify__/;
    for (var f in{
        localStorage: 1,
        sessionStorage: 1
    })
        try {
            window[f].getItem && e(f, window[f])
    } catch (g) {}
    if (window.globalStorage)
        try {
            e("globalStorage", window.globalStorage[window.location.hostname]), c.type === "sessionStorage" && (c.type = "globalStorage")
    } catch (g) {}(function() {
        if (!c.types.localStorage) {
            var a = document.createElement("div"), d = "amplify";
            a.style.display = "none", document.getElementsByTagName("head")[0].appendChild(a);
            try {
                a.addBehavior("#default#userdata"), a.load(d)
            } catch (e) {
                a.parentNode.removeChild(a);
                return 
            }
            c.addType("userData", function(e, f, g) {
                a.load(d);
                var h, i, j, k, l, m = f, n = (new Date).getTime();
                if (!e) {
                    m = {}, l = [], k = 0;
                    while (h = a.XMLDocument.documentElement.attributes[k++])
                        i = JSON.parse(h.value), i.expires && i.expires <= n ? l.push(h.name) : m[h.name] = i.data;
                    while (e = l.pop())
                        a.removeAttribute(e);
                    a.save(d);
                    return m
                }
                e = e.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g, "-");
                if (f === b) {
                    h = a.getAttribute(e), i = h ? JSON.parse(h) : {
                        expires: - 1
                    };
                    if (i.expires && i.expires <= n)
                        a.removeAttribute(e);
                    else 
                        return i.data
                } else 
                    f === null ? a.removeAttribute(e) : (j = a.getAttribute(e), i = JSON.stringify({
                        data: f,
                        expires: g.expires ? n + g.expires: null
                    }), a.setAttribute(e, i));
                try {
                    a.save(d)
                } catch (o) {
                    j === null ? a.removeAttribute(e) : a.setAttribute(e, j), c.userData();
                    try {
                        a.setAttribute(e, i), a.save(d)
                    } catch (o) {
                        j === null ? a.removeAttribute(e) : a.setAttribute(e, j);
                        throw c.error()
                    }
                }
                return m
            })
        }
    })(), function() {
        function e(a) {
            return a === b ? b : JSON.parse(JSON.stringify(a))
        }
        var a = {}, d = {};
        c.addType("memory", function(c, f, g) {
            if (!c)
                return e(a);
            if (f === b)
                return e(a[c]);
            d[c] && (clearTimeout(d[c]), delete d[c]);
            if (f === null) {
                delete a[c];
                return null
            }
            a[c] = f, g.expires && (d[c] = setTimeout(function() {
                delete a[c], delete d[c]
            }, g.expires));
            return f
        })
    }()
}(this.amplify = this.amplify || {}), function(a, b) {
    function e(a) {
        var b=!1;
        setTimeout(function() {
            b=!0
        }, 1);
        return function() {
            var c = this, d = arguments;
            b ? a.apply(c, d) : setTimeout(function() {
                a.apply(c, d)
            }, 1)
        }
    }
    function d(a) {
        return {}.toString.call(a) === "[object Function]"
    }
    function c() {}
    a.request = function(b, f, g) {
        var h = b || {};
        typeof h == "string" && (d(f) && (g = f, f = {}), h = {
            resourceId: b,
            data: f || {},
            success: g
        });
        var i = {
            abort: c
        }, j = a.request.resources[h.resourceId], k = h.success || c, l = h.error || c;
        h.success = e(function(b, c) {
            c = c || "success", a.publish("request.success", h, b, c), a.publish("request.complete", h, b, c), k(b, c)
        }), h.error = e(function(b, c) {
            c = c || "error", a.publish("request.error", h, b, c), a.publish("request.complete", h, b, c), l(b, c)
        });
        if (!j) {
            if (!h.resourceId)
                throw "amplify.request: no resourceId provided";
            throw "amplify.request: unknown resourceId: " + h.resourceId
        }
        if (!a.publish("request.before", h))
            h.error(null, "abort");
        else {
            a.request.resources[h.resourceId](h, i);
            return i
        }
    }, a.request.types = {}, a.request.resources = {}, a.request.define = function(b, c, d) {
        if (typeof c == "string") {
            if (!(c in a.request.types))
                throw "amplify.request.define: unknown type: " + c;
            d.resourceId = b, a.request.resources[b] = a.request.types[c](d)
        } else 
            a.request.resources[b] = c
    }
}(amplify), function(a, b, c) {
    var d = ["status", "statusText", "responseText", "responseXML", "readyState"], e = /\{([^\}]+)\}/g;
    a.request.types.ajax = function(e) {
        e = b.extend({
            type: "GET"
        }, e);
        return function(f, g) {
            function n(a, e) {
                b.each(d, function(a, b) {
                    try {
                        m[b] = h[b]
                    } catch (c) {}
                }), /OK$/.test(m.statusText) && (m.statusText = "success"), a === c && (a = null), l && (e = "abort"), /timeout|error|abort/.test(e) ? m.error(a, e) : m.success(a, e), n = b.noop
            }
            var h, i = e.url, j = g.abort, k = b.extend(!0, {}, e, {
                data: f.data
            }), l=!1, m = {
                readyState: 0,
                setRequestHeader: function(a, b) {
                    return h.setRequestHeader(a, b)
                },
                getAllResponseHeaders: function() {
                    return h.getAllResponseHeaders()
                },
                getResponseHeader: function(a) {
                    return h.getResponseHeader(a)
                },
                overrideMimeType: function(a) {
                    return h.overrideMideType(a)
                },
                abort: function() {
                    l=!0;
                    try {
                        h.abort()
                    } catch (a) {}
                    n(null, "abort")
                },
                success: function(a, b) {
                    f.success(a, b)
                },
                error: function(a, b) {
                    f.error(a, b)
                }
            };
            a.publish("request.ajax.preprocess", e, f, k, m), b.extend(k, {
                success: function(a, b) {
                    n(a, b)
                },
                error: function(a, b) {
                    n(null, b)
                },
                beforeSend: function(b, c) {
                    h = b, k = c;
                    var d = e.beforeSend ? e.beforeSend.call(this, m, k): !0;
                    return d && a.publish("request.before.ajax", e, f, k, m)
                }
            }), b.ajax(k), g.abort = function() {
                m.abort(), j.call(this)
            }
        }
    }, a.subscribe("request.ajax.preprocess", function(a, c, d) {
        var f = [], g = d.data;
        typeof g != "string" && (g = b.extend(!0, {}, a.data, g), d.url = d.url.replace(e, function(a, b) {
            if (b in g) {
                f.push(b);
                return g[b]
            }
        }), b.each(f, function(a, b) {
            delete g[b]
        }), d.data = g)
    }), a.subscribe("request.ajax.preprocess", function(a, c, d) {
        var e = d.data, f = a.dataMap;
        !!f && typeof e != "string" && (b.isFunction(f) ? d.data = f(e) : (b.each(a.dataMap, function(a, b) {
            a in e && (e[b] = e[a], delete e[a])
        }), d.data = e))
    });
    var f = a.request.cache = {
        _key: function(a, b, c) {
            function g() {
                return c.charCodeAt(e++)<<24 | c.charCodeAt(e++)<<16 | c.charCodeAt(e++)<<8 | c.charCodeAt(e++)<<0
            }
            c = b + c;
            var d = c.length, e = 0, f = g();
            while (e < d)
                f^=g();
            return "request-" + a + "-" + f
        },
        _default: function() {
            var a = {};
            return function(b, c, d, e) {
                var g = f._key(c.resourceId, d.url, d.data), h = b.cache;
                if (g in a) {
                    e.success(a[g]);
                    return !1
                }
                var i = e.success;
                e.success = function(b) {
                    a[g] = b, typeof h == "number" && setTimeout(function() {
                        delete a[g]
                    }, h), i.apply(this, arguments)
                }
            }
        }()
    };
    a.store && (b.each(a.store.types, function(b) {
        f[b] = function(c, d, e, g) {
            var h = f._key(d.resourceId, e.url, e.data), i = a.store[b](h);
            if (i) {
                e.success(i);
                return !1
            }
            var j = g.success;
            g.success = function(d) {
                a.store[b](h, d, {
                    expires: c.cache.expires
                }), j.apply(this, arguments)
            }
        }
    }), f.persist = f[a.store.type]), a.subscribe("request.before.ajax", function(a) {
        var b = a.cache;
        if (b) {
            b = b.type || b;
            return f[b in f ? b: "_default"].apply(this, arguments)
        }
    }), a.request.decoders = {
        jsend: function(a, b, c, d, e) {
            a.status === "success" ? d(a.data) : a.status === "fail" ? e(a.data, "fail") : a.status === "error" && (delete a.status, e(a, "error"))
        }
    }, a.subscribe("request.before.ajax", function(c, d, e, f) {
        function k(a, b) {
            h(a, b)
        }
        function j(a, b) {
            g(a, b)
        }
        var g = f.success, h = f.error, i = b.isFunction(c.decoder) ? c.decoder: c.decoder in a.request.decoders ? a.request.decoders[c.decoder]: a.request.decoders._default;
        !i || (f.success = function(a, b) {
            i(a, b, f, j, k)
        }, f.error = function(a, b) {
            i(a, b, f, j, k)
        })
    })
}(amplify, jQuery)

