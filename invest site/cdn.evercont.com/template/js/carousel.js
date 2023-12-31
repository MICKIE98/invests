/*! jCarousel - v0.3.9 - 2018-07-30
 * http://sorgalla.com/jcarousel/
 * Copyright (c) 2006-2018 Jan Sorgalla; Licensed MIT */

! function(t) {
    "use strict";
    var i = t.jCarousel = {};
    i.version = "0.3.9";
    var s = /^([+\-]=)?(.+)$/;
    i.parseTarget = function(t) {
        var i = !1,
            e = "object" != typeof t ? s.exec(t) : null;
        return e ? (t = parseInt(e[2], 10) || 0, e[1] && (i = !0, "-=" === e[1] && (t *= -1))) : "object" != typeof t && (t = parseInt(t, 10) || 0), {
            target: t,
            relative: i
        }
    }, i.detectCarousel = function(t) {
        for (var i; t.length > 0;) {
            if ((i = t.filter("[data-jcarousel]")).length > 0) return i;
            if ((i = t.find("[data-jcarousel]")).length > 0) return i;
            t = t.parent()
        }
        return null
    }, i.base = function(s) {
        return {
            version: i.version,
            _options: {},
            _element: null,
            _carousel: null,
            _init: t.noop,
            _create: t.noop,
            _destroy: t.noop,
            _reload: t.noop,
            create: function() {
                return this._element.attr("data-" + s.toLowerCase(), !0).data(s, this), !1 === this._trigger("create") ? this : (this._create(), this._trigger("createend"), this)
            },
            destroy: function() {
                return !1 === this._trigger("destroy") ? this : (this._destroy(), this._trigger("destroyend"), this._element.removeData(s).removeAttr("data-" + s.toLowerCase()), this)
            },
            reload: function(t) {
                return !1 === this._trigger("reload") ? this : (t && this.options(t), this._reload(), this._trigger("reloadend"), this)
            },
            element: function() {
                return this._element
            },
            options: function(i, s) {
                if (0 === arguments.length) return t.extend({}, this._options);
                if ("string" == typeof i) {
                    if (void 0 === s) return void 0 === this._options[i] ? null : this._options[i];
                    this._options[i] = s
                } else this._options = t.extend({}, this._options, i);
                return this
            },
            carousel: function() {
                return this._carousel || (this._carousel = i.detectCarousel(this.options("carousel") || this._element), this._carousel || t.error('Could not detect carousel for plugin "' + s + '"')), this._carousel
            },
            _trigger: function(i, e, n) {
                var r, l = !1;
                return n = [this].concat(n || []), (e || this._element).each(function() {
                    r = t.Event((s + ":" + i).toLowerCase()), t(this).trigger(r, n), r.isDefaultPrevented() && (l = !0)
                }), !l
            }
        }
    }, i.plugin = function(s, e) {
        var n = t[s] = function(i, s) {
            this._element = t(i), this.options(s), this._init(), this.create()
        };
        return n.fn = n.prototype = t.extend({}, i.base(s), e), t.fn[s] = function(i) {
            var e = Array.prototype.slice.call(arguments, 1),
                r = this;
            return "string" == typeof i ? this.each(function() {
                var n = t(this).data(s);
                if (!n) return t.error("Cannot call methods on " + s + ' prior to initialization; attempted to call method "' + i + '"');
                if (!t.isFunction(n[i]) || "_" === i.charAt(0)) return t.error('No such method "' + i + '" for ' + s + " instance");
                var l = n[i].apply(n, e);
                return l !== n && void 0 !== l ? (r = l, !1) : void 0
            }) : this.each(function() {
                var e = t(this).data(s);
                e instanceof n ? e.reload(i) : new n(this, i)
            }), r
        }, n
    }
}(jQuery),
function(t, i) {
    "use strict";
    var s = t(i),
        e = function(t) {
            return parseFloat(t) || 0
        };
    t.jCarousel.plugin("jcarousel", {
        animating: !1,
        tail: 0,
        inTail: !1,
        resizeState: null,
        resizeTimer: null,
        lt: null,
        vertical: !1,
        rtl: !1,
        circular: !1,
        underflow: !1,
        relative: !1,
        _options: {
            list: function() {
                return this.element().children().eq(0)
            },
            items: function() {
                return this.list().children()
            },
            animation: 400,
            transitions: !1,
            wrap: null,
            vertical: null,
            rtl: null,
            center: !1
        },
        _list: null,
        _items: null,
        _target: t(),
        _first: t(),
        _last: t(),
        _visible: t(),
        _fullyvisible: t(),
        _init: function() {
            var t = this;
            return t.resizeState = s.width() + "x" + s.height(), this.onWindowResize = function() {
                t.resizeTimer && clearTimeout(t.resizeTimer), t.resizeTimer = setTimeout(function() {
                    var i = s.width() + "x" + s.height();
                    i !== t.resizeState && (t.resizeState = i, t.reload())
                }, 100)
            }, this
        },
        _create: function() {
            this._reload(), s.on("resize.jcarousel", this.onWindowResize)
        },
        _destroy: function() {
            s.off("resize.jcarousel", this.onWindowResize)
        },
        _reload: function() {
            this.vertical = this.options("vertical"), null == this.vertical && (this.vertical = e(this.list().height()) > e(this.list().width())), this.rtl = this.options("rtl"), null == this.rtl && (this.rtl = function(i) {
                if ("rtl" === ("" + i.attr("dir")).toLowerCase()) return !0;
                var s = !1;
                return i.parents("[dir]").each(function() {
                    if (/rtl/i.test(t(this).attr("dir"))) return s = !0, !1
                }), s
            }(this._element)), this.lt = this.vertical ? "top" : "left", this.relative = "relative" === this.list().css("position"), this._list = null, this._items = null;
            var i = this.index(this._target) >= 0 ? this._target : this.closest();
            this.circular = "circular" === this.options("wrap"), this.underflow = !1;
            var s = {
                left: 0,
                top: 0
            };
            return i.length > 0 && (this._prepare(i), this.list().find("[data-jcarousel-clone]").remove(), this._items = null, this.underflow = this._fullyvisible.length >= this.items().length, this.circular = this.circular && !this.underflow, s[this.lt] = this._position(i) + "px"), this.move(s), this
        },
        list: function() {
            if (null === this._list) {
                var i = this.options("list");
                this._list = t.isFunction(i) ? i.call(this) : this._element.find(i)
            }
            return this._list
        },
        items: function() {
            if (null === this._items) {
                var i = this.options("items");
                this._items = (t.isFunction(i) ? i.call(this) : this.list().find(i)).not("[data-jcarousel-clone]")
            }
            return this._items
        },
        index: function(t) {
            return this.items().index(t)
        },
        closest: function() {
            var i, s = this,
                n = this.list().position()[this.lt],
                r = t(),
                l = !1,
                h = this.vertical ? "bottom" : this.rtl && !this.relative ? "left" : "right";
            return this.rtl && this.relative && !this.vertical && (n += e(this.list().width()) - this.clipping()), this.items().each(function() {
                if (r = t(this), l) return !1;
                var o = s.dimension(r);
                if ((n += o) >= 0) {
                    if (i = o - e(r.css("margin-" + h)), !(Math.abs(n) - o + i / 2 <= 0)) return !1;
                    l = !0
                }
            }), r
        },
        target: function() {
            return this._target
        },
        first: function() {
            return this._first
        },
        last: function() {
            return this._last
        },
        visible: function() {
            return this._visible
        },
        fullyvisible: function() {
            return this._fullyvisible
        },
        hasNext: function() {
            if (!1 === this._trigger("hasnext")) return !0;
            var t = this.options("wrap"),
                i = this.items().length - 1,
                s = this.options("center") ? this._target : this._last;
            return !!(i >= 0 && !this.underflow && (t && "first" !== t || this.index(s) < i || this.tail && !this.inTail))
        },
        hasPrev: function() {
            if (!1 === this._trigger("hasprev")) return !0;
            var t = this.options("wrap");
            return !!(this.items().length > 0 && !this.underflow && (t && "last" !== t || this.index(this._first) > 0 || this.tail && this.inTail))
        },
        clipping: function() {
            return e(this._element["inner" + (this.vertical ? "Height" : "Width")]())
        },
        dimension: function(t) {
            return e(t["outer" + (this.vertical ? "Height" : "Width")](!0))
        },
        scroll: function(i, s, e) {
            if (this.animating) return this;
            if (!1 === this._trigger("scroll", null, [i, s])) return this;
            t.isFunction(s) && (e = s, s = !0);
            var n = t.jCarousel.parseTarget(i);
            if (n.relative) {
                var r, l, h, o, a, u, c, f, d = this.items().length - 1,
                    p = Math.abs(n.target),
                    _ = this.options("wrap");
                if (n.target > 0) {
                    var v = this.index(this._last);
                    if (v >= d && this.tail) this.inTail ? "both" === _ || "last" === _ ? this._scroll(0, s, e) : t.isFunction(e) && e.call(this, !1) : this._scrollTail(s, e);
                    else if (r = this.index(this._target), this.underflow && r === d && ("circular" === _ || "both" === _ || "last" === _) || !this.underflow && v === d && ("both" === _ || "last" === _)) this._scroll(0, s, e);
                    else if (h = r + p, this.circular && h > d) {
                        for (f = d, a = this.items().get(-1); f++ < h;) a = this.items().eq(0), (u = this._visible.index(a) >= 0) && a.after(a.clone(!0).attr("data-jcarousel-clone", !0)), this.list().append(a), u || ((c = {})[this.lt] = this.dimension(a), this.moveBy(c)), this._items = null;
                        this._scroll(a, s, e)
                    } else this._scroll(Math.min(h, d), s, e)
                } else if (this.inTail) this._scroll(Math.max(this.index(this._first) - p + 1, 0), s, e);
                else if (l = this.index(this._first), r = this.index(this._target), h = (o = this.underflow ? r : l) - p, o <= 0 && (this.underflow && "circular" === _ || "both" === _ || "first" === _)) this._scroll(d, s, e);
                else if (this.circular && h < 0) {
                    for (f = h, a = this.items().get(0); f++ < 0;) {
                        a = this.items().eq(-1), (u = this._visible.index(a) >= 0) && a.after(a.clone(!0).attr("data-jcarousel-clone", !0)), this.list().prepend(a), this._items = null;
                        var m = this.dimension(a);
                        (c = {})[this.lt] = -m, this.moveBy(c)
                    }
                    this._scroll(a, s, e)
                } else this._scroll(Math.max(h, 0), s, e)
            } else this._scroll(n.target, s, e);
            return this._trigger("scrollend"), this
        },
        moveBy: function(t, i) {
            var s = this.list().position(),
                n = 1,
                r = 0;
            return this.rtl && !this.vertical && (n = -1, this.relative && (r = e(this.list().width()) - this.clipping())), t.left && (t.left = e(s.left) + r + e(t.left) * n + "px"), t.top && (t.top = e(s.top) + r + e(t.top) * n + "px"), this.move(t, i)
        },
        move: function(i, s) {
            s = s || {};
            var e = this.options("transitions"),
                n = !!e,
                r = !!e.transforms,
                l = !!e.transforms3d,
                h = s.duration || 0,
                o = this.list();
            if (!n && h > 0) o.animate(i, s);
            else {
                var a = s.complete || t.noop,
                    u = {};
                if (n) {
                    var c = {
                            transitionDuration: o.css("transitionDuration"),
                            transitionTimingFunction: o.css("transitionTimingFunction"),
                            transitionProperty: o.css("transitionProperty")
                        },
                        f = a;
                    a = function() {
                        t(this).css(c), f.call(this)
                    }, u = {
                        transitionDuration: (h > 0 ? h / 1e3 : 0) + "s",
                        transitionTimingFunction: e.easing || s.easing,
                        transitionProperty: h > 0 ? r || l ? "all" : i.left ? "left" : "top" : "none",
                        transform: "none"
                    }
                }
                l ? u.transform = "translate3d(" + (i.left || 0) + "," + (i.top || 0) + ",0)" : r ? u.transform = "translate(" + (i.left || 0) + "," + (i.top || 0) + ")" : t.extend(u, i), n && h > 0 && o.one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", a), o.css(u), h <= 0 && o.each(function() {
                    a.call(this)
                })
            }
        },
        _scroll: function(i, s, n) {
            if (this.animating) return t.isFunction(n) && n.call(this, !1), this;
            if ("object" != typeof i ? i = this.items().eq(i) : void 0 === i.jquery && (i = t(i)), 0 === i.length) return t.isFunction(n) && n.call(this, !1), this;
            this.inTail = !1, this._prepare(i);
            var r = this._position(i);
            if (r === e(this.list().position()[this.lt])) return t.isFunction(n) && n.call(this, !1), this;
            var l = {};
            return l[this.lt] = r + "px", this._animate(l, s, n), this
        },
        _scrollTail: function(i, s) {
            if (this.animating || !this.tail) return t.isFunction(s) && s.call(this, !1), this;
            var n = this.list().position()[this.lt];
            this.rtl && this.relative && !this.vertical && (n += e(this.list().width()) - this.clipping()), this.rtl && !this.vertical ? n += this.tail : n -= this.tail, this.inTail = !0;
            var r = {};
            return r[this.lt] = n + "px", this._update({
                target: this._target.next(),
                fullyvisible: this._fullyvisible.slice(1).add(this._visible.last())
            }), this._animate(r, i, s), this
        },
        _animate: function(i, s, e) {
            if (e = e || t.noop, !1 === this._trigger("animate")) return e.call(this, !1), this;
            this.animating = !0;
            var n = this.options("animation"),
                r = t.proxy(function() {
                    this.animating = !1;
                    var t = this.list().find("[data-jcarousel-clone]");
                    t.length > 0 && (t.remove(), this._reload()), this._trigger("animateend"), e.call(this, !0)
                }, this),
                l = "object" == typeof n ? t.extend({}, n) : {
                    duration: n
                },
                h = l.complete || t.noop;
            return !1 === s ? l.duration = 0 : void 0 !== t.fx.speeds[l.duration] && (l.duration = t.fx.speeds[l.duration]), l.complete = function() {
                r(), h.call(this)
            }, this.move(i, l), this
        },
        _prepare: function(i) {
            var s, n, r, l = this.index(i),
                h = l,
                o = this.dimension(i),
                a = this.clipping(),
                u = this.vertical ? "bottom" : this.rtl ? "left" : "right",
                c = this.options("center"),
                f = {
                    target: i,
                    first: i,
                    last: i,
                    visible: i,
                    fullyvisible: o <= a ? i : t()
                };
            if (c && (o /= 2, a /= 2), o < a)
                for (;;) {
                    if (0 === (s = this.items().eq(++h)).length) {
                        if (!this.circular) break;
                        if (s = this.items().eq(0), i.get(0) === s.get(0)) break;
                        if ((n = this._visible.index(s) >= 0) && s.after(s.clone(!0).attr("data-jcarousel-clone", !0)), this.list().append(s), !n) {
                            var d = {};
                            d[this.lt] = this.dimension(s), this.moveBy(d)
                        }
                        this._items = null
                    }
                    if (0 === (r = this.dimension(s))) break;
                    if (o += r, f.last = s, f.visible = f.visible.add(s), o - e(s.css("margin-" + u)) <= a && (f.fullyvisible = f.fullyvisible.add(s)), o >= a) break
                }
            if (!this.circular && !c && o < a)
                for (h = l; !(--h < 0 || 0 === (s = this.items().eq(h)).length || 0 === (r = this.dimension(s)) || (o += r, f.first = s, f.visible = f.visible.add(s), o - e(s.css("margin-" + u)) <= a && (f.fullyvisible = f.fullyvisible.add(s)), o >= a)););
            return this._update(f), this.tail = 0, c || "circular" === this.options("wrap") || "custom" === this.options("wrap") || this.index(f.last) !== this.items().length - 1 || (o -= e(f.last.css("margin-" + u))) > a && (this.tail = o - a), this
        },
        _position: function(t) {
            var i = this._first,
                s = e(i.position()[this.lt]),
                n = this.options("center"),
                r = n ? this.clipping() / 2 - this.dimension(i) / 2 : 0;
            return this.rtl && !this.vertical ? (this.relative ? s -= e(this.list().width()) - this.dimension(i) : s -= this.clipping() - this.dimension(i), s += r) : s -= r, !n && (this.index(t) > this.index(i) || this.inTail) && this.tail ? (s = this.rtl && !this.vertical ? s - this.tail : s + this.tail, this.inTail = !0) : this.inTail = !1, -s
        },
        _update: function(i) {
            var s, e = this,
                n = {
                    target: this._target,
                    first: this._first,
                    last: this._last,
                    visible: this._visible,
                    fullyvisible: this._fullyvisible
                },
                r = this.index(i.first || n.first) < this.index(n.first),
                l = function(s) {
                    var l = [],
                        h = [];
                    i[s].each(function() {
                        n[s].index(this) < 0 && l.push(this)
                    }), n[s].each(function() {
                        i[s].index(this) < 0 && h.push(this)
                    }), r ? l = l.reverse() : h = h.reverse(), e._trigger(s + "in", t(l)), e._trigger(s + "out", t(h)), e["_" + s] = i[s]
                };
            for (s in i) l(s);
            return this
        }
    })
}(jQuery, window);

! function(t) {
    "use strict";
    t.jCarousel.plugin("jcarouselControl", {
        _options: {
            target: "+=1",
            event: "click",
            method: "scroll"
        },
        _active: null,
        _init: function() {
            this.onDestroy = t.proxy(function() {
                this._destroy(), this.carousel().one("jcarousel:createend", t.proxy(this._create, this))
            }, this), this.onReload = t.proxy(this._reload, this), this.onEvent = t.proxy(function(e) {
                e.preventDefault();
                var o = this.options("method");
                t.isFunction(o) ? o.call(this) : this.carousel().jcarousel(this.options("method"), this.options("target"))
            }, this)
        },
        _create: function() {
            this.carousel().one("jcarousel:destroy", this.onDestroy).on("jcarousel:reloadend jcarousel:scrollend", this.onReload), this._element.on(this.options("event") + ".jcarouselcontrol", this.onEvent), this._reload()
        },
        _destroy: function() {
            this._element.off(".jcarouselcontrol", this.onEvent), this.carousel().off("jcarousel:destroy", this.onDestroy).off("jcarousel:reloadend jcarousel:scrollend", this.onReload)
        },
        _reload: function() {
            var e, o = t.jCarousel.parseTarget(this.options("target")),
                s = this.carousel();
            if (o.relative) e = s.jcarousel(o.target > 0 ? "hasNext" : "hasPrev");
            else {
                var r = "object" != typeof o.target ? s.jcarousel("items").eq(o.target) : o.target;
                e = s.jcarousel("target").index(r) >= 0
            }
            return this._active !== e && (this._trigger(e ? "active" : "inactive"), this._active = e), this
        }
    })
}(jQuery);


var jcarousel = $('.default .carousel');

jcarousel.on('jcarousel:reload jcarousel:create', function() {
    var carousel = $(this),
        width = carousel.innerWidth();

    if (width >= 600) {
        width = width / 3;
    } else if (width >= 350) {
        width = width / 2;
    }

    carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
}).jcarousel({
    wrap: 'circular'
});

$('.jcarousel-control-prev').jcarouselControl({
    target: '-=1'
});

$('.jcarousel-control-next').jcarouselControl({
    target: '+=1'
});