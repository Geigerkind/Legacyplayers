/*
* Modelviewer of Warmane.com
*/

function ModelViewer(e) {
    var t = this;
    if (!e.type || !t.validTypes[e.type]) throw "Viewer error: Bad viewer type given";
    if (!e.container) throw "Viewer error: Bad container given";
    if (!e.aspect) throw "Viewer error: Bad aspect ratio given";
    if (!e.contentPath) throw "Viewer error: No content path given";
    t.type = e.type, t.container = e.container, t.aspect = parseFloat(e.aspect), t.renderer = null, 
    t.options = e;
    var r = parseInt(t.container.width()), n = Math.round(r / t.aspect);
    t.init(r, n);
}

!function(e) {
    e.fn.on || (e.fn.on = function(e, t, r, n) {
        var o = this, a = arguments.length;
        return a > 3 ? o.delegate(t, e, r, n) :a > 2 ? "string" == typeof t ? o.delegate(t, e, r) :o.bind(e, t, r) :o.bind(e, t);
    }), e.fn.off || (e.fn.off = function(e, t, r) {
        var n = this, o = arguments.length;
        return "string" == typeof t ? o > 2 ? n.undelegate(t, e, r) :o > 1 ? n.undelegate(t, e) :n.undelegate() :o > 1 ? (r = t, 
        n.unbind(e, r)) :o > 0 ? n.unbind(e) :n.unbind();
    });
}(this.jQuery), function(e) {
    "use strict";
    var t = {};
    "undefined" == typeof exports ? "function" == typeof define && "object" == typeof define.amd && define.amd ? (t.exports = {}, 
    define(function() {
        return t.exports;
    })) :t.exports = "undefined" != typeof window ? window :e :t.exports = exports, 
    function(e) {
        if (!t) var t = 1e-6;
        if (!r) var r = "undefined" != typeof Float32Array ? Float32Array :Array;
        if (!n) var n = Math.random;
        var o = {};
        o.setMatrixArrayType = function(e) {
            r = e;
        }, "undefined" != typeof e && (e.glMatrix = o);
        var a = Math.PI / 180;
        o.toRadian = function(e) {
            return e * a;
        };
        var i = {};
        i.create = function() {
            var e = new r(2);
            return e[0] = 0, e[1] = 0, e;
        }, i.clone = function(e) {
            var t = new r(2);
            return t[0] = e[0], t[1] = e[1], t;
        }, i.fromValues = function(e, t) {
            var n = new r(2);
            return n[0] = e, n[1] = t, n;
        }, i.copy = function(e, t) {
            return e[0] = t[0], e[1] = t[1], e;
        }, i.set = function(e, t, r) {
            return e[0] = t, e[1] = r, e;
        }, i.add = function(e, t, r) {
            return e[0] = t[0] + r[0], e[1] = t[1] + r[1], e;
        }, i.subtract = function(e, t, r) {
            return e[0] = t[0] - r[0], e[1] = t[1] - r[1], e;
        }, i.sub = i.subtract, i.multiply = function(e, t, r) {
            return e[0] = t[0] * r[0], e[1] = t[1] * r[1], e;
        }, i.mul = i.multiply, i.divide = function(e, t, r) {
            return e[0] = t[0] / r[0], e[1] = t[1] / r[1], e;
        }, i.div = i.divide, i.min = function(e, t, r) {
            return e[0] = Math.min(t[0], r[0]), e[1] = Math.min(t[1], r[1]), e;
        }, i.max = function(e, t, r) {
            return e[0] = Math.max(t[0], r[0]), e[1] = Math.max(t[1], r[1]), e;
        }, i.scale = function(e, t, r) {
            return e[0] = t[0] * r, e[1] = t[1] * r, e;
        }, i.scaleAndAdd = function(e, t, r, n) {
            return e[0] = t[0] + r[0] * n, e[1] = t[1] + r[1] * n, e;
        }, i.distance = function(e, t) {
            var r = t[0] - e[0], n = t[1] - e[1];
            return Math.sqrt(r * r + n * n);
        }, i.dist = i.distance, i.squaredDistance = function(e, t) {
            var r = t[0] - e[0], n = t[1] - e[1];
            return r * r + n * n;
        }, i.sqrDist = i.squaredDistance, i.length = function(e) {
            var t = e[0], r = e[1];
            return Math.sqrt(t * t + r * r);
        }, i.len = i.length, i.squaredLength = function(e) {
            var t = e[0], r = e[1];
            return t * t + r * r;
        }, i.sqrLen = i.squaredLength, i.negate = function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e;
        }, i.normalize = function(e, t) {
            var r = t[0], n = t[1], o = r * r + n * n;
            return o > 0 && (o = 1 / Math.sqrt(o), e[0] = t[0] * o, e[1] = t[1] * o), e;
        }, i.dot = function(e, t) {
            return e[0] * t[0] + e[1] * t[1];
        }, i.cross = function(e, t, r) {
            var n = t[0] * r[1] - t[1] * r[0];
            return e[0] = e[1] = 0, e[2] = n, e;
        }, i.lerp = function(e, t, r, n) {
            var o = t[0], a = t[1];
            return e[0] = o + n * (r[0] - o), e[1] = a + n * (r[1] - a), e;
        }, i.random = function(e, t) {
            t = t || 1;
            var r = 2 * n() * Math.PI;
            return e[0] = Math.cos(r) * t, e[1] = Math.sin(r) * t, e;
        }, i.transformMat2 = function(e, t, r) {
            var n = t[0], o = t[1];
            return e[0] = r[0] * n + r[2] * o, e[1] = r[1] * n + r[3] * o, e;
        }, i.transformMat2d = function(e, t, r) {
            var n = t[0], o = t[1];
            return e[0] = r[0] * n + r[2] * o + r[4], e[1] = r[1] * n + r[3] * o + r[5], e;
        }, i.transformMat3 = function(e, t, r) {
            var n = t[0], o = t[1];
            return e[0] = r[0] * n + r[3] * o + r[6], e[1] = r[1] * n + r[4] * o + r[7], e;
        }, i.transformMat4 = function(e, t, r) {
            var n = t[0], o = t[1];
            return e[0] = r[0] * n + r[4] * o + r[12], e[1] = r[1] * n + r[5] * o + r[13], e;
        }, i.forEach = function() {
            var e = i.create();
            return function(t, r, n, o, a, i) {
                var s, l;
                for (r || (r = 2), n || (n = 0), l = o ? Math.min(o * r + n, t.length) :t.length, 
                s = n; l > s; s += r) e[0] = t[s], e[1] = t[s + 1], a(e, e, i), t[s] = e[0], t[s + 1] = e[1];
                return t;
            };
        }(), i.str = function(e) {
            return "vec2(" + e[0] + ", " + e[1] + ")";
        }, "undefined" != typeof e && (e.vec2 = i);
        var s = {};
        s.create = function() {
            var e = new r(3);
            return e[0] = 0, e[1] = 0, e[2] = 0, e;
        }, s.clone = function(e) {
            var t = new r(3);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t;
        }, s.fromValues = function(e, t, n) {
            var o = new r(3);
            return o[0] = e, o[1] = t, o[2] = n, o;
        }, s.copy = function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e;
        }, s.set = function(e, t, r, n) {
            return e[0] = t, e[1] = r, e[2] = n, e;
        }, s.add = function(e, t, r) {
            return e[0] = t[0] + r[0], e[1] = t[1] + r[1], e[2] = t[2] + r[2], e;
        }, s.subtract = function(e, t, r) {
            return e[0] = t[0] - r[0], e[1] = t[1] - r[1], e[2] = t[2] - r[2], e;
        }, s.sub = s.subtract, s.multiply = function(e, t, r) {
            return e[0] = t[0] * r[0], e[1] = t[1] * r[1], e[2] = t[2] * r[2], e;
        }, s.mul = s.multiply, s.divide = function(e, t, r) {
            return e[0] = t[0] / r[0], e[1] = t[1] / r[1], e[2] = t[2] / r[2], e;
        }, s.div = s.divide, s.min = function(e, t, r) {
            return e[0] = Math.min(t[0], r[0]), e[1] = Math.min(t[1], r[1]), e[2] = Math.min(t[2], r[2]), 
            e;
        }, s.max = function(e, t, r) {
            return e[0] = Math.max(t[0], r[0]), e[1] = Math.max(t[1], r[1]), e[2] = Math.max(t[2], r[2]), 
            e;
        }, s.scale = function(e, t, r) {
            return e[0] = t[0] * r, e[1] = t[1] * r, e[2] = t[2] * r, e;
        }, s.scaleAndAdd = function(e, t, r, n) {
            return e[0] = t[0] + r[0] * n, e[1] = t[1] + r[1] * n, e[2] = t[2] + r[2] * n, e;
        }, s.distance = function(e, t) {
            var r = t[0] - e[0], n = t[1] - e[1], o = t[2] - e[2];
            return Math.sqrt(r * r + n * n + o * o);
        }, s.dist = s.distance, s.squaredDistance = function(e, t) {
            var r = t[0] - e[0], n = t[1] - e[1], o = t[2] - e[2];
            return r * r + n * n + o * o;
        }, s.sqrDist = s.squaredDistance, s.length = function(e) {
            var t = e[0], r = e[1], n = e[2];
            return Math.sqrt(t * t + r * r + n * n);
        }, s.len = s.length, s.squaredLength = function(e) {
            var t = e[0], r = e[1], n = e[2];
            return t * t + r * r + n * n;
        }, s.sqrLen = s.squaredLength, s.negate = function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e;
        }, s.normalize = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = r * r + n * n + o * o;
            return a > 0 && (a = 1 / Math.sqrt(a), e[0] = t[0] * a, e[1] = t[1] * a, e[2] = t[2] * a), 
            e;
        }, s.dot = function(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
        }, s.cross = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = r[0], s = r[1], l = r[2];
            return e[0] = o * l - a * s, e[1] = a * i - n * l, e[2] = n * s - o * i, e;
        }, s.lerp = function(e, t, r, n) {
            var o = t[0], a = t[1], i = t[2];
            return e[0] = o + n * (r[0] - o), e[1] = a + n * (r[1] - a), e[2] = i + n * (r[2] - i), 
            e;
        }, s.random = function(e, t) {
            t = t || 1;
            var r = 2 * n() * Math.PI, o = 2 * n() - 1, a = Math.sqrt(1 - o * o) * t;
            return e[0] = Math.cos(r) * a, e[1] = Math.sin(r) * a, e[2] = o * t, e;
        }, s.transformMat4 = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2];
            return e[0] = r[0] * n + r[4] * o + r[8] * a + r[12], e[1] = r[1] * n + r[5] * o + r[9] * a + r[13], 
            e[2] = r[2] * n + r[6] * o + r[10] * a + r[14], e;
        }, s.transformMat3 = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2];
            return e[0] = n * r[0] + o * r[3] + a * r[6], e[1] = n * r[1] + o * r[4] + a * r[7], 
            e[2] = n * r[2] + o * r[5] + a * r[8], e;
        }, s.transformQuat = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = r[0], s = r[1], l = r[2], u = r[3], d = u * n + s * a - l * o, c = u * o + l * n - i * a, m = u * a + i * o - s * n, f = -i * n - s * o - l * a;
            return e[0] = d * u + f * -i + c * -l - m * -s, e[1] = c * u + f * -s + m * -i - d * -l, 
            e[2] = m * u + f * -l + d * -s - c * -i, e;
        }, s.rotateX = function(e, t, r, n) {
            var o = [], a = [];
            return o[0] = t[0] - r[0], o[1] = t[1] - r[1], o[2] = t[2] - r[2], a[0] = o[0], 
            a[1] = o[1] * Math.cos(n) - o[2] * Math.sin(n), a[2] = o[1] * Math.sin(n) + o[2] * Math.cos(n), 
            e[0] = a[0] + r[0], e[1] = a[1] + r[1], e[2] = a[2] + r[2], e;
        }, s.rotateY = function(e, t, r, n) {
            var o = [], a = [];
            return o[0] = t[0] - r[0], o[1] = t[1] - r[1], o[2] = t[2] - r[2], a[0] = o[2] * Math.sin(n) + o[0] * Math.cos(n), 
            a[1] = o[1], a[2] = o[2] * Math.cos(n) - o[0] * Math.sin(n), e[0] = a[0] + r[0], 
            e[1] = a[1] + r[1], e[2] = a[2] + r[2], e;
        }, s.rotateZ = function(e, t, r, n) {
            var o = [], a = [];
            return o[0] = t[0] - r[0], o[1] = t[1] - r[1], o[2] = t[2] - r[2], a[0] = o[0] * Math.cos(n) - o[1] * Math.sin(n), 
            a[1] = o[0] * Math.sin(n) + o[1] * Math.cos(n), a[2] = o[2], e[0] = a[0] + r[0], 
            e[1] = a[1] + r[1], e[2] = a[2] + r[2], e;
        }, s.forEach = function() {
            var e = s.create();
            return function(t, r, n, o, a, i) {
                var s, l;
                for (r || (r = 3), n || (n = 0), l = o ? Math.min(o * r + n, t.length) :t.length, 
                s = n; l > s; s += r) e[0] = t[s], e[1] = t[s + 1], e[2] = t[s + 2], a(e, e, i), 
                t[s] = e[0], t[s + 1] = e[1], t[s + 2] = e[2];
                return t;
            };
        }(), s.str = function(e) {
            return "vec3(" + e[0] + ", " + e[1] + ", " + e[2] + ")";
        }, "undefined" != typeof e && (e.vec3 = s);
        var l = {};
        l.create = function() {
            var e = new r(4);
            return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e;
        }, l.clone = function(e) {
            var t = new r(4);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;
        }, l.fromValues = function(e, t, n, o) {
            var a = new r(4);
            return a[0] = e, a[1] = t, a[2] = n, a[3] = o, a;
        }, l.copy = function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
        }, l.set = function(e, t, r, n, o) {
            return e[0] = t, e[1] = r, e[2] = n, e[3] = o, e;
        }, l.add = function(e, t, r) {
            return e[0] = t[0] + r[0], e[1] = t[1] + r[1], e[2] = t[2] + r[2], e[3] = t[3] + r[3], 
            e;
        }, l.subtract = function(e, t, r) {
            return e[0] = t[0] - r[0], e[1] = t[1] - r[1], e[2] = t[2] - r[2], e[3] = t[3] - r[3], 
            e;
        }, l.sub = l.subtract, l.multiply = function(e, t, r) {
            return e[0] = t[0] * r[0], e[1] = t[1] * r[1], e[2] = t[2] * r[2], e[3] = t[3] * r[3], 
            e;
        }, l.mul = l.multiply, l.divide = function(e, t, r) {
            return e[0] = t[0] / r[0], e[1] = t[1] / r[1], e[2] = t[2] / r[2], e[3] = t[3] / r[3], 
            e;
        }, l.div = l.divide, l.min = function(e, t, r) {
            return e[0] = Math.min(t[0], r[0]), e[1] = Math.min(t[1], r[1]), e[2] = Math.min(t[2], r[2]), 
            e[3] = Math.min(t[3], r[3]), e;
        }, l.max = function(e, t, r) {
            return e[0] = Math.max(t[0], r[0]), e[1] = Math.max(t[1], r[1]), e[2] = Math.max(t[2], r[2]), 
            e[3] = Math.max(t[3], r[3]), e;
        }, l.scale = function(e, t, r) {
            return e[0] = t[0] * r, e[1] = t[1] * r, e[2] = t[2] * r, e[3] = t[3] * r, e;
        }, l.scaleAndAdd = function(e, t, r, n) {
            return e[0] = t[0] + r[0] * n, e[1] = t[1] + r[1] * n, e[2] = t[2] + r[2] * n, e[3] = t[3] + r[3] * n, 
            e;
        }, l.distance = function(e, t) {
            var r = t[0] - e[0], n = t[1] - e[1], o = t[2] - e[2], a = t[3] - e[3];
            return Math.sqrt(r * r + n * n + o * o + a * a);
        }, l.dist = l.distance, l.squaredDistance = function(e, t) {
            var r = t[0] - e[0], n = t[1] - e[1], o = t[2] - e[2], a = t[3] - e[3];
            return r * r + n * n + o * o + a * a;
        }, l.sqrDist = l.squaredDistance, l.length = function(e) {
            var t = e[0], r = e[1], n = e[2], o = e[3];
            return Math.sqrt(t * t + r * r + n * n + o * o);
        }, l.len = l.length, l.squaredLength = function(e) {
            var t = e[0], r = e[1], n = e[2], o = e[3];
            return t * t + r * r + n * n + o * o;
        }, l.sqrLen = l.squaredLength, l.negate = function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = -t[3], e;
        }, l.normalize = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = r * r + n * n + o * o + a * a;
            return i > 0 && (i = 1 / Math.sqrt(i), e[0] = t[0] * i, e[1] = t[1] * i, e[2] = t[2] * i, 
            e[3] = t[3] * i), e;
        }, l.dot = function(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3];
        }, l.lerp = function(e, t, r, n) {
            var o = t[0], a = t[1], i = t[2], s = t[3];
            return e[0] = o + n * (r[0] - o), e[1] = a + n * (r[1] - a), e[2] = i + n * (r[2] - i), 
            e[3] = s + n * (r[3] - s), e;
        }, l.random = function(e, t) {
            return t = t || 1, e[0] = n(), e[1] = n(), e[2] = n(), e[3] = n(), l.normalize(e, e), 
            l.scale(e, e, t), e;
        }, l.transformMat4 = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3];
            return e[0] = r[0] * n + r[4] * o + r[8] * a + r[12] * i, e[1] = r[1] * n + r[5] * o + r[9] * a + r[13] * i, 
            e[2] = r[2] * n + r[6] * o + r[10] * a + r[14] * i, e[3] = r[3] * n + r[7] * o + r[11] * a + r[15] * i, 
            e;
        }, l.transformQuat = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = r[0], s = r[1], l = r[2], u = r[3], d = u * n + s * a - l * o, c = u * o + l * n - i * a, m = u * a + i * o - s * n, f = -i * n - s * o - l * a;
            return e[0] = d * u + f * -i + c * -l - m * -s, e[1] = c * u + f * -s + m * -i - d * -l, 
            e[2] = m * u + f * -l + d * -s - c * -i, e;
        }, l.forEach = function() {
            var e = l.create();
            return function(t, r, n, o, a, i) {
                var s, l;
                for (r || (r = 4), n || (n = 0), l = o ? Math.min(o * r + n, t.length) :t.length, 
                s = n; l > s; s += r) e[0] = t[s], e[1] = t[s + 1], e[2] = t[s + 2], e[3] = t[s + 3], 
                a(e, e, i), t[s] = e[0], t[s + 1] = e[1], t[s + 2] = e[2], t[s + 3] = e[3];
                return t;
            };
        }(), l.str = function(e) {
            return "vec4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
        }, "undefined" != typeof e && (e.vec4 = l);
        var u = {};
        u.create = function() {
            var e = new r(4);
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e;
        }, u.clone = function(e) {
            var t = new r(4);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t;
        }, u.copy = function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
        }, u.identity = function(e) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e;
        }, u.transpose = function(e, t) {
            if (e === t) {
                var r = t[1];
                e[1] = t[2], e[2] = r;
            } else e[0] = t[0], e[1] = t[2], e[2] = t[1], e[3] = t[3];
            return e;
        }, u.invert = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = r * a - o * n;
            return i ? (i = 1 / i, e[0] = a * i, e[1] = -n * i, e[2] = -o * i, e[3] = r * i, 
            e) :null;
        }, u.adjoint = function(e, t) {
            var r = t[0];
            return e[0] = t[3], e[1] = -t[1], e[2] = -t[2], e[3] = r, e;
        }, u.determinant = function(e) {
            return e[0] * e[3] - e[2] * e[1];
        }, u.multiply = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = r[0], l = r[1], u = r[2], d = r[3];
            return e[0] = n * s + a * l, e[1] = o * s + i * l, e[2] = n * u + a * d, e[3] = o * u + i * d, 
            e;
        }, u.mul = u.multiply, u.rotate = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = Math.sin(r), l = Math.cos(r);
            return e[0] = n * l + a * s, e[1] = o * l + i * s, e[2] = n * -s + a * l, e[3] = o * -s + i * l, 
            e;
        }, u.scale = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = r[0], l = r[1];
            return e[0] = n * s, e[1] = o * s, e[2] = a * l, e[3] = i * l, e;
        }, u.str = function(e) {
            return "mat2(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
        }, u.frob = function(e) {
            return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2));
        }, u.LDU = function(e, t, r, n) {
            return e[2] = n[2] / n[0], r[0] = n[0], r[1] = n[1], r[3] = n[3] - e[2] * r[1], 
            [ e, t, r ];
        }, "undefined" != typeof e && (e.mat2 = u);
        var d = {};
        d.create = function() {
            var e = new r(6);
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e;
        }, d.clone = function(e) {
            var t = new r(6);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], 
            t;
        }, d.copy = function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], 
            e;
        }, d.identity = function(e) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e;
        }, d.invert = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = t[4], s = t[5], l = r * a - n * o;
            return l ? (l = 1 / l, e[0] = a * l, e[1] = -n * l, e[2] = -o * l, e[3] = r * l, 
            e[4] = (o * s - a * i) * l, e[5] = (n * i - r * s) * l, e) :null;
        }, d.determinant = function(e) {
            return e[0] * e[3] - e[1] * e[2];
        }, d.multiply = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = t[4], l = t[5], u = r[0], d = r[1], c = r[2], m = r[3], f = r[4], h = r[5];
            return e[0] = n * u + a * d, e[1] = o * u + i * d, e[2] = n * c + a * m, e[3] = o * c + i * m, 
            e[4] = n * f + a * h + s, e[5] = o * f + i * h + l, e;
        }, d.mul = d.multiply, d.rotate = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = t[4], l = t[5], u = Math.sin(r), d = Math.cos(r);
            return e[0] = n * d + a * u, e[1] = o * d + i * u, e[2] = n * -u + a * d, e[3] = o * -u + i * d, 
            e[4] = s, e[5] = l, e;
        }, d.scale = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = t[4], l = t[5], u = r[0], d = r[1];
            return e[0] = n * u, e[1] = o * u, e[2] = a * d, e[3] = i * d, e[4] = s, e[5] = l, 
            e;
        }, d.translate = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = t[4], l = t[5], u = r[0], d = r[1];
            return e[0] = n, e[1] = o, e[2] = a, e[3] = i, e[4] = n * u + a * d + s, e[5] = o * u + i * d + l, 
            e;
        }, d.str = function(e) {
            return "mat2d(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ")";
        }, d.frob = function(e) {
            return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + 1);
        }, "undefined" != typeof e && (e.mat2d = d);
        var c = {};
        c.create = function() {
            var e = new r(9);
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 0, 
            e[8] = 1, e;
        }, c.fromMat4 = function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[4], e[4] = t[5], e[5] = t[6], 
            e[6] = t[8], e[7] = t[9], e[8] = t[10], e;
        }, c.clone = function(e) {
            var t = new r(9);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], 
            t[6] = e[6], t[7] = e[7], t[8] = e[8], t;
        }, c.copy = function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], 
            e[6] = t[6], e[7] = t[7], e[8] = t[8], e;
        }, c.identity = function(e) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 1, e[5] = 0, e[6] = 0, e[7] = 0, 
            e[8] = 1, e;
        }, c.transpose = function(e, t) {
            if (e === t) {
                var r = t[1], n = t[2], o = t[5];
                e[1] = t[3], e[2] = t[6], e[3] = r, e[5] = t[7], e[6] = n, e[7] = o;
            } else e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], 
            e[6] = t[2], e[7] = t[5], e[8] = t[8];
            return e;
        }, c.invert = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = t[4], s = t[5], l = t[6], u = t[7], d = t[8], c = d * i - s * u, m = -d * a + s * l, f = u * a - i * l, h = r * c + n * m + o * f;
            return h ? (h = 1 / h, e[0] = c * h, e[1] = (-d * n + o * u) * h, e[2] = (s * n - o * i) * h, 
            e[3] = m * h, e[4] = (d * r - o * l) * h, e[5] = (-s * r + o * a) * h, e[6] = f * h, 
            e[7] = (-u * r + n * l) * h, e[8] = (i * r - n * a) * h, e) :null;
        }, c.adjoint = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = t[4], s = t[5], l = t[6], u = t[7], d = t[8];
            return e[0] = i * d - s * u, e[1] = o * u - n * d, e[2] = n * s - o * i, e[3] = s * l - a * d, 
            e[4] = r * d - o * l, e[5] = o * a - r * s, e[6] = a * u - i * l, e[7] = n * l - r * u, 
            e[8] = r * i - n * a, e;
        }, c.determinant = function(e) {
            var t = e[0], r = e[1], n = e[2], o = e[3], a = e[4], i = e[5], s = e[6], l = e[7], u = e[8];
            return t * (u * a - i * l) + r * (-u * o + i * s) + n * (l * o - a * s);
        }, c.multiply = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = t[4], l = t[5], u = t[6], d = t[7], c = t[8], m = r[0], f = r[1], h = r[2], p = r[3], g = r[4], w = r[5], v = r[6], x = r[7], M = r[8];
            return e[0] = m * n + f * i + h * u, e[1] = m * o + f * s + h * d, e[2] = m * a + f * l + h * c, 
            e[3] = p * n + g * i + w * u, e[4] = p * o + g * s + w * d, e[5] = p * a + g * l + w * c, 
            e[6] = v * n + x * i + M * u, e[7] = v * o + x * s + M * d, e[8] = v * a + x * l + M * c, 
            e;
        }, c.mul = c.multiply, c.translate = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = t[4], l = t[5], u = t[6], d = t[7], c = t[8], m = r[0], f = r[1];
            return e[0] = n, e[1] = o, e[2] = a, e[3] = i, e[4] = s, e[5] = l, e[6] = m * n + f * i + u, 
            e[7] = m * o + f * s + d, e[8] = m * a + f * l + c, e;
        }, c.rotate = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = t[4], l = t[5], u = t[6], d = t[7], c = t[8], m = Math.sin(r), f = Math.cos(r);
            return e[0] = f * n + m * i, e[1] = f * o + m * s, e[2] = f * a + m * l, e[3] = f * i - m * n, 
            e[4] = f * s - m * o, e[5] = f * l - m * a, e[6] = u, e[7] = d, e[8] = c, e;
        }, c.scale = function(e, t, r) {
            var n = r[0], o = r[1];
            return e[0] = n * t[0], e[1] = n * t[1], e[2] = n * t[2], e[3] = o * t[3], e[4] = o * t[4], 
            e[5] = o * t[5], e[6] = t[6], e[7] = t[7], e[8] = t[8], e;
        }, c.fromMat2d = function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = 0, e[3] = t[2], e[4] = t[3], e[5] = 0, e[6] = t[4], 
            e[7] = t[5], e[8] = 1, e;
        }, c.fromQuat = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = r + r, s = n + n, l = o + o, u = r * i, d = n * i, c = n * s, m = o * i, f = o * s, h = o * l, p = a * i, g = a * s, w = a * l;
            return e[0] = 1 - c - h, e[3] = d - w, e[6] = m + g, e[1] = d + w, e[4] = 1 - u - h, 
            e[7] = f - p, e[2] = m - g, e[5] = f + p, e[8] = 1 - u - c, e;
        }, c.normalFromMat4 = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = t[4], s = t[5], l = t[6], u = t[7], d = t[8], c = t[9], m = t[10], f = t[11], h = t[12], p = t[13], g = t[14], w = t[15], v = r * s - n * i, x = r * l - o * i, M = r * u - a * i, b = n * l - o * s, A = n * u - a * s, y = o * u - a * l, T = d * p - c * h, V = d * g - m * h, I = d * w - f * h, U = c * g - m * p, E = c * w - f * p, S = m * w - f * g, R = v * S - x * E + M * U + b * I - A * V + y * T;
            return R ? (R = 1 / R, e[0] = (s * S - l * E + u * U) * R, e[1] = (l * I - i * S - u * V) * R, 
            e[2] = (i * E - s * I + u * T) * R, e[3] = (o * E - n * S - a * U) * R, e[4] = (r * S - o * I + a * V) * R, 
            e[5] = (n * I - r * E - a * T) * R, e[6] = (p * y - g * A + w * b) * R, e[7] = (g * M - h * y - w * x) * R, 
            e[8] = (h * A - p * M + w * v) * R, e) :null;
        }, c.str = function(e) {
            return "mat3(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ")";
        }, c.frob = function(e) {
            return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + Math.pow(e[6], 2) + Math.pow(e[7], 2) + Math.pow(e[8], 2));
        }, "undefined" != typeof e && (e.mat3 = c);
        var m = {};
        m.create = function() {
            var e = new r(16);
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, 
            e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, 
            e;
        }, m.clone = function(e) {
            var t = new r(16);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], 
            t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], 
            t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t;
        }, m.copy = function(e, t) {
            return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], 
            e[6] = t[6], e[7] = t[7], e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], 
            e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e;
        }, m.identity = function(e) {
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, 
            e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, 
            e;
        }, m.transpose = function(e, t) {
            if (e === t) {
                var r = t[1], n = t[2], o = t[3], a = t[6], i = t[7], s = t[11];
                e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = r, e[6] = t[9], e[7] = t[13], e[8] = n, 
                e[9] = a, e[11] = t[14], e[12] = o, e[13] = i, e[14] = s;
            } else e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = t[1], e[5] = t[5], 
            e[6] = t[9], e[7] = t[13], e[8] = t[2], e[9] = t[6], e[10] = t[10], e[11] = t[14], 
            e[12] = t[3], e[13] = t[7], e[14] = t[11], e[15] = t[15];
            return e;
        }, m.invert = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = t[4], s = t[5], l = t[6], u = t[7], d = t[8], c = t[9], m = t[10], f = t[11], h = t[12], p = t[13], g = t[14], w = t[15], v = r * s - n * i, x = r * l - o * i, M = r * u - a * i, b = n * l - o * s, A = n * u - a * s, y = o * u - a * l, T = d * p - c * h, V = d * g - m * h, I = d * w - f * h, U = c * g - m * p, E = c * w - f * p, S = m * w - f * g, R = v * S - x * E + M * U + b * I - A * V + y * T;
            return R ? (R = 1 / R, e[0] = (s * S - l * E + u * U) * R, e[1] = (o * E - n * S - a * U) * R, 
            e[2] = (p * y - g * A + w * b) * R, e[3] = (m * A - c * y - f * b) * R, e[4] = (l * I - i * S - u * V) * R, 
            e[5] = (r * S - o * I + a * V) * R, e[6] = (g * M - h * y - w * x) * R, e[7] = (d * y - m * M + f * x) * R, 
            e[8] = (i * E - s * I + u * T) * R, e[9] = (n * I - r * E - a * T) * R, e[10] = (h * A - p * M + w * v) * R, 
            e[11] = (c * M - d * A - f * v) * R, e[12] = (s * V - i * U - l * T) * R, e[13] = (r * U - n * V + o * T) * R, 
            e[14] = (p * x - h * b - g * v) * R, e[15] = (d * b - c * x + m * v) * R, e) :null;
        }, m.adjoint = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = t[4], s = t[5], l = t[6], u = t[7], d = t[8], c = t[9], m = t[10], f = t[11], h = t[12], p = t[13], g = t[14], w = t[15];
            return e[0] = s * (m * w - f * g) - c * (l * w - u * g) + p * (l * f - u * m), e[1] = -(n * (m * w - f * g) - c * (o * w - a * g) + p * (o * f - a * m)), 
            e[2] = n * (l * w - u * g) - s * (o * w - a * g) + p * (o * u - a * l), e[3] = -(n * (l * f - u * m) - s * (o * f - a * m) + c * (o * u - a * l)), 
            e[4] = -(i * (m * w - f * g) - d * (l * w - u * g) + h * (l * f - u * m)), e[5] = r * (m * w - f * g) - d * (o * w - a * g) + h * (o * f - a * m), 
            e[6] = -(r * (l * w - u * g) - i * (o * w - a * g) + h * (o * u - a * l)), e[7] = r * (l * f - u * m) - i * (o * f - a * m) + d * (o * u - a * l), 
            e[8] = i * (c * w - f * p) - d * (s * w - u * p) + h * (s * f - u * c), e[9] = -(r * (c * w - f * p) - d * (n * w - a * p) + h * (n * f - a * c)), 
            e[10] = r * (s * w - u * p) - i * (n * w - a * p) + h * (n * u - a * s), e[11] = -(r * (s * f - u * c) - i * (n * f - a * c) + d * (n * u - a * s)), 
            e[12] = -(i * (c * g - m * p) - d * (s * g - l * p) + h * (s * m - l * c)), e[13] = r * (c * g - m * p) - d * (n * g - o * p) + h * (n * m - o * c), 
            e[14] = -(r * (s * g - l * p) - i * (n * g - o * p) + h * (n * l - o * s)), e[15] = r * (s * m - l * c) - i * (n * m - o * c) + d * (n * l - o * s), 
            e;
        }, m.determinant = function(e) {
            var t = e[0], r = e[1], n = e[2], o = e[3], a = e[4], i = e[5], s = e[6], l = e[7], u = e[8], d = e[9], c = e[10], m = e[11], f = e[12], h = e[13], p = e[14], g = e[15], w = t * i - r * a, v = t * s - n * a, x = t * l - o * a, M = r * s - n * i, b = r * l - o * i, A = n * l - o * s, y = u * h - d * f, T = u * p - c * f, V = u * g - m * f, I = d * p - c * h, U = d * g - m * h, E = c * g - m * p;
            return w * E - v * U + x * I + M * V - b * T + A * y;
        }, m.multiply = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = t[4], l = t[5], u = t[6], d = t[7], c = t[8], m = t[9], f = t[10], h = t[11], p = t[12], g = t[13], w = t[14], v = t[15], x = r[0], M = r[1], b = r[2], A = r[3];
            return e[0] = x * n + M * s + b * c + A * p, e[1] = x * o + M * l + b * m + A * g, 
            e[2] = x * a + M * u + b * f + A * w, e[3] = x * i + M * d + b * h + A * v, x = r[4], 
            M = r[5], b = r[6], A = r[7], e[4] = x * n + M * s + b * c + A * p, e[5] = x * o + M * l + b * m + A * g, 
            e[6] = x * a + M * u + b * f + A * w, e[7] = x * i + M * d + b * h + A * v, x = r[8], 
            M = r[9], b = r[10], A = r[11], e[8] = x * n + M * s + b * c + A * p, e[9] = x * o + M * l + b * m + A * g, 
            e[10] = x * a + M * u + b * f + A * w, e[11] = x * i + M * d + b * h + A * v, x = r[12], 
            M = r[13], b = r[14], A = r[15], e[12] = x * n + M * s + b * c + A * p, e[13] = x * o + M * l + b * m + A * g, 
            e[14] = x * a + M * u + b * f + A * w, e[15] = x * i + M * d + b * h + A * v, e;
        }, m.mul = m.multiply, m.translate = function(e, t, r) {
            var n, o, a, i, s, l, u, d, c, m, f, h, p = r[0], g = r[1], w = r[2];
            return t === e ? (e[12] = t[0] * p + t[4] * g + t[8] * w + t[12], e[13] = t[1] * p + t[5] * g + t[9] * w + t[13], 
            e[14] = t[2] * p + t[6] * g + t[10] * w + t[14], e[15] = t[3] * p + t[7] * g + t[11] * w + t[15]) :(n = t[0], 
            o = t[1], a = t[2], i = t[3], s = t[4], l = t[5], u = t[6], d = t[7], c = t[8], 
            m = t[9], f = t[10], h = t[11], e[0] = n, e[1] = o, e[2] = a, e[3] = i, e[4] = s, 
            e[5] = l, e[6] = u, e[7] = d, e[8] = c, e[9] = m, e[10] = f, e[11] = h, e[12] = n * p + s * g + c * w + t[12], 
            e[13] = o * p + l * g + m * w + t[13], e[14] = a * p + u * g + f * w + t[14], e[15] = i * p + d * g + h * w + t[15]), 
            e;
        }, m.scale = function(e, t, r) {
            var n = r[0], o = r[1], a = r[2];
            return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * o, 
            e[5] = t[5] * o, e[6] = t[6] * o, e[7] = t[7] * o, e[8] = t[8] * a, e[9] = t[9] * a, 
            e[10] = t[10] * a, e[11] = t[11] * a, e[12] = t[12], e[13] = t[13], e[14] = t[14], 
            e[15] = t[15], e;
        }, m.rotate = function(e, r, n, o) {
            var a, i, s, l, u, d, c, m, f, h, p, g, w, v, x, M, b, A, y, T, V, I, U, E, S = o[0], R = o[1], F = o[2], L = Math.sqrt(S * S + R * R + F * F);
            return Math.abs(L) < t ? null :(L = 1 / L, S *= L, R *= L, F *= L, a = Math.sin(n), 
            i = Math.cos(n), s = 1 - i, l = r[0], u = r[1], d = r[2], c = r[3], m = r[4], f = r[5], 
            h = r[6], p = r[7], g = r[8], w = r[9], v = r[10], x = r[11], M = S * S * s + i, 
            b = R * S * s + F * a, A = F * S * s - R * a, y = S * R * s - F * a, T = R * R * s + i, 
            V = F * R * s + S * a, I = S * F * s + R * a, U = R * F * s - S * a, E = F * F * s + i, 
            e[0] = l * M + m * b + g * A, e[1] = u * M + f * b + w * A, e[2] = d * M + h * b + v * A, 
            e[3] = c * M + p * b + x * A, e[4] = l * y + m * T + g * V, e[5] = u * y + f * T + w * V, 
            e[6] = d * y + h * T + v * V, e[7] = c * y + p * T + x * V, e[8] = l * I + m * U + g * E, 
            e[9] = u * I + f * U + w * E, e[10] = d * I + h * U + v * E, e[11] = c * I + p * U + x * E, 
            r !== e && (e[12] = r[12], e[13] = r[13], e[14] = r[14], e[15] = r[15]), e);
        }, m.rotateX = function(e, t, r) {
            var n = Math.sin(r), o = Math.cos(r), a = t[4], i = t[5], s = t[6], l = t[7], u = t[8], d = t[9], c = t[10], m = t[11];
            return t !== e && (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[12] = t[12], 
            e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[4] = a * o + u * n, e[5] = i * o + d * n, 
            e[6] = s * o + c * n, e[7] = l * o + m * n, e[8] = u * o - a * n, e[9] = d * o - i * n, 
            e[10] = c * o - s * n, e[11] = m * o - l * n, e;
        }, m.rotateY = function(e, t, r) {
            var n = Math.sin(r), o = Math.cos(r), a = t[0], i = t[1], s = t[2], l = t[3], u = t[8], d = t[9], c = t[10], m = t[11];
            return t !== e && (e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[12] = t[12], 
            e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * o - u * n, e[1] = i * o - d * n, 
            e[2] = s * o - c * n, e[3] = l * o - m * n, e[8] = a * n + u * o, e[9] = i * n + d * o, 
            e[10] = s * n + c * o, e[11] = l * n + m * o, e;
        }, m.rotateZ = function(e, t, r) {
            var n = Math.sin(r), o = Math.cos(r), a = t[0], i = t[1], s = t[2], l = t[3], u = t[4], d = t[5], c = t[6], m = t[7];
            return t !== e && (e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], 
            e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * o + u * n, e[1] = i * o + d * n, 
            e[2] = s * o + c * n, e[3] = l * o + m * n, e[4] = u * o - a * n, e[5] = d * o - i * n, 
            e[6] = c * o - s * n, e[7] = m * o - l * n, e;
        }, m.fromRotationTranslation = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = n + n, l = o + o, u = a + a, d = n * s, c = n * l, m = n * u, f = o * l, h = o * u, p = a * u, g = i * s, w = i * l, v = i * u;
            return e[0] = 1 - (f + p), e[1] = c + v, e[2] = m - w, e[3] = 0, e[4] = c - v, e[5] = 1 - (d + p), 
            e[6] = h + g, e[7] = 0, e[8] = m + w, e[9] = h - g, e[10] = 1 - (d + f), e[11] = 0, 
            e[12] = r[0], e[13] = r[1], e[14] = r[2], e[15] = 1, e;
        }, m.fromQuat = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = r + r, s = n + n, l = o + o, u = r * i, d = n * i, c = n * s, m = o * i, f = o * s, h = o * l, p = a * i, g = a * s, w = a * l;
            return e[0] = 1 - c - h, e[1] = d + w, e[2] = m - g, e[3] = 0, e[4] = d - w, e[5] = 1 - u - h, 
            e[6] = f + p, e[7] = 0, e[8] = m + g, e[9] = f - p, e[10] = 1 - u - c, e[11] = 0, 
            e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
        }, m.frustum = function(e, t, r, n, o, a, i) {
            var s = 1 / (r - t), l = 1 / (o - n), u = 1 / (a - i);
            return e[0] = 2 * a * s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 2 * a * l, 
            e[6] = 0, e[7] = 0, e[8] = (r + t) * s, e[9] = (o + n) * l, e[10] = (i + a) * u, 
            e[11] = -1, e[12] = 0, e[13] = 0, e[14] = 2 * i * a * u, e[15] = 0, e;
        }, m.perspective = function(e, t, r, n, o) {
            var a = 1 / Math.tan(t / 2), i = 1 / (n - o);
            return e[0] = a / r, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = a, e[6] = 0, 
            e[7] = 0, e[8] = 0, e[9] = 0, e[10] = (o + n) * i, e[11] = -1, e[12] = 0, e[13] = 0, 
            e[14] = 2 * o * n * i, e[15] = 0, e;
        }, m.ortho = function(e, t, r, n, o, a, i) {
            var s = 1 / (t - r), l = 1 / (n - o), u = 1 / (a - i);
            return e[0] = -2 * s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * l, e[6] = 0, 
            e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * u, e[11] = 0, e[12] = (t + r) * s, e[13] = (o + n) * l, 
            e[14] = (i + a) * u, e[15] = 1, e;
        }, m.lookAt = function(e, r, n, o) {
            var a, i, s, l, u, d, c, f, h, p, g = r[0], w = r[1], v = r[2], x = o[0], M = o[1], b = o[2], A = n[0], y = n[1], T = n[2];
            return Math.abs(g - A) < t && Math.abs(w - y) < t && Math.abs(v - T) < t ? m.identity(e) :(c = g - A, 
            f = w - y, h = v - T, p = 1 / Math.sqrt(c * c + f * f + h * h), c *= p, f *= p, 
            h *= p, a = M * h - b * f, i = b * c - x * h, s = x * f - M * c, p = Math.sqrt(a * a + i * i + s * s), 
            p ? (p = 1 / p, a *= p, i *= p, s *= p) :(a = 0, i = 0, s = 0), l = f * s - h * i, 
            u = h * a - c * s, d = c * i - f * a, p = Math.sqrt(l * l + u * u + d * d), p ? (p = 1 / p, 
            l *= p, u *= p, d *= p) :(l = 0, u = 0, d = 0), e[0] = a, e[1] = l, e[2] = c, e[3] = 0, 
            e[4] = i, e[5] = u, e[6] = f, e[7] = 0, e[8] = s, e[9] = d, e[10] = h, e[11] = 0, 
            e[12] = -(a * g + i * w + s * v), e[13] = -(l * g + u * w + d * v), e[14] = -(c * g + f * w + h * v), 
            e[15] = 1, e);
        }, m.str = function(e) {
            return "mat4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ", " + e[9] + ", " + e[10] + ", " + e[11] + ", " + e[12] + ", " + e[13] + ", " + e[14] + ", " + e[15] + ")";
        }, m.frob = function(e) {
            return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + Math.pow(e[6], 2) + Math.pow(e[6], 2) + Math.pow(e[7], 2) + Math.pow(e[8], 2) + Math.pow(e[9], 2) + Math.pow(e[10], 2) + Math.pow(e[11], 2) + Math.pow(e[12], 2) + Math.pow(e[13], 2) + Math.pow(e[14], 2) + Math.pow(e[15], 2));
        }, "undefined" != typeof e && (e.mat4 = m);
        var f = {};
        f.create = function() {
            var e = new r(4);
            return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e;
        }, f.rotationTo = function() {
            var e = s.create(), t = s.fromValues(1, 0, 0), r = s.fromValues(0, 1, 0);
            return function(n, o, a) {
                var i = s.dot(o, a);
                return -.999999 > i ? (s.cross(e, t, o), s.length(e) < 1e-6 && s.cross(e, r, o), 
                s.normalize(e, e), f.setAxisAngle(n, e, Math.PI), n) :i > .999999 ? (n[0] = 0, n[1] = 0, 
                n[2] = 0, n[3] = 1, n) :(s.cross(e, o, a), n[0] = e[0], n[1] = e[1], n[2] = e[2], 
                n[3] = 1 + i, f.normalize(n, n));
            };
        }(), f.setAxes = function() {
            var e = c.create();
            return function(t, r, n, o) {
                return e[0] = n[0], e[3] = n[1], e[6] = n[2], e[1] = o[0], e[4] = o[1], e[7] = o[2], 
                e[2] = -r[0], e[5] = -r[1], e[8] = -r[2], f.normalize(t, f.fromMat3(t, e));
            };
        }(), f.clone = l.clone, f.fromValues = l.fromValues, f.copy = l.copy, f.set = l.set, 
        f.identity = function(e) {
            return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 1, e;
        }, f.setAxisAngle = function(e, t, r) {
            r = .5 * r;
            var n = Math.sin(r);
            return e[0] = n * t[0], e[1] = n * t[1], e[2] = n * t[2], e[3] = Math.cos(r), e;
        }, f.add = l.add, f.multiply = function(e, t, r) {
            var n = t[0], o = t[1], a = t[2], i = t[3], s = r[0], l = r[1], u = r[2], d = r[3];
            return e[0] = n * d + i * s + o * u - a * l, e[1] = o * d + i * l + a * s - n * u, 
            e[2] = a * d + i * u + n * l - o * s, e[3] = i * d - n * s - o * l - a * u, e;
        }, f.mul = f.multiply, f.scale = l.scale, f.rotateX = function(e, t, r) {
            r *= .5;
            var n = t[0], o = t[1], a = t[2], i = t[3], s = Math.sin(r), l = Math.cos(r);
            return e[0] = n * l + i * s, e[1] = o * l + a * s, e[2] = a * l - o * s, e[3] = i * l - n * s, 
            e;
        }, f.rotateY = function(e, t, r) {
            r *= .5;
            var n = t[0], o = t[1], a = t[2], i = t[3], s = Math.sin(r), l = Math.cos(r);
            return e[0] = n * l - a * s, e[1] = o * l + i * s, e[2] = a * l + n * s, e[3] = i * l - o * s, 
            e;
        }, f.rotateZ = function(e, t, r) {
            r *= .5;
            var n = t[0], o = t[1], a = t[2], i = t[3], s = Math.sin(r), l = Math.cos(r);
            return e[0] = n * l + o * s, e[1] = o * l - n * s, e[2] = a * l + i * s, e[3] = i * l - a * s, 
            e;
        }, f.calculateW = function(e, t) {
            var r = t[0], n = t[1], o = t[2];
            return e[0] = r, e[1] = n, e[2] = o, e[3] = -Math.sqrt(Math.abs(1 - r * r - n * n - o * o)), 
            e;
        }, f.dot = l.dot, f.lerp = l.lerp, f.slerp = function(e, t, r, n) {
            var o, a, i, s, l, u = t[0], d = t[1], c = t[2], m = t[3], f = r[0], h = r[1], p = r[2], g = r[3];
            return a = u * f + d * h + c * p + m * g, 0 > a && (a = -a, f = -f, h = -h, p = -p, 
            g = -g), 1 - a > 1e-6 ? (o = Math.acos(a), i = Math.sin(o), s = Math.sin((1 - n) * o) / i, 
            l = Math.sin(n * o) / i) :(s = 1 - n, l = n), e[0] = s * u + l * f, e[1] = s * d + l * h, 
            e[2] = s * c + l * p, e[3] = s * m + l * g, e;
        }, f.invert = function(e, t) {
            var r = t[0], n = t[1], o = t[2], a = t[3], i = r * r + n * n + o * o + a * a, s = i ? 1 / i :0;
            return e[0] = -r * s, e[1] = -n * s, e[2] = -o * s, e[3] = a * s, e;
        }, f.conjugate = function(e, t) {
            return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e[3] = t[3], e;
        }, f.length = l.length, f.len = f.length, f.squaredLength = l.squaredLength, f.sqrLen = f.squaredLength, 
        f.normalize = l.normalize, f.fromMat3 = function(e, t) {
            var r, n = t[0] + t[4] + t[8];
            if (n > 0) r = Math.sqrt(n + 1), e[3] = .5 * r, r = .5 / r, e[0] = (t[7] - t[5]) * r, 
            e[1] = (t[2] - t[6]) * r, e[2] = (t[3] - t[1]) * r; else {
                var o = 0;
                t[4] > t[0] && (o = 1), t[8] > t[3 * o + o] && (o = 2);
                var a = (o + 1) % 3, i = (o + 2) % 3;
                r = Math.sqrt(t[3 * o + o] - t[3 * a + a] - t[3 * i + i] + 1), e[o] = .5 * r, r = .5 / r, 
                e[3] = (t[3 * i + a] - t[3 * a + i]) * r, e[a] = (t[3 * a + o] + t[3 * o + a]) * r, 
                e[i] = (t[3 * i + o] + t[3 * o + i]) * r;
            }
            return e;
        }, f.str = function(e) {
            return "quat(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
        }, "undefined" != typeof e && (e.quat = f);
    }(t.exports);
}(this), !function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
        var t;
        "undefined" != typeof window ? t = window :"undefined" != typeof global ? t = global :"undefined" != typeof self && (t = self), 
        t.pako = e();
    }
}(function() {
    return function e(t, r, n) {
        function o(i, s) {
            if (!r[i]) {
                if (!t[i]) {
                    var l = "function" == typeof require && require;
                    if (!s && l) return l(i, !0);
                    if (a) return a(i, !0);
                    throw new Error("Cannot find module '" + i + "'");
                }
                var u = r[i] = {
                    exports:{}
                };
                t[i][0].call(u.exports, function(e) {
                    var r = t[i][1][e];
                    return o(r ? r :e);
                }, u, u.exports, e, t, r, n);
            }
            return r[i].exports;
        }
        for (var a = "function" == typeof require && require, i = 0; i < n.length; i++) o(n[i]);
        return o;
    }({
        1:[ function(e, t, r) {
            "use strict";
            function n(e, t) {
                var r = new m(t);
                if (r.push(e, !0), r.err) throw r.msg;
                return r.result;
            }
            function o(e, t) {
                return t = t || {}, t.raw = !0, n(e, t);
            }
            var a = e("./zlib/inflate.js"), i = e("./utils/common"), s = e("./utils/strings"), l = e("./zlib/constants"), u = e("./zlib/messages"), d = e("./zlib/zstream"), c = e("./zlib/gzheader"), m = function(e) {
                this.options = i.assign({
                    chunkSize:16384,
                    windowBits:0,
                    to:""
                }, e || {});
                var t = this.options;
                t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, 
                0 === t.windowBits && (t.windowBits = -15)), !(t.windowBits >= 0 && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), 
                t.windowBits > 15 && t.windowBits < 48 && 0 === (15 & t.windowBits) && (t.windowBits |= 15), 
                this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new d(), 
                this.strm.avail_out = 0;
                var r = a.inflateInit2(this.strm, t.windowBits);
                if (r !== l.Z_OK) throw new Error(u[r]);
                this.header = new c(), a.inflateGetHeader(this.strm, this.header);
            };
            m.prototype.push = function(e, t) {
                var r, n, o, u, d, c = this.strm, m = this.options.chunkSize;
                if (this.ended) return !1;
                n = t === ~~t ? t :t === !0 ? l.Z_FINISH :l.Z_NO_FLUSH, c.input = "string" == typeof e ? s.binstring2buf(e) :e, 
                c.next_in = 0, c.avail_in = c.input.length;
                do {
                    if (0 === c.avail_out && (c.output = new i.Buf8(m), c.next_out = 0, c.avail_out = m), 
                    r = a.inflate(c, l.Z_NO_FLUSH), r !== l.Z_STREAM_END && r !== l.Z_OK) return this.onEnd(r), 
                    this.ended = !0, !1;
                    c.next_out && (0 === c.avail_out || r === l.Z_STREAM_END || 0 === c.avail_in && n === l.Z_FINISH) && ("string" === this.options.to ? (o = s.utf8border(c.output, c.next_out), 
                    u = c.next_out - o, d = s.buf2string(c.output, o), c.next_out = u, c.avail_out = m - u, 
                    u && i.arraySet(c.output, c.output, o, u, 0), this.onData(d)) :this.onData(i.shrinkBuf(c.output, c.next_out)));
                } while (c.avail_in > 0 && r !== l.Z_STREAM_END);
                return r === l.Z_STREAM_END && (n = l.Z_FINISH), n === l.Z_FINISH ? (r = a.inflateEnd(this.strm), 
                this.onEnd(r), this.ended = !0, r === l.Z_OK) :!0;
            }, m.prototype.onData = function(e) {
                this.chunks.push(e);
            }, m.prototype.onEnd = function(e) {
                e === l.Z_OK && (this.result = "string" === this.options.to ? this.chunks.join("") :i.flattenChunks(this.chunks)), 
                this.chunks = [], this.err = e, this.msg = this.strm.msg;
            }, r.Inflate = m, r.inflate = n, r.inflateRaw = o, r.ungzip = n;
        }, {
            "./utils/common":2,
            "./utils/strings":3,
            "./zlib/constants":5,
            "./zlib/gzheader":7,
            "./zlib/inflate.js":9,
            "./zlib/messages":11,
            "./zlib/zstream":12
        } ],
        2:[ function(e, t, r) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            r.assign = function(e) {
                for (var t = Array.prototype.slice.call(arguments, 1); t.length; ) {
                    var r = t.shift();
                    if (r) {
                        if ("object" != typeof r) throw new TypeError(r + "must be non-object");
                        for (var n in r) r.hasOwnProperty(n) && (e[n] = r[n]);
                    }
                }
                return e;
            }, r.shrinkBuf = function(e, t) {
                return e.length === t ? e :e.subarray ? e.subarray(0, t) :(e.length = t, e);
            };
            var o = {
                arraySet:function(e, t, r, n, o) {
                    if (t.subarray && e.subarray) return void e.set(t.subarray(r, r + n), o);
                    for (var a = 0; n > a; a++) e[o + a] = t[r + a];
                },
                flattenChunks:function(e) {
                    var t, r, n, o, a, i;
                    for (n = 0, t = 0, r = e.length; r > t; t++) n += e[t].length;
                    for (i = new Uint8Array(n), o = 0, t = 0, r = e.length; r > t; t++) a = e[t], i.set(a, o), 
                    o += a.length;
                    return i;
                }
            }, a = {
                arraySet:function(e, t, r, n, o) {
                    for (var a = 0; n > a; a++) e[o + a] = t[r + a];
                },
                flattenChunks:function(e) {
                    return [].concat.apply([], e);
                }
            };
            r.setTyped = function(e) {
                e ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, o)) :(r.Buf8 = Array, 
                r.Buf16 = Array, r.Buf32 = Array, r.assign(r, a));
            }, r.setTyped(n);
        }, {} ],
        3:[ function(e, t, r) {
            "use strict";
            function n(e, t) {
                if (65537 > t && (e.subarray && i || !e.subarray && a)) return String.fromCharCode.apply(null, o.shrinkBuf(e, t));
                for (var r = "", n = 0; t > n; n++) r += String.fromCharCode(e[n]);
                return r;
            }
            var o = e("./common"), a = !0, i = !0;
            try {
                String.fromCharCode.apply(null, [ 0 ]);
            } catch (s) {
                a = !1;
            }
            try {
                String.fromCharCode.apply(null, new Uint8Array(1));
            } catch (s) {
                i = !1;
            }
            for (var l = new o.Buf8(256), u = 0; 256 > u; u++) l[u] = u >= 252 ? 6 :u >= 248 ? 5 :u >= 240 ? 4 :u >= 224 ? 3 :u >= 192 ? 2 :1;
            l[254] = l[254] = 1, r.string2buf = function(e) {
                var t, r, n, a, i, s = e.length, l = 0;
                for (a = 0; s > a; a++) r = e.charCodeAt(a), 55296 === (64512 & r) && s > a + 1 && (n = e.charCodeAt(a + 1), 
                56320 === (64512 & n) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++)), l += 128 > r ? 1 :2048 > r ? 2 :65536 > r ? 3 :4;
                for (t = new o.Buf8(l), i = 0, a = 0; l > i; a++) r = e.charCodeAt(a), 55296 === (64512 & r) && s > a + 1 && (n = e.charCodeAt(a + 1), 
                56320 === (64512 & n) && (r = 65536 + (r - 55296 << 10) + (n - 56320), a++)), 128 > r ? t[i++] = r :2048 > r ? (t[i++] = 192 | r >>> 6, 
                t[i++] = 128 | 63 & r) :65536 > r ? (t[i++] = 224 | r >>> 12, t[i++] = 128 | 63 & r >>> 6, 
                t[i++] = 128 | 63 & r) :(t[i++] = 240 | r >>> 18, t[i++] = 128 | 63 & r >>> 12, 
                t[i++] = 128 | 63 & r >>> 6, t[i++] = 128 | 63 & r);
                return t;
            }, r.buf2binstring = function(e) {
                return n(e, e.length);
            }, r.binstring2buf = function(e) {
                for (var t = new o.Buf8(e.length), r = 0, n = t.length; n > r; r++) t[r] = e.charCodeAt(r);
                return t;
            }, r.buf2string = function(e, t) {
                var r, o, a, i, s = t || e.length, u = new Array(2 * s);
                for (o = 0, r = 0; s > r; ) if (a = e[r++], 128 > a) u[o++] = a; else if (i = l[a], 
                i > 4) u[o++] = 65533, r += i - 1; else {
                    for (a &= 2 === i ? 31 :3 === i ? 15 :7; i > 1 && s > r; ) a = a << 6 | 63 & e[r++], 
                    i--;
                    i > 1 ? u[o++] = 65533 :65536 > a ? u[o++] = a :(a -= 65536, u[o++] = 55296 | 1023 & a >> 10, 
                    u[o++] = 56320 | 1023 & a);
                }
                return n(u, o);
            }, r.utf8border = function(e, t) {
                var r;
                for (t = t || e.length, t > e.length && (t = e.length), r = t - 1; r >= 0 && 128 === (192 & e[r]); ) r--;
                return 0 > r ? t :0 === r ? t :r + l[e[r]] > t ? r :t;
            };
        }, {
            "./common":2
        } ],
        4:[ function(e, t) {
            "use strict";
            function r(e, t, r, n) {
                for (var o = 0 | 65535 & e, a = 0 | 65535 & e >>> 16, i = 0; 0 !== r; ) {
                    i = r > 2e3 ? 2e3 :r, r -= i;
                    do o = 0 | o + t[n++], a = 0 | a + o; while (--i);
                    o %= 65521, a %= 65521;
                }
                return 0 | (o | a << 16);
            }
            t.exports = r;
        }, {} ],
        5:[ function(e, t) {
            t.exports = {
                Z_NO_FLUSH:0,
                Z_PARTIAL_FLUSH:1,
                Z_SYNC_FLUSH:2,
                Z_FULL_FLUSH:3,
                Z_FINISH:4,
                Z_BLOCK:5,
                Z_TREES:6,
                Z_OK:0,
                Z_STREAM_END:1,
                Z_NEED_DICT:2,
                Z_ERRNO:-1,
                Z_STREAM_ERROR:-2,
                Z_DATA_ERROR:-3,
                Z_BUF_ERROR:-5,
                Z_NO_COMPRESSION:0,
                Z_BEST_SPEED:1,
                Z_BEST_COMPRESSION:9,
                Z_DEFAULT_COMPRESSION:-1,
                Z_FILTERED:1,
                Z_HUFFMAN_ONLY:2,
                Z_RLE:3,
                Z_FIXED:4,
                Z_DEFAULT_STRATEGY:0,
                Z_BINARY:0,
                Z_TEXT:1,
                Z_UNKNOWN:2,
                Z_DEFLATED:8
            };
        }, {} ],
        6:[ function(e, t) {
            "use strict";
            function r() {
                for (var e, t = [], r = 0; 256 > r; r++) {
                    e = r;
                    for (var n = 0; 8 > n; n++) e = 1 & e ? 3988292384 ^ e >>> 1 :e >>> 1;
                    t[r] = e;
                }
                return t;
            }
            function n(e, t, r, n) {
                var a = o, i = n + r;
                e = -1 ^ e;
                for (var s = n; i > s; s++) e = e >>> 8 ^ a[255 & (e ^ t[s])];
                return -1 ^ e;
            }
            var o = r();
            t.exports = n;
        }, {} ],
        7:[ function(e, t) {
            "use strict";
            function r() {
                this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, 
                this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
            }
            t.exports = r;
        }, {} ],
        8:[ function(e, t) {
            "use strict";
            var r = 30, n = 12;
            t.exports = function(e, t) {
                var o, a, i, s, l, u, d, c, m, f, h, p, g, w, v, x, M, b, A, y, T, V, I, U, E;
                o = e.state, a = e.next_in, U = e.input, i = a + (e.avail_in - 5), s = e.next_out, 
                E = e.output, l = s - (t - e.avail_out), u = s + (e.avail_out - 257), d = o.dmax, 
                c = o.wsize, m = o.whave, f = o.wnext, h = o.window, p = o.hold, g = o.bits, w = o.lencode, 
                v = o.distcode, x = (1 << o.lenbits) - 1, M = (1 << o.distbits) - 1;
                e:do {
                    15 > g && (p += U[a++] << g, g += 8, p += U[a++] << g, g += 8), b = w[p & x];
                    t:for (;;) {
                        if (A = b >>> 24, p >>>= A, g -= A, A = 255 & b >>> 16, 0 === A) E[s++] = 65535 & b; else {
                            if (!(16 & A)) {
                                if (0 === (64 & A)) {
                                    b = w[(65535 & b) + (p & (1 << A) - 1)];
                                    continue t;
                                }
                                if (32 & A) {
                                    o.mode = n;
                                    break e;
                                }
                                e.msg = "invalid literal/length code", o.mode = r;
                                break e;
                            }
                            y = 65535 & b, A &= 15, A && (A > g && (p += U[a++] << g, g += 8), y += p & (1 << A) - 1, 
                            p >>>= A, g -= A), 15 > g && (p += U[a++] << g, g += 8, p += U[a++] << g, g += 8), 
                            b = v[p & M];
                            r:for (;;) {
                                if (A = b >>> 24, p >>>= A, g -= A, A = 255 & b >>> 16, !(16 & A)) {
                                    if (0 === (64 & A)) {
                                        b = v[(65535 & b) + (p & (1 << A) - 1)];
                                        continue r;
                                    }
                                    e.msg = "invalid distance code", o.mode = r;
                                    break e;
                                }
                                if (T = 65535 & b, A &= 15, A > g && (p += U[a++] << g, g += 8, A > g && (p += U[a++] << g, 
                                g += 8)), T += p & (1 << A) - 1, T > d) {
                                    e.msg = "invalid distance too far back", o.mode = r;
                                    break e;
                                }
                                if (p >>>= A, g -= A, A = s - l, T > A) {
                                    if (A = T - A, A > m && o.sane) {
                                        e.msg = "invalid distance too far back", o.mode = r;
                                        break e;
                                    }
                                    if (V = 0, I = h, 0 === f) {
                                        if (V += c - A, y > A) {
                                            y -= A;
                                            do E[s++] = h[V++]; while (--A);
                                            V = s - T, I = E;
                                        }
                                    } else if (A > f) {
                                        if (V += c + f - A, A -= f, y > A) {
                                            y -= A;
                                            do E[s++] = h[V++]; while (--A);
                                            if (V = 0, y > f) {
                                                A = f, y -= A;
                                                do E[s++] = h[V++]; while (--A);
                                                V = s - T, I = E;
                                            }
                                        }
                                    } else if (V += f - A, y > A) {
                                        y -= A;
                                        do E[s++] = h[V++]; while (--A);
                                        V = s - T, I = E;
                                    }
                                    for (;y > 2; ) E[s++] = I[V++], E[s++] = I[V++], E[s++] = I[V++], y -= 3;
                                    y && (E[s++] = I[V++], y > 1 && (E[s++] = I[V++]));
                                } else {
                                    V = s - T;
                                    do E[s++] = E[V++], E[s++] = E[V++], E[s++] = E[V++], y -= 3; while (y > 2);
                                    y && (E[s++] = E[V++], y > 1 && (E[s++] = E[V++]));
                                }
                                break;
                            }
                        }
                        break;
                    }
                } while (i > a && u > s);
                y = g >> 3, a -= y, g -= y << 3, p &= (1 << g) - 1, e.next_in = a, e.next_out = s, 
                e.avail_in = i > a ? 5 + (i - a) :5 - (a - i), e.avail_out = u > s ? 257 + (u - s) :257 - (s - u), 
                o.hold = p, o.bits = g;
            };
        }, {} ],
        9:[ function(e, t, r) {
            "use strict";
            function n(e) {
                return (255 & e >>> 24) + (65280 & e >>> 8) + ((65280 & e) << 8) + ((255 & e) << 24);
            }
            function o() {
                this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, 
                this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, 
                this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, 
                this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, 
                this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, 
                this.ndist = 0, this.have = 0, this.next = null, this.lens = new w.Buf16(320), this.work = new w.Buf16(288), 
                this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
            }
            function a(e) {
                var t;
                return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", 
                t.wrap && (e.adler = 1 & t.wrap), t.mode = D, t.last = 0, t.havedict = 0, t.dmax = 32768, 
                t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new w.Buf32(ht), t.distcode = t.distdyn = new w.Buf32(pt), 
                t.sane = 1, t.back = -1, E) :F;
            }
            function i(e) {
                var t;
                return e && e.state ? (t = e.state, t.wsize = 0, t.whave = 0, t.wnext = 0, a(e)) :F;
            }
            function s(e, t) {
                var r, n;
                return e && e.state ? (n = e.state, 0 > t ? (r = 0, t = -t) :(r = (t >> 4) + 1, 
                48 > t && (t &= 15)), t && (8 > t || t > 15) ? F :(null !== n.window && n.wbits !== t && (n.window = null), 
                n.wrap = r, n.wbits = t, i(e))) :F;
            }
            function l(e, t) {
                var r, n;
                return e ? (n = new o(), e.state = n, n.window = null, r = s(e, t), r !== E && (e.state = null), 
                r) :F;
            }
            function u(e) {
                return l(e, wt);
            }
            function d(e) {
                if (vt) {
                    var t;
                    for (p = new w.Buf32(512), g = new w.Buf32(32), t = 0; 144 > t; ) e.lens[t++] = 8;
                    for (;256 > t; ) e.lens[t++] = 9;
                    for (;280 > t; ) e.lens[t++] = 7;
                    for (;288 > t; ) e.lens[t++] = 8;
                    for (b(y, e.lens, 0, 288, p, 0, e.work, {
                        bits:9
                    }), t = 0; 32 > t; ) e.lens[t++] = 5;
                    b(T, e.lens, 0, 32, g, 0, e.work, {
                        bits:5
                    }), vt = !1;
                }
                e.lencode = p, e.lenbits = 9, e.distcode = g, e.distbits = 5;
            }
            function c(e, t, r, n) {
                var o, a = e.state;
                return null === a.window && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new w.Buf8(a.wsize)), 
                n >= a.wsize ? (w.arraySet(a.window, t, r - a.wsize, a.wsize, 0), a.wnext = 0, a.whave = a.wsize) :(o = a.wsize - a.wnext, 
                o > n && (o = n), w.arraySet(a.window, t, r - n, o, a.wnext), n -= o, n ? (w.arraySet(a.window, t, r - n, n, 0), 
                a.wnext = n, a.whave = a.wsize) :(a.wnext += o, a.wnext === a.wsize && (a.wnext = 0), 
                a.whave < a.wsize && (a.whave += o))), 0;
            }
            function m(e, t) {
                var r, o, a, i, s, l, u, m, f, h, p, g, ht, pt, gt, wt, vt, xt, Mt, bt, At, yt, Tt, Vt, It = 0, Ut = new w.Buf8(4), Et = [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];
                if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return F;
                r = e.state, r.mode === Z && (r.mode = j), s = e.next_out, a = e.output, u = e.avail_out, 
                i = e.next_in, o = e.input, l = e.avail_in, m = r.hold, f = r.bits, h = l, p = u, 
                yt = E;
                e:for (;;) switch (r.mode) {
                  case D:
                    if (0 === r.wrap) {
                        r.mode = j;
                        break;
                    }
                    for (;16 > f; ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    if (2 & r.wrap && 35615 === m) {
                        r.check = 0, Ut[0] = 255 & m, Ut[1] = 255 & m >>> 8, r.check = x(r.check, Ut, 2, 0), 
                        m = 0, f = 0, r.mode = W;
                        break;
                    }
                    if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & m) << 8) + (m >> 8)) % 31) {
                        e.msg = "incorrect header check", r.mode = ct;
                        break;
                    }
                    if ((15 & m) !== _) {
                        e.msg = "unknown compression method", r.mode = ct;
                        break;
                    }
                    if (m >>>= 4, f -= 4, At = (15 & m) + 8, 0 === r.wbits) r.wbits = At; else if (At > r.wbits) {
                        e.msg = "invalid window size", r.mode = ct;
                        break;
                    }
                    r.dmax = 1 << At, e.adler = r.check = 1, r.mode = 512 & m ? q :Z, m = 0, f = 0;
                    break;

                  case W:
                    for (;16 > f; ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    if (r.flags = m, (255 & r.flags) !== _) {
                        e.msg = "unknown compression method", r.mode = ct;
                        break;
                    }
                    if (57344 & r.flags) {
                        e.msg = "unknown header flags set", r.mode = ct;
                        break;
                    }
                    r.head && (r.head.text = 1 & m >> 8), 512 & r.flags && (Ut[0] = 255 & m, Ut[1] = 255 & m >>> 8, 
                    r.check = x(r.check, Ut, 2, 0)), m = 0, f = 0, r.mode = B;

                  case B:
                    for (;32 > f; ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    r.head && (r.head.time = m), 512 & r.flags && (Ut[0] = 255 & m, Ut[1] = 255 & m >>> 8, 
                    Ut[2] = 255 & m >>> 16, Ut[3] = 255 & m >>> 24, r.check = x(r.check, Ut, 4, 0)), 
                    m = 0, f = 0, r.mode = P;

                  case P:
                    for (;16 > f; ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    r.head && (r.head.xflags = 255 & m, r.head.os = m >> 8), 512 & r.flags && (Ut[0] = 255 & m, 
                    Ut[1] = 255 & m >>> 8, r.check = x(r.check, Ut, 2, 0)), m = 0, f = 0, r.mode = N;

                  case N:
                    if (1024 & r.flags) {
                        for (;16 > f; ) {
                            if (0 === l) break e;
                            l--, m += o[i++] << f, f += 8;
                        }
                        r.length = m, r.head && (r.head.extra_len = m), 512 & r.flags && (Ut[0] = 255 & m, 
                        Ut[1] = 255 & m >>> 8, r.check = x(r.check, Ut, 2, 0)), m = 0, f = 0;
                    } else r.head && (r.head.extra = null);
                    r.mode = H;

                  case H:
                    if (1024 & r.flags && (g = r.length, g > l && (g = l), g && (r.head && (At = r.head.extra_len - r.length, 
                    r.head.extra || (r.head.extra = new Array(r.head.extra_len)), w.arraySet(r.head.extra, o, i, g, At)), 
                    512 & r.flags && (r.check = x(r.check, o, g, i)), l -= g, i += g, r.length -= g), 
                    r.length)) break e;
                    r.length = 0, r.mode = O;

                  case O:
                    if (2048 & r.flags) {
                        if (0 === l) break e;
                        g = 0;
                        do At = o[i + g++], r.head && At && r.length < 65536 && (r.head.name += String.fromCharCode(At)); while (At && l > g);
                        if (512 & r.flags && (r.check = x(r.check, o, g, i)), l -= g, i += g, At) break e;
                    } else r.head && (r.head.name = null);
                    r.length = 0, r.mode = z;

                  case z:
                    if (4096 & r.flags) {
                        if (0 === l) break e;
                        g = 0;
                        do At = o[i + g++], r.head && At && r.length < 65536 && (r.head.comment += String.fromCharCode(At)); while (At && l > g);
                        if (512 & r.flags && (r.check = x(r.check, o, g, i)), l -= g, i += g, At) break e;
                    } else r.head && (r.head.comment = null);
                    r.mode = G;

                  case G:
                    if (512 & r.flags) {
                        for (;16 > f; ) {
                            if (0 === l) break e;
                            l--, m += o[i++] << f, f += 8;
                        }
                        if (m !== (65535 & r.check)) {
                            e.msg = "header crc mismatch", r.mode = ct;
                            break;
                        }
                        m = 0, f = 0;
                    }
                    r.head && (r.head.hcrc = 1 & r.flags >> 9, r.head.done = !0), e.adler = r.check = 0, 
                    r.mode = Z;
                    break;

                  case q:
                    for (;32 > f; ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    e.adler = r.check = n(m), m = 0, f = 0, r.mode = Y;

                  case Y:
                    if (0 === r.havedict) return e.next_out = s, e.avail_out = u, e.next_in = i, e.avail_in = l, 
                    r.hold = m, r.bits = f, R;
                    e.adler = r.check = 1, r.mode = Z;

                  case Z:
                    if (t === I || t === U) break e;

                  case j:
                    if (r.last) {
                        m >>>= 7 & f, f -= 7 & f, r.mode = lt;
                        break;
                    }
                    for (;3 > f; ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    switch (r.last = 1 & m, m >>>= 1, f -= 1, 3 & m) {
                      case 0:
                        r.mode = X;
                        break;

                      case 1:
                        if (d(r), r.mode = tt, t === U) {
                            m >>>= 2, f -= 2;
                            break e;
                        }
                        break;

                      case 2:
                        r.mode = $;
                        break;

                      case 3:
                        e.msg = "invalid block type", r.mode = ct;
                    }
                    m >>>= 2, f -= 2;
                    break;

                  case X:
                    for (m >>>= 7 & f, f -= 7 & f; 32 > f; ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    if ((65535 & m) !== (65535 ^ m >>> 16)) {
                        e.msg = "invalid stored block lengths", r.mode = ct;
                        break;
                    }
                    if (r.length = 65535 & m, m = 0, f = 0, r.mode = Q, t === U) break e;

                  case Q:
                    r.mode = K;

                  case K:
                    if (g = r.length) {
                        if (g > l && (g = l), g > u && (g = u), 0 === g) break e;
                        w.arraySet(a, o, i, g, s), l -= g, i += g, u -= g, s += g, r.length -= g;
                        break;
                    }
                    r.mode = Z;
                    break;

                  case $:
                    for (;14 > f; ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    if (r.nlen = (31 & m) + 257, m >>>= 5, f -= 5, r.ndist = (31 & m) + 1, m >>>= 5, 
                    f -= 5, r.ncode = (15 & m) + 4, m >>>= 4, f -= 4, r.nlen > 286 || r.ndist > 30) {
                        e.msg = "too many length or distance symbols", r.mode = ct;
                        break;
                    }
                    r.have = 0, r.mode = J;

                  case J:
                    for (;r.have < r.ncode; ) {
                        for (;3 > f; ) {
                            if (0 === l) break e;
                            l--, m += o[i++] << f, f += 8;
                        }
                        r.lens[Et[r.have++]] = 7 & m, m >>>= 3, f -= 3;
                    }
                    for (;r.have < 19; ) r.lens[Et[r.have++]] = 0;
                    if (r.lencode = r.lendyn, r.lenbits = 7, Tt = {
                        bits:r.lenbits
                    }, yt = b(A, r.lens, 0, 19, r.lencode, 0, r.work, Tt), r.lenbits = Tt.bits, yt) {
                        e.msg = "invalid code lengths set", r.mode = ct;
                        break;
                    }
                    r.have = 0, r.mode = et;

                  case et:
                    for (;r.have < r.nlen + r.ndist; ) {
                        for (;It = r.lencode[m & (1 << r.lenbits) - 1], gt = It >>> 24, wt = 255 & It >>> 16, 
                        vt = 65535 & It, !(f >= gt); ) {
                            if (0 === l) break e;
                            l--, m += o[i++] << f, f += 8;
                        }
                        if (16 > vt) m >>>= gt, f -= gt, r.lens[r.have++] = vt; else {
                            if (16 === vt) {
                                for (Vt = gt + 2; Vt > f; ) {
                                    if (0 === l) break e;
                                    l--, m += o[i++] << f, f += 8;
                                }
                                if (m >>>= gt, f -= gt, 0 === r.have) {
                                    e.msg = "invalid bit length repeat", r.mode = ct;
                                    break;
                                }
                                At = r.lens[r.have - 1], g = 3 + (3 & m), m >>>= 2, f -= 2;
                            } else if (17 === vt) {
                                for (Vt = gt + 3; Vt > f; ) {
                                    if (0 === l) break e;
                                    l--, m += o[i++] << f, f += 8;
                                }
                                m >>>= gt, f -= gt, At = 0, g = 3 + (7 & m), m >>>= 3, f -= 3;
                            } else {
                                for (Vt = gt + 7; Vt > f; ) {
                                    if (0 === l) break e;
                                    l--, m += o[i++] << f, f += 8;
                                }
                                m >>>= gt, f -= gt, At = 0, g = 11 + (127 & m), m >>>= 7, f -= 7;
                            }
                            if (r.have + g > r.nlen + r.ndist) {
                                e.msg = "invalid bit length repeat", r.mode = ct;
                                break;
                            }
                            for (;g--; ) r.lens[r.have++] = At;
                        }
                    }
                    if (r.mode === ct) break;
                    if (0 === r.lens[256]) {
                        e.msg = "invalid code -- missing end-of-block", r.mode = ct;
                        break;
                    }
                    if (r.lenbits = 9, Tt = {
                        bits:r.lenbits
                    }, yt = b(y, r.lens, 0, r.nlen, r.lencode, 0, r.work, Tt), r.lenbits = Tt.bits, 
                    yt) {
                        e.msg = "invalid literal/lengths set", r.mode = ct;
                        break;
                    }
                    if (r.distbits = 6, r.distcode = r.distdyn, Tt = {
                        bits:r.distbits
                    }, yt = b(T, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, Tt), r.distbits = Tt.bits, 
                    yt) {
                        e.msg = "invalid distances set", r.mode = ct;
                        break;
                    }
                    if (r.mode = tt, t === U) break e;

                  case tt:
                    r.mode = rt;

                  case rt:
                    if (l >= 6 && u >= 258) {
                        e.next_out = s, e.avail_out = u, e.next_in = i, e.avail_in = l, r.hold = m, r.bits = f, 
                        M(e, p), s = e.next_out, a = e.output, u = e.avail_out, i = e.next_in, o = e.input, 
                        l = e.avail_in, m = r.hold, f = r.bits, r.mode === Z && (r.back = -1);
                        break;
                    }
                    for (r.back = 0; It = r.lencode[m & (1 << r.lenbits) - 1], gt = It >>> 24, wt = 255 & It >>> 16, 
                    vt = 65535 & It, !(f >= gt); ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    if (wt && 0 === (240 & wt)) {
                        for (xt = gt, Mt = wt, bt = vt; It = r.lencode[bt + ((m & (1 << xt + Mt) - 1) >> xt)], 
                        gt = It >>> 24, wt = 255 & It >>> 16, vt = 65535 & It, !(f >= xt + gt); ) {
                            if (0 === l) break e;
                            l--, m += o[i++] << f, f += 8;
                        }
                        m >>>= xt, f -= xt, r.back += xt;
                    }
                    if (m >>>= gt, f -= gt, r.back += gt, r.length = vt, 0 === wt) {
                        r.mode = st;
                        break;
                    }
                    if (32 & wt) {
                        r.back = -1, r.mode = Z;
                        break;
                    }
                    if (64 & wt) {
                        e.msg = "invalid literal/length code", r.mode = ct;
                        break;
                    }
                    r.extra = 15 & wt, r.mode = nt;

                  case nt:
                    if (r.extra) {
                        for (Vt = r.extra; Vt > f; ) {
                            if (0 === l) break e;
                            l--, m += o[i++] << f, f += 8;
                        }
                        r.length += m & (1 << r.extra) - 1, m >>>= r.extra, f -= r.extra, r.back += r.extra;
                    }
                    r.was = r.length, r.mode = ot;

                  case ot:
                    for (;It = r.distcode[m & (1 << r.distbits) - 1], gt = It >>> 24, wt = 255 & It >>> 16, 
                    vt = 65535 & It, !(f >= gt); ) {
                        if (0 === l) break e;
                        l--, m += o[i++] << f, f += 8;
                    }
                    if (0 === (240 & wt)) {
                        for (xt = gt, Mt = wt, bt = vt; It = r.distcode[bt + ((m & (1 << xt + Mt) - 1) >> xt)], 
                        gt = It >>> 24, wt = 255 & It >>> 16, vt = 65535 & It, !(f >= xt + gt); ) {
                            if (0 === l) break e;
                            l--, m += o[i++] << f, f += 8;
                        }
                        m >>>= xt, f -= xt, r.back += xt;
                    }
                    if (m >>>= gt, f -= gt, r.back += gt, 64 & wt) {
                        e.msg = "invalid distance code", r.mode = ct;
                        break;
                    }
                    r.offset = vt, r.extra = 15 & wt, r.mode = at;

                  case at:
                    if (r.extra) {
                        for (Vt = r.extra; Vt > f; ) {
                            if (0 === l) break e;
                            l--, m += o[i++] << f, f += 8;
                        }
                        r.offset += m & (1 << r.extra) - 1, m >>>= r.extra, f -= r.extra, r.back += r.extra;
                    }
                    if (r.offset > r.dmax) {
                        e.msg = "invalid distance too far back", r.mode = ct;
                        break;
                    }
                    r.mode = it;

                  case it:
                    if (0 === u) break e;
                    if (g = p - u, r.offset > g) {
                        if (g = r.offset - g, g > r.whave && r.sane) {
                            e.msg = "invalid distance too far back", r.mode = ct;
                            break;
                        }
                        g > r.wnext ? (g -= r.wnext, ht = r.wsize - g) :ht = r.wnext - g, g > r.length && (g = r.length), 
                        pt = r.window;
                    } else pt = a, ht = s - r.offset, g = r.length;
                    g > u && (g = u), u -= g, r.length -= g;
                    do a[s++] = pt[ht++]; while (--g);
                    0 === r.length && (r.mode = rt);
                    break;

                  case st:
                    if (0 === u) break e;
                    a[s++] = r.length, u--, r.mode = rt;
                    break;

                  case lt:
                    if (r.wrap) {
                        for (;32 > f; ) {
                            if (0 === l) break e;
                            l--, m |= o[i++] << f, f += 8;
                        }
                        if (p -= u, e.total_out += p, r.total += p, p && (e.adler = r.check = r.flags ? x(r.check, a, p, s - p) :v(r.check, a, p, s - p)), 
                        p = u, (r.flags ? m :n(m)) !== r.check) {
                            e.msg = "incorrect data check", r.mode = ct;
                            break;
                        }
                        m = 0, f = 0;
                    }
                    r.mode = ut;

                  case ut:
                    if (r.wrap && r.flags) {
                        for (;32 > f; ) {
                            if (0 === l) break e;
                            l--, m += o[i++] << f, f += 8;
                        }
                        if (m !== (4294967295 & r.total)) {
                            e.msg = "incorrect length check", r.mode = ct;
                            break;
                        }
                        m = 0, f = 0;
                    }
                    r.mode = dt;

                  case dt:
                    yt = S;
                    break e;

                  case ct:
                    yt = L;
                    break e;

                  case mt:
                    return k;

                  case ft:
                  default:
                    return F;
                }
                return e.next_out = s, e.avail_out = u, e.next_in = i, e.avail_in = l, r.hold = m, 
                r.bits = f, (r.wsize || p !== e.avail_out && r.mode < ct && (r.mode < lt || t !== V)) && c(e, e.output, e.next_out, p - e.avail_out) ? (r.mode = mt, 
                k) :(h -= e.avail_in, p -= e.avail_out, e.total_in += h, e.total_out += p, r.total += p, 
                r.wrap && p && (e.adler = r.check = r.flags ? x(r.check, a, p, e.next_out - p) :v(r.check, a, p, e.next_out - p)), 
                e.data_type = r.bits + (r.last ? 64 :0) + (r.mode === Z ? 128 :0) + (r.mode === tt || r.mode === Q ? 256 :0), 
                (0 === h && 0 === p || t === V) && yt === E && (yt = C), yt);
            }
            function f(e) {
                if (!e || !e.state) return F;
                var t = e.state;
                return t.window && (t.window = null), e.state = null, E;
            }
            function h(e, t) {
                var r;
                return e && e.state ? (r = e.state, 0 === (2 & r.wrap) ? F :(r.head = t, t.done = !1, 
                E)) :F;
            }
            var p, g, w = e("../utils/common"), v = e("./adler32"), x = e("./crc32"), M = e("./inffast"), b = e("./inftrees"), A = 0, y = 1, T = 2, V = 4, I = 5, U = 6, E = 0, S = 1, R = 2, F = -2, L = -3, k = -4, C = -5, _ = 8, D = 1, W = 2, B = 3, P = 4, N = 5, H = 6, O = 7, z = 8, G = 9, q = 10, Y = 11, Z = 12, j = 13, X = 14, Q = 15, K = 16, $ = 17, J = 18, et = 19, tt = 20, rt = 21, nt = 22, ot = 23, at = 24, it = 25, st = 26, lt = 27, ut = 28, dt = 29, ct = 30, mt = 31, ft = 32, ht = 852, pt = 592, gt = 15, wt = gt, vt = !0;
            r.inflateReset = i, r.inflateReset2 = s, r.inflateResetKeep = a, r.inflateInit = u, 
            r.inflateInit2 = l, r.inflate = m, r.inflateEnd = f, r.inflateGetHeader = h, r.inflateInfo = "pako inflate (from Nodeca project)";
        }, {
            "../utils/common":2,
            "./adler32":4,
            "./crc32":6,
            "./inffast":8,
            "./inftrees":10
        } ],
        10:[ function(e, t) {
            "use strict";
            var r = e("../utils/common"), n = 15, o = 852, a = 592, i = 0, s = 1, l = 2, u = [ 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0 ], d = [ 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78 ], c = [ 1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0 ], m = [ 16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64 ];
            t.exports = function(e, t, f, h, p, g, w, v) {
                var x, M, b, A, y, T, V, I, U, E = v.bits, S = 0, R = 0, F = 0, L = 0, k = 0, C = 0, _ = 0, D = 0, W = 0, B = 0, P = null, N = 0, H = new r.Buf16(n + 1), O = new r.Buf16(n + 1), z = null, G = 0;
                for (S = 0; n >= S; S++) H[S] = 0;
                for (R = 0; h > R; R++) H[t[f + R]]++;
                for (k = E, L = n; L >= 1 && 0 === H[L]; L--) ;
                if (k > L && (k = L), 0 === L) return p[g++] = 20971520, p[g++] = 20971520, v.bits = 1, 
                0;
                for (F = 1; L > F && 0 === H[F]; F++) ;
                for (F > k && (k = F), D = 1, S = 1; n >= S; S++) if (D <<= 1, D -= H[S], 0 > D) return -1;
                if (D > 0 && (e === i || 1 !== L)) return -1;
                for (O[1] = 0, S = 1; n > S; S++) O[S + 1] = O[S] + H[S];
                for (R = 0; h > R; R++) 0 !== t[f + R] && (w[O[t[f + R]]++] = R);
                if (e === i ? (P = z = w, T = 19) :e === s ? (P = u, N -= 257, z = d, G -= 257, 
                T = 256) :(P = c, z = m, T = -1), B = 0, R = 0, S = F, y = g, C = k, _ = 0, b = -1, 
                W = 1 << k, A = W - 1, e === s && W > o || e === l && W > a) return 1;
                for (var q = 0; ;) {
                    q++, V = S - _, w[R] < T ? (I = 0, U = w[R]) :w[R] > T ? (I = z[G + w[R]], U = P[N + w[R]]) :(I = 96, 
                    U = 0), x = 1 << S - _, M = 1 << C, F = M;
                    do M -= x, p[y + (B >> _) + M] = 0 | (V << 24 | I << 16 | U); while (0 !== M);
                    for (x = 1 << S - 1; B & x; ) x >>= 1;
                    if (0 !== x ? (B &= x - 1, B += x) :B = 0, R++, 0 === --H[S]) {
                        if (S === L) break;
                        S = t[f + w[R]];
                    }
                    if (S > k && (B & A) !== b) {
                        for (0 === _ && (_ = k), y += F, C = S - _, D = 1 << C; L > C + _ && (D -= H[C + _], 
                        !(0 >= D)); ) C++, D <<= 1;
                        if (W += 1 << C, e === s && W > o || e === l && W > a) return 1;
                        b = B & A, p[b] = 0 | (k << 24 | C << 16 | y - g);
                    }
                }
                return 0 !== B && (p[y + B] = 0 | (S - _ << 24 | 64 << 16)), v.bits = k, 0;
            };
        }, {
            "../utils/common":2
        } ],
        11:[ function(e, t) {
            "use strict";
            t.exports = {
                2:"need dictionary",
                1:"stream end",
                0:"",
                "-1":"file error",
                "-2":"stream error",
                "-3":"data error",
                "-4":"insufficient memory",
                "-5":"buffer error",
                "-6":"incompatible version"
            };
        }, {} ],
        12:[ function(e, t) {
            "use strict";
            function r() {
                this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, 
                this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, 
                this.data_type = 2, this.adler = 0;
            }
            t.exports = r;
        }, {} ]
    }, {}, [ 1 ])(1);
});

var swfobject = void 0;

mat4.translation = function(e, t) {
    return mat4.identity(e), e[12] = t[0], e[13] = t[1], e[14] = t[2], e;
}, mat4.rotationQuat = function(e, t) {
    mat4.identity(e);
    var r = t[0] * t[0], n = t[1] * t[1], o = t[2] * t[2], a = t[0] * t[1], i = t[2] * t[3], s = t[2] * t[0], l = t[1] * t[3], u = t[1] * t[2], d = t[0] * t[3];
    return e[0] = 1 - 2 * (n + o), e[1] = 2 * (a + i), e[2] = 2 * (s - l), e[4] = 2 * (a - i), 
    e[5] = 1 - 2 * (o + r), e[6] = 2 * (u + d), e[8] = 2 * (s + l), e[9] = 2 * (u - d), 
    e[10] = 1 - 2 * (n + r), e;
}, mat4.mulSlimDX = function(e, t, r) {
    var n = {
        M11:t[0],
        M12:t[1],
        M13:t[2],
        M14:t[3],
        M21:t[4],
        M22:t[5],
        M23:t[6],
        M24:t[7],
        M31:t[8],
        M32:t[9],
        M33:t[10],
        M34:t[11],
        M41:t[12],
        M42:t[13],
        M43:t[14],
        M44:t[15]
    }, o = {
        M11:r[0],
        M12:r[1],
        M13:r[2],
        M14:r[3],
        M21:r[4],
        M22:r[5],
        M23:r[6],
        M24:r[7],
        M31:r[8],
        M32:r[9],
        M33:r[10],
        M34:r[11],
        M41:r[12],
        M42:r[13],
        M43:r[14],
        M44:r[15]
    };
    return e[0] = n.M11 * o.M11 + n.M12 * o.M21 + n.M13 * o.M31 + n.M14 * o.M41, e[1] = n.M11 * o.M12 + n.M12 * o.M22 + n.M13 * o.M32 + n.M14 * o.M42, 
    e[2] = n.M11 * o.M13 + n.M12 * o.M23 + n.M13 * o.M33 + n.M14 * o.M43, e[3] = n.M11 * o.M14 + n.M12 * o.M24 + n.M13 * o.M34 + n.M14 * o.M44, 
    e[4] = n.M21 * o.M11 + n.M22 * o.M21 + n.M23 * o.M31 + n.M24 * o.M41, e[5] = n.M21 * o.M12 + n.M22 * o.M22 + n.M23 * o.M32 + n.M24 * o.M42, 
    e[6] = n.M21 * o.M13 + n.M22 * o.M23 + n.M23 * o.M33 + n.M24 * o.M43, e[7] = n.M21 * o.M14 + n.M22 * o.M24 + n.M23 * o.M34 + n.M24 * o.M44, 
    e[8] = n.M31 * o.M11 + n.M32 * o.M21 + n.M33 * o.M31 + n.M34 * o.M41, e[9] = n.M31 * o.M12 + n.M32 * o.M22 + n.M33 * o.M32 + n.M34 * o.M42, 
    e[10] = n.M31 * o.M13 + n.M32 * o.M23 + n.M33 * o.M33 + n.M34 * o.M43, e[11] = n.M31 * o.M14 + n.M32 * o.M24 + n.M33 * o.M34 + n.M34 * o.M44, 
    e[12] = n.M41 * o.M11 + n.M42 * o.M21 + n.M43 * o.M31 + n.M44 * o.M41, e[13] = n.M41 * o.M12 + n.M42 * o.M22 + n.M43 * o.M32 + n.M44 * o.M42, 
    e[14] = n.M41 * o.M13 + n.M42 * o.M23 + n.M43 * o.M33 + n.M44 * o.M43, e[15] = n.M41 * o.M14 + n.M42 * o.M24 + n.M43 * o.M34 + n.M44 * o.M44, 
    e;
}, mat4.transformVec3 = function(e, t, r) {
    return e[0] = t[0] * r[0] + t[1] * r[4] + t[2] * r[8] + r[12], e[1] = t[0] * r[1] + t[1] * r[5] + t[2] * r[9] + r[13], 
    e[2] = t[0] * r[2] + t[1] * r[6] + t[2] * r[10] + r[14], e;
}, mat4.transformVec4 = function(e, t, r) {
    return e[0] = t[0] * r[0] + t[1] * r[4] + t[2] * r[8] + t[3] * r[12], e[1] = t[0] * r[1] + t[1] * r[5] + t[2] * r[9] + t[3] * r[13], 
    e[2] = t[0] * r[2] + t[1] * r[6] + t[2] * r[10] + t[3] * r[14], e[3] = t[0] * r[3] + t[1] * r[7] + t[2] * r[11] + t[3] * r[15], 
    e;
}, mat4.extractEulerAngles = function(e, t) {
    e[0] = Math.atan2(t[6], t[10]);
    var r = Math.sqrt(t[0] * t[0] + t[1] * t[1]);
    e[1] = Math.atan2(-t[2], r);
    var n = Math.sin(e[0]), o = Math.cos(e[0]);
    return e[2] = Math.atan2(n * t[8] - o * t[4], o * t[5] - n * t[9]), e;
}, mat4.invert2 = function(e, t) {
    var r = t[0] * (t[5] * t[10] - t[6] * t[9]) + t[4] * (t[2] * t[9] - t[1] * t[10]) + t[8] * (t[1] * t[6] - t[2] * t[5]);
    if (0 == r) return null;
    var n = 1 / r;
    return e[0] = (t[5] * t[10] - t[6] * t[9]) * n, e[1] = (t[9] * t[2] - t[10] * t[1]) * n, 
    e[2] = (t[1] * t[6] - t[2] * t[5]) * n, e[4] = (t[6] * t[8] - t[4] * t[10]) * n, 
    e[5] = (t[10] * t[0] - t[8] * t[2]) * n, e[6] = (t[2] * t[4] - t[0] * t[6]) * n, 
    e[8] = (t[4] * t[9] - t[5] * t[8]) * n, e[9] = (t[8] * t[1] - t[9] * t[0]) * n, 
    e[10] = (t[0] * t[5] - t[1] * t[4]) * n, e[3] = e[0] * -t[3] + e[1] * -t[7] + e[2] * -t[11], 
    e[7] = e[4] * -t[3] + e[5] * -t[7] + e[6] * -t[11], e[11] = e[8] * -t[3] + e[9] * -t[7] + e[10] * -t[11], 
    e[12] = e[13] = e[14] = 0, e[15] = 1, e;
}, window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
        window.setTimeout(e, 1e3 / 60);
    };
}(), $.support.cors = !0, $.ajaxTransport ? ($.ajaxSetup({
    flatOptions:{
        renderer:!0
    }
}), $.ajaxTransport("+binary", function(e, t, r) {
    return window.FormData && (e.dataType && "binary" == e.dataType || e.data && (window.ArrayBuffer && e.data instanceof ArrayBuffer || window.Blob && e.data instanceof Blob)) ? {
        send:function(t, r) {
            var n = new XMLHttpRequest(), o = e.url, a = e.type, i = e.responseType || "blob", s = e.data || null;
            e.renderer && n.addEventListener("progress", function(t) {
                t.lengthComputable && (e.renderer.downloads[this.responseURL] ? e.renderer.downloads[this.responseURL].loaded = t.loaded :e.renderer.downloads[this.responseURL] = {
                    loaded:t.loaded,
                    total:t.total
                }, e.renderer.updateProgress());
            }), n.addEventListener("load", function() {
                e.renderer && (delete e.renderer.downloads[this.responseURL], e.renderer.updateProgress());
                var t = {};
                t[e.dataType] = n.response, r(n.status, n.statusText, t, n.getAllResponseHeaders());
            }), n.open(a, o, !0), n.responseType = i, n.send(s);
        },
        abort:function() {
            r.abort();
        }
    } :void 0;
})) :(!function() {
    var e = $.httpData;
    $.httpData = function(t, r, n) {
        return "binary" == r ? t.response :e(t, r, n);
    };
}(), $.ajaxSetup({
    beforeSend:function(e, t) {
        "binary" == t.dataType && (e.responseType = t.responseType || "arraybuffer", e.addEventListener("progress", function(e) {
            t.renderer && e.lengthComputable && (t.renderer.downloads[this.responseURL] ? t.renderer.downloads[this.responseURL].loaded = e.loaded :t.renderer.downloads[this.responseURL] = {
                loaded:e.loaded,
                total:e.total
            }, t.renderer.updateProgress());
        }, !1), e.addEventListener("load", function() {
            t.renderer && (delete t.renderer.downloads[this.responseURL], t.renderer.updateProgress());
        }, !1));
    }
})), Math.randomInt = function() {
    return Math.randomInt || function(e, t) {
        return Math.floor(Math.random() * (t - e)) + e;
    };
}(), "function" != typeof Object.create && (Object.create = function() {
    var e = function() {};
    return function(t) {
        if (arguments.length > 1) throw Error("Second argument not supported");
        if ("object" != typeof t) throw TypeError("Argument must be an object");
        e.prototype = t;
        var r = new e();
        return e.prototype = null, r;
    };
}()), window.console = window.console || {
    log:function() {},
    error:function() {},
    warn:function() {}
}, ModelViewer.WEBGL = 1, ModelViewer.FLASH = 2, ModelViewer.TOR = 1, ModelViewer.WOW = 2, 
ModelViewer.Models = {}, ModelViewer.prototype = {
    validTypes:{
        2:"Wowhead",
        3:"LolKing",
        6:"HeroKing",
        7:"DestinyDB"
    },
    destroy:function() {
        var e = this;
        e.renderer && e.renderer.destroy(), e.options = null, e.container = null;
    },
    init:function(e, t) {
        var r = this, n = !1;
        if (void 0 !== typeof window.Uint8Array && void 0 !== typeof window.DataView) try {
            var o = document.createElement("canvas"), a = o.getContext("webgl") || o.getContext("experimental-webgl");
            a && (n = !0);
        } catch (i) {}
        !r.options.flash && n ? (r.mode = ModelViewer.WEBGL, r.renderer = new ModelViewer.WebGL(r)) :(r.mode = ModelViewer.FLASH, 
        r.renderer = new ModelViewer.Flash(r)), r.renderer.resize(e, t), r.renderer.init();
    },
    method:function(e, t) {
        var r = this;
        return void 0 === t && (t = []), r.renderer ? r.renderer.method(e, [].concat(t)) :null;
    },
    option:function(e, t) {
        var r = this;
        return void 0 !== t && (r.options[e] = t), r.options[e];
    }
}, ModelViewer.isFullscreen = function() {
    return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement ? !0 :!1;
}, ModelViewer.requestFullscreen = function(e) {
    document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || (e.requestFullscreen ? e.requestFullscreen() :e.webkitRequestFullscreen ? e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT) :e.mozRequestFullScreen ? e.mozRequestFullScreen() :e.msRequestFullscreen && e.msRequestFullscreen());
}, ModelViewer.exitFullscreen = function() {
    document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || (document.exitFullscreen ? document.exitFullscreen() :document.webkitExitFullscreen ? document.webkitExitFullscreen() :document.mozCancelFullScreen ? document.mozCancelFullScreen() :document.msExitFullscreen && document.msExitFullscreen());
}, ModelViewer.DataView = function(e) {
    this.buffer = new DataView(e), this.position = 0;
}, ModelViewer.DataView.prototype = {
    getBool:function() {
        var e = 0 != this.buffer.getUint8(this.position);
        return this.position += 1, e;
    },
    getUint8:function() {
        var e = this.buffer.getUint8(this.position);
        return this.position += 1, e;
    },
    getInt8:function() {
        var e = this.buffer.getInt8(this.position);
        return this.position += 1, e;
    },
    getUint16:function() {
        var e = this.buffer.getUint16(this.position, !0);
        return this.position += 2, e;
    },
    getInt16:function() {
        var e = this.buffer.getInt16(this.position, !0);
        return this.position += 2, e;
    },
    getUint32:function() {
        var e = this.buffer.getUint32(this.position, !0);
        return this.position += 4, e;
    },
    getInt32:function() {
        var e = this.buffer.getInt32(this.position, !0);
        return this.position += 4, e;
    },
    getFloat:function() {
        var e = this.buffer.getFloat32(this.position, !0);
        return this.position += 4, e;
    },
    getString:function(e) {
        void 0 === e && (e = this.getUint16());
        for (var t = "", r = 0; e > r; ++r) t += String.fromCharCode(this.getUint8());
        return t;
    },
    setBool:function(e) {
        this.buffer.setUint8(this.position, e ? 1 :0), this.position += 1;
    },
    setUint8:function(e) {
        this.buffer.setUint8(this.position, e), this.position += 1;
    },
    setInt8:function(e) {
        this.buffer.setInt8(this.position, e), this.position += 1;
    },
    setUint16:function(e) {
        this.buffer.setUint16(this.position, e, !0), this.position += 2;
    },
    setInt16:function(e) {
        this.buffer.setInt16(this.position, e, !0), this.position += 2;
    },
    setUint32:function(e) {
        this.buffer.setUint32(this.position, e, !0), this.position += 4;
    },
    setInt32:function(e) {
        this.buffer.setInt32(this.position, e, !0), this.position += 4;
    },
    setFloat:function(e) {
        this.buffer.setFloat32(this.position, e, !0), this.position += 4;
    }
}, ModelViewer.WebGL = function(e) {
    var t = this;
    t.viewer = e, t.options = e.options, t.downloads = {}, t.context = null, t.width = 0, 
    t.height = 0, t.time = 0, t.delta = 0, t.models = [], t.azimuth = 1.5 * Math.PI, 
    t.zenith = Math.PI / 2, t.distance = 15, t.fov = 30, t.translation = [ 0, 0, 0 ], 
    t.target = [ 0, 0, 0 ], t.eye = [ 0, 0, 0 ], t.up = [ 0, 0, 1 ], t.lookDir = vec3.create(), 
    t.fullscreen = !1, t.projMatrix = mat4.create(), t.viewMatrix = mat4.create(), t.panningMatrix = mat4.create(), 
    t.viewOffset = vec3.create(), ModelViewer.WebGL.addedCss || (ModelViewer.WebGL.addedCss = !0, 
    $("head").append(''));
}, ModelViewer.WebGL.prototype = {
    updateProgress:function() {
        var e = this, t = 0, r = 0;
        for (var n in e.downloads) t += e.downloads[n].total, r += e.downloads[n].loaded;
        if (0 >= t) e.progressShown && (e.progressBg.hide(), e.progressBar.hide(), e.progressShown = !1); else {
            e.progressShown || (e.progressBg.show(), e.progressBar.show(), e.progressShown = !0);
            var o = r / t;
            e.progressBar.width(Math.round(e.width * o) + "px");
        }
    },
    destroy:function() {
        var e = this;
        if (e.stop = !0, e.canvas && (e.canvas.detach(), e.progressBg.detach(), e.progressBar.detach(), 
        e.canvas.off("mousedown touchstart", e.onMouseDown).off("DOMMouseScroll", e.onMouseScroll).off("mousewheel", e.onMouseWheel).off("contextmenu", e.onContextMenu), 
        $(document).off("mouseup touchend", e.onMouseUp).off("mousemove touchmove", e.onMouseMove), 
        e.canvas = e.progressBg = e.progressBar = null), e.context) {
            var t = e.context;
            e.bgTexture && t.deleteTexture(e.bgTexture), e.bgTexture = null, e.program && t.deleteProgram(e.program), 
            e.program = null, e.vb && t.deleteBuffer(e.vb), e.vs && t.deleteShader(e.vs), e.fs && t.deleteShader(e.fs), 
            e.vb = e.vs = e.fs = null;
        }
        e.bgImg && (e.bgImg = null);
        for (var r = 0; r < e.models.length; ++r) e.models[r].destroy(), e.models[r] = null;
        e.models = [];
    },
    method:function(e, t) {
        var r = this;
        return r.models.length > 0 && r.models[0].external && r.models[0].external[e] ? r.models[0].external[e].apply(r.models[0], t) :null;
    },
    getTime:function() {
        return window.performance && window.performance.now ? window.performance.now() :Date.now();
    },
    draw:function() {
        var e, t = this, r = t.context, n = t.getTime();
        for (t.delta = .001 * (n - t.time), t.time = n, t.updateCamera(), r.viewport(0, 0, t.width, t.height), 
        r.clear(r.COLOR_BUFFER_BIT | r.DEPTH_BUFFER_BIT), t.bgTexture && t.program && (r.useProgram(t.program), 
        r.activeTexture(r.TEXTURE0), r.bindTexture(r.TEXTURE_2D, t.bgTexture), r.uniform1i(t.uTexture, 0), 
        r.bindBuffer(r.ARRAY_BUFFER, t.vb), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, null), 
        r.enableVertexAttribArray(t.aPosition), r.vertexAttribPointer(t.aPosition, 2, r.FLOAT, !1, 16, 0), 
        r.enableVertexAttribArray(t.aTexCoord), r.vertexAttribPointer(t.aTexCoord, 2, r.FLOAT, !1, 16, 8), 
        r.depthMask(!1), r.disable(r.CULL_FACE), r.blendFunc(r.ONE, r.ZERO), r.drawArrays(r.TRIANGLE_STRIP, 0, 4), 
        r.enable(r.CULL_FACE), r.depthMask(!0), r.disableVertexAttribArray(t.aPosition), 
        r.disableVertexAttribArray(t.aTexCoord)), e = 0; e < t.models.length; ++e) t.models[e].draw();
    },
    updateCamera:function() {
        var e = this, t = e.distance, r = e.azimuth, n = e.zenith;
        1 == e.up[2] ? (e.eye[0] = -t * Math.sin(n) * Math.cos(r) + e.target[0], e.eye[1] = -t * Math.sin(n) * Math.sin(r) + e.target[1], 
        e.eye[2] = -t * Math.cos(n) + e.target[2]) :(e.eye[0] = -t * Math.sin(n) * Math.cos(r) + e.target[0], 
        e.eye[1] = -t * Math.cos(n) + e.target[1], e.eye[2] = -t * Math.sin(n) * Math.sin(r) + e.target[2]), 
        vec3.subtract(e.lookDir, e.target, e.eye), vec3.normalize(e.lookDir, e.lookDir), 
        mat4.lookAt(e.viewMatrix, e.eye, e.target, e.up), mat4.identity(e.panningMatrix), 
        1 == e.up[2] ? vec3.set(e.viewOffset, e.translation[0], -e.translation[1], 0) :vec3.set(e.viewOffset, e.translation[0], 0, e.translation[1]), 
        mat4.translate(e.panningMatrix, e.panningMatrix, e.viewOffset), mat4.multiply(e.viewMatrix, e.panningMatrix, e.viewMatrix);
    },
    init:function() {
        function e() {
            r.stop || (requestAnimFrame(e), r.draw());
        }
        var t, r = this, n = r.context;
        if (mat4.perspective(r.projMatrix, .0174532925 * r.fov, r.viewer.aspect, .1, 5e3), 
        r.updateCamera(), n.clearColor(0, 0, 0, 1), n.enable(n.DEPTH_TEST), n.depthFunc(n.LEQUAL), 
        n.blendFunc(n.SRC_ALPHA, n.ONE_MINUS_SRC_ALPHA), n.enable(n.BLEND), (r.options.models || r.options.items) && ModelViewer.Models[r.viewer.type]) {
            var o = ModelViewer.Models[r.viewer.type], a = [].concat(r.options.models);
            if (a.length > 0) for (t = 0; t < a.length; ++t) r.models.push(new o(r, r.viewer, a[t], t)); else r.viewer.type == ModelViewer.DESTINY && r.options.items && r.models.push(new o(r, r.viewer));
        }
        e();
    },
    resize:function(e, t) {
        var r = this;
        if (r.width !== e) {
            if (r.fullscreen || r.viewer.container.css({
                height:t + "px",
                position:"absolute"
            }), r.width = e, r.height = t, r.canvas) r.canvas.attr({
                width:e,
                height:t
            }), r.canvas.css({
                width:e + "px",
                height:t + "px"
            }), r.context.viewport(0, 0, r.drawingBufferWidth, r.drawingBufferHeight); else {
                if (r.canvas = $("<canvas/>"), r.canvas.attr({
                    width:e,
                    height:t
                }), r.viewer.container.append(r.canvas), r.context = r.canvas[0].getContext("webgl") || r.canvas[0].getContext("experimental-webgl"), 
                r.progressBg = $("<div/>", {
                    css:{
                        display:"none",
                        position:"absolute",
                        bottom:0,
                        left:0,
                        right:0,
                        height:"10px",
                        backgroundColor:"#0f0f0f"
                    }
                }), r.progressBar = $("<div/>", {
                    css:{
                        display:"none",
                        position:"absolute",
                        bottom:0,
                        left:0,
                        width:0,
                        height:"10px",
                        backgroundColor:"#ccc"
                    }
                }), r.viewer.container.append(r.progressBg), r.viewer.container.append(r.progressBar), 
                !r.context) return alert("No WebGL support."), r.canvas.detach(), void (r.canvas = null);
                r.toggleSize = function() {
                    r.resized ? (r.resized = !1, r.resize(r.restoreWidth, r.restoreHeight), mat4.perspective(r.projMatrix, .0174532925 * r.fov, r.viewer.aspect, .1, 5e3)) :(r.restoreWidth = r.width, 
                    r.restoreHeight = r.height, r.resized = !0, r.resize(640, 480), mat4.perspective(r.projMatrix, .0174532925 * r.fov, 640 / 480, .1, 5e3));
                }, r.onDoubleClick = function() {
                    ModelViewer.isFullscreen() ? ModelViewer.exitFullscreen() :ModelViewer.requestFullscreen(r.canvas[0]);
                }, r.onFullscreen = function() {
                    if (!r.fullscreen && ModelViewer.isFullscreen()) {
                        r.restoreWidth = r.width, r.restoreHeight = r.height, r.fullscreen = !0;
                        var e = $(window);
                        r.resize(e.width(), e.height()), mat4.perspective(r.projMatrix, .0174532925 * r.fov, e.width() / e.height(), .1, 5e3);
                    } else r.fullscreen && !ModelViewer.isFullscreen() && (r.fullscreen = !1, r.resize(r.restoreWidth, r.restoreHeight), 
                    mat4.perspective(r.projMatrix, .0174532925 * r.fov, r.viewer.aspect, .1, 5e3));
                }, r.onMouseDown = function(e) {
                    3 == e.which || e.ctrlKey ? r.rightMouseDown = !0 :r.mouseDown = !0, "touchstart" == e.type ? (r.mouseX = e.originalEvent.touches[0].clientX, 
                    r.mouseY = e.originalEvent.touches[0].clientY) :(r.mouseX = e.clientX, r.mouseY = e.clientY), 
                    $("body").addClass("unselectable");
                }, r.onMouseScroll = function(e) {
                    return r.distance *= e.originalEvent.detail > 0 ? 1.25 :.75, e.preventDefault(), 
                    !1;
                }, r.onMouseWheel = function(e) {
                    return r.distance *= e.originalEvent.wheelDelta < 0 ? 1.25 :.75, e.preventDefault(), 
                    !1;
                }, r.onMouseUp = function() {
                    (r.mouseDown || r.rightMouseDown) && ($("body").removeClass("unselectable"), r.mouseDown = !1, 
                    r.rightMouseDown = !1);
                }, r.onMouseMove = function(e) {
                    if ((r.mouseDown || r.rightMouseDown) && void 0 !== r.mouseX) {
                        var t, n;
                        "touchmove" == e.type ? (e.preventDefault(), t = e.originalEvent.touches[0].clientX, 
                        n = e.originalEvent.touches[0].clientY) :(t = e.clientX, n = e.clientY);
                        var o = 2 * (t - r.mouseX) / r.width * Math.PI, a = 2 * (n - r.mouseY) / r.width * Math.PI;
                        if (r.mouseDown) {
                            1 == r.up[2] ? r.azimuth -= o :r.azimuth += o, r.zenith += a;
                            for (var i = 2 * Math.PI; r.azimuth < 0; ) r.azimuth += i;
                            for (;r.azimuth > i; ) r.azimuth -= i;
                            r.zenith < 1e-4 && (r.zenith = 1e-4), r.zenith >= Math.PI && (r.zenith = Math.PI - 1e-4);
                        } else r.translation[0] += o, r.translation[1] += a;
                        r.mouseX = t, r.mouseY = n;
                    }
                }, r.onContextMenu = function() {
                    return !1;
                }, r.canvas.on("mousedown touchstart", r.onMouseDown).on("DOMMouseScroll", r.onMouseScroll).on("mousewheel", r.onMouseWheel).on("dblclick", r.onDoubleClick).on("contextmenu", r.onContextMenu), 
                $(window).on("resize", r.onFullscreen), $(document).on("mouseup touchend", r.onMouseUp).on("mousemove touchmove", r.onMouseMove);
            }
            r.options.background && r.loadBackground();
        }
    },
    loadBackground:function() {
        var e = this, t = e.context, r = function() {
            e.vb = t.createBuffer(), t.bindBuffer(t.ARRAY_BUFFER, e.vb), t.bufferData(t.ARRAY_BUFFER, new Float32Array(16), t.DYNAMIC_DRAW);
            var r = e.compileShader(t.VERTEX_SHADER, e.vertShader), n = e.compileShader(t.FRAGMENT_SHADER, e.fragShader), o = t.createProgram();
            return t.attachShader(o, r), t.attachShader(o, n), t.linkProgram(o), t.getProgramParameter(o, t.LINK_STATUS) ? (e.vs = r, 
            e.fs = n, e.program = o, e.uTexture = t.getUniformLocation(o, "uTexture"), e.aPosition = t.getAttribLocation(o, "aPosition"), 
            void (e.aTexCoord = t.getAttribLocation(o, "aTexCoord"))) :void console.error("Error linking shaders");
        }, n = function() {
            var r = e.width / e.bgImg.width, n = e.height / e.bgImg.height, o = [ -1, -1, 0, n, 1, -1, r, n, -1, 1, 0, 0, 1, 1, r, 0 ];
            t.bindBuffer(t.ARRAY_BUFFER, e.vb), t.bufferSubData(t.ARRAY_BUFFER, 0, new Float32Array(o));
        };
        e.bgImg ? e.bgImg.loaded && (e.vb || r(), n()) :(e.bgImg = new Image(), e.bgImg.crossOrigin = "", 
        e.bgImg.onload = function() {
            e.bgImg.loaded = !0, e.bgTexture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, e.bgTexture), 
            t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e.bgImg), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), 
            e.vb || r(), n();
        }, e.bgImg.onerror = function() {
            e.bgImg = null;
        }, e.bgImg.src = e.options.contentPath + e.options.background);
    },
    vertShader:"    attribute vec2 aPosition;    attribute vec2 aTexCoord;        varying vec2 vTexCoord;        void main(void) {        vTexCoord = aTexCoord;        gl_Position = vec4(aPosition, 0, 1);    }    ",
    fragShader:"    precision mediump float;    varying vec2 vTexCoord;        uniform sampler2D uTexture;        void main(void) {        gl_FragColor = texture2D(uTexture, vTexCoord);    }    ",
    compileShader:function(e, t) {
        var r = this, n = r.context, o = n.createShader(e);
        if (n.shaderSource(o, t), n.compileShader(o), !n.getShaderParameter(o, n.COMPILE_STATUS)) throw "Shader compile error: " + n.getShaderInfoLog(o);
        return o;
    }
}, ModelViewer.Wow = function() {}, ModelViewer.Wow.Model = function(e, t, r, n, o) {
    var a = this;
    a.Texture = ModelViewer.Wow.Texture, a.renderer = e, a.viewer = t, a.model = r, 
    a.modelIndex = n, a.modelPath = null, a.loaded = !1, a.opts = a.viewer.options, 
    a.mount = null, a.isMount = a.opts.mount && a.opts.mount.type == ModelViewer.Wow.Types.NPC && a.opts.mount.id == a.model.id, 
    a.model.type == ModelViewer.Wow.Types.CHARACTER && a.opts.mount && a.opts.mount.type == ModelViewer.Wow.Types.NPC && a.opts.mount.id && (a.opts.mount.parent = a, 
    a.mount = new ModelViewer.Wow.Model(e, t, a.opts.mount, 0)), a.race = -1, a.gender = -1, 
    a["class"] = a.opts.cls ? parseInt(a.opts.cls) :-1, a.meta = null, a.skinIndex = 0, 
    a.hairIndex = 0, a.hairColorIndex = 0, a.faceIndex = 0, a.faceFeatureIndex = 0, 
    a.faceColorIndex = 0, a.HornsIndex = 0, a.EyePatchIndex = 0, a.TattoosIndex = 0, 
    a.hairVis = !0, a.faceVis = !0, a.hairMesh = null, a.parent = a.model.parent || null, 
    a.items = {}, a.needsCompositing = !1, a.textureOverrides = {}, a.compositeImage = null, 
    a.compositeTexture = null, a.npcTexture = null, a.specialTextures = {}, a.bakedTextures = [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ], 
    a.isHD = !1, a.numGeosets = 25, a.geosets = new Array(a.numGeosets), a.time = 0, 
    a.frame = 0, a.animationList = null, a.currentAnimation = null, a.animStartTime = 0, 
    a.slotAttachments = {}, a.matrix = mat4.create(), a.vbData = null, a.vb = null, 
    a.ib = null, a.shaderReady = !1, a.vs = null, a.fs = null, a.program = null, a.uniforms = null, 
    a.attribs = null, a.ambientColor = [ .35, .35, .35, 1 ], a.primaryColor = [ 1, 1, 1, 1 ], 
    a.secondaryColor = [ .35, .35, .35, 1 ], a.lightDir1 = vec3.create(), a.lightDir2 = vec3.create(), 
    a.lightDir3 = vec3.create(), vec3.normalize(a.lightDir1, [ 5, -3, 3 ]), vec3.normalize(a.lightDir2, [ 5, 5, 5 ]), 
    vec3.normalize(a.lightDir3, [ -5, -5, -5 ]), a.boundsSet = !1, a.animBounds = !1, 
    a.boundsMin = [ 0, 0, 0 ], a.boundsMax = [ 0, 0, 0 ], a.boundsCenter = [ 0, 0, 0 ], 
    a.boundsSize = [ 0, 0, 0 ], a.vertices = null, a.indices = null, a.animations = null, 
    a.animLookup = null, a.bones = null, a.boneLookup = null, a.keyBoneLookup = null, 
    a.meshes = null, a.texUnits = null, a.texUnitLookup = null, a.renderFlags = null, 
    a.materials = null, a.materialLookup = null, a.textureAnims = null, a.textureAnimLookup = null, 
    a.textureReplacements = null, a.attachments = null, a.attachmentLookup = null, a.colors = null, 
    a.alphas = null, a.alphaLookup = null, a.particleEmitters = null, a.ribbonEmitters = null, 
    a.skins = null, a.faces = null, a.hairs = null, a.tmpMat = mat4.create(), a.tmpVec = vec3.create(), 
    a.tmpVec3 = vec3.create(), a.tmpVec4 = vec4.create(), a.mountMat = mat4.create(), 
    o || a.load();
}, ModelViewer.Models[ModelViewer.WOW] = ModelViewer.Wow.Model, ModelViewer.Wow.Model.prototype = {
    external:{
        getNumAnimations:function() {
            var e = this.mount ? this.mount :this;
            return e.animations ? e.animations.length :0;
        },
        getAnimation:function(e) {
            var t = this.mount ? this.mount :this;
            return t.animations && e > -1 && e < t.animations.length ? t.animations[e].name :"";
        },
        setAnimation:function(e) {
            var t = this.mount ? this.mount :this;
            t.setAnimation(e);
        },
        resetAnimation:function() {
            var e = this.mount ? this.mount :this;
            e.setAnimation("Stand");
        },
        attachList:function(e) {
            for (var t = e.split(","), r = [], n = 0; n < t.length; n += 2) r.push([ t[n], t[n + 1] ]);
            for (var n in r) {
                var o = [ parseInt(r[n][0]), parseInt(r[n][1]) ];
                this.opts.items.push(o);
            }
            this.loadItems(r), this.needsCompositing = !0, this.dhmodel && (this.dhmodel.destroy(), 
            this.dhloaded = 0, this.loadDH(this.meta.DHGeosetsModel)), this.setup();
        },
        clearSlots:function(e) {
            for (var t = e.split(","), r = 0; r < t.length; ++r) {
                this.removeSlot(t[r]);
                var n = [];
                for (var r in this.opts.items) 0 != this.opts.items[r].indexOf(parseInt(t[r])) && n.push(this.opts.items[r]);
                this.opts.items = n;
            }
            this.needsCompositing = !0, this.dhmodel && (this.dhmodel.destroy(), this.dhloaded = 0, 
            this.loadDH(this.meta.DHGeosetsModel)), this.setup();
        },
        setAppearance:function(e, t, r, n, o, a, i, s, l) {
            this.skinIndex = n, this.hairIndex = e, this.hairColorIndex = t, this.faceIndex = r, 
            this.faceFeatureIndex = o, this.faceColorIndex = a, this.HornsIndex = i, this.EyePatchIndex = s, 
            this.TattoosIndex = l;
            var u = ModelViewer.Wow.Regions, d = function(e, t) {
                e[t].destroy(), delete e[t];
            };
            this.specialTextures[1] && d(this.specialTextures, 1), this.specialTextures[6] && d(this.specialTextures, 6), 
            this.specialTextures[8] && d(this.specialTextures, 8), this.bakedTextures[u.LegUpper][1] && d(this.bakedTextures[u.LegUpper], 1), 
            this.bakedTextures[u.TorsoUpper][1] && d(this.bakedTextures[u.TorsoUpper], 1), this.bakedTextures[u.FaceLower][1] && d(this.bakedTextures[u.FaceLower], 1), 
            this.bakedTextures[u.FaceUpper][1] && d(this.bakedTextures[u.FaceUpper], 1), this.bakedTextures[u.FaceLower][2] && d(this.bakedTextures[u.FaceLower], 2), 
            this.bakedTextures[u.FaceUpper][2] && d(this.bakedTextures[u.FaceUpper], 2), this.bakedTextures[u.FaceLower][3] && d(this.bakedTextures[u.FaceLower], 3), 
            this.bakedTextures[u.FaceUpper][3] && d(this.bakedTextures[u.FaceUpper], 3), this.bakedTextures[u.Base][1] && d(this.bakedTextures[u.Base], 1), 
            this.needsCompositing = !0, this.dhmodel && (this.dhmodel.destroy(), this.dhloaded = 0, 
            this.loadDH(this.meta.DHGeosetsModel)), this.setup();
        },
        isLoaded:function() {
            return this.mount ? this.mount.loaded && this.loaded :this.loaded;
        }
    },
    setMatrix:function(e, t, r, n) {
        var o = this;
        mat4.copy(o.matrix, e), mat4.multiply(o.matrix, o.matrix, t), r && mat4.translate(o.matrix, o.matrix, r), 
        n && mat4.multiply(o.matrix, o.matrix, n);
    },
    setAnimation:function(e) {
        var t, r = this, n = ModelViewer.Wow;
        r.animationList = [];
        for (var o = 0; o < r.animations.length; ++o) if (t = r.animations[o], t.name) if (t.name == e && "Stand" == e) {
            if (r.race == n.Races.PANDAREN && r.gender == n.Genders.MALE && 11900 == t.length) continue;
            r.animationList.push(t);
        } else t.name == e && r.animationList.push(t);
        r.animStartTime = 0, r.currentAnimation = r.animationList.length > 0 ? r.animationList[0] :null, 
        "Stand" == e || r.currentAnimation || r.setAnimation("Stand");
    },
    updateBuffers:function(e) {
        var t, r, n = this, o = 8, a = n.renderer.context;
        if (n.vertices && n.indices) {
            var i = n.vertices.length * o;
            if (n.vbData || (n.vbData = new Float32Array(i)), e) {
                var s = n.vbData, l = n.vertices;
                for (t = 0, r = 0; i > t; ++r) s[t + 0] = l[r].transPosition[0], s[t + 1] = l[r].transPosition[1], 
                s[t + 2] = l[r].transPosition[2], s[t + 3] = l[r].transNormal[0], s[t + 4] = l[r].transNormal[1], 
                s[t + 5] = l[r].transNormal[2], s[t + 6] = l[r].u, s[t + 7] = l[r].v, t += 8;
            }
            n.vb ? (a.bindBuffer(a.ARRAY_BUFFER, n.vb), a.bufferSubData(a.ARRAY_BUFFER, 0, n.vbData)) :(n.vb = a.createBuffer(), 
            a.bindBuffer(a.ARRAY_BUFFER, n.vb), a.bufferData(a.ARRAY_BUFFER, n.vbData, a.DYNAMIC_DRAW), 
            n.ib = a.createBuffer(), a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, n.ib), a.bufferData(a.ELEMENT_ARRAY_BUFFER, new Uint16Array(n.indices), a.STATIC_DRAW));
        }
    },
    updateBounds:function() {
        var e, t, r, n = this, o = [ 1, 1, 1, 1 ], a = ModelViewer.Wow, i = n.boundsMin, s = n.boundsMax, l = n.tmpVec;
        if (vec3.set(i, 9999, 9999, 999), vec3.set(s, -9999, -9999, -9999), !n.texUnits) return mat4.identity(n.matrix), 
        n.renderer.distance = 1, !1;
        for (var u = 0; u < n.texUnits.length; ++u) if (e = n.texUnits[u], e.show && (o[0] = o[1] = o[2] = o[3] = 1, 
        n.currentAnimation && (e.color && e.color.getValue(n.currentAnimation.index, n.time, o), 
        e.alpha && (o[3] *= e.alpha.getValue(n.currentAnimation.index, n.time))), !(o[3] < .01))) {
            t = e.mesh;
            for (var d = 0; d < t.indexCount; ++d) r = n.vertices[n.indices[t.indexStart + d]].transPosition, 
            vec3.min(i, i, r), vec3.max(s, s, r);
        }
        n.mount && n.mount.loaded && n.mount.updateBounds() && (vec3.copy(i, vec3.scale(i, n.mount.boundsMin, 1.1)), 
        vec3.copy(s, vec3.scale(s, n.mount.boundsMax, 1.1)), s[2] *= 1.75), n.model.type == a.Types.NPC && (vec3.scale(i, i, n.meta.Scale), 
        vec3.scale(s, s, n.meta.Scale)), vec3.subtract(n.boundsSize, s, i), vec3.scaleAndAdd(n.boundsCenter, i, n.boundsSize, .5);
        var c, m, f = n.boundsSize[2], h = n.meta.Scale ? n.meta.Scale :1;
        if (n.model.type != a.Types.ITEM ? (c = n.boundsSize[1], m = n.boundsSize[0]) :(c = n.boundsSize[0], 
        m = n.boundsSize[1]), !n.parent) {
            var p = n.renderer.width / n.renderer.height, g = 2 * Math.tan(.0174532925 * (n.renderer.fov / 2)), w = g * p, v = 1.2 * f / g, x = 1.2 * c / w;
            n.renderer.distance = Math.max(Math.max(v, x), 2 * m);
        }
        return mat4.identity(n.matrix), n.model.type != a.Types.ITEM && mat4.rotateZ(n.matrix, n.matrix, Math.PI / 2), 
        mat4.translate(n.matrix, n.matrix, vec3.negate(l, n.boundsCenter)), vec3.set(n.tmpVec, h, h, h), 
        mat4.scale(n.matrix, n.matrix, n.tmpVec), !0;
    },
    disabledMeshes:{
        "item/objectcomponents/weapon/knife_1h_outlandraid_d_01.mo3":{
            1:!0
        },
        "creature/cat/spectralcat.mo3":{
            1:!0
        }
    },
    setup:function() {
        var e, t = this, r = ModelViewer.Wow;
        if (t.model.type != r.Types.CHARACTER && t.model.type != r.Types.NPC && t.model.type != r.Types.HUMANOIDNPC || t.race < 1) {
            if (t.texUnits) if (t.modelPath.indexOf("item/objectcomponents/collections/demonhuntergeosets") > -1) {
                if (0 == t.parent.dhloaded) {
                    t.slot = 6;
                    var n = !1;
                    for (var e in t.parent.opts.items) 0 == t.parent.opts.items[e].indexOf(7) && (n = !0);
                    for (e = 0; e < t.texUnits.length; ++e) t.texUnits[e].show = 1401 != t.texUnits[e].meshId || n ? !1 :!0;
                }
                if (1 == t.parent.dhloaded) for (t.slot = 1, e = 0; e < t.texUnits.length; ++e) t.texUnits[e].show = t.parent.HornsIndex > 0 && t.texUnits[e].meshId == 2400 + t.parent.HornsIndex ? !0 :!1;
                if (2 == t.parent.dhloaded) for (t.slot = 1, e = 0; e < t.texUnits.length; ++e) t.texUnits[e].show = t.parent.EyePatchIndex > 0 && t.texUnits[e].meshId == 2500 + t.parent.EyePatchIndex ? !0 :!1;
                if (3 == t.parent.dhloaded) for (t.slot = 25, e = 0; e < t.texUnits.length; ++e) t.texUnits[e].show = 2301 == t.texUnits[e].meshId ? !0 :!1;
                t.parent.dhloaded = t.parent.dhloaded + 1;
            } else if ("creature/saberon/saberon.mo3" == t.modelPath) for (e = 0; e < t.texUnits.length; ++e) t.texUnits[e].show = 0 == t.texUnits[e].meshId; else if (void 0 !== t.disabledMeshes[t.modelPath]) {
                var o = t.disabledMeshes[t.modelPath];
                for (e = 0; e < t.texUnits.length; ++e) t.texUnits[e].show = void 0 === o[e];
            } else for (e = 0; e < t.texUnits.length; ++e) t.texUnits[e].show = !0;
        } else {
            t.race != r.Races.BROKEN && t.race != r.Races.TUSKARR || 0 != t.hairIndex || (t.hairIndex = 1), 
            t.model.type == r.Types.CHARACTER && t.race == r.Races.DWARF && void 0 == t.opts.fh && (t.faceFeatureIndex = 3);
            var a, i, s, l, u, d, c, m, f, h, p = t["class"] == r.Classes.DEATHKNIGHT;
            if (c = t["class"] == r.Classes.DEMONHUNTER ? t.skins :r.Skin.GetSkins(t.skins, !0, p), 
            c && (t.skinIndex >= c.length && (t.skinIndex = 0), t.skinIndex < c.length && (a = c[t.skinIndex]), 
            a && t.faceIndex < c.length)) {
                m = r.Skin.GetFaces(c[t.faceIndex].faces, !0, p, 0);
                var g = t.skinIndex;
                g >= m.length && (g = m.length - 1), g < m.length && (i = m[g]);
            }
            t.faces && (t.faceFeatureIndex >= t.faces.length && (t.faceFeatureIndex = m.length - 1), 
            t.faceFeatureIndex < t.faces.length && (s = t.faces[t.faceFeatureIndex]), s && (f = t["class"] == r.Classes.DEMONHUNTER ? s.textures :r.Face.GetTextures(s.textures, !0, p), 
            t.faceColorIndex >= f.length && (t.faceColorIndex = f.length - 1), t.faceColorIndex < f.length && (l = f[t.faceColorIndex]))), 
            t.hairs && (t.hairIndex >= t.hairs.length && (t.hairIndex = 0), t.hairIndex < t.hairs.length && (u = t.hairs[t.hairIndex]), 
            u && (f = t["class"] == r.Classes.DEMONHUNTER ? u.textures :r.Hair.GetTextures(u.textures, !0, p), 
            t.hairColorIndex >= f.length && (t.hairColorIndex = 0), t.hairColorIndex < f.length && (d = f[t.hairColorIndex]))), 
            t.tattoos && t["class"] == r.Classes.DEMONHUNTER && (t.TattoosIndex >= t.tattoos.length && (t.TattoosIndex = 0), 
            t.TattoosIndex < t.tattoos.length && (h = t.tattoos[t.TattoosIndex]));
            var w = ModelViewer.Wow.Regions;
            t.npcTexture || (t.needsCompositing = !0, a && (a.base && !t.specialTextures[1] && (t.specialTextures[1] = new t.Texture(t, 1, a.base)), 
            a.panties && !t.bakedTextures[w.LegUpper][1] && (t.bakedTextures[w.LegUpper][1] = new t.Texture(t, w.LegUpper, a.panties)), 
            a.bra && !t.bakedTextures[w.TorsoUpper][1] && (t.bakedTextures[w.TorsoUpper][1] = new t.Texture(t, w.TorsoUpper, a.bra)), 
            h && !t.bakedTextures[w.Base][1] && (t.bakedTextures[w.Base][1] = new t.Texture(t, w.FaceLower, h.texture))), 
            i && (i.lower && !t.bakedTextures[w.FaceLower][1] && (t.bakedTextures[w.FaceLower][1] = new t.Texture(t, w.FaceLower, i.lower)), 
            i.upper && !t.bakedTextures[w.FaceUpper][1] && (t.bakedTextures[w.FaceUpper][1] = new t.Texture(t, w.FaceUpper, i.upper))), 
            l && (l.lower && !t.bakedTextures[w.FaceLower][2] && (t.bakedTextures[w.FaceLower][2] = new t.Texture(t, w.FaceLower, l.lower)), 
            l.upper && !t.bakedTextures[w.FaceUpper][2] && (t.bakedTextures[w.FaceUpper][2] = new t.Texture(t, w.FaceUpper, l.upper))), 
            d && (d.lower && !t.bakedTextures[w.FaceLower][3] && (t.bakedTextures[w.FaceLower][3] = new t.Texture(t, w.FaceLower, d.lower)), 
            d.upper && !t.bakedTextures[w.FaceUpper][3] && (t.bakedTextures[w.FaceUpper][3] = new t.Texture(t, w.FaceUpper, d.upper)))), 
            a && a.fur && !t.specialTextures[8] && (t.specialTextures[8] = new t.Texture(t, 8, a.fur)), 
            d && d.texture && !t.specialTextures[6] ? t.specialTextures[6] = new t.Texture(t, 6, d.texture) :d && !d.texture && !t.specialTextures[6] && 0 == t.hairIndex && t.hairs.length > 1 && (u = t.hairs[1], 
            t.hairColorIndex >= u.textures.length && (t.hairColorIndex = 0), t.hairColorIndex < u.textures.length && (d = u.textures[t.hairColorIndex], 
            d.texture && (t.specialTextures[6] = new t.Texture(t, 6, d.texture)))), t.updateMeshes();
        }
    },
    updateMeshes:function() {
        var e, t, r, n = this, o = ModelViewer.Wow, a = o.Races, i = o.Genders, s = o.Slots;
        if (n.texUnits && 0 != n.texUnits.length) {
            var l = !0;
            for (n.hairMesh && (l = n.hairMesh.show), e = 0; e < n.texUnits.length; ++e) n.texUnits[e].show = 0 == n.texUnits[e].meshId;
            for (e = 0; e < n.numGeosets; ++e) n.geosets[e] = 1;
            if (n.geosets[7] = 2, n.faceVis && n.faces && n.faceFeatureIndex < n.faces.length) {
                var u = n.faces[n.faceFeatureIndex];
                n.geosets[1] = u.geoset1, n.geosets[2] = u.geoset2, n.geosets[3] = u.geoset3;
            }
            n.race == a.GOBLIN && (1 == n.geosets[1] && (n.geosets[1] = 2), 1 == n.geosets[2] && (n.geosets[2] = 2), 
            1 == n.geosets[3] && (n.geosets[3] = 2));
            var d, c, m = !1, f = !1, h = !1;
            for (d in n.items) if (c = n.items[d], c.slot == s.ROBE ? m = !0 :c.slot == s.BOOTS ? f = !0 :c.slot == s.HEAD && (h = !0), 
            c.geosets) {
                for (t = 0; t < c.geosets.length; ++t) n.geosets[c.geosets[t].index] = c.geosets[t].value;
                1 == n.geosets[13] && (n.geosets[13] += c.geoC), c.slot == s.BELT && (n.geosets[18] = 1 + c.geoA), 
                n.race == a.PANDAREN && c.slot == s.PANTS && (n.geosets[14] = 0);
            }
            if (2 == n.geosets[13] && (n.geosets[5] = n.geosets[12] = 0), n.geosets[4] > 1 && (n.geosets[8] = 0), 
            n.isHD && f && (n.geosets[20] = 2), h ? l = n.hairVis :(l = !0, n.hairVis = n.faceVis = !0), 
            l && n.hairs && n.hairIndex < n.hairs.length) {
                n.hairMesh = null;
                var p = n.hairs[n.hairIndex];
                for (e = 0; e < n.texUnits.length; ++e) r = n.texUnits[e], 0 != r.meshId && r.meshId == p.geoset && (r.show = !0, 
                n.hairMesh = r);
            }
            var g, w;
            for (e = 0; e < n.texUnits.length; ++e) if (r = n.texUnits[e], n.race != a.HUMAN && (n.race != a.DRAENEI && n.race != a.SCOURGE || n.gender != i.FEMALE) && 0 == r.meshId && r.mesh.indexCount < 36) r.show = !1; else {
                for (1 != r.meshId || n.hairVis && (n.gender != i.MALE || 0 != n.hairIndex || n.race != a.HUMAN && n.race != a.GNOME && n.race != a.TROLL) || (r.show = !0), 
                t = 1; t < n.numGeosets; ++t) g = 100 * t, w = 100 * (t + 1), r.meshId > g && r.meshId < w && (r.show = r.meshId == g + n.geosets[t]);
                n.race != a.SCOURGE || n.isHD ? n.race == a.GOBLIN ? (n.gender == i.FEMALE && 0 == r.mesh || n.gender == i.MALE && 3 == r.mesh) && (r.show = !1) :n.race == a.WORGEN ? n.gender == i.MALE ? (5 == r.mesh || 3 == r.mesh || r.mesh >= 36 && r.mesh <= 47) && (r.show = !1) :(2 == r.mesh || 3 == r.mesh || r.mesh >= 58 && r.mesh <= 69) && (r.show = !1) :n.race == a.PANDAREN ? n.gender == i.FEMALE && m && 1401 == r.meshId && (r.show = !1) :n.race == a.NIGHTELF && n["class"] != o.Classes.DEATHKNIGHT && 1702 == r.meshId && (r.show = !0) :n.gender == i.FEMALE ? (49 == r.mesh || 51 == r.mesh) && (r.show = !0) :62 == r.mesh && (r.show = !0), 
                (n.race == a.BLOODELF || n.race == a.NIGHTELF) && 2301 == r.meshId && (r.show = !0), 
                n["class"] == o.Classes.DEATHKNIGHT && 1703 == r.meshId && (r.show = !0);
            }
            var v;
            if (n.dhmodel) {
                var x = n.dhmodel;
                if (x.models) for (e = 0; e < x.models.length; ++e) if (n.slotAttachments[x.models[e].model.slot]) {
                    v = n.attachments[n.slotAttachments[x.models[e].model.slot]];
                    var M = JSON.parse(JSON.stringify(v));
                    x.models[e].bone = M.bone, x.models[e].attachment = M, x.models[e].attachment.position = n.gender == i.MALE && n.race == a.NIGHTELF && n.isHD ? [ .012, 0, .018 ] :6 == x.models[e].model.slot && n.gender == i.FEMALE && n.race == a.BLOODELF ? [ -.032, 0, -.65 ] :6 == x.models[e].model.slot ? [ -.032, 0, -.4 ] :[ 0, 0, 0 ];
                }
            }
            var v;
            for (d in n.items) if (c = n.items[d], c.models) for (e = 0; e < c.models.length; ++e) n.slotAttachments[c.slot] && n.slotAttachments[c.slot].length > e && (v = n.attachments[n.slotAttachments[c.slot][e]], 
            c.models[e].bone = v.bone, c.models[e].attachment = v);
            n.hairMesh && (n.hairMesh.show = l && n.hairVis);
        }
    },
    compositeTextures:function() {
        var e, t, r, n, o = this, a = ModelViewer.Wow.Regions, i = ModelViewer.Wow.Classes, s = ModelViewer.Wow.Slots, l = ModelViewer.Wow.Races;
        for (e = 0; 11 > e; ++e) for (t in o.bakedTextures[e]) if (!o.bakedTextures[e][t].ready()) return;
        for (e in o.items) {
            if (r = o.items[e], !r.loaded) return;
            if (r.textures) for (t = 0; t < r.textures.length; ++t) if (r.textures[t].texture && !r.textures[t].texture.ready()) return;
        }
        for (var e in o.specialTextures) if (o.specialTextures[e] && !o.specialTextures[e].ready()) return;
        o.compositeImage || (o.compositeImage = document.createElement("canvas"), o.compositeImage.width = o.specialTextures[1].img.width, 
        o.compositeImage.height = o.specialTextures[1].img.height);
        var u = o.compositeImage.getContext("2d");
        u.drawImage(o.specialTextures[1].img, 0, 0, o.compositeImage.width, o.compositeImage.height);
        var d, c = o.compositeImage.width, m = o.compositeImage.height, f = a.old;
        for (c != m && (f = a["new"]), e = 1; 3 >= e; ++e) {
            if (o.bakedTextures[a.FaceLower][e]) {
                if (!o.bakedTextures[a.FaceLower][e].mergeImages()) return;
                d = f[a.FaceLower], u.drawImage(o.bakedTextures[a.FaceLower][e].mergedImg, c * d.x, m * d.y, c * d.w, m * d.h);
            }
            if (o.bakedTextures[a.FaceUpper][e]) {
                if (!o.bakedTextures[a.FaceUpper][e].mergeImages()) return;
                d = f[a.FaceUpper], u.drawImage(o.bakedTextures[a.FaceUpper][e].mergedImg, c * d.x, m * d.y, c * d.w, m * d.h);
            }
        }
        if (o.isHD) for (e = 2; 3 >= e; ++e) if (o.bakedTextures[a.FaceLower][e]) {
            if (!o.bakedTextures[a.FaceLower][e].mergeImages()) return;
            d = f[a.FaceLower2], d && u.drawImage(o.bakedTextures[a.FaceLower][e].mergedImg, c * d.x, m * d.y, c * d.w, m * d.h);
        }
        var h, p = !0, g = !0;
        for (e in o.items) h = o.items[e].uniqueSlot, (h == s.SHIRT || h == s.CHEST || h == s.TABARD) && (p = !1), 
        (o.items[e].slot == s.ROBE || h == s.PANTS) && (g = !1);
        if (p && o.bakedTextures[a.TorsoUpper][1]) {
            if (!o.bakedTextures[a.TorsoUpper][1].mergeImages()) return;
            d = f[a.TorsoUpper], u.drawImage(o.bakedTextures[a.TorsoUpper][1].mergedImg, c * d.x, m * d.y, c * d.w, m * d.h);
        }
        if (g && o.bakedTextures[a.LegUpper][1]) {
            if (!o.bakedTextures[a.LegUpper][1].mergeImages()) return;
            d = f[a.LegUpper], u.drawImage(o.bakedTextures[a.LegUpper][1].mergedImg, c * d.x, m * d.y, c * d.w, m * d.h);
        }
        if (o.TattoosIndex > 0 && o["class"] == i.DEMONHUNTER && o.bakedTextures[a.Base][1]) {
            if (!o.bakedTextures[a.Base][1].mergeImages()) return;
            d = f[a.Base], u.drawImage(o.bakedTextures[a.Base][1].mergedImg, c * d.x, m * d.y, c * d.w, m * d.h);
        }
        var w = [];
        for (e in o.items) w.push(o.items[e]);
        for (o.dhmodel && w.push(o.dhmodel), w.sort(function(e, t) {
            return e.sortValue - t.sortValue;
        }), e = 0; e < w.length; ++e) if (r = w[e], r.textures) for (t = 0; t < r.textures.length; ++t) if (n = r.textures[t], 
        n.gender == o.gender && n.texture && n.texture.mergeImages() && n.region > 0) {
            if ((o.race == l.TAUREN || o.race == l.TROLL || o.race == l.DRAENEI || o.race == l.BROKEN || o.race == l.WORGEN) && n.region == a.Foot) continue;
            d = f[n.region], u.drawImage(n.texture.mergedImg, c * d.x, m * d.y, c * d.w, m * d.h);
        }
        var v = o.renderer.context;
        o.compositeTexture && v.deleteTexture(o.compositeTexture), o.compositeTexture = v.createTexture(), 
        v.bindTexture(v.TEXTURE_2D, o.compositeTexture), v.texImage2D(v.TEXTURE_2D, 0, v.RGBA, v.RGBA, v.UNSIGNED_BYTE, o.compositeImage), 
        v.texParameteri(v.TEXTURE_2D, v.TEXTURE_MIN_FILTER, v.LINEAR), o.needsCompositing = !1;
    },
    loadItems:function(e) {
        var t = this;
        if ($.isArray(e)) for (var r = 0; r < e.length; ++r) t.addItem(e[r][0], e[r][1]); else for (var n in e) t.addItem(parseInt(n), e[n]);
    },
    loadDH:function(e) {
        var t = this, r = ModelViewer.Wow;
        t.dhloaded = 0, t.dhmodel = new r.HornModel(t, 23, e, t.race, t.gender);
    },
    addItem:function(e, t) {
        var r = this, n = ModelViewer.Wow, o = new n.Item(r, e, t, r.race, r.gender), a = o.uniqueSlot, i = n.SlotAlternate[e];
        r.items[a] && 0 != i ? (o.uniqueSlot = i, r.items[i] = o) :r.items[a] = o;
    },
    removeSlot:function(e) {
        var t = this;
        if (t.items[e]) {
            if (t.items[e].models) for (var r = 0; r < t.items[e].models.length; ++r) t.items[e].models[r].model && t.items[e].models[r].model.destroy();
            t.items[e] = null, delete t.items[e];
        }
    },
    onLoaded:function() {
        var e, t = this;
        if (t.texUnits) {
            for (e = 0; e < t.texUnits.length; ++e) t.texUnits[e].setup(t);
            t.sortedTexUnits = t.texUnits.concat(), t.sortedTexUnits.sort(function(e, t) {
                return e.meshId == t.meshId ? e.meshIndex - t.meshIndex :e.meshId - t.meshId;
            });
        }
        if (t.attachments && t.attachmentLookup) {
            var r = {
                1:[ 11 ],
                3:[ 6, 5 ],
                22:[ 2 ],
                21:[ 1 ],
                17:[ 1 ],
                15:[ 2 ],
                25:[ 1 ],
                13:[ 1 ],
                14:[ 0 ],
                23:[ 2 ],
                6:[ 53 ],
                26:[ 1 ]
            }, n = {
                21:26,
                22:27,
                17:26,
                15:28,
                25:32,
                13:32,
                23:33,
                14:28,
                26:26
            };
            for (var o in r) for (e = 0; e < r[o].length; ++e) {
                var a = r[o][e];
                t.mount && n[o] && (a = n[o]), a >= t.attachmentLookup.length || -1 == t.attachmentLookup[a] || (t.slotAttachments[o] || (t.slotAttachments[o] = []), 
                t.slotAttachments[o].push(t.attachmentLookup[a]));
            }
        }
        "creature/saberon/saberon.mo3" == t.modelPath ? t.setAnimation("StealthStand") :t.mount ? ModelViewer.Wow.StandingMounts[t.mount.model.id] ? t.setAnimation("StealthStand") :t.setAnimation("Mount") :t.setAnimation("Stand"), 
        t.updateBuffers(!0), t.updateBounds(), t.setup(), t.loaded = !0, t.isMount && t.parent.loaded && t.parent.updateBounds(), 
        t.parent && t.parent.loaded && t.parent.updateMeshes();
    }
}, ModelViewer.Wow.ReversedItems = {
    139260:!0
}, ModelViewer.Wow.StandingMounts = {
    28060:!0,
    28063:!0,
    28082:!0,
    41903:!0,
    42147:!0,
    44808:!0,
    45271:!0
}, ModelViewer.Wow.Types = {
    ITEM:1,
    HELM:2,
    SHOULDER:4,
    NPC:8,
    CHARACTER:16,
    HUMANOIDNPC:32,
    OBJECT:64,
    ARMOR:128,
    PATH:256
}, ModelViewer.Wow.Classes = {
    WARRIOR:1,
    PALADIN:2,
    HUNTER:3,
    ROGUE:4,
    PRIEST:5,
    DEATHKNIGHT:6,
    SHAMAN:7,
    MAGE:8,
    WARLOCK:9,
    MONK:10,
    DRUID:11,
    DEMONHUNTER:12
}, ModelViewer.Wow.Genders = {
    MALE:0,
    FEMALE:1,
    0:"male",
    1:"female"
}, ModelViewer.Wow.Races = {
    HUMAN:1,
    ORC:2,
    DWARF:3,
    NIGHTELF:4,
    SCOURGE:5,
    TAUREN:6,
    GNOME:7,
    TROLL:8,
    GOBLIN:9,
    BLOODELF:10,
    DRAENEI:11,
    FELORC:12,
    NAGA:13,
    BROKEN:14,
    SKELETON:15,
    VRYKUL:16,
    TUSKARR:17,
    FORESTTROLL:18,
    TAUNKA:19,
    NORTHRENDSKELETON:20,
    ICETROLL:21,
    WORGEN:22,
    WORGENHUMAN:23,
    PANDAREN:24,
    1:"human",
    2:"orc",
    3:"dwarf",
    4:"nightelf",
    5:"scourge",
    6:"tauren",
    7:"gnome",
    8:"troll",
    9:"goblin",
    10:"bloodelf",
    11:"draenei",
    12:"felorc",
    13:"naga_",
    14:"broken",
    15:"skeleton",
    16:"vrykul",
    17:"tuskarr",
    18:"foresttroll",
    19:"taunka",
    20:"northrendskeleton",
    21:"icetroll",
    22:"worgen",
    23:"human",
    24:"pandaren",
    25:"pandaren",
    26:"pandaren"
}, ModelViewer.Wow.UniqueSlots = [ 0, 1, 0, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 21, 22, 22, 16, 21, 0, 19, 5, 21, 22, 22, 0, 21, 21 ], 
ModelViewer.Wow.SlotOrder = [ 0, 16, 0, 15, 1, 8, 10, 5, 6, 6, 7, 0, 0, 17, 18, 19, 14, 20, 0, 9, 8, 21, 22, 23, 0, 24, 25 ], 
ModelViewer.Wow.SlotAlternate = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], 
ModelViewer.Wow.SlotType = [ 0, 2, 0, 4, 128, 128, 128, 128, 128, 128, 128, 0, 0, 1, 1, 1, 128, 1, 0, 128, 128, 1, 1, 1, 0, 1, 1 ], 
ModelViewer.Wow.Slots = {
    HEAD:1,
    SHOULDER:3,
    SHIRT:4,
    CHEST:5,
    BELT:6,
    PANTS:7,
    BOOTS:8,
    BRACERS:9,
    HANDS:10,
    ONEHAND:13,
    SHIELD:14,
    BOW:15,
    CAPE:16,
    TWOHAND:17,
    TABARD:19,
    ROBE:20,
    RIGHTHAND:21,
    LEFTHAND:22,
    OFFHAND:23,
    THROWN:25,
    RANGED:26
}, ModelViewer.Wow.Regions = {
    Base:0,
    ArmUpper:1,
    ArmLower:2,
    Hand:3,
    FaceUpper:4,
    FaceLower:5,
    TorsoUpper:6,
    TorsoLower:7,
    LegUpper:8,
    LegLower:9,
    Foot:10,
    FaceLower2:11,
    old:[ {
        x:0,
        y:0,
        w:1,
        h:1
    }, {
        x:0,
        y:0,
        w:.5,
        h:.25
    }, {
        x:0,
        y:.25,
        w:.5,
        h:.25
    }, {
        x:0,
        y:.5,
        w:.5,
        h:.125
    }, {
        x:0,
        y:.625,
        w:.5,
        h:.125
    }, {
        x:0,
        y:.75,
        w:.5,
        h:.25
    }, {
        x:.5,
        y:0,
        w:.5,
        h:.25
    }, {
        x:.5,
        y:.25,
        w:.5,
        h:.125
    }, {
        x:.5,
        y:.375,
        w:.5,
        h:.25
    }, {
        x:.5,
        y:.625,
        w:.5,
        h:.25
    }, {
        x:.5,
        y:.875,
        w:.5,
        h:.125
    } ],
    "new":[ {
        x:0,
        y:0,
        w:.5,
        h:1
    }, {
        x:0,
        y:0,
        w:.25,
        h:.25
    }, {
        x:0,
        y:.25,
        w:.25,
        h:.25
    }, {
        x:0,
        y:.5,
        w:.25,
        h:.125
    }, {
        x:.5,
        y:0,
        w:.5,
        h:1
    }, {
        x:0,
        y:.75,
        w:.25,
        h:.25
    }, {
        x:.25,
        y:0,
        w:.25,
        h:.25
    }, {
        x:.25,
        y:.25,
        w:.25,
        h:.125
    }, {
        x:.25,
        y:.375,
        w:.25,
        h:.25
    }, {
        x:.25,
        y:.625,
        w:.25,
        h:.25
    }, {
        x:.25,
        y:.875,
        w:.25,
        h:.125
    }, {
        x:.5,
        y:0,
        w:.5,
        h:1
    } ]
}, ModelViewer.Wow.Model.prototype.load = function() {
    var e = this;
    ModelViewer.Wow.Types, e.model && e.model.type && e.model.id && e._load(e.model.type, e.model.id);
}, ModelViewer.Wow.Model.prototype._load = function(e, t) {
    var r = this, n = ModelViewer.Wow.Types, o = null;
    e == n.ITEM ? o = "meta/item/" :e == n.HELM ? o = "meta/armor/1/" :e == n.SHOULDER ? o = "meta/armor/3/" :e == n.NPC || e == n.HUMANOIDNPC ? o = "meta/npc/" :e == n.OBJECT ? o = "meta/object/" :e == n.CHARACTER && (o = "meta/character/"), 
    o ? (o = r.opts.contentPath + o + t + ".json", function(e) {
        $.getJSON(o, function(t) {
            r.loadMeta(t, e);
        });
    }(e)) :e == n.PATH && (r.modelPath = t, r.meta || (r.meta = {}), o = r.opts.contentPath + "mo3/" + t, 
    $.ajax({
        url:o,
        type:"GET",
        dataType:"binary",
        responseType:"arraybuffer",
        processData:!1,
        renderer:r.renderer,
        success:function(e) {
            r.loadMo3(e);
        },
        error:function(e, t, r) {
            console.log(r);
        }
    }));
}, ModelViewer.Wow.Model.prototype.loadMeta = function(e, t) {
    var r, n, o = this, a = ModelViewer.Wow.Types;
    if (t || (t = o.model.type), o.meta || (o.meta = e), t == a.CHARACTER) r = e.Model, 
    o.opts.hd && e.HDModel && (r = e.HDModel, o.isHD = !0), o.isHD && o.meta.HDTexture ? o.npcTexture = new o.Texture(o, -1, o.meta.HDTexture) :o.meta.Texture && (o.npcTexture = new o.Texture(o, -1, o.meta.Texture)), 
    o.race = e.Race, o.gender = e.Gender, o._load(a.PATH, r), o.opts.cls && (o["class"] = parseInt(o.opts.cls)), 
    o.meta.DHGeosetsModel && 12 == o["class"] && o.loadDH(o.meta.DHGeosetsModel), o.meta.Equipment && o.loadItems(o.meta.Equipment), 
    o.opts.items && o.loadItems(o.opts.items), o.model.type != a.CHARACTER && o.meta.Race > 0 ? (o.skinIndex = parseInt(o.meta.SkinColor), 
    o.hairIndex = parseInt(o.meta.HairStyle), o.hairColorIndex = parseInt(o.meta.HairColor), 
    o.faceIndex = parseInt(o.meta.FaceType), o.faceFeatureIndex = parseInt(o.meta.FacialHair), 
    o.faceColorIndex = o.hairColorIndex, o.HornsIndex = 0, o.EyePatchIndex = 0, o.TattoosIndex = 0) :(o.opts.sk && (o.skinIndex = parseInt(o.opts.sk)), 
    o.opts.ha && (o.hairIndex = parseInt(o.opts.ha)), o.opts.hc && (o.hairColorIndex = parseInt(o.opts.hc)), 
    o.opts.fa && (o.faceIndex = parseInt(o.opts.fa)), o.opts.fh && (o.faceFeatureIndex = parseInt(o.opts.fh)), 
    o.opts.fc && (o.faceColorIndex = parseInt(o.opts.fc)), o.opts.ho && (o.HornsIndex = parseInt(o.opts.ho)), 
    o.opts.ep && (o.EyePatchIndex = parseInt(o.opts.ep)), o.opts.ta && (o.TattoosIndex = parseInt(o.opts.ta))); else if (t == a.HELM) {
        var i = 1, s = 0;
        if (o.parent && (i = o.parent.race, s = o.parent.gender, o.parent.hairVis = 0 == e.ShowHair, 
        o.parent.faceVis = 0 == e.ShowFacial1), e.RaceModels[s] && e.RaceModels[s][i] && o._load(a.PATH, e.RaceModels[s][i]), 
        e.Textures) for (n in e.Textures) o.textureOverrides[n] = new o.Texture(o, parseInt(n), e.Textures[n]);
    } else if (t == a.SHOULDER) {
        if (1 == o.model.shoulder || void 0 === o.model.shoulder && e.Model) {
            if (e.Model && o._load(a.PATH, e.Model), e.Textures) for (n in e.Textures) o.textureOverrides[n] = new o.Texture(o, parseInt(n), e.Textures[n]);
        } else if ((2 == o.model.shoulder || void 0 === o.model.shoulder && e.Model2) && (e.Model2 && o._load(a.PATH, e.Model2), 
        e.Textures2)) for (n in e.Textures2) o.textureOverrides[n] = new o.Texture(o, parseInt(n), e.Textures2[n]);
    } else {
        if (e.Textures) for (n in e.Textures) o.textureOverrides[n] = new o.Texture(o, parseInt(n), e.Textures[n]); else if (e.GenderTextures && o.parent) {
            var l = o.parent.gender;
            for (n in e.GenderTextures[l]) o.textureOverrides[n] = new o.Texture(o, parseInt(n), e.GenderTextures[l][n]);
        }
        o.opts.hd && e.HDModel ? o._load(a.PATH, e.HDModel) :e.Model ? o._load(a.PATH, e.Model) :e.GenderModels && o.parent && e.GenderModels[o.parent.gender] ? o._load(a.PATH, e.GenderModels[o.parent.gender]) :e.Race > 0 && (r = ModelViewer.Wow.Races[e.Race] + ModelViewer.Wow.Genders[e.Gender], 
        o.race = e.Race, o.gender = e.Gender, o._load(a.CHARACTER, r));
    }
}, ModelViewer.Wow.Model.prototype.loadMo3 = function(e) {
    var t = ModelViewer.Wow;
    if (!e) return void console.error("Bad buffer for DataView");
    var r, n = this, o = new ModelViewer.DataView(e), t = ModelViewer.Wow, a = o.getUint32();
    if (604210112 != a) return void console.log("Bad magic value");
    var i = o.getUint32();
    if (2e3 > i) return void console.log("Bad version");
    var s = o.getUint32(), l = o.getUint32(), u = (o.getUint32(), o.getUint32()), d = o.getUint32(), c = o.getUint32(), m = o.getUint32(), f = o.getUint32(), h = o.getUint32(), p = o.getUint32(), g = o.getUint32(), w = o.getUint32(), v = o.getUint32(), x = o.getUint32(), M = o.getUint32(), b = o.getUint32(), A = o.getUint32(), y = o.getUint32(), T = o.getUint32(), V = o.getUint32(), I = o.getUint32(), U = o.getUint32(), E = o.getUint32(), S = o.getUint32(), R = o.getUint32(), F = o.getUint32(), L = o.getUint32(), k = o.getUint32(), C = o.getUint32(), _ = o.getUint32(), D = o.getUint32(), W = o.getUint32(), B = o.getUint32(), P = o.getUint32(), N = o.getUint32(), H = new Uint8Array(e, o.position), O = null;
    try {
        O = pako.inflate(H);
    } catch (z) {
        return void console.log("Decompression error: " + z);
    }
    if (O.length < N) return void console.log("Unexpected data size", O.length, N);
    o = new ModelViewer.DataView(O.buffer), o.position = s;
    var G = o.getInt32();
    if (G > 0) for (n.vertices = new Array(G), r = 0; G > r; ++r) n.vertices[r] = new t.Vertex(o);
    o.position = l;
    var q = o.getInt32();
    if (q > 0) for (n.indices = new Array(q), r = 0; q > r; ++r) n.indices[r] = o.getUint16();
    o.position = u;
    var Y = o.getInt32();
    if (Y > 0) for (n.animations = new Array(Y), r = 0; Y > r; ++r) n.animations[r] = new t.Animation(o);
    o.position = d;
    var Z = o.getInt32();
    if (Z > 0) for (n.animLookup = new Array(Z), r = 0; Z > r; ++r) n.animLookup[r] = o.getInt16();
    o.position = c;
    var j = o.getInt32();
    if (j > 0) for (n.bones = new Array(j), r = 0; j > r; ++r) n.bones[r] = new t.Bone(n, r, o);
    o.position = m;
    var X = o.getInt32();
    if (X > 0) for (n.boneLookup = new Array(X), r = 0; X > r; ++r) n.boneLookup[r] = o.getInt16();
    o.position = f;
    var Q = o.getInt32();
    if (Q > 0) for (n.keyBoneLookup = new Array(Q), r = 0; Q > r; ++r) n.keyBoneLookup[r] = o.getInt16();
    o.position = h;
    var K = o.getInt32();
    if (K > 0) for (n.meshes = new Array(K), r = 0; K > r; ++r) n.meshes[r] = new t.Mesh(o);
    o.position = p;
    var $ = o.getInt32();
    if ($ > 0) for (n.texUnits || (n.texUnits = []), r = 0; $ > r; ++r) n.texUnits.push(new t.TexUnit(o));
    o.position = g;
    var J = o.getInt32();
    if (J > 0) for (n.texUnitLookup = new Array(J), r = 0; J > r; ++r) n.texUnitLookup[r] = o.getInt16();
    o.position = w;
    var et = o.getInt32();
    if (et > 0) for (n.renderFlags = new Array(et), r = 0; et > r; ++r) n.renderFlags[r] = new t.RenderFlag(o);
    o.position = v;
    var tt = o.getInt32();
    if (tt > 0) for (n.materials = new Array(tt), r = 0; tt > r; ++r) n.materials[r] = new t.Material(n, r, o);
    o.position = x;
    var rt = o.getInt32();
    if (rt > 0) for (n.materialLookup = new Array(rt), r = 0; rt > r; ++r) n.materialLookup[r] = o.getInt16();
    o.position = M;
    var nt = o.getInt32();
    if (nt > 0) for (n.textureAnims = new Array(nt), r = 0; nt > r; ++r) n.textureAnims[r] = new t.TextureAnimation(o);
    o.position = b;
    var ot = o.getInt32();
    if (ot > 0) for (n.textureAnimLookup = new Array(ot), r = 0; ot > r; ++r) n.textureAnimLookup[r] = o.getInt16();
    o.position = A;
    var at = o.getInt32();
    if (at > 0) for (n.textureReplacements = new Array(at), r = 0; at > r; ++r) n.textureReplacements[r] = o.getInt16();
    o.position = y;
    var it = o.getInt32();
    if (it > 0) for (n.attachments = new Array(it), r = 0; it > r; ++r) n.attachments[r] = new t.Attachment(o);
    o.position = T;
    var st = o.getInt32();
    if (st > 0) for (n.attachmentLookup = new Array(st), r = 0; st > r; ++r) n.attachmentLookup[r] = o.getInt16();
    o.position = V;
    var lt = o.getInt32();
    if (lt > 0) for (n.colors = new Array(lt), r = 0; lt > r; ++r) n.colors[r] = new t.Color(o);
    o.position = I;
    var ut = o.getInt32();
    if (ut > 0) for (n.alphas = new Array(ut), r = 0; ut > r; ++r) n.alphas[r] = new t.Alpha(o);
    o.position = U;
    var dt = o.getInt32();
    if (dt > 0) for (n.alphaLookup = new Array(dt), r = 0; dt > r; ++r) n.alphaLookup[r] = o.getInt16();
    o.position = E;
    var ct = o.getInt32();
    if (ct > 0) for (n.particleEmitters = new Array(ct), r = 0; ct > r; ++r) n.particleEmitters[r] = new t.ParticleEmitter(n, o);
    o.position = S;
    var mt = o.getInt32();
    if (mt > 0) for (n.ribbonEmitters = new Array(mt), r = 0; mt > r; ++r) n.ribbonEmitters[r] = new t.RibbonEmitter(n, o);
    o.position = R;
    var ft = o.getInt32();
    if (ft > 0) {
        for (n.skins = new Array(ft), r = 0; ft > r; ++r) n.skins[r] = new t.Skin(o, i);
        for (o.position = F, r = 0; ft > r; ++r) n.skins[r].readFaces(o, i);
    }
    o.position = L;
    var ht = o.getInt32();
    if (ht > 0) {
        for (n.faces = new Array(ht), r = 0; ht > r; ++r) n.faces[r] = new t.Face(o);
        for (O.position = k, r = 0; ht > r; ++r) n.faces[r].readTextures(o, i);
    }
    o.position = C;
    var pt = o.getInt32();
    if (pt > 0) {
        for (n.hairs = new Array(pt), r = 0; pt > r; ++r) n.hairs[r] = new t.Hair(o);
        for (O.position = _, r = 0; pt > r; ++r) n.hairs[r].readTextures(o, i);
    }
    o.position = D;
    var gt = o.getInt32();
    if (gt > 0) for (n.horns = new Array(gt), r = 0; gt > r; ++r) n.horns[r] = new t.Horns(o);
    o.position = W;
    var wt = o.getInt32();
    if (wt > 0) for (n.blindFolds = new Array(wt), r = 0; wt > r; ++r) n.blindFolds[r] = new t.Blindfolds(o);
    o.position = B;
    var vt = o.getInt32();
    if (vt > 0) for (n.coloredHands = new Array(vt), r = 0; vt > r; ++r) n.coloredHands[r] = new t.ColoredHands(o);
    o.position = P;
    var xt = o.getInt32();
    if (xt > 0) for (n.tattoos = new Array(xt), r = 0; xt > r; ++r) n.tattoos[r] = new t.Tattoos(o);
    n.onLoaded();
}, ModelViewer.Wow.Model.prototype.update = function() {
    var e, t, r = this;
    if (r.loaded && r.texUnits) {
        if (r.frame++, r.time = r.renderer.time, r.animationList && r.animationList.length > 0 && (0 == r.animStartTime && (r.animStartTime = r.time), 
        r.time - r.animStartTime >= r.currentAnimation.length)) {
            var n = Math.max(0, Math.randomInt(0, r.animationList.length + 3) - 3);
            r.currentAnimation = r.animationList[n], r.animStartTime = r.time;
        }
        var o, a, i, s = r.texUnits.length;
        for (e = 0; s > e; ++e) if (i = r.texUnits[e], i.show) for (o = i.mesh.indexCount, 
        a = i.mesh.indexStart, t = 0; o > t; ++t) r.vertices[r.indices[a + t]].frame = r.frame;
        var l = r.bones.length, u = r.time - r.animStartTime, d = r.vbData;
        if (r.bones && r.animations) {
            for (e = 0; l > e; ++e) r.bones[e].updated = !1;
            for (e = 0; l > e; ++e) r.bones[e].update(u);
            if (r.vertices) {
                var c, m, f, h, p = r.vertices.length, g = r.tmpVec3, w = r.tmpVec4;
                for (e = 0; p > e; ++e) if (c = r.vertices[e], c.frame == r.frame) {
                    for (h = 8 * e, d[h] = d[h + 1] = d[h + 2] = d[h + 3] = d[h + 4] = d[h + 5] = 0, 
                    t = 0; 4 > t; ++t) f = c.weights[t] / 255, f > 0 && (m = r.bones[c.bones[t]], vec3.transformMat4(g, c.position, m.matrix), 
                    vec4.transformMat4(w, c.normal, m.matrix), d[h + 0] += g[0] * f, d[h + 1] += g[1] * f, 
                    d[h + 2] += g[2] * f, d[h + 3] += w[0] * f, d[h + 4] += w[1] * f, d[h + 5] += w[2] * f);
                    c.transPosition[0] = d[h + 0], c.transPosition[1] = d[h + 1], c.transPosition[2] = d[h + 2], 
                    c.transNormal[0] = d[h + 3], c.transNormal[1] = d[h + 4], c.transNormal[2] = d[h + 5];
                }
                r.updateBuffers(!1), r.animBounds || (r.animBounds = !0, r.updateBounds());
            }
        }
    }
}, ModelViewer.Wow.Model.prototype.draw = function(e) {
    var t, r = this, n = r.renderer.context, o = ModelViewer.Wow, a = o.Races, i = o.Genders;
    if (r.mount && (r.mount.draw(), r.mount.loaded)) {
        var s = r.mount.attachments[r.mount.attachmentLookup[0]], l = 1 / r.mount.meta.Scale;
        vec3.set(r.tmpVec, l, l, l), mat4.identity(r.tmpMat), mat4.scale(r.tmpMat, r.tmpMat, r.tmpVec), 
        r.setMatrix(r.mount.matrix, r.mount.bones[s.bone].matrix, s.position, r.tmpMat);
    }
    if (r.loaded && r.texUnits && (r.update(), r.shaderReady || r.initShader(), r.program)) {
        r.needsCompositing && r.compositeTextures(), n.useProgram(r.program), n.uniformMatrix4fv(r.uniforms.vModelMatrix, !1, r.matrix), 
        n.uniformMatrix4fv(r.uniforms.vViewMatrix, !1, r.renderer.viewMatrix), n.uniformMatrix4fv(r.uniforms.vProjMatrix, !1, r.renderer.projMatrix), 
        n.uniform3fv(r.uniforms.vCameraPos, r.renderer.eye), n.uniform4fv(r.uniforms.fAmbientColor, r.ambientColor), 
        n.uniform4fv(r.uniforms.fPrimaryColor, r.primaryColor), n.uniform4fv(r.uniforms.fSecondaryColor, r.secondaryColor), 
        n.uniform3fv(r.uniforms.fLightDir1, r.lightDir1), n.uniform3fv(r.uniforms.fLightDir2, r.lightDir2), 
        n.uniform3fv(r.uniforms.fLightDir3, r.lightDir3), n.bindBuffer(n.ARRAY_BUFFER, r.vb), 
        n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, r.ib);
        for (t in r.attribs) {
            var u = r.attribs[t];
            n.enableVertexAttribArray(u.loc), n.vertexAttribPointer(u.loc, u.size, u.type, !1, u.stride, u.offset);
        }
        for (e && n.frontFace(n.CW), t = 0; t < r.sortedTexUnits.length; ++t) r.sortedTexUnits[t].show && r.sortedTexUnits[t].draw();
        if (e && n.frontFace(n.CCW), r.dhmodel) {
            var d = r.dhmodel;
            if (d.models) for (var c = 0; c < d.models.length; ++c) if (d.models[c].model && d.models[c].bone > -1 && d.models[c].bone < r.bones.length) {
                var m = !1, f = d.models[c].model.model.type == o.Types.ITEM && o.ReversedItems[d.models[c].model.model.id];
                f && d.slot != o.Slots.LEFTHAND || !f && d.slot == o.Slots.LEFTHAND ? (mat4.identity(r.tmpMat), 
                vec3.set(r.tmpVec, 1, -1, 1), mat4.scale(r.tmpMat, r.tmpMat, r.tmpVec), m = !0) :mat4.identity(r.tmpMat), 
                6 != r.dhmodel.models[c].model.slot || r.gender == i.MALE && r.race == a.NIGHTELF && r.isHD || (mat4.identity(r.tmpMat), 
                r.gender == i.FEMALE && r.race == a.NIGHTELF && vec3.set(r.tmpVec, 1.3, 1.3, 1.3), 
                r.gender == i.FEMALE && r.race == a.BLOODELF && vec3.set(r.tmpVec, 1.55, 1.55, 1.55), 
                r.gender == i.MALE && r.race == a.BLOODELF && vec3.set(r.tmpVec, 1.3, 1.3, 1.3), 
                mat4.scale(r.tmpMat, r.tmpMat, r.tmpVec)), d.models[c].model.setMatrix(r.matrix, r.bones[d.models[c].bone].matrix, d.models[c].attachment.position, r.tmpMat), 
                d.models[c].model.update(), d.models[c].model.draw(m);
            }
        }
        for (t in r.items) {
            var d = r.items[t];
            if (d.models) for (var c = 0; c < d.models.length; ++c) if (d.models[c].model && d.models[c].bone > -1 && d.models[c].bone < r.bones.length) {
                var m = !1, f = d.models[c].model.model.type == o.Types.ITEM && o.ReversedItems[d.models[c].model.model.id];
                f && d.slot != o.Slots.LEFTHAND || !f && d.slot == o.Slots.LEFTHAND ? (mat4.identity(r.tmpMat), 
                vec3.set(r.tmpVec, 1, -1, 1), mat4.scale(r.tmpMat, r.tmpMat, r.tmpVec), m = !0) :mat4.identity(r.tmpMat), 
                d.models[c].model.setMatrix(r.matrix, r.bones[d.models[c].bone].matrix, d.models[c].attachment.position, r.tmpMat), 
                d.models[c].model.update(), d.models[c].model.draw(m);
            }
        }
        if (r.particleEmitters) for (t = 0; t < r.particleEmitters.length; ++t) r.particleEmitters[t].update(r.currentAnimation.index, r.time, r.renderer.delta), 
        r.particleEmitters[t].draw();
        if (r.ribbonEmitters) for (t = 0; t < r.ribbonEmitters.length; ++t) r.ribbonEmitters[t].update(r.currentAnimation.index, r.time), 
        r.ribbonEmitters[t].draw();
        for (t in r.attribs) n.disableVertexAttribArray(r.attribs[t].loc);
    }
}, ModelViewer.Wow.Model.prototype.initShader = function() {
    var e = this, t = e.renderer.context;
    e.shaderReady = !0;
    var r = e.renderer.compileShader(t.VERTEX_SHADER, e.vertShader), n = e.renderer.compileShader(t.FRAGMENT_SHADER, e.fragShader), o = t.createProgram();
    return t.attachShader(o, r), t.attachShader(o, n), t.linkProgram(o), t.getProgramParameter(o, t.LINK_STATUS) ? (e.vs = r, 
    e.fs = n, e.program = o, e.uniforms = {
        vModelMatrix:t.getUniformLocation(o, "uModelMatrix"),
        vViewMatrix:t.getUniformLocation(o, "uViewMatrix"),
        vProjMatrix:t.getUniformLocation(o, "uProjMatrix"),
        vCameraPos:t.getUniformLocation(o, "uCameraPos"),
        vTextureMatrix:t.getUniformLocation(o, "uTextureMatrix"),
        fHasTexture:t.getUniformLocation(o, "uHasTexture"),
        fHasAlpha:t.getUniformLocation(o, "uHasAlpha"),
        fBlendMode:t.getUniformLocation(o, "uBlendMode"),
        fUnlit:t.getUniformLocation(o, "uUnlit"),
        fColor:t.getUniformLocation(o, "uColor"),
        fAmbientColor:t.getUniformLocation(o, "uAmbientColor"),
        fPrimaryColor:t.getUniformLocation(o, "uPrimaryColor"),
        fSecondaryColor:t.getUniformLocation(o, "uSecondaryColor"),
        fLightDir1:t.getUniformLocation(o, "uLightDir1"),
        fLightDir2:t.getUniformLocation(o, "uLightDir2"),
        fLightDir3:t.getUniformLocation(o, "uLightDir3"),
        fTexture:t.getUniformLocation(o, "uTexture"),
        fAlpha:t.getUniformLocation(o, "uAlpha")
    }, void (e.attribs = {
        position:{
            loc:t.getAttribLocation(o, "aPosition"),
            type:t.FLOAT,
            size:3,
            offset:0,
            stride:32
        },
        normal:{
            loc:t.getAttribLocation(o, "aNormal"),
            type:t.FLOAT,
            size:3,
            offset:12,
            stride:32
        },
        texcoord:{
            loc:t.getAttribLocation(o, "aTexCoord"),
            type:t.FLOAT,
            size:2,
            offset:24,
            stride:32
        }
    })) :void console.error("Error linking shaders");
}, ModelViewer.Wow.Model.prototype.vertShader = "    attribute vec3 aPosition;    attribute vec3 aNormal;    attribute vec2 aTexCoord;        varying vec3 vNormal;    varying vec2 vTexCoord;        uniform mat4 uModelMatrix;    uniform mat4 uPanningMatrix;    uniform mat4 uViewMatrix;    uniform mat4 uProjMatrix;    uniform mat4 uTextureMatrix;    uniform vec3 uCameraPos;        void main(void) {        gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1);                vTexCoord = (uTextureMatrix * vec4(aTexCoord, 0, 1)).st;        vNormal = mat3(uViewMatrix * uModelMatrix) * aNormal;    }", 
ModelViewer.Wow.Model.prototype.fragShader = "    precision mediump float;        varying vec3 vNormal;    varying vec2 vTexCoord;        uniform bool uHasTexture;    uniform bool uHasAlpha;    uniform int uBlendMode;    uniform bool uUnlit;    uniform vec4 uColor;    uniform vec4 uAmbientColor;    uniform vec4 uPrimaryColor;    uniform vec4 uSecondaryColor;    uniform vec3 uLightDir1;    uniform vec3 uLightDir2;    uniform vec3 uLightDir3;    uniform sampler2D uTexture;    uniform sampler2D uAlpha;        void main(void) {        vec4 color = vec4(1, 1, 1, 1);        if (uHasTexture) {            color = texture2D(uTexture, vTexCoord.st);        } else {            color = vec4(vTexCoord.st, 0, 1);        }                if ((uBlendMode == 1 || uBlendMode == 2 || uBlendMode == 4) && uHasAlpha) {            color.a = texture2D(uAlpha, vTexCoord.st).r;        }                color *= uColor;                if (uBlendMode == 1) {            if (color.a < 0.7) {                discard;            }        }                if (!uUnlit) {            vec4 litColor = uAmbientColor;            vec3 normal = normalize(vNormal);                        float dp = max(0.0, dot(normal, uLightDir1));            litColor += uPrimaryColor * dp;                        dp = max(0.0, dot(normal, uLightDir2));            litColor += uSecondaryColor * dp;                        dp = max(0.0, dot(normal, uLightDir3));            litColor += uSecondaryColor * dp;                        litColor = clamp(litColor, vec4(0,0,0,0), vec4(1,1,1,1));            color *= litColor;        }                gl_FragColor = color;    }", 
ModelViewer.Wow.Model.prototype.destroy = function() {
    var e = this;
    if (e.renderer) {
        var t, r, n = e.renderer.context;
        if (e.program && n.deleteProgram(e.program), e.vs && n.deleteShader(e.vs), e.fs && n.deleteShader(e.fs), 
        e.vb && n.deleteBuffer(e.vb), e.ib && n.deleteBuffer(e.ib), e.program = null, e.vs = null, 
        e.fs = null, e.vb = null, e.ib = null, e.vbData = null, e.uniforms = null, e.attribs = null, 
        e.compositeTexture && n.deleteTexture(e.compositeTexture), e.npcTexture && e.npcTexture.destroy(), 
        e.bakedTextures) for (t = 0; 11 > t; ++t) for (r in e.bakedTextures[t]) e.bakedTextures[t][r].destroy();
        if (e.specialTextures) for (t in e.specialTextures) e.specialTextures[t].destroy();
        if (e.textureOverrides) for (t in e.textureOverrides) e.textureOverrides[t].destroy();
        if (e.indices && (e.indices = null), e.animLookup && (e.animLookup = null), e.boneLookup && (e.boneLookup = null), 
        e.keyBoneLookup && (e.keyBoneLookup = null), e.texUnitLookup && (e.texUnitLookup = null), 
        e.materialLookup && (e.materialLookup = null), e.textureAnimLookup && (e.textureAnimLookup = null), 
        e.textureReplacements && (e.textureReplacements = null), e.attachmentLookup && (e.attachmentLookup = null), 
        e.alphaLookup && (e.alphaLookup = null), e.renderFlags) for (t = 0; t < e.renderFlags.length; ++t) e.renderFlags[t] = null;
        e.renderFlags = null;
        var o = function(t) {
            if (e[t]) {
                for (var r = e[t], n = 0; n < r.length; ++n) r[n] && r[n].destroy && r[n].destroy(), 
                r[n] = null;
                e[t] = null;
            }
        };
        if (o("vertices"), o("animations"), o("bones"), o("meshes"), o("texUnits"), o("materials"), 
        o("textureAnims"), o("attachments"), o("colors"), o("alphas"), o("particleEmitters"), 
        o("ribbonEmitters"), o("skins"), o("faces"), o("hairs"), e.items) for (t in e.items) e.items[t].destroy(), 
        e.items[t] = null;
        e.dhmodel && (e.dhmodel.destroy(), e.dhmodel = null), e.mount && e.mount.destroy(), 
        e.mount = null, e.renderer = null, e.viewer = null, e.model = null, e.items = null, 
        e.textureOverrides = null, e.specialTextures = null, e.bakedTextures = null, e.geosets = null, 
        e.slotAttachments = null, e.matrix = null, e.ambientColor = null, e.primaryColor = null, 
        e.secondaryColor = null, e.lightDir1 = null, e.lightDir2 = null, e.lightDir3 = null, 
        e.boundsMin = null, e.boundsMax = null, e.boundsCenter = null, e.boundsSize = null, 
        e.tmpMat = null, e.tmpVec = null, e.tmpVec2 = null, e.tmpVec3 = null, e.tmpVec4 = null, 
        e.mountMat = null;
    }
}, function() {
    ModelViewer.Wow.Animated = function() {}, ModelViewer.Wow.Animated.prototype = {
        destroy:function() {
            var e = this;
            if (e.data) for (var t = 0; t < e.data.length; ++t) e.data[t] = null;
            return e.times = null, e.data = null, null;
        },
        createValue:function() {
            return this.defaultValue;
        },
        defaultValue:0,
        setDefault:function(e) {
            this.defaultValue = e;
        },
        interpolate:function(e, t, r, n) {
            return n = e + (t - e) * r;
        },
        set:function(e, t) {
            return e = t;
        },
        getDefault:function(e) {
            return e = this.defaultValue;
        },
        readValue:function(e) {
            return e.getInt32();
        },
        getValue:function(e, t) {
            var r = this;
            if (t = void 0 === t ? r.createValue() :r.getDefault(t), 0 != r.type || r.data.length > 1) {
                if (r.times.length > 1) {
                    var n = r.times[r.times.length - 1];
                    n > 0 && e > n && (e %= n);
                    for (var o = 0, a = r.times.length, i = 0; a > i; ++i) if (e >= r.times[i] && e < r.times[i + 1]) {
                        o = i;
                        break;
                    }
                    var s = r.times[o], l = r.times[o + 1], u = 0;
                    return s != l && (u = (e - s) / (l - s)), 1 == r.type ? r.interpolate(r.data[o], r.data[o + 1], u, t) :t = r.set(t, r.data[o]);
                }
                return r.data.length > 0 ? t = r.set(t, r.data[0]) :t;
            }
            return 0 == r.data.length ? t :t = r.set(t, r.data[0]);
        },
        read:function(e) {
            var t, r = this;
            r.type = e.getInt16(), r.seq = e.getInt16(), r.used = e.getBool();
            var n = e.getInt32();
            for (r.times = new Array(n), t = 0; n > t; ++t) r.times[t] = e.getInt32();
            var o = e.getInt32();
            for (r.data = new Array(o), t = 0; o > t; ++t) r.data[t] = r.readValue(e);
        }
    }, ModelViewer.Wow.Animated.destroySet = function(e) {
        if (e && 0 != e.length) {
            for (var t = 0; t < e.length; ++t) e[t].destroy(), e[t] = null;
            return null;
        }
    }, ModelViewer.Wow.Animated.getValue = function(e, t, r, n, o) {
        return o = o ? e.getDefault(o) :e.createValue(), t && 0 != t.length ? (r >= t.length && (r = 0), 
        t[r].getValue(n, o)) :o;
    }, ModelViewer.Wow.Animated.isUsed = function(e, t) {
        return e && 0 != e.length ? (t >= e.length && (t = 0), e[t].used) :!1;
    }, ModelViewer.Wow.AnimatedVec3 = function(e) {
        var t = this;
        t.read(e);
    }, ModelViewer.Wow.AnimatedVec3.prototype = new ModelViewer.Wow.Animated(), ModelViewer.Wow.AnimatedVec3.prototype.constructor = ModelViewer.Wow.AnimatedVec3, 
    ModelViewer.Wow.AnimatedVec3.prototype.createValue = function() {
        return vec3.clone(this.defaultValue);
    }, ModelViewer.Wow.AnimatedVec3.prototype.defaultValue = vec3.create(), ModelViewer.Wow.AnimatedVec3.prototype.getDefault = function(e) {
        return vec3.copy(e, this.defaultValue), e;
    }, ModelViewer.Wow.AnimatedVec3.prototype.interpolate = function(e, t, r, n) {
        return vec3.lerp(n, e, t, r);
    }, ModelViewer.Wow.AnimatedVec3.prototype.set = function(e, t) {
        e[0] = t[0], e[1] = t[1], e[2] = t[2];
    }, ModelViewer.Wow.AnimatedVec3.prototype.readValue = function(e) {
        return vec3.set(vec3.create(), e.getFloat(), e.getFloat(), e.getFloat());
    }, ModelViewer.Wow.AnimatedVec3.getValue = function(e, t, r, n) {
        return ModelViewer.Wow.Animated.getValue(ModelViewer.Wow.AnimatedVec3.prototype, e, t, r, n);
    }, ModelViewer.Wow.AnimatedVec3.readSet = function(e) {
        for (var t = e.getInt32(), r = new Array(t), n = 0; t > n; ++n) r[n] = new ModelViewer.Wow.AnimatedVec3(e);
        return r;
    }, ModelViewer.Wow.AnimatedQuat = function(e) {
        var t = this;
        t.read(e);
    }, ModelViewer.Wow.AnimatedQuat.prototype = new ModelViewer.Wow.Animated(), ModelViewer.Wow.AnimatedQuat.prototype.constructor = ModelViewer.Wow.AnimatedQuat, 
    ModelViewer.Wow.AnimatedQuat.prototype.createValue = function() {
        return quat.clone(this.defaultValue);
    }, ModelViewer.Wow.AnimatedQuat.prototype.defaultValue = quat.create(), ModelViewer.Wow.AnimatedQuat.prototype.getDefault = function(e) {
        return quat.copy(e, this.defaultValue), e;
    }, ModelViewer.Wow.AnimatedQuat.prototype.interpolate = function(e, t, r, n) {
        return quat.slerp(n, e, t, r);
    }, ModelViewer.Wow.AnimatedQuat.prototype.set = function(e, t) {
        e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3];
    }, ModelViewer.Wow.AnimatedQuat.prototype.readValue = function(e) {
        return quat.set(quat.create(), e.getFloat(), e.getFloat(), e.getFloat(), e.getFloat());
    }, ModelViewer.Wow.AnimatedQuat.getValue = function(e, t, r, n) {
        return ModelViewer.Wow.Animated.getValue(ModelViewer.Wow.AnimatedQuat.prototype, e, t, r, n);
    }, ModelViewer.Wow.AnimatedUint16 = function(e) {
        var t = this;
        t.read(e);
    }, ModelViewer.Wow.AnimatedUint16.prototype = new ModelViewer.Wow.Animated(), ModelViewer.Wow.AnimatedUint16.prototype.constructor = ModelViewer.Wow.AnimatedUint16, 
    ModelViewer.Wow.AnimatedUint16.prototype.readValue = function(e) {
        return e.getUint16();
    }, ModelViewer.Wow.AnimatedUint16.getValue = function(e, t, r, n) {
        return ModelViewer.Wow.Animated.getValue(ModelViewer.Wow.AnimatedUint16.prototype, e, t, r, n);
    }, ModelViewer.Wow.AnimatedUint16.readSet = function(e) {
        for (var t = e.getInt32(), r = new Array(t), n = 0; t > n; ++n) r[n] = new ModelViewer.Wow.AnimatedUint16(e);
        return r;
    }, ModelViewer.Wow.AnimatedFloat = function(e) {
        var t = this;
        t.read(e);
    }, ModelViewer.Wow.AnimatedFloat.prototype = new ModelViewer.Wow.Animated(), ModelViewer.Wow.AnimatedFloat.prototype.constructor = ModelViewer.Wow.AnimatedFloat, 
    ModelViewer.Wow.AnimatedFloat.prototype.readValue = function(e) {
        return e.getFloat();
    }, ModelViewer.Wow.AnimatedFloat.getValue = function(e, t, r, n) {
        return ModelViewer.Wow.Animated.getValue(ModelViewer.Wow.AnimatedFloat.prototype, e, t, r, n);
    }, ModelViewer.Wow.AnimatedFloat.readSet = function(e) {
        for (var t = e.getInt32(), r = new Array(t), n = 0; t > n; ++n) r[n] = new ModelViewer.Wow.AnimatedFloat(e);
        return r;
    }, ModelViewer.Wow.AnimatedUint8 = function(e) {
        var t = this;
        t.read(e);
    }, ModelViewer.Wow.AnimatedUint8.prototype = new ModelViewer.Wow.Animated(), ModelViewer.Wow.AnimatedUint8.prototype.constructor = ModelViewer.Wow.AnimatedUint8, 
    ModelViewer.Wow.AnimatedUint8.prototype.readValue = function(e) {
        return e.getUint8();
    }, ModelViewer.Wow.AnimatedUint8.getValue = function(e, t, r, n) {
        return ModelViewer.Wow.Animated.getValue(ModelViewer.Wow.AnimatedUint8.prototype, e, t, r, n);
    }, ModelViewer.Wow.AnimatedUint8.readSet = function(e) {
        for (var t = e.getInt32(), r = new Array(t), n = 0; t > n; ++n) r[n] = new ModelViewer.Wow.AnimatedUint8(e);
        return r;
    }, ModelViewer.Wow.SAnimated = function() {}, ModelViewer.Wow.SAnimated.prototype = {
        destroy:function() {
            for (var e = this, t = 0; t < e.data.length; ++t) e.data[t] = null;
            return e.times = null, e.data = null, null;
        },
        createValue:function() {
            return this.defaultValue;
        },
        defaultValue:0,
        setDefault:function(e) {
            this.defaultValue = e;
        },
        interpolate:function(e, t, r, n) {
            return n = e + (t - e) * r;
        },
        set:function(e, t) {
            return e = t;
        },
        getDefault:function(e) {
            return e = this.defaultValue;
        },
        readValue:function(e) {
            return e.getInt32();
        },
        getValue:function(e, t) {
            var r = this;
            if (t = void 0 === t ? r.createValue() :r.getDefault(t), r.data.length > 1 && r.times.length > 1) {
                var n = r.times[r.times.length - 1];
                n > 0 && e > n && (e %= n);
                for (var o = 0, a = r.times.length, i = 0; a > i; ++i) if (e >= r.times[i] && e < r.times[i + 1]) {
                    o = i;
                    break;
                }
                var s = r.times[o], l = r.times[o + 1], u = 0;
                return s != l && (u = (e - s) / (l - s)), r.interpolate(r.data[o], r.data[o + 1], u, t);
            }
            return r.data.length > 0 ? t = r.set(t, r.data[0]) :t;
        },
        read:function(e) {
            var t, r = this, n = e.getInt32();
            for (r.times = new Array(n), t = 0; n > t; ++t) r.times[t] = e.getUint32();
            var o = e.getInt32();
            for (r.data = new Array(o), t = 0; o > t; ++t) r.data[t] = r.readValue(e);
        }
    }, ModelViewer.Wow.SAnimatedVec2 = function(e) {
        var t = this;
        t.read(e);
    }, ModelViewer.Wow.SAnimatedVec2.prototype = new ModelViewer.Wow.SAnimated(), ModelViewer.Wow.SAnimatedVec2.prototype.constructor = ModelViewer.Wow.SAnimatedVec2, 
    ModelViewer.Wow.SAnimatedVec2.prototype.createValue = function() {
        return vec2.clone(this.defaultValue);
    }, ModelViewer.Wow.SAnimatedVec2.prototype.defaultValue = vec2.create(), ModelViewer.Wow.SAnimatedVec2.prototype.getDefault = function(e) {
        return vec2.copy(e, this.defaultValue), e;
    }, ModelViewer.Wow.SAnimatedVec2.prototype.interpolate = function(e, t, r, n) {
        return vec2.lerp(n, e, t, r);
    }, ModelViewer.Wow.SAnimatedVec2.prototype.set = function(e, t) {
        e[0] = t[0], e[1] = t[1], e[2] = t[2];
    }, ModelViewer.Wow.SAnimatedVec2.prototype.readValue = function(e) {
        return vec2.set(vec2.create(), e.getFloat(), e.getFloat());
    }, ModelViewer.Wow.SAnimatedVec2.getValue = function(e, t, r, n) {
        return ModelViewer.Wow.Animated.getValue(ModelViewer.Wow.SAnimatedVec2.prototype, e, t, r, n);
    }, ModelViewer.Wow.SAnimatedVec3 = function(e) {
        var t = this;
        t.read(e);
    }, ModelViewer.Wow.SAnimatedVec3.prototype = new ModelViewer.Wow.SAnimated(), ModelViewer.Wow.SAnimatedVec3.prototype.constructor = ModelViewer.Wow.SAnimatedVec3, 
    ModelViewer.Wow.SAnimatedVec3.prototype.createValue = function() {
        return vec3.clone(this.defaultValue);
    }, ModelViewer.Wow.SAnimatedVec3.prototype.defaultValue = vec3.create(), ModelViewer.Wow.SAnimatedVec3.prototype.getDefault = function(e) {
        return vec3.copy(e, this.defaultValue), e;
    }, ModelViewer.Wow.SAnimatedVec3.prototype.interpolate = function(e, t, r, n) {
        return vec3.lerp(n, e, t, r);
    }, ModelViewer.Wow.SAnimatedVec3.prototype.set = function(e, t) {
        e[0] = t[0], e[1] = t[1], e[2] = t[2];
    }, ModelViewer.Wow.SAnimatedVec3.prototype.readValue = function(e) {
        return vec3.set(vec3.create(), e.getFloat(), e.getFloat(), e.getFloat());
    }, ModelViewer.Wow.SAnimatedVec3.getValue = function(e, t, r, n) {
        return ModelViewer.Wow.Animated.getValue(ModelViewer.Wow.SAnimatedVec3.prototype, e, t, r, n);
    }, ModelViewer.Wow.SAnimatedUint16 = function(e) {
        var t = this;
        t.read(e);
    }, ModelViewer.Wow.SAnimatedUint16.prototype = new ModelViewer.Wow.SAnimated(), 
    ModelViewer.Wow.SAnimatedUint16.prototype.constructor = ModelViewer.Wow.SAnimatedUint16, 
    ModelViewer.Wow.SAnimatedUint16.prototype.readValue = function(e) {
        return e.getUint16();
    }, ModelViewer.Wow.SAnimatedUint16.getValue = function(e, t, r, n) {
        return ModelViewer.Wow.SAnimated.getValue(ModelViewer.Wow.SAnimatedUint16.prototype, e, t, r, n);
    };
}(), ModelViewer.Wow.Texture = function(e, t, r) {
    var n = this, o = e.renderer.context;
    n.model = e, n.index = t, n.url = e.opts.contentPath + "textures/" + r, -1 == n.url.indexOf(".png") && (n.url = n.url + ".png"), 
    n.alphaUrl = n.url.replace(".png", ".alpha.png"), n.texture = null, n.alphaTexture = null, 
    n.mergedImg = null, function(e, t) {
        e.img = new Image(), e.img.crossOrigin = "", e.img.onload = function() {
            e.img.loaded = !0, e.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, e.texture), 
            t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e.img), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR);
        }, e.img.onerror = function() {
            e.img = null;
        }, e.img.src = e.url, e.alphaImg = new Image(), e.alphaImg.crossOrigin = "", e.alphaImg.onload = function() {
            0 == e.alphaImg.width && 0 == e.alphaImg.height ? e.alphaImg = null :(e.alphaImg.loaded = !0, 
            e.alphaTexture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, e.alphaTexture), 
            t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e.alphaImg), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR));
        }, e.alphaImg.onerror = function() {
            e.alphaImg = null;
        }, e.alphaImg.src = e.alphaUrl;
    }(n, o);
}, ModelViewer.Wow.Texture.prototype = {
    ready:function() {
        var e = this;
        return e.img && !e.img.loaded ? !1 :e.alphaImg && !e.alphaImg.loaded ? !1 :!0;
    },
    destroy:function() {
        var e = this;
        if (e.model) {
            var t = e.model.renderer.context;
            e.texture && t.deleteTexture(e.texture), e.alphaTexture && t.deleteTexture(e.alphaTexture), 
            e.texture = null, e.alphaTexture = null, e.img = e.alphaImg = e.mergedImg = null, 
            e.model = null;
        }
    },
    mergeImages:function() {
        var e, t = this;
        if (t.mergedImg) return !0;
        if (!t.ready()) return !1;
        if (!t.alphaImg) return t.mergedImg = t.img, !0;
        var r = document.createElement("canvas");
        r.width = t.img.width, r.height = t.img.height;
        var n = r.getContext("2d");
        n.drawImage(t.img, 0, 0, t.img.width, t.img.height);
        var o = document.createElement("canvas");
        o.width = t.img.width, o.height = t.img.height;
        var a = o.getContext("2d");
        a.drawImage(t.alphaImg, 0, 0, t.alphaImg.width, t.alphaImg.height, 0, 0, t.img.width, t.img.height);
        var i = n.getImageData(0, 0, t.img.width, t.img.height), s = i.data, l = a.getImageData(0, 0, t.img.width, t.img.height), u = l.data;
        for (e = 0; e < s.length; e += 4) s[e + 3] = u[e];
        return n.putImageData(i, 0, 0), t.mergedImg = r, !0;
    }
}, ModelViewer.Wow.Item = function(e, t, r, n, o) {
    var a = this;
    a.model = e, a.slot = t, a.uniqueSlot = ModelViewer.Wow.UniqueSlots[t], a.sortValue = ModelViewer.Wow.SlotOrder[t], 
    a.models = null, a.geosets = null, a.textures = null, a.geoA = 0, a.geoB = 0, a.geoC = 0, 
    a.loaded = !1, r && a.load(r, n, o);
}, ModelViewer.Wow.Item.prototype = {
    destroy:function() {
        var e, t = this;
        if (t.model = null, t.models) {
            for (e = 0; e < t.models.length; ++e) t.models[e].model && t.models[e].model.destroy(), 
            t.models[e].model = null, t.models[e].attachment = null, t.models[e] = null;
            t.models = null;
        }
        if (t.textures) {
            for (e = 0; e < t.textures; ++e) t.textures[e].texture && t.textures[e].texture.destroy(), 
            t.textures[e].texture = null, t.textures[e] = null;
            t.textures = null;
        }
        t.geosets = null;
    },
    load:function(e, t, r) {
        var n = this, o = ModelViewer.Wow;
        if (n.id = e, n.slot == o.Slots.SHOULDER ? n.models = new Array(2) :o.SlotType[n.slot] != o.Types.ARMOR && (n.models = new Array(1)), 
        n.models) {
            for (var a = 0; a < n.models.length; ++a) {
                n.models[a] = {
                    race:t,
                    gender:r,
                    bone:-1,
                    attachment:null,
                    model:null
                };
                var i = {
                    type:o.SlotType[n.slot],
                    id:n.id,
                    parent:n.model
                };
                n.slot == o.Slots.SHOULDER && (i.shoulder = a + 1), n.models[a].model = new o.Model(n.model.renderer, n.model.viewer, i, a);
            }
            n.loaded = !0;
        } else {
            var s = n.model.opts.contentPath + "meta/armor/" + n.slot + "/" + n.id + ".json";
            $.getJSON(s, function(e) {
                n.loadMeta(e);
            });
        }
    },
    loadMeta:function(e) {
        var t = this, r = ModelViewer.Wow;
        if (t.slot = parseInt(e.Slot), e.Geosets) {
            t.geosets = [];
            for (var n in e.Geosets) t.geosets.push({
                index:parseInt(n),
                value:e.Geosets[n]
            });
        }
        if (e.GenderTextures) {
            t.textures = [];
            for (var o in e.GenderTextures) if (parseInt(o), o != t.model.gender && !t.model.npcTexture) {
                var a = e.GenderTextures[o];
                for (var i in a) {
                    var s = parseInt(i), l = {
                        region:s,
                        gender:t.model.gender,
                        file:a[i],
                        texture:null
                    };
                    s > 0 ? l.texture = new r.Texture(t.model, i, a[i]) :t.slot == r.Slots.CAPE && (t.model.textureOverrides[2] = new r.Texture(t.model, 2, a[i])), 
                    t.textures.push(l);
                }
            }
        }
        if (t.geoA = e.GeosetA, t.geoB = e.GeosetB, t.geoC = e.GeosetC, t.slot == r.Slots.HEAD) t.model.hairVis = 0 == e.ShowHair, 
        t.model.faceVis = 0 == e.ShowFacial1; else if (t.slot == r.Slots.BELT && e.GenderModels && e.GenderModels[t.model.gender]) {
            var u = {
                race:0,
                gender:0,
                bone:-1,
                attachment:null,
                model:null
            }, d = {
                type:r.SlotType[t.slot],
                id:t.id,
                parent:t.model
            };
            u.model = new r.Model(t.model.renderer, t.model.viewer, d, 0, !0), u.model.loadMeta(e, r.Types.ARMOR), 
            t.models = [ u ];
        } else t.slot == r.Slots.PANTS && t.geoC > 0 ? t.sortValue += 2 :t.slot == r.Slots.HANDS && t.geoA > 0 && (t.sortValue += 2);
        t.loaded = !0, t.model.updateMeshes();
    }
}, ModelViewer.Wow.Vertex = function(e) {
    var t = this;
    t.position = [ e.getFloat(), e.getFloat(), e.getFloat() ], t.normal = [ e.getFloat(), e.getFloat(), e.getFloat(), 0 ], 
    t.u = e.getFloat(), t.v = e.getFloat(), t.weights = [ e.getUint8(), e.getUint8(), e.getUint8(), e.getUint8() ], 
    t.bones = [ e.getUint8(), e.getUint8(), e.getUint8(), e.getUint8() ], t.transPosition = vec3.clone(t.position), 
    t.transNormal = vec4.clone(t.normal);
}, ModelViewer.Wow.Vertex.prototype = {
    destroy:function() {
        var e = this;
        e.position = null, e.normal = null, e.weights = null, e.bones = null, e.transPosition = null, 
        e.transNormal = null;
    }
}, ModelViewer.Wow.Animation = function(e) {
    var t = this, r = ModelViewer.Wow;
    if (t.id = e.getUint16(), t.subId = e.getUint16(), t.flags = e.getUint32(), t.length = e.getUint32(), 
    t.speed = e.getFloat(), t.next = e.getInt16(), t.index = e.getUint16(), t.available = e.getBool(), 
    t.available) {
        t.dbcFlags = e.getUint32(), t.name = e.getString();
        var n = e.getInt32();
        if (n > 0) {
            t.translation = new Array(n), t.rotation = new Array(n), t.scale = new Array(n);
            for (var o = 0; n > o; ++o) t.translation[o] = new r.AnimatedVec3(e), t.rotation[o] = new r.AnimatedQuat(e), 
            t.scale[o] = new r.AnimatedVec3(e);
        }
    }
}, ModelViewer.Wow.Animation.prototype = {
    destroy:function() {
        var e = this;
        if (e.translation) {
            for (var t = 0; t < e.translation.length; ++t) e.translation[t].destroy(), e.translation[t] = null, 
            e.rotation[t].destroy(), e.rotation[t] = null, e.scale[t].destroy(), e.scale[t] = null;
            e.translation = null, e.rotation = null, e.scale = null;
        }
    }
}, ModelViewer.Wow.Bone = function(e, t, r) {
    var n = this;
    n.model = e, n.index = t, n.keyId = r.getInt32(), n.parent = r.getInt16(), n.mesh = r.getUint16(), 
    n.flags = r.getUint32(), n.pivot = [ r.getFloat(), r.getFloat(), r.getFloat() ], 
    n.transformedPivot = vec3.create(), n.matrix = mat4.create(), n.tmpVec = vec3.create(), 
    n.tmpQuat = quat.create(), n.tmpMat = mat4.create(), n.hidden = !1, n.updated = !1;
}, ModelViewer.Wow.Bone.prototype = {
    destroy:function() {
        var e = this;
        e.model = null, e.pivot = null, e.transformedPivot = null, e.matrix = null, e.tmpVec = null, 
        e.tmpQuat = null, e.tmpMat = null;
    },
    hide:function() {
        var e = this;
        e.hidden = !0;
        for (var t = 0; 16 > t; ++t) e.matrix[t] = 0;
    },
    update:function(e) {
        var t = this, r = ModelViewer.Wow;
        if (t.hidden) return void t.hide();
        if (t.model.model.type != r.Types.CHARACTER || t.model.isHD || t.model.race == r.Races.HUMAN && t.model.gender == r.Genders.MALE && 24 == t.index && t.hide(), 
        !t.updated && (t.updated = !0, t.model && t.model.animations)) {
            mat4.identity(t.matrix);
            var n = t.model.currentAnimation;
            if (n && n.translation && n.rotation && n.scale) {
                var o = (8 & t.flags) > 0;
                if (n.translation[t.index].used || n.rotation[t.index].used || n.scale[t.index].used || o) {
                    if (mat4.translate(t.matrix, t.matrix, t.pivot), n.translation[t.index].used && (n.translation[t.index].getValue(e, t.tmpVec), 
                    mat4.translate(t.matrix, t.matrix, t.tmpVec)), n.rotation[t.index].used && (n.rotation[t.index].getValue(e, t.tmpQuat), 
                    mat4.fromQuat(t.tmpMat, t.tmpQuat), mat4.transpose(t.tmpMat, t.tmpMat), mat4.multiply(t.matrix, t.matrix, t.tmpMat)), 
                    n.scale[t.index].used && (n.scale[t.index].getValue(e, t.tmpVec), (t.tmpVec[0] > 10 || Math.abs(t.tmpVec[0]) < 1e-4) && (t.tmpVec[0] = 1), 
                    (t.tmpVec[1] > 10 || Math.abs(t.tmpVec[1]) < 1e-4) && (t.tmpVec[1] = 1), (t.tmpVec[2] > 10 || Math.abs(t.tmpVec[2]) < 1e-4) && (t.tmpVec[2] = 1), 
                    mat4.scale(t.matrix, t.matrix, t.tmpVec)), o) {
                        var a, i = -t.model.renderer.zenith + Math.PI / 2;
                        a = t.model.model.type == r.Types.ITEM ? t.model.renderer.azimuth - Math.PI :t.model.renderer.azimuth - 1.5 * Math.PI, 
                        mat4.identity(t.matrix), mat4.translate(t.matrix, t.matrix, t.pivot), mat4.rotateZ(t.matrix, t.matrix, a), 
                        mat4.rotateY(t.matrix, t.matrix, i);
                    }
                    mat4.translate(t.matrix, t.matrix, vec3.negate(t.tmpVec, t.pivot));
                }
                t.parent > -1 && (t.model.bones[t.parent].update(e), mat4.multiply(t.matrix, t.model.bones[t.parent].matrix, t.matrix)), 
                vec3.transformMat4(t.transformedPivot, t.pivot, t.matrix);
            }
        }
    }
}, ModelViewer.Wow.Mesh = function(e) {
    var t = this;
    t.id = e.getUint16(), t.indexWrap = e.getUint16(), t.vertexStart = e.getUint16(), 
    t.vertexCount = e.getUint16(), t.indexStart = e.getUint16() + 65536 * t.indexWrap, 
    t.indexCount = e.getUint16(), t.centerOfMass = [ e.getFloat(), e.getFloat(), e.getFloat() ], 
    t.centerBounds = [ e.getFloat(), e.getFloat(), e.getFloat() ], t.radius = e.getFloat();
}, ModelViewer.Wow.Mesh.prototype = {
    destroy:function() {
        var e = this;
        e.centerOfMass = null, e.centerBounds = null;
    }
}, ModelViewer.Wow.TexUnit = function(e) {
    var t = this;
    t.flags = e.getUint16(), t.shading1 = e.getUint8(), t.shading2 = e.getUint8(), t.meshIndex = e.getUint16(), 
    t.mode = e.getUint16(), t.colorIndex = e.getInt16(), t.alphaIndex = e.getInt16(), 
    t.materialIndex = e.getInt16(), t.textureAnimIndex = e.getInt16(), t.renderFlagIndex = e.getUint16(), 
    t.texUnitIndex = e.getUint16(), t.show = !0, t.model = null, t.mesh = null, t.meshId = 0, 
    t.renderFlag = null, t.material = null, t.textureAnim = null, t.color = null, t.alpha = null, 
    t.unlit = !1, t.cull = !1, t.noZWrite = !1, t.tmpColor = vec4.create(), t.textureMatrix = mat4.create(), 
    t.tmpVec = vec3.create(), t.tmpQuat = quat.create();
}, ModelViewer.Wow.TexUnit.prototype = {
    destroy:function() {
        var e = this;
        e.model = null, e.mesh = null, e.renderFlag = null, e.material = null, e.textureAnim = null, 
        e.color = null, e.alpha = null, e.tmpColor = null, e.textureMatrix = null, e.tmpVec = null, 
        e.tmpQuat = null;
    },
    draw:function() {
        var e = this, t = e.model.renderer.context, r = e.model.currentAnimation.index, n = e.model.time;
        if (e.tmpColor[0] = e.tmpColor[1] = e.tmpColor[2] = e.tmpColor[3] = 1, e.color && e.color.getValue(r, n, e.tmpColor), 
        e.alpha && (e.tmpColor[3] *= e.alpha.getValue(r, n)), !(e.tmpColor[3] <= .001)) {
            var o = e.renderFlag.blend;
            e.meshId > 1500 && e.meshId < 1600 && (o = 0), t.uniform4fv(e.model.uniforms.fColor, e.tmpColor), 
            t.uniform1i(e.model.uniforms.fBlendMode, o), t.uniform1i(e.model.uniforms.fUnlit, e.unlit);
            var a = null, i = null;
            if (e.material) if (1 == e.material.type) e.model.npcTexture ? (a = e.model.npcTexture.texture, 
            i = e.model.npcTexture.alphaTexture) :e.model.compositeTexture && (a = e.model.compositeTexture); else if (e.material.texture) a = e.material.texture.texture, 
            i = e.material.texture.alphaTexture; else if (((e.model.model.type < 8 || e.model.model.type > 32) && 2 == e.material.type || e.material.type >= 11) && e.model.textureOverrides[e.material.index]) a = e.model.textureOverrides[e.material.index].texture, 
            i = e.model.textureOverrides[e.material.index].alphaTexture; else if (-1 != e.material.type && e.model.textureOverrides[e.material.type]) a = e.model.textureOverrides[e.material.type].texture, 
            i = e.model.textureOverrides[e.material.type].alphaTexture; else if (-1 != e.material.type && e.model.specialTextures[e.material.type]) a = e.model.specialTextures[e.material.type].texture, 
            i = e.model.specialTextures[e.material.type].alphaTexture; else if (!e.material.filename) {
                var s = e.model.materials[e.materialIndex];
                s.texture && (a = s.texture.texture, i = s.texture.alphaTexture);
            }
            if (a && (t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, a), t.uniform1i(e.model.uniforms.fTexture, 0)), 
            i && (t.activeTexture(t.TEXTURE1), t.bindTexture(t.TEXTURE_2D, i), t.uniform1i(e.model.uniforms.fAlpha, 1)), 
            t.uniform1i(e.model.uniforms.fHasTexture, a ? 1 :0), t.uniform1i(e.model.uniforms.fHasAlpha, i ? 1 :0), 
            mat4.identity(e.textureMatrix), e.textureAnim) {
                var l = !1;
                e.textureAnim.translation ? (ModelViewer.Wow.AnimatedVec3.getValue(e.textureAnim.translation, r, n, e.tmpVec), 
                l = !0) :vec3.set(e.tmpVec, 0, 0, 0), e.textureAnim.rotation ? (ModelViewer.Wow.AnimatedQuat.getValue(e.textureAnim.rotation, r, n, e.tmpQuat), 
                l = !0) :quat.set(e.tmpQuat, 0, 0, 0, 1), l && mat4.fromRotationTranslation(e.textureMatrix, e.tmpQuat, e.tmpVec), 
                e.textureAnim.scale && ModelViewer.Wow.Animated.isUsed(e.textureAnim.scale, r) && (ModelViewer.Wow.AnimatedVec3.getValue(e.textureAnim.scale, r, n, e.tmpVec), 
                mat4.scale(e.textureMatrix, e.textureMatrix, e.tmpVec));
            }
            t.uniformMatrix4fv(e.model.uniforms.vTextureMatrix, !1, e.textureMatrix), 0 == o || 1 == o ? t.blendFunc(t.ONE, t.ZERO) :2 == o ? t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA) :3 == o ? t.blendFunc(t.SRC_COLOR, t.ONE) :4 == o ? 1 == e.mode || 2 == e.mode ? t.blendFunc(t.SRC_ALPHA, t.ONE) :t.blendFunc(t.ONE, t.ONE) :5 == o ? 1 == e.mode ? t.blendFunc(t.ZERO, t.SRC_COLOR) :t.blendFunc(t.DST_COLOR, t.SRC_COLOR) :6 == o ? t.blendFunc(t.DST_COLOR, t.SRC_COLOR) :t.blendFunc(t.ONE, t.ONE_MINUS_SRC_ALPHA), 
            e.cull ? t.enable(t.CULL_FACE) :t.disable(t.CULL_FACE), e.noZWrite ? t.depthMask(!1) :t.depthMask(!0), 
            t.drawElements(t.TRIANGLES, e.mesh.indexCount, t.UNSIGNED_SHORT, 2 * e.mesh.indexStart);
        }
    },
    setup:function(e) {
        var t = this;
        if (t.model = e, t.mesh = e.meshes[t.meshIndex], t.meshId = t.mesh.id, t.renderFlag = e.renderFlags[t.renderFlagIndex], 
        t.unlit = (1 & t.renderFlag.flags) > 0, t.cull = 0 == (4 & t.renderFlag.flags), 
        t.noZWrite = (16 & t.renderFlag.flags) > 0, t.materialIndex > -1 && t.materialIndex < e.materialLookup.length) {
            var r = e.materialLookup[t.materialIndex];
            r > -1 && r < e.materials.length && (t.material = e.materials[r]);
        }
        if (t.textureAnimIndex > -1 && t.textureAnimIndex < e.textureAnimLookup.length) {
            var n = e.textureAnimLookup[t.textureAnimIndex];
            n > -1 && n < e.textureAnims.length && (t.textureAnim = e.textureAnims[n]);
        }
        if (t.colorIndex > -1 && t.colorIndex < e.colors.length && (t.color = e.colors[t.colorIndex]), 
        t.alphaIndex > -1 && t.alphaIndex < e.alphaLookup.length) {
            var o = e.alphaLookup[t.alphaIndex];
            o > -1 && o < e.alphas.length && (t.alpha = e.alphas[o]);
        }
    }
}, ModelViewer.Wow.RenderFlag = function(e) {
    var t = this;
    t.flags = e.getUint16(), t.blend = e.getUint16();
}, ModelViewer.Wow.Material = function(e, t, r) {
    var n = this;
    n.model = e, n.index = t, n.type = r.getInt32(), n.flags = r.getUint32(), n.filename = r.getUint32(), 
    n.texture = null, n.load();
}, ModelViewer.Wow.Material.prototype = {
    destroy:function() {
        var e = this;
        e.model = null, e.texture && e.texture.destroy(), e.texture = null;
    },
    load:function() {
        var e = this;
        0 != e.filename && (e.texture = new ModelViewer.Wow.Texture(e.model, 0, e.filename));
    }
}, ModelViewer.Wow.TextureAnimation = function(e) {
    var t, r = ModelViewer.Wow, n = this, o = e.getInt32();
    if (o > 0) for (n.translation = new Array(o), t = 0; o > t; ++t) n.translation[t] = new r.AnimatedVec3(e); else n.translation = null;
    var a = e.getInt32();
    if (a > 0) for (n.rotation = new Array(a), t = 0; a > t; ++t) n.rotation[t] = new r.AnimatedQuat(e); else n.rotation = null;
    var i = e.getInt32();
    if (i > 0) for (n.scale = new Array(i), t = 0; i > t; ++t) n.scale[t] = new r.AnimatedVec3(e); else n.scale = null;
}, ModelViewer.Wow.TextureAnimation.prototype = {
    destroy:function() {
        var e, t = this;
        if (t.translation) {
            for (e = 0; e < t.translation.length; ++e) t.translation[e] = t.translation[e].destroy();
            t.translation = null;
        }
        if (t.rotation) {
            for (e = 0; e < t.rotation.length; ++e) t.rotation[e] = t.rotation[e].destroy();
            t.rotation = null;
        }
        if (t.scale) {
            for (e = 0; e < t.scale.length; ++e) t.scale[e] = t.scale[e].destroy();
            t.scale = null;
        }
    }
}, ModelViewer.Wow.Attachment = function(e) {
    var t = this;
    t.id = e.getInt32(), t.bone = e.getInt32(), t.position = [ e.getFloat(), e.getFloat(), e.getFloat() ], 
    t.slot = -1;
}, ModelViewer.Wow.Attachment.prototype = {
    destroy:function() {
        var e = this;
        e.position = null;
    }
}, ModelViewer.Wow.Color = function(e) {
    var t, r = ModelViewer.Wow, n = this, o = e.getInt32();
    if (o > 0) for (n.rgb = new Array(o), t = 0; o > t; ++t) n.rgb[t] = new r.AnimatedVec3(e);
    var a = e.getInt32();
    if (a > 0) for (n.alpha = new Array(a), t = 0; a > t; ++t) n.alpha[t] = new r.AnimatedUint16(e);
}, ModelViewer.Wow.Color.prototype = {
    destroy:function() {
        var e, t = this;
        if (t.rgb) {
            for (e = 0; e < t.rgb.length; ++e) t.rgb[e] = t.rgb[e].destroy();
            t.rgb = null;
        }
        if (t.alpha) {
            for (e = 0; e < t.alpha.length; ++e) t.alpha[e] = t.alpha[e].destroy();
            t.alpha = null;
        }
    },
    rgbUsed:function(e) {
        var t = this;
        return t.rgb ? e < t.rgb.length ? t.rgb[e].used :t.rgb[0].used :!1;
    },
    alphaUsed:function(e) {
        var t = this;
        return t.alpha ? e < t.alpha.length ? t.alpha[e].used :t.alpha[0].used :!1;
    },
    used:function(e) {
        var t = this;
        return t.rgbUsed(e) || t.alphaUsed(e);
    },
    getValue:function(e, t, r) {
        var n = this;
        return r ? r[0] = r[1] = r[2] = r[3] = 1 :r = [ 1, 1, 1, 1 ], n.rgbUsed(e) && ModelViewer.Wow.AnimatedVec3.getValue(n.rgb, e, t, r), 
        n.alphaUsed(e) && (r[3] = ModelViewer.Wow.AnimatedUint16.getValue(n.alpha, e, t, r[3]) / 32767), 
        r;
    }
}, ModelViewer.Wow.Alpha = function(e) {
    var t = this, r = e.getInt32();
    t.data = new Array(r);
    for (var n = 0; r > n; ++n) t.data[n] = new ModelViewer.Wow.AnimatedUint16(e);
}, ModelViewer.Wow.Alpha.prototype = {
    destroy:function() {
        for (var e = this, t = 0; t < e.data.length; ++t) e.data[t] = e.data[t].destroy();
        e.data = null;
    },
    used:function(e) {
        var t = this;
        return 0 == t.data.length ? !1 :e < t.data.length ? t.data[e].used :t.data[0].used;
    },
    getValue:function(e, t) {
        var r = this, n = 1;
        if (r.used(e)) {
            var o = ModelViewer.Wow.AnimatedUint16.getValue(r.data, e, t, n);
            n = o / 32767;
        }
        return n > 1 ? n = 1 :0 > n && (n = 0), n;
    }
}, ModelViewer.Wow.ParticleEmitter = function(e, t) {
    var r = this, n = ModelViewer.Wow;
    r.model = e, r.id = t.getInt32(), r.flags = t.getUint32(), r.flags2 = t.getUint16(), 
    r.position = [ t.getFloat(), t.getFloat(), t.getFloat() ], r.boneId = t.getInt16(), 
    r.textureId = t.getInt16(), r.blendMode = t.getUint8(), r.emitterType = t.getUint8(), 
    r.particleType = t.getUint8(), r.headTail = t.getUint8(), r.tileRotation = t.getUint16(), 
    r.tileRows = t.getUint16(), r.tileColumns = t.getUint16(), r.scale = [ t.getFloat(), t.getFloat(), t.getFloat() ], 
    r.slowdown = t.getFloat(), r.rotation = [ t.getFloat(), t.getFloat(), t.getFloat() ], 
    r.modelRot1 = [ t.getFloat(), t.getFloat(), t.getFloat() ], r.modelRot2 = [ t.getFloat(), t.getFloat(), t.getFloat() ], 
    r.modelTranslation = [ t.getFloat(), t.getFloat(), t.getFloat() ], r.modelPath = t.getString(), 
    r.particlePath = t.getString(), r.emissionSpeed = n.AnimatedFloat.readSet(t), r.speedVariation = n.AnimatedFloat.readSet(t), 
    r.verticalRange = n.AnimatedFloat.readSet(t), r.horizontalRange = n.AnimatedFloat.readSet(t), 
    r.gravity = n.AnimatedFloat.readSet(t), r.lifespan = n.AnimatedFloat.readSet(t), 
    r.emissionRate = n.AnimatedFloat.readSet(t), r.areaLength = n.AnimatedFloat.readSet(t), 
    r.areaWidth = n.AnimatedFloat.readSet(t), r.gravity2 = n.AnimatedFloat.readSet(t), 
    r.color = new n.SAnimatedVec3(t), r.alpha = new n.SAnimatedUint16(t), r.size = new n.SAnimatedVec2(t), 
    r.intensity = new n.SAnimatedUint16(t), r.enabled = n.AnimatedUint8.readSet(t), 
    r.bone = r.model.bones[r.boneId], r.maxParticles = 500, r.particles = new Array(r.maxParticles), 
    r.unusedParticles = new Array(r.maxParticles);
    for (var o = r.maxParticles - 1, a = 0; o >= 0; --o, ++a) r.unusedParticles[o] = a;
    r.nextParticle = r.maxParticles - 1, r.numParticles = 0, r.spawnRemainder = 0, r.tmpColors = [ vec4.create(), vec4.create(), vec4.create() ], 
    r.spreadMat = mat4.create(), r.tmpMat = mat4.create(), r.init();
}, ModelViewer.Wow.ParticleEmitter.prototype = {
    destroy:function() {
        var e = this, t = e.model.renderer.context, r = ModelViewer.Wow.Animated;
        e.program && t.deleteProgram(e.program), e.vs && t.deleteShader(e.vs), e.fs && t.deleteShader(e.fs), 
        e.vb && t.deleteBuffer(e.vb), e.ib && t.deleteBuffer(e.ib), e.program = null, e.vs = null, 
        e.fs = null, e.vb = null, e.ib = null, e.vbData = null, e.texture = null, e.attribs = null, 
        e.uniforms = null, e.model = null, e.bone = null, e.position = null, e.scale = null, 
        e.rotation = null, e.modelRot1 = null, e.modelRot2 = null, e.modelTranslation = null, 
        e.emissionSpeed = r.destroySet(e.emissionSpeed), e.speedVariation = r.destroySet(e.speedVariation), 
        e.verticalRange = r.destroySet(e.verticalRange), e.horizontalRange = r.destroySet(e.horizontalRange), 
        e.gravity = r.destroySet(e.gravity), e.lifespan = r.destroySet(e.lifespan), e.emissionRate = r.destroySet(e.emissionRate), 
        e.areaLength = r.destroySet(e.areaLength), e.areaWidth = r.destroySet(e.areaWidth), 
        e.gravity2 = r.destroySet(e.gravity2), e.enabled = r.destroySet(e.enabled), e.color = e.color.destroy(), 
        e.alpha = e.alpha.destroy(), e.size = e.size.destroy(), e.intensity = e.intensity.destroy(), 
        e.particles = null, e.unusedParticles = null, e.tmpColors[0] = e.tmpColors[1] = e.tmpColors[2] = null, 
        e.tmpColors = null, e.spreadMat = null, e.tmpMat = null;
    },
    updateBuffers:function() {
        var e, t, r = this, n = r.model.renderer.context;
        if (!r.vbData) {
            r.vbData = new Float32Array(11 * r.maxParticles);
            var o = new Uint16Array(6 * r.maxParticles), a = 0;
            for (e = 0; e < r.maxParticles; ++e) o[6 * e + 0] = a, o[6 * e + 1] = a + 1, o[6 * e + 2] = a + 2, 
            o[6 * e + 3] = a + 2, o[6 * e + 4] = a + 1, o[6 * e + 5] = a + 3, a += 4;
            r.ib = n.createBuffer(), n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, r.ib), n.bufferData(n.ELEMENT_ARRAY_BUFFER, o, n.STATIC_DRAW);
        }
        r.numParticles = 0;
        var i, s, l = 0, u = r.vbData;
        if (0 == r.particleType || 2 == r.particleType) {
            for (e = 0; e < r.maxParticles; ++e) if (i = r.particles[e], i && 0 != i.maxLife) {
                for (s = r.textureCoords[i.tile], t = 0; 4 > t; ++t) u[l + 0] = i.position[0], u[l + 1] = i.position[1], 
                u[l + 2] = i.position[2], u[l + 3] = i.color[0], u[l + 4] = i.color[1], u[l + 5] = i.color[2], 
                u[l + 6] = i.color[3], u[l + 7] = s[t].x, u[l + 8] = s[t].y, u[l + 9] = s[t].z * i.size[0], 
                u[l + 10] = s[t].w * i.size[1], l += 11;
                r.numParticles++;
            }
        } else for (e = 0; e < r.maxParticles; ++e) if (i = r.particles[e], i && 0 != i.maxLife) {
            for (s = r.textureCoords[i.tile], u[l + 0] = i.position[0], u[l + 1] = i.position[1], 
            u[l + 2] = i.position[2], u[l + 11] = i.position[0], u[l + 12] = i.position[1], 
            u[l + 13] = i.position[2], u[l + 22] = i.origin[0], u[l + 23] = i.origin[1], u[l + 24] = i.origin[2], 
            u[l + 33] = i.origin[0], u[l + 34] = i.origin[1], u[l + 35] = i.origin[2], t = 0; 4 > t; ++t) u[l + 3] = i.color[0], 
            u[l + 4] = i.color[1], u[l + 5] = i.color[2], u[l + 6] = i.color[3], u[l + 7] = s[t].x, 
            u[l + 8] = s[t].y, u[l + 9] = s[t].z * i.size[0], u[l + 10] = s[t].w * i.size[1], 
            l += 11;
            r.numParticles++;
        }
        r.vb ? (n.bindBuffer(n.ARRAY_BUFFER, r.vb), n.bufferSubData(n.ARRAY_BUFFER, 0, r.vbData)) :(r.vb = n.createBuffer(), 
        n.bindBuffer(n.ARRAY_BUFFER, r.vb), n.bufferData(n.ARRAY_BUFFER, r.vbData, n.DYNAMIC_DRAW));
    },
    draw:function() {
        var e, t = this, r = t.model.renderer.context;
        if (0 != t.numParticles && (t.shaderReady || t.initShader(), t.program)) {
            if (!t.texture && t.textureId > -1 && t.textureId < t.model.materials.length) {
                var n = t.model.materials[t.textureId];
                n.texture && n.texture.texture && (!n.texture.alphaImg || n.texture.alphaTexture) && (t.texture = n.texture);
            }
            if (t.texture) {
                r.useProgram(t.program), r.uniformMatrix4fv(t.uniforms.vModelMatrix, !1, t.model.matrix), 
                r.uniformMatrix4fv(t.uniforms.vViewMatrix, !1, t.model.renderer.viewMatrix), r.uniformMatrix4fv(t.uniforms.vProjMatrix, !1, t.model.renderer.projMatrix), 
                r.uniform1i(t.uniforms.fBlendMode, t.blendMode), t.texture && (r.activeTexture(r.TEXTURE0), 
                r.bindTexture(r.TEXTURE_2D, t.texture.texture), r.uniform1i(t.uniforms.fTexture, 0)), 
                t.texture && t.texture.alphaTexture && (r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, t.texture.alphaTexture), 
                r.uniform1i(t.uniforms.fAlpha, 1)), r.uniform1i(t.uniforms.fHasTexture, t.texture ? 1 :0), 
                r.uniform1i(t.uniforms.fHasAlpha, t.texture && t.texture.alphaTexture ? 1 :0);
                var o = t.blendMode;
                0 == o || 1 == o ? r.blendFunc(r.ONE, r.ZERO) :2 == o ? r.blendFunc(r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA) :3 == o ? r.blendFunc(r.SRC_COLOR, r.ONE) :4 == o ? r.blendFunc(r.SRC_ALPHA, r.ONE) :5 == o || 6 == o ? r.blendFunc(r.DST_COLOR, r.SRC_COLOR) :r.blendFunc(r.ONE, r.ONE_MINUS_SRC_ALPHA), 
                r.disable(r.CULL_FACE), r.depthMask(!1), r.bindBuffer(r.ARRAY_BUFFER, t.vb), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, t.ib);
                for (e in t.attribs) {
                    var a = t.attribs[e];
                    r.enableVertexAttribArray(a.loc), r.vertexAttribPointer(a.loc, a.size, a.type, !1, a.stride, a.offset);
                }
                r.drawElements(r.TRIANGLES, 6 * t.numParticles, r.UNSIGNED_SHORT, 0);
                for (e in t.attribs) r.disableVertexAttribArray(t.attribs[e].loc);
            }
        }
    },
    initShader:function() {
        var e = this, t = e.model.renderer.context;
        e.shaderReady = !0;
        var r = e.model.renderer.compileShader(t.VERTEX_SHADER, e.vertShader), n = e.model.renderer.compileShader(t.FRAGMENT_SHADER, e.fragShader), o = t.createProgram();
        return t.attachShader(o, r), t.attachShader(o, n), t.linkProgram(o), t.getProgramParameter(o, t.LINK_STATUS) ? (e.vs = r, 
        e.fs = n, e.program = o, e.uniforms = {
            vModelMatrix:t.getUniformLocation(o, "uModelMatrix"),
            vViewMatrix:t.getUniformLocation(o, "uViewMatrix"),
            vProjMatrix:t.getUniformLocation(o, "uProjMatrix"),
            fHasTexture:t.getUniformLocation(o, "uHasTexture"),
            fHasAlpha:t.getUniformLocation(o, "uHasAlpha"),
            fBlendMode:t.getUniformLocation(o, "uBlendMode"),
            fTexture:t.getUniformLocation(o, "uTexture"),
            fAlpha:t.getUniformLocation(o, "uAlpha")
        }, void (e.attribs = {
            position:{
                loc:t.getAttribLocation(o, "aPosition"),
                type:t.FLOAT,
                size:3,
                offset:0,
                stride:44
            },
            normal:{
                loc:t.getAttribLocation(o, "aColor"),
                type:t.FLOAT,
                size:4,
                offset:12,
                stride:44
            },
            texcoord:{
                loc:t.getAttribLocation(o, "aTexCoord"),
                type:t.FLOAT,
                size:4,
                offset:28,
                stride:44
            }
        })) :void console.error("Error linking shaders");
    },
    vertShader:"        attribute vec3 aPosition;        attribute vec4 aColor;        attribute vec4 aTexCoord;                varying vec4 vColor;        varying vec2 vTexCoord;                uniform mat4 uModelMatrix;        uniform mat4 uViewMatrix;        uniform mat4 uProjMatrix;                void main(void) {            vec4 pos = uViewMatrix * uModelMatrix * vec4(aPosition, 1);            pos.xy += aTexCoord.zw;            gl_Position = uProjMatrix * pos;                        vTexCoord = aTexCoord.xy;            vColor = aColor;        }    ",
    fragShader:"        precision mediump float;                varying vec4 vColor;        varying vec2 vTexCoord;                uniform bool uHasTexture;        uniform bool uHasAlpha;        uniform int uBlendMode;        uniform sampler2D uTexture;        uniform sampler2D uAlpha;                void main(void) {            vec4 color = vec4(1, 1, 1, 1);            if (uHasTexture) {                color = texture2D(uTexture, vTexCoord.st);            }            if ((uBlendMode == 1 || uBlendMode == 2 || uBlendMode == 4) && uHasAlpha) {                color.a = texture2D(uAlpha, vTexCoord.st).r;            }                        color *= vColor;                        if (uBlendMode == 1) {                if (color.a < 0.7) { discard; }            }                        gl_FragColor = color;        }    ",
    update:function(e, t, r) {
        var n, o, a, i = this, s = ModelViewer.Wow, l = s.AnimatedFloat.getValue(i.gravity, e, t), u = s.AnimatedFloat.getValue(i.gravity2, e, t);
        if (1 == i.emitterType || 2 == i.emitterType) {
            var d = s.AnimatedFloat.getValue(i.emissionRate, e, t), c = s.AnimatedFloat.getValue(i.lifespan, e, t), m = 0;
            if (m = 0 != c ? r * d / c + i.spawnRemainder :i.spawnRemainder, 1 > m) i.spawnRemainder = m, 
            i.spawnRemainder < 0 && (i.spawnRemainder = 0); else {
                var f = Math.min(Math.floor(m), i.nextParticle + 1);
                i.spawnRemainder = m - f;
                var h = !0;
                if (s.Animated.isUsed(i.enabled, e) && (h = 0 != s.AnimatedUint8.getValue(i.enabled, e, t)), 
                h && f > 0) {
                    var p = .5 * s.AnimatedFloat.getValue(i.areaWidth, e, t), g = .5 * s.AnimatedFloat.getValue(i.areaLength, e, t);
                    n = s.AnimatedFloat.getValue(i.emissionSpeed, e, t);
                    var w = s.AnimatedFloat.getValue(i.speedVariation, e, t);
                    if (1 == i.emitterType) for (o = 0; f > o; ++o) i.spawnPlaneParticle(p, g, n, w, c); else {
                        var v = s.AnimatedFloat.getValue(i.verticalRange, e, t), x = s.AnimatedFloat.getValue(i.horizontalRange, e, t);
                        for (o = 0; f > o; ++o) i.spawnSphereParticle(p, g, n, w, v, x);
                    }
                }
            }
            isNaN(i.spawnRemainder) && (i.spawnRemainder = 0);
        }
        n = 1;
        var M, b, A, y, T, V, I, U = l * r, E = u * r, S = n * r;
        for (T = i.size.data[0], i.size.data.length > 2 ? (V = i.size.data[1], I = i.size.data[2]) :i.size.data.length > 1 ? (V = i.size.data[1], 
        I = V) :I = V = T, o = 0; o < i.maxParticles; ++o) if (M = i.particles[o], M && 0 != M.maxLife) if (M.life += r, 
        b = M.life / M.maxLife, b >= 1) M.maxLife = 0, i.nextParticle++, i.unusedParticles[i.nextParticle] = M.index; else {
            for (vec3.scaleAndAdd(M.speed, M.speed, M.down, U), vec3.scaleAndAdd(M.speed, M.speed, M.direction, -E), 
            i.slowdown > 0 && (n = Math.exp(-1 * i.slowdown * M.life), S = n * r), vec3.scaleAndAdd(M.position, M.position, M.speed, S), 
            .5 >= b ? vec2.lerp(M.size, T, V, b / .5) :vec2.lerp(M.size, V, I, (b - .5) / .5), 
            vec2.multiply(M.size, M.size, i.scale), A = Math.min(3, i.color.data.length), a = 0; A > a; ++a) y = i.color.data[a], 
            vec4.set(i.tmpColors[a], y[0] / 255, y[1] / 255, y[2] / 255, i.alpha.data[a] / 32767);
            if (3 > A) for (y = i.color.data[A - 1], a = A; 3 > a; ++a) vec4.set(i.tmpColors[a], y[0] / 255, y[1] / 255, y[2] / 255, i.alpha.data[a] / 32767);
            .5 >= b ? vec4.lerp(M.color, i.tmpColors[0], i.tmpColors[1], b / .5) :vec4.lerp(M.color, i.tmpColors[1], i.tmpColors[2], (b - .5) / .5);
        }
        i.updateBuffers();
    },
    getNextParticle:function() {
        var e = this;
        if (e.nextParticle < 0) return null;
        var t = e.unusedParticles[e.nextParticle];
        return e.particles[t] || (e.particles[t] = {
            index:t,
            position:vec3.create(),
            origin:vec3.create(),
            speed:vec4.create(),
            direction:vec4.create(),
            down:vec3.create(),
            color:vec4.create(),
            size:vec2.create(),
            life:0,
            maxLife:0,
            tile:0
        }), e.nextParticle--, e.particles[t];
    },
    spawnPlaneParticle:function(e, t, r, n, o) {
        var a = this, i = a.getNextParticle();
        if (!i) return null;
        vec3.copy(i.position, a.position), i.position[0] += -e / 2 + e * Math.random(), 
        i.position[1] += -t / 2 + t * Math.random(), vec3.transformMat4(i.position, i.position, a.bone.matrix), 
        vec4.set(i.direction, 0, 0, 1, 0), vec4.transformMat4(i.direction, i.direction, a.bone.matrix), 
        vec3.normalize(i.direction, i.direction), vec4.copy(i.speed, i.direction);
        var s = r - r * n, l = r + r * n;
        return vec4.scale(i.speed, i.speed, s + (l - s) * Math.random()), vec3.set(i.down, 0, 0, -1), 
        i.life = 0, i.maxLife = o, i.maxLife || (i.maxLife = 1), vec3.copy(i.origin, i.position), 
        i.tile = Math.floor(Math.random() * a.tileRows * a.tileColumns), vec4.set(i.color, 1, 1, 1, 1), 
        i;
    },
    spawnSphereParticle:function(e, t, r, n, o, a, i) {
        var s = this, l = s.getNextParticle();
        if (!l) return null;
        var u = Math.random(), d = 0;
        return d = 0 == o ? 2 * Math.random() * Math.PI - Math.PI :2 * Math.random() * o - o, 
        s.calcSpread(2 * o, 2 * o, e, t), 57 == (57 & s.flags) || 313 == (313 & s.flags) ? (vec3.copy(l.position, s.position), 
        vec4.set(l.direction, 1.6 * e * Math.cos(d), 1.6 * t * Math.sin(d), 0, 0), vec3.add(l.position, l.position, l.direction), 
        vec3.transformMat4(l.position, l.position, s.bone.matrix), 0 == vec3.squaredLength(l.direction) ? vec4.set(l.speed, 0, 0, 0, 0) :(vec4.transformMat4(l.direction, l.direction, s.bone.matrix), 
        vec3.normalize(l.direction, l.direction), vec3.copy(l.speed, l.direction), vec3.scale(l.speed, l.speed, r * (1 + 2 * Math.random() * n - n)))) :(vec4.set(l.direction, 0, 0, 1, 0), 
        vec4.transformMat4(l.direction, l.direction, s.spreadMat), vec3.scale(l.direction, l.direction, u), 
        vec3.copy(l.position, s.position), vec3.add(l.position, l.position, l.direction), 
        vec3.transformMat4(l.position, l.position, s.bone.matrix), 0 == vec3.squaredLength(l.direction) && 0 == (256 & s.flags) ? (vec4.set(l.speed, 0, 0, 0, 0), 
        vec4.set(l.direction, 0, 0, 1, 0), vec4.transformMat4(l.direction, l.direction, s.bone.matrix), 
        vec3.normalize(l.direction, l.direction)) :((256 & s.flags) > 0 && (vec4.set(l.direction, 0, 0, 1, 0), 
        vec4.transformMat4(l.direction, l.direction, s.bone.matrix)), vec3.normalize(l.direction, l.direction), 
        vec4.copy(l.speed, l.direction), vec3.scale(l.speed, l.speed, r * (1 + 2 * Math.random() * n - n)))), 
        vec3.set(l.down, 0, 0, -1), l.life = 0, l.maxLife = i, l.maxLife || (l.maxLife = 1), 
        vec3.copy(l.origin, l.position), l.tile = Math.floor(Math.random() * s.tileRows * s.tileColumns), 
        vec4.set(l.color, 1, 1, 1, 1), l;
    },
    calcSpread:function(e, t, r, n) {
        var o = this, a = this.spreadMat, i = this.tmpMat, s = (Math.random() * 2 * e - e) / 2, l = (Math.random() * 2 * t - t) / 2, u = Math.cos(s), d = Math.cos(l), c = Math.sin(s), m = Math.sin(l);
        mat4.identity(a), mat4.identity(i), i[5] = i[10] = u, i[9] = c, i[6] = -c, mat4.multiply(a, a, i), 
        mat4.identity(i), i[0] = i[10] = d, i[2] = m, i[8] = -m, mat4.multiply(a, a, i);
        var f = Math.abs(u) * n * Math.abs(c) * r;
        return a[0] *= f, a[1] *= f, a[2] *= f, a[4] *= f, a[5] *= f, a[6] *= f, a[8] *= f, 
        a[9] *= f, a[10] *= f, mat4.multiply(a, o.bone.matrix, a), a;
    },
    init:function() {
        var e = this;
        519 == e.scale.z && (e.scale.z = 1.5);
        var t = e.tileRows * e.tileColumns;
        e.textureCoords = new Array(t);
        var r, n, o, a = {
            x:0,
            y:0
        }, i = {
            x:0,
            y:0
        };
        for (r = 0; t > r; ++r) n = r % e.tileColumns, o = Math.floor(r / e.tileColumns), 
        a.x = n * (1 / e.tileColumns), i.x = (n + 1) * (1 / e.tileColumns), a.y = o * (1 / e.tileRows), 
        i.y = (o + 1) * (1 / e.tileRows), e.textureCoords[r] = [ {
            x:a.x,
            y:a.y,
            z:-1,
            w:1
        }, {
            x:i.x,
            y:a.y,
            z:1,
            w:1
        }, {
            x:a.x,
            y:i.y,
            z:-1,
            w:-1
        }, {
            x:i.x,
            y:i.y,
            z:1,
            w:-1
        } ];
    }
}, ModelViewer.Wow.RibbonEmitter = function(e, t) {
    var r, n = this, o = ModelViewer.Wow;
    n.model = e, n.id = t.getInt32(), n.boneId = t.getInt32(), n.position = [ t.getFloat(), t.getFloat(), t.getFloat() ], 
    n.resolution = t.getFloat(), n.length = t.getFloat(), n.emissionAngle = t.getFloat(), 
    n.s1 = t.getInt16(), n.s2 = t.getInt16();
    var a = t.getInt32();
    if (a > 0) for (n.textureIds = new Array(a), r = 0; a > r; ++r) n.textureIds[r] = t.getInt32();
    for (n.color = o.AnimatedVec3.readSet(t), n.alpha = o.AnimatedUint16.readSet(t), 
    n.above = o.AnimatedFloat.readSet(t), n.below = o.AnimatedFloat.readSet(t), n.bone = n.model.bones[n.boneId], 
    n.maxSegments = 50, n.segments = new Array(n.maxSegments), r = 0; r < n.maxSegments; ++r) n.segments[r] = {
        position:vec3.create(),
        start:vec3.create(),
        up:vec4.create(),
        length:0
    };
    n.currentSegment = 0, n.numSegments = 0, n.totalLength = n.resolution / n.length, 
    n.currentPosition = vec3.clone(n.position), n.currentColor = vec4.create(), n.currentAbove = 0, 
    n.currentBelow = 0, n.currentLength = 0, n.tmpPosition = vec3.create(), n.tmpUp = vec4.create(), 
    n.tmpVec = vec4.create();
}, ModelViewer.Wow.RibbonEmitter.prototype = {
    destroy:function() {
        var e = this, t = e.model.renderer.context, r = ModelViewer.Wow.Animated;
        e.program && t.deleteProgram(e.program), e.vs && t.deleteShader(e.vs), e.fs && t.deleteShader(e.fs), 
        e.vb && t.deleteBuffer(e.vb), e.ib && t.deleteBuffer(e.ib), e.program = null, e.vs = null, 
        e.fs = null, e.vb = null, e.ib = null, e.vbData = null, e.uniforms = null, e.attribs = null, 
        e.texture = null, e.model = null, e.bone = null, e.position = null, e.textureIds = null;
        for (var n = 0; n < e.maxSegments; ++n) e.segments[n].position = null, e.segments[n].start = null, 
        e.segments[n].up = null, e.segments[n] = null;
        e.segments = null, e.currentPosition = null, e.currentColor = null, e.tmpPosition = null, 
        e.tmpUp = null, e.tmpVec = null, e.color = r.destroySet(e.color), e.alpha = r.destroySet(e.alpha), 
        e.above = r.destroySet(e.above), e.below = r.destroySet(e.below);
    },
    updateBuffers:function() {
        var e, t = this, r = t.model.renderer.context;
        if (!t.vbData) {
            t.vbData = new Float32Array(5 * (2 * t.maxSegments + 2));
            var n = new Uint16Array(6 * t.maxSegments), o = 0;
            for (e = 0; e < t.maxSegments; ++e) n[6 * e + 0] = o, n[6 * e + 1] = o + 1, n[6 * e + 2] = o + 2, 
            n[6 * e + 3] = o + 2, n[6 * e + 4] = o + 1, n[6 * e + 5] = o + 3, o += 2;
            t.ib = r.createBuffer(), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, t.ib), r.bufferData(r.ELEMENT_ARRAY_BUFFER, n, r.STATIC_DRAW);
        }
        if (0 != t.numSegments) {
            var a, i, s = t.segments[t.currentSegment], l = 0, u = 0, d = t.vbData, c = t.currentAbove, m = t.currentBelow;
            for (d[l] = s.start[0] + s.up[0] * c, d[l + 1] = s.start[1] + s.up[1] * c, d[l + 2] = s.start[2] + s.up[2] * c, 
            d[l + 3] = 1, d[l + 4] = 0, l += 5, d[l] = s.start[0] - s.up[0] * m, d[l + 1] = s.start[1] - s.up[1] * m, 
            d[l + 2] = s.start[2] - s.up[2] * m, d[l + 3] = 1, d[l + 4] = 1, l += 5, e = 0; e < t.numSegments; ++e) s = t.segments[(t.currentSegment + e) % t.maxSegments], 
            a = 1 - (0 != t.currentLength ? u / t.currentLength :0), i = 1 - (0 != t.currentLength ? (u + s.length) / t.currentLength :1), 
            d[l] = s.position[0] + s.up[0] * c, d[l + 1] = s.position[1] + s.up[1] * c, d[l + 2] = s.position[2] + s.up[2] * c, 
            d[l + 3] = i, d[l + 4] = 0, l += 5, d[l] = s.position[0] - s.up[0] * m, d[l + 1] = s.position[1] - s.up[1] * m, 
            d[l + 2] = s.position[2] - s.up[2] * m, d[l + 3] = i, d[l + 4] = 1, l += 5, u += s.length;
            t.vb ? (r.bindBuffer(r.ARRAY_BUFFER, t.vb), r.bufferSubData(r.ARRAY_BUFFER, 0, t.vbData)) :(t.vb = r.createBuffer(), 
            r.bindBuffer(r.ARRAY_BUFFER, t.vb), r.bufferData(r.ARRAY_BUFFER, t.vbData, r.DYNAMIC_DRAW));
        }
    },
    draw:function() {
        var e, t = this, r = t.model.renderer.context;
        if (0 != t.numSegments && (t.shaderReady || t.initShader(), t.program)) {
            if (!t.texture && t.textureIds[0] > -1 && t.textureIds[0] < t.model.materials.length) {
                var n = t.model.materials[t.textureIds[0]];
                n.texture && n.texture.texture && (!n.texture.alphaImg || n.texture.alphaTexture) && (t.texture = n.texture);
            }
            if (t.texture) {
                r.useProgram(t.program), r.uniformMatrix4fv(t.uniforms.vModelMatrix, !1, t.model.matrix), 
                r.uniformMatrix4fv(t.uniforms.vViewMatrix, !1, t.model.renderer.viewMatrix), r.uniformMatrix4fv(t.uniforms.vProjMatrix, !1, t.model.renderer.projMatrix), 
                r.uniform4fv(t.uniforms.fColor, t.currentColor), t.texture && (r.activeTexture(r.TEXTURE0), 
                r.bindTexture(r.TEXTURE_2D, t.texture.texture), r.uniform1i(t.uniforms.fTexture, 0)), 
                t.texture && t.texture.alphaTexture && (r.activeTexture(r.TEXTURE1), r.bindTexture(r.TEXTURE_2D, t.texture.alphaTexture), 
                r.uniform1i(t.uniforms.fAlpha, 1)), r.uniform1i(t.uniforms.fHasTexture, t.texture ? 1 :0), 
                r.uniform1i(t.uniforms.fHasAlpha, t.texture && t.texture.alphaTexture ? 1 :0), r.blendFunc(r.SRC_ALPHA, r.ONE), 
                r.disable(r.CULL_FACE), r.depthMask(!1), r.bindBuffer(r.ARRAY_BUFFER, t.vb), r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, t.ib);
                for (e in t.attribs) {
                    var o = t.attribs[e];
                    r.enableVertexAttribArray(o.loc), r.vertexAttribPointer(o.loc, o.size, o.type, !1, o.stride, o.offset);
                }
                r.drawElements(r.TRIANGLES, 6 * t.numSegments, r.UNSIGNED_SHORT, 0);
                for (e in t.attribs) r.disableVertexAttribArray(t.attribs[e].loc);
            }
        }
    },
    initShader:function() {
        var e = this, t = e.model.renderer.context;
        e.shaderReady = !0;
        var r = e.model.renderer.compileShader(t.VERTEX_SHADER, e.vertShader), n = e.model.renderer.compileShader(t.FRAGMENT_SHADER, e.fragShader), o = t.createProgram();
        return t.attachShader(o, r), t.attachShader(o, n), t.linkProgram(o), t.getProgramParameter(o, t.LINK_STATUS) ? (e.vs = r, 
        e.fs = n, e.program = o, e.uniforms = {
            vModelMatrix:t.getUniformLocation(o, "uModelMatrix"),
            vViewMatrix:t.getUniformLocation(o, "uViewMatrix"),
            vProjMatrix:t.getUniformLocation(o, "uProjMatrix"),
            fHasTexture:t.getUniformLocation(o, "uHasTexture"),
            fHasAlpha:t.getUniformLocation(o, "uHasAlpha"),
            fTexture:t.getUniformLocation(o, "uTexture"),
            fAlpha:t.getUniformLocation(o, "uAlpha"),
            fColor:t.getUniformLocation(o, "uColor")
        }, void (e.attribs = {
            position:{
                loc:t.getAttribLocation(o, "aPosition"),
                type:t.FLOAT,
                size:3,
                offset:0,
                stride:20
            },
            texcoord:{
                loc:t.getAttribLocation(o, "aTexCoord"),
                type:t.FLOAT,
                size:2,
                offset:12,
                stride:20
            }
        })) :void console.error("Error linking shaders");
    },
    vertShader:"        attribute vec3 aPosition;        attribute vec2 aTexCoord;                varying vec2 vTexCoord;                uniform mat4 uModelMatrix;        uniform mat4 uViewMatrix;        uniform mat4 uProjMatrix;                void main(void) {            gl_Position = uProjMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1);                        vTexCoord = aTexCoord;        }    ",
    fragShader:"        precision mediump float;                varying vec2 vTexCoord;                uniform bool uHasTexture;        uniform bool uHasAlpha;        uniform sampler2D uTexture;        uniform sampler2D uAlpha;        uniform vec4 uColor;                void main(void) {            vec4 color = vec4(1, 1, 1, 1);            if (uHasTexture) {                color = texture2D(uTexture, vTexCoord.st);            }            if (uHasAlpha) {                color.a = texture2D(uAlpha, vTexCoord.st).r;            }                        gl_FragColor = color * uColor;        }    ",
    update:function(e, t) {
        var r, n, o = this, a = ModelViewer.Wow;
        if (vec3.transformMat4(o.tmpPosition, o.position, o.bone.matrix), vec4.set(o.tmpUp, 0, 0, 1, 0), 
        vec4.transformMat4(o.tmpUp, o.tmpUp, o.bone.matrix), vec3.normalize(o.tmpUp, o.tmpUp), 
        0 == o.numSegments) n = o.pushSegment(), vec3.copy(n.start, o.tmpPosition), vec3.copy(n.position, o.tmpPosition), 
        vec4.copy(n.up, o.tmpUp), n.length = 0; else {
            var i = (o.currentSegment + o.numSegments - 1) % o.maxSegments;
            n = o.segments[i], vec3.copy(n.position, o.tmpPosition), vec4.copy(n.up, o.tmpUp), 
            vec3.subtract(o.tmpVec, n.position, o.currentPosition), n.length += vec3.length(o.tmpVec), 
            n.length >= o.length && (n = o.pushSegment(), vec3.copy(n.start, o.tmpPosition), 
            vec3.copy(n.position, o.tmpPosition), vec4.copy(n.up, o.tmpUp), n.length = 0);
        }
        o.currentLength = 0;
        var s;
        for (r = 0; r < o.numSegments; ++r) s = (o.currentSegment + r) % o.maxSegments, 
        o.currentLength += o.segments[s].length;
        o.currentLength > o.totalLength + .1 && (o.currentLength -= o.segments[o.currentSegment].length, 
        o.shiftSegment()), vec3.copy(o.currentPosition, o.tmpPosition), a.AnimatedVec3.getValue(o.color, e, t, o.currentColor), 
        o.currentColor[3] = a.AnimatedUint16.getValue(o.alpha, e, t) / 32767, o.currentAbove = a.AnimatedFloat.getValue(o.above, e, t), 
        o.currentBelow = a.AnimatedFloat.getValue(o.below, e, t), o.updateBuffers();
    },
    pushSegment:function() {
        var e = this;
        return e.numSegments < e.maxSegments ? e.numSegments++ :e.currentSegment = (e.currentSegment + 1) % e.maxSegments, 
        e.segments[e.currentSegment];
    },
    popSegment:function() {
        var e = this;
        e.numSegments--;
    },
    shiftSegment:function() {
        var e = this;
        e.currentSegment = (e.currentSegment + 1) % e.maxSegments, e.numSegments--;
    }
}, ModelViewer.Wow.Skin = function(e, t) {
    var r = this;
    r.skinFlags = t > 2e3 ? e.getUint32() :0, r.base = e.getUint32(), r.fur = e.getUint32(), 
    r.underwearFlags = t > 2e3 ? e.getUint32() :0, r.panties = e.getUint32(), r.bra = e.getUint32(), 
    r.faces = null;
}, ModelViewer.Wow.Skin._lastFaces = null, ModelViewer.Wow.Skin.GetSkins = function(e, t, r) {
    if (!e) return [];
    for (var n = [], o = 0; o < e.length; ++o) t && (3 & e[o].skinFlags) > 0 ? (4 & e[o].skinFlags) > 0 ? r && n.push(e[o]) :n.push(e[o]) :t && 0 != e[o].skinFlags || n.push(e[o]);
    return n;
}, ModelViewer.Wow.Skin.GetFaces = function(e, t, r, n) {
    if (!e || r && (4 & n) > 0) return [];
    for (var o = [], a = 0; a < e.length; ++a) t && (3 & e[a].flags) > 0 ? (4 & e[a].flags) > 0 ? r && o.push(e[a]) :o.push(e[a]) :t && 0 != e[a].flags || o.push(e[a]);
    return o;
}, ModelViewer.Wow.Skin.prototype = {
    destroy:function() {
        var e = this;
        if (e.faces) {
            for (var t = 0; t < e.faces.length; ++t) e.faces[t] = null;
            e.faces = null;
        }
    },
    readFaces:function(e, t) {
        var r = this, n = e.getInt32();
        if (0 == n && ModelViewer.Wow.Skin._lastFaces) r.faces = ModelViewer.Wow.Skin._lastFaces; else if (n > 0) {
            r.faces = new Array(n);
            for (var o = 0; n > o; ++o) r.faces[o] = {
                flags:t > 2e3 ? e.getUint32() :0,
                lower:e.getUint32(),
                upper:e.getUint32()
            }, ModelViewer.Wow.Skin._lastFaces = r.faces[o];
        }
    }
}, ModelViewer.Wow.Face = function(e) {
    var t = this;
    t.geoset1 = e.getInt32(), t.geoset2 = e.getInt32(), t.geoset3 = e.getInt32(), t.textures = null;
}, ModelViewer.Wow.Face.GetTextures = function(e, t, r) {
    if (!e) return [];
    for (var n = [], o = 0; o < e.length; ++o) t && (3 & e[o].flags) > 0 ? (4 & e[o].flags) > 0 ? r && n.push(e[o]) :n.push(e[o]) :t && 0 != e[o].flags || n.push(e[o]);
    return n;
}, ModelViewer.Wow.Face.prototype = {
    destroy:function() {
        var e = this;
        if (e.textures) {
            for (var t = 0; t < e.textures.length; ++t) e.textures[t] = null;
            e.textures = null;
        }
    },
    readTextures:function(e, t) {
        var r = this, n = e.getInt32();
        if (n > 0) {
            r.textures = new Array(n);
            for (var o = 0; n > o; ++o) r.textures[o] = {
                flags:t > 2e3 ? e.getUint32() :0,
                lower:e.getUint32(),
                upper:e.getUint32()
            };
        }
    }
}, ModelViewer.Wow.Hair = function(e) {
    var t = this;
    t.geoset = e.getUint8(), t.textures = null;
}, ModelViewer.Wow.Hair.GetTextures = function(e, t, r) {
    if (!e) return [];
    for (var n = [], o = 0; o < e.length; ++o) 0 != e[o].flags && (t && (3 & e[o].flags) > 0 ? (4 & e[o].flags) > 0 ? r && n.push(e[o]) :n.push(e[o]) :t && 0 != e[o].flags || n.push(e[o]));
    return n;
}, ModelViewer.Wow.Hair.prototype = {
    destroy:function() {
        var e = this;
        if (e.textures) {
            for (var t = 0; t < e.textures.length; ++t) e.textures[t] = null;
            e.textures = null;
        }
    },
    readTextures:function(e, t) {
        var r = this, n = e.getInt32();
        if (n > 0) {
            r.textures = new Array(n);
            for (var o = 0; n > o; ++o) r.textures[o] = {
                flags:t > 2e3 ? e.getUint32() :0,
                texture:e.getUint32(),
                lower:e.getUint32(),
                upper:e.getUint32()
            }, r.textures[o].upper > 0 && r.textures[o].lower > 0;
        }
    }
}, ModelViewer.Wow.Horns = function(e) {
    this.geoset = e.getUint8();
}, ModelViewer.Wow.Horns.prototype = {
    destroy:function() {
        this.geoset = null;
    }
}, ModelViewer.Wow.Blindfolds = function(e) {
    this.geoset = e.getUint8(), this.geoset = null;
}, ModelViewer.Wow.Blindfolds.prototype = {
    destroy:function() {}
}, ModelViewer.Wow.ColoredHands = function(e) {
    this.colorIndex = e.getUint8();
}, ModelViewer.Wow.ColoredHands.prototype = {
    destroy:function() {
        this.colorIndex = null;
    }
}, ModelViewer.Wow.Tattoos = function(e) {
    this.texture = e.getInt32();
}, ModelViewer.Wow.Tattoos.prototype = {
    destroy:function() {
        this.texture = null;
    }
}, ModelViewer.Wow.HornModel = function(e, t, r, n, o) {
    var a = this;
    a.model = e, a.slot = t, a.uniqueSlot = ModelViewer.Wow.UniqueSlots[t], a.sortValue = ModelViewer.Wow.SlotOrder[t], 
    a.models = null, a.geosets = null, a.textures = null, a.geoA = 0, a.geoB = 0, a.geoC = 0, 
    a.loaded = !1, r && a.load(r, n, o);
}, ModelViewer.Wow.HornModel.prototype = {
    destroy:function() {
        var e, t = this;
        if (t.model = null, t.models) {
            for (e = 0; e < t.models.length; ++e) t.models[e].model && t.models[e].model.destroy(), 
            t.models[e].model = null, t.models[e].attachment = null, t.models[e] = null;
            t.models = null;
        }
        if (t.textures) {
            for (e = 0; e < t.textures; ++e) t.textures[e].texture && t.textures[e].texture.destroy(), 
            t.textures[e].texture = null, t.textures[e] = null;
            t.textures = null;
        }
        t.geosets = null;
    },
    load:function(e, t, r) {
        var n = this, o = ModelViewer.Wow;
        n.id = e, n.meta = {}, n.models = new Array(3);
        var a = {
            0:6,
            1:1,
            2:1,
            3:10
        };
        if (n.models) {
            for (var i = 0; i < n.models.length; ++i) {
                n.models[i] = {
                    race:t,
                    gender:r,
                    bone:-1,
                    attachment:null,
                    model:null
                };
                var s = {
                    type:256,
                    id:n.id,
                    parent:n.model
                };
                s.shoulder = i + 1, n.models[i].model = new o.Model(n.model.renderer, n.model.viewer, s, i), 
                n.models[i].slot = a[i];
            }
            n.loaded = !0;
        }
    }
};
