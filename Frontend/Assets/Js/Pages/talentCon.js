/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURL=jquery-1.10.2.min.map
*/
(function (e, t) {
    var n, r, i = typeof t, o = e.location, a = e.document, s = a.documentElement, l = e.jQuery, u = e.$, c = {}, p = [], f = "1.10.2", d = p.concat, h = p.push, g = p.slice, m = p.indexOf, y = c.toString, v = c.hasOwnProperty, b = f.trim, x = function (e, t) { return new x.fn.init(e, t, r) }, w = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, T = /\S+/g, C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, N = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, k = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, E = /^[\],:{}\s]*$/, S = /(?:^|:|,)(?:\s*\[)+/g, A = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, j = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, D = /^-ms-/, L = /-([\da-z])/gi, H = function (e, t) { return t.toUpperCase() }, q = function (e) { (a.addEventListener || "load" === e.type || "complete" === a.readyState) && (_(), x.ready()) }, _ = function () { a.addEventListener ? (a.removeEventListener("DOMContentLoaded", q, !1), e.removeEventListener("load", q, !1)) : (a.detachEvent("onreadystatechange", q), e.detachEvent("onload", q)) }; x.fn = x.prototype = { jquery: f, constructor: x, init: function (e, n, r) { var i, o; if (!e) return this; if ("string" == typeof e) { if (i = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : N.exec(e), !i || !i[1] && n) return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e); if (i[1]) { if (n = n instanceof x ? n[0] : n, x.merge(this, x.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : a, !0)), k.test(i[1]) && x.isPlainObject(n)) for (i in n) x.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]); return this } if (o = a.getElementById(i[2]), o && o.parentNode) { if (o.id !== i[2]) return r.find(e); this.length = 1, this[0] = o } return this.context = a, this.selector = e, this } return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : x.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), x.makeArray(e, this)) }, selector: "", length: 0, toArray: function () { return g.call(this) }, get: function (e) { return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e] }, pushStack: function (e) { var t = x.merge(this.constructor(), e); return t.prevObject = this, t.context = this.context, t }, each: function (e, t) { return x.each(this, e, t) }, ready: function (e) { return x.ready.promise().done(e), this }, slice: function () { return this.pushStack(g.apply(this, arguments)) }, first: function () { return this.eq(0) }, last: function () { return this.eq(-1) }, eq: function (e) { var t = this.length, n = +e + (0 > e ? t : 0); return this.pushStack(n >= 0 && t > n ? [this[n]] : []) }, map: function (e) { return this.pushStack(x.map(this, function (t, n) { return e.call(t, n, t) })) }, end: function () { return this.prevObject || this.constructor(null) }, push: h, sort: [].sort, splice: [].splice }, x.fn.init.prototype = x.fn, x.extend = x.fn.extend = function () { var e, n, r, i, o, a, s = arguments[0] || {}, l = 1, u = arguments.length, c = !1; for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, l = 2), "object" == typeof s || x.isFunction(s) || (s = {}), u === l && (s = this, --l) ; u > l; l++) if (null != (o = arguments[l])) for (i in o) e = s[i], r = o[i], s !== r && (c && r && (x.isPlainObject(r) || (n = x.isArray(r))) ? (n ? (n = !1, a = e && x.isArray(e) ? e : []) : a = e && x.isPlainObject(e) ? e : {}, s[i] = x.extend(c, a, r)) : r !== t && (s[i] = r)); return s }, x.extend({ expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""), noConflict: function (t) { return e.$ === x && (e.$ = u), t && e.jQuery === x && (e.jQuery = l), x }, isReady: !1, readyWait: 1, holdReady: function (e) { e ? x.readyWait++ : x.ready(!0) }, ready: function (e) { if (e === !0 ? !--x.readyWait : !x.isReady) { if (!a.body) return setTimeout(x.ready); x.isReady = !0, e !== !0 && --x.readyWait > 0 || (n.resolveWith(a, [x]), x.fn.trigger && x(a).trigger("ready").off("ready")) } }, isFunction: function (e) { return "function" === x.type(e) }, isArray: Array.isArray || function (e) { return "array" === x.type(e) }, isWindow: function (e) { return null != e && e == e.window }, isNumeric: function (e) { return !isNaN(parseFloat(e)) && isFinite(e) }, type: function (e) { return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? c[y.call(e)] || "object" : typeof e }, isPlainObject: function (e) { var n; if (!e || "object" !== x.type(e) || e.nodeType || x.isWindow(e)) return !1; try { if (e.constructor && !v.call(e, "constructor") && !v.call(e.constructor.prototype, "isPrototypeOf")) return !1 } catch (r) { return !1 } if (x.support.ownLast) for (n in e) return v.call(e, n); for (n in e); return n === t || v.call(e, n) }, isEmptyObject: function (e) { var t; for (t in e) return !1; return !0 }, error: function (e) { throw Error(e) }, parseHTML: function (e, t, n) { if (!e || "string" != typeof e) return null; "boolean" == typeof t && (n = t, t = !1), t = t || a; var r = k.exec(e), i = !n && []; return r ? [t.createElement(r[1])] : (r = x.buildFragment([e], t, i), i && x(i).remove(), x.merge([], r.childNodes)) }, parseJSON: function (n) { return e.JSON && e.JSON.parse ? e.JSON.parse(n) : null === n ? n : "string" == typeof n && (n = x.trim(n), n && E.test(n.replace(A, "@").replace(j, "]").replace(S, ""))) ? Function("return " + n)() : (x.error("Invalid JSON: " + n), t) }, parseXML: function (n) { var r, i; if (!n || "string" != typeof n) return null; try { e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n)) } catch (o) { r = t } return r && r.documentElement && !r.getElementsByTagName("parsererror").length || x.error("Invalid XML: " + n), r }, noop: function () { }, globalEval: function (t) { t && x.trim(t) && (e.execScript || function (t) { e.eval.call(e, t) })(t) }, camelCase: function (e) { return e.replace(D, "ms-").replace(L, H) }, nodeName: function (e, t) { return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase() }, each: function (e, t, n) { var r, i = 0, o = e.length, a = M(e); if (n) { if (a) { for (; o > i; i++) if (r = t.apply(e[i], n), r === !1) break } else for (i in e) if (r = t.apply(e[i], n), r === !1) break } else if (a) { for (; o > i; i++) if (r = t.call(e[i], i, e[i]), r === !1) break } else for (i in e) if (r = t.call(e[i], i, e[i]), r === !1) break; return e }, trim: b && !b.call("\ufeff\u00a0") ? function (e) { return null == e ? "" : b.call(e) } : function (e) { return null == e ? "" : (e + "").replace(C, "") }, makeArray: function (e, t) { var n = t || []; return null != e && (M(Object(e)) ? x.merge(n, "string" == typeof e ? [e] : e) : h.call(n, e)), n }, inArray: function (e, t, n) { var r; if (t) { if (m) return m.call(t, e, n); for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++) if (n in t && t[n] === e) return n } return -1 }, merge: function (e, n) { var r = n.length, i = e.length, o = 0; if ("number" == typeof r) for (; r > o; o++) e[i++] = n[o]; else while (n[o] !== t) e[i++] = n[o++]; return e.length = i, e }, grep: function (e, t, n) { var r, i = [], o = 0, a = e.length; for (n = !!n; a > o; o++) r = !!t(e[o], o), n !== r && i.push(e[o]); return i }, map: function (e, t, n) { var r, i = 0, o = e.length, a = M(e), s = []; if (a) for (; o > i; i++) r = t(e[i], i, n), null != r && (s[s.length] = r); else for (i in e) r = t(e[i], i, n), null != r && (s[s.length] = r); return d.apply([], s) }, guid: 1, proxy: function (e, n) { var r, i, o; return "string" == typeof n && (o = e[n], n = e, e = o), x.isFunction(e) ? (r = g.call(arguments, 2), i = function () { return e.apply(n || this, r.concat(g.call(arguments))) }, i.guid = e.guid = e.guid || x.guid++, i) : t }, access: function (e, n, r, i, o, a, s) { var l = 0, u = e.length, c = null == r; if ("object" === x.type(r)) { o = !0; for (l in r) x.access(e, n, l, r[l], !0, a, s) } else if (i !== t && (o = !0, x.isFunction(i) || (s = !0), c && (s ? (n.call(e, i), n = null) : (c = n, n = function (e, t, n) { return c.call(x(e), n) })), n)) for (; u > l; l++) n(e[l], r, s ? i : i.call(e[l], l, n(e[l], r))); return o ? e : c ? n.call(e) : u ? n(e[0], r) : a }, now: function () { return (new Date).getTime() }, swap: function (e, t, n, r) { var i, o, a = {}; for (o in t) a[o] = e.style[o], e.style[o] = t[o]; i = n.apply(e, r || []); for (o in t) e.style[o] = a[o]; return i } }), x.ready.promise = function (t) { if (!n) if (n = x.Deferred(), "complete" === a.readyState) setTimeout(x.ready); else if (a.addEventListener) a.addEventListener("DOMContentLoaded", q, !1), e.addEventListener("load", q, !1); else { a.attachEvent("onreadystatechange", q), e.attachEvent("onload", q); var r = !1; try { r = null == e.frameElement && a.documentElement } catch (i) { } r && r.doScroll && function o() { if (!x.isReady) { try { r.doScroll("left") } catch (e) { return setTimeout(o, 50) } _(), x.ready() } }() } return n.promise(t) }, x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) { c["[object " + t + "]"] = t.toLowerCase() }); function M(e) { var t = e.length, n = x.type(e); return x.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || "function" !== n && (0 === t || "number" == typeof t && t > 0 && t - 1 in e) } r = x(a), function (e, t) { var n, r, i, o, a, s, l, u, c, p, f, d, h, g, m, y, v, b = "sizzle" + -new Date, w = e.document, T = 0, C = 0, N = st(), k = st(), E = st(), S = !1, A = function (e, t) { return e === t ? (S = !0, 0) : 0 }, j = typeof t, D = 1 << 31, L = {}.hasOwnProperty, H = [], q = H.pop, _ = H.push, M = H.push, O = H.slice, F = H.indexOf || function (e) { var t = 0, n = this.length; for (; n > t; t++) if (this[t] === e) return t; return -1 }, B = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", P = "[\\x20\\t\\r\\n\\f]", R = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", W = R.replace("w", "w#"), $ = "\\[" + P + "*(" + R + ")" + P + "*(?:([*^$|!~]?=)" + P + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + W + ")|)|)" + P + "*\\]", I = ":(" + R + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + $.replace(3, 8) + ")*)|.*)\\)|)", z = RegExp("^" + P + "+|((?:^|[^\\\\])(?:\\\\.)*)" + P + "+$", "g"), X = RegExp("^" + P + "*," + P + "*"), U = RegExp("^" + P + "*([>+~]|" + P + ")" + P + "*"), V = RegExp(P + "*[+~]"), Y = RegExp("=" + P + "*([^\\]'\"]*)" + P + "*\\]", "g"), J = RegExp(I), G = RegExp("^" + W + "$"), Q = { ID: RegExp("^#(" + R + ")"), CLASS: RegExp("^\\.(" + R + ")"), TAG: RegExp("^(" + R.replace("w", "w*") + ")"), ATTR: RegExp("^" + $), PSEUDO: RegExp("^" + I), CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + P + "*(even|odd|(([+-]|)(\\d*)n|)" + P + "*(?:([+-]|)" + P + "*(\\d+)|))" + P + "*\\)|)", "i"), bool: RegExp("^(?:" + B + ")$", "i"), needsContext: RegExp("^" + P + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + P + "*((?:-\\d)?\\d*)" + P + "*\\)|)(?=[^-]|$)", "i") }, K = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, et = /^(?:input|select|textarea|button)$/i, tt = /^h\d$/i, nt = /'|\\/g, rt = RegExp("\\\\([\\da-f]{1,6}" + P + "?|(" + P + ")|.)", "ig"), it = function (e, t, n) { var r = "0x" + t - 65536; return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(55296 | r >> 10, 56320 | 1023 & r) }; try { M.apply(H = O.call(w.childNodes), w.childNodes), H[w.childNodes.length].nodeType } catch (ot) { M = { apply: H.length ? function (e, t) { _.apply(e, O.call(t)) } : function (e, t) { var n = e.length, r = 0; while (e[n++] = t[r++]); e.length = n - 1 } } } function at(e, t, n, i) { var o, a, s, l, u, c, d, m, y, x; if ((t ? t.ownerDocument || t : w) !== f && p(t), t = t || f, n = n || [], !e || "string" != typeof e) return n; if (1 !== (l = t.nodeType) && 9 !== l) return []; if (h && !i) { if (o = Z.exec(e)) if (s = o[1]) { if (9 === l) { if (a = t.getElementById(s), !a || !a.parentNode) return n; if (a.id === s) return n.push(a), n } else if (t.ownerDocument && (a = t.ownerDocument.getElementById(s)) && v(t, a) && a.id === s) return n.push(a), n } else { if (o[2]) return M.apply(n, t.getElementsByTagName(e)), n; if ((s = o[3]) && r.getElementsByClassName && t.getElementsByClassName) return M.apply(n, t.getElementsByClassName(s)), n } if (r.qsa && (!g || !g.test(e))) { if (m = d = b, y = t, x = 9 === l && e, 1 === l && "object" !== t.nodeName.toLowerCase()) { c = mt(e), (d = t.getAttribute("id")) ? m = d.replace(nt, "\\$&") : t.setAttribute("id", m), m = "[id='" + m + "'] ", u = c.length; while (u--) c[u] = m + yt(c[u]); y = V.test(e) && t.parentNode || t, x = c.join(",") } if (x) try { return M.apply(n, y.querySelectorAll(x)), n } catch (T) { } finally { d || t.removeAttribute("id") } } } return kt(e.replace(z, "$1"), t, n, i) } function st() { var e = []; function t(n, r) { return e.push(n += " ") > o.cacheLength && delete t[e.shift()], t[n] = r } return t } function lt(e) { return e[b] = !0, e } function ut(e) { var t = f.createElement("div"); try { return !!e(t) } catch (n) { return !1 } finally { t.parentNode && t.parentNode.removeChild(t), t = null } } function ct(e, t) { var n = e.split("|"), r = e.length; while (r--) o.attrHandle[n[r]] = t } function pt(e, t) { var n = t && e, r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || D) - (~e.sourceIndex || D); if (r) return r; if (n) while (n = n.nextSibling) if (n === t) return -1; return e ? 1 : -1 } function ft(e) { return function (t) { var n = t.nodeName.toLowerCase(); return "input" === n && t.type === e } } function dt(e) { return function (t) { var n = t.nodeName.toLowerCase(); return ("input" === n || "button" === n) && t.type === e } } function ht(e) { return lt(function (t) { return t = +t, lt(function (n, r) { var i, o = e([], n.length, t), a = o.length; while (a--) n[i = o[a]] && (n[i] = !(r[i] = n[i])) }) }) } s = at.isXML = function (e) { var t = e && (e.ownerDocument || e).documentElement; return t ? "HTML" !== t.nodeName : !1 }, r = at.support = {}, p = at.setDocument = function (e) { var n = e ? e.ownerDocument || e : w, i = n.defaultView; return n !== f && 9 === n.nodeType && n.documentElement ? (f = n, d = n.documentElement, h = !s(n), i && i.attachEvent && i !== i.top && i.attachEvent("onbeforeunload", function () { p() }), r.attributes = ut(function (e) { return e.className = "i", !e.getAttribute("className") }), r.getElementsByTagName = ut(function (e) { return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length }), r.getElementsByClassName = ut(function (e) { return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length }), r.getById = ut(function (e) { return d.appendChild(e).id = b, !n.getElementsByName || !n.getElementsByName(b).length }), r.getById ? (o.find.ID = function (e, t) { if (typeof t.getElementById !== j && h) { var n = t.getElementById(e); return n && n.parentNode ? [n] : [] } }, o.filter.ID = function (e) { var t = e.replace(rt, it); return function (e) { return e.getAttribute("id") === t } }) : (delete o.find.ID, o.filter.ID = function (e) { var t = e.replace(rt, it); return function (e) { var n = typeof e.getAttributeNode !== j && e.getAttributeNode("id"); return n && n.value === t } }), o.find.TAG = r.getElementsByTagName ? function (e, n) { return typeof n.getElementsByTagName !== j ? n.getElementsByTagName(e) : t } : function (e, t) { var n, r = [], i = 0, o = t.getElementsByTagName(e); if ("*" === e) { while (n = o[i++]) 1 === n.nodeType && r.push(n); return r } return o }, o.find.CLASS = r.getElementsByClassName && function (e, n) { return typeof n.getElementsByClassName !== j && h ? n.getElementsByClassName(e) : t }, m = [], g = [], (r.qsa = K.test(n.querySelectorAll)) && (ut(function (e) { e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || g.push("\\[" + P + "*(?:value|" + B + ")"), e.querySelectorAll(":checked").length || g.push(":checked") }), ut(function (e) { var t = n.createElement("input"); t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("t", ""), e.querySelectorAll("[t^='']").length && g.push("[*^$]=" + P + "*(?:''|\"\")"), e.querySelectorAll(":enabled").length || g.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), g.push(",.*:") })), (r.matchesSelector = K.test(y = d.webkitMatchesSelector || d.mozMatchesSelector || d.oMatchesSelector || d.msMatchesSelector)) && ut(function (e) { r.disconnectedMatch = y.call(e, "div"), y.call(e, "[s!='']:x"), m.push("!=", I) }), g = g.length && RegExp(g.join("|")), m = m.length && RegExp(m.join("|")), v = K.test(d.contains) || d.compareDocumentPosition ? function (e, t) { var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode; return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r))) } : function (e, t) { if (t) while (t = t.parentNode) if (t === e) return !0; return !1 }, A = d.compareDocumentPosition ? function (e, t) { if (e === t) return S = !0, 0; var i = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t); return i ? 1 & i || !r.sortDetached && t.compareDocumentPosition(e) === i ? e === n || v(w, e) ? -1 : t === n || v(w, t) ? 1 : c ? F.call(c, e) - F.call(c, t) : 0 : 4 & i ? -1 : 1 : e.compareDocumentPosition ? -1 : 1 } : function (e, t) { var r, i = 0, o = e.parentNode, a = t.parentNode, s = [e], l = [t]; if (e === t) return S = !0, 0; if (!o || !a) return e === n ? -1 : t === n ? 1 : o ? -1 : a ? 1 : c ? F.call(c, e) - F.call(c, t) : 0; if (o === a) return pt(e, t); r = e; while (r = r.parentNode) s.unshift(r); r = t; while (r = r.parentNode) l.unshift(r); while (s[i] === l[i]) i++; return i ? pt(s[i], l[i]) : s[i] === w ? -1 : l[i] === w ? 1 : 0 }, n) : f }, at.matches = function (e, t) { return at(e, null, null, t) }, at.matchesSelector = function (e, t) { if ((e.ownerDocument || e) !== f && p(e), t = t.replace(Y, "='$1']"), !(!r.matchesSelector || !h || m && m.test(t) || g && g.test(t))) try { var n = y.call(e, t); if (n || r.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n } catch (i) { } return at(t, f, null, [e]).length > 0 }, at.contains = function (e, t) { return (e.ownerDocument || e) !== f && p(e), v(e, t) }, at.attr = function (e, n) { (e.ownerDocument || e) !== f && p(e); var i = o.attrHandle[n.toLowerCase()], a = i && L.call(o.attrHandle, n.toLowerCase()) ? i(e, n, !h) : t; return a === t ? r.attributes || !h ? e.getAttribute(n) : (a = e.getAttributeNode(n)) && a.specified ? a.value : null : a }, at.error = function (e) { throw Error("Syntax error, unrecognized expression: " + e) }, at.uniqueSort = function (e) { var t, n = [], i = 0, o = 0; if (S = !r.detectDuplicates, c = !r.sortStable && e.slice(0), e.sort(A), S) { while (t = e[o++]) t === e[o] && (i = n.push(o)); while (i--) e.splice(n[i], 1) } return e }, a = at.getText = function (e) { var t, n = "", r = 0, i = e.nodeType; if (i) { if (1 === i || 9 === i || 11 === i) { if ("string" == typeof e.textContent) return e.textContent; for (e = e.firstChild; e; e = e.nextSibling) n += a(e) } else if (3 === i || 4 === i) return e.nodeValue } else for (; t = e[r]; r++) n += a(t); return n }, o = at.selectors = { cacheLength: 50, createPseudo: lt, match: Q, attrHandle: {}, find: {}, relative: { ">": { dir: "parentNode", first: !0 }, " ": { dir: "parentNode" }, "+": { dir: "previousSibling", first: !0 }, "~": { dir: "previousSibling" } }, preFilter: { ATTR: function (e) { return e[1] = e[1].replace(rt, it), e[3] = (e[4] || e[5] || "").replace(rt, it), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4) }, CHILD: function (e) { return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || at.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && at.error(e[0]), e }, PSEUDO: function (e) { var n, r = !e[5] && e[2]; return Q.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : r && J.test(r) && (n = mt(r, !0)) && (n = r.indexOf(")", r.length - n) - r.length) && (e[0] = e[0].slice(0, n), e[2] = r.slice(0, n)), e.slice(0, 3)) } }, filter: { TAG: function (e) { var t = e.replace(rt, it).toLowerCase(); return "*" === e ? function () { return !0 } : function (e) { return e.nodeName && e.nodeName.toLowerCase() === t } }, CLASS: function (e) { var t = N[e + " "]; return t || (t = RegExp("(^|" + P + ")" + e + "(" + P + "|$)")) && N(e, function (e) { return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== j && e.getAttribute("class") || "") }) }, ATTR: function (e, t, n) { return function (r) { var i = at.attr(r, e); return null == i ? "!=" === t : t ? (i += "", "=" === t ? i === n : "!=" === t ? i !== n : "^=" === t ? n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(n) > -1 : "$=" === t ? n && i.slice(-n.length) === n : "~=" === t ? (" " + i + " ").indexOf(n) > -1 : "|=" === t ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0 } }, CHILD: function (e, t, n, r, i) { var o = "nth" !== e.slice(0, 3), a = "last" !== e.slice(-4), s = "of-type" === t; return 1 === r && 0 === i ? function (e) { return !!e.parentNode } : function (t, n, l) { var u, c, p, f, d, h, g = o !== a ? "nextSibling" : "previousSibling", m = t.parentNode, y = s && t.nodeName.toLowerCase(), v = !l && !s; if (m) { if (o) { while (g) { p = t; while (p = p[g]) if (s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) return !1; h = g = "only" === e && !h && "nextSibling" } return !0 } if (h = [a ? m.firstChild : m.lastChild], a && v) { c = m[b] || (m[b] = {}), u = c[e] || [], d = u[0] === T && u[1], f = u[0] === T && u[2], p = d && m.childNodes[d]; while (p = ++d && p && p[g] || (f = d = 0) || h.pop()) if (1 === p.nodeType && ++f && p === t) { c[e] = [T, d, f]; break } } else if (v && (u = (t[b] || (t[b] = {}))[e]) && u[0] === T) f = u[1]; else while (p = ++d && p && p[g] || (f = d = 0) || h.pop()) if ((s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) && ++f && (v && ((p[b] || (p[b] = {}))[e] = [T, f]), p === t)) break; return f -= i, f === r || 0 === f % r && f / r >= 0 } } }, PSEUDO: function (e, t) { var n, r = o.pseudos[e] || o.setFilters[e.toLowerCase()] || at.error("unsupported pseudo: " + e); return r[b] ? r(t) : r.length > 1 ? (n = [e, e, "", t], o.setFilters.hasOwnProperty(e.toLowerCase()) ? lt(function (e, n) { var i, o = r(e, t), a = o.length; while (a--) i = F.call(e, o[a]), e[i] = !(n[i] = o[a]) }) : function (e) { return r(e, 0, n) }) : r } }, pseudos: { not: lt(function (e) { var t = [], n = [], r = l(e.replace(z, "$1")); return r[b] ? lt(function (e, t, n, i) { var o, a = r(e, null, i, []), s = e.length; while (s--) (o = a[s]) && (e[s] = !(t[s] = o)) }) : function (e, i, o) { return t[0] = e, r(t, null, o, n), !n.pop() } }), has: lt(function (e) { return function (t) { return at(e, t).length > 0 } }), contains: lt(function (e) { return function (t) { return (t.textContent || t.innerText || a(t)).indexOf(e) > -1 } }), lang: lt(function (e) { return G.test(e || "") || at.error("unsupported lang: " + e), e = e.replace(rt, it).toLowerCase(), function (t) { var n; do if (n = h ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-"); while ((t = t.parentNode) && 1 === t.nodeType); return !1 } }), target: function (t) { var n = e.location && e.location.hash; return n && n.slice(1) === t.id }, root: function (e) { return e === d }, focus: function (e) { return e === f.activeElement && (!f.hasFocus || f.hasFocus()) && !!(e.type || e.href || ~e.tabIndex) }, enabled: function (e) { return e.disabled === !1 }, disabled: function (e) { return e.disabled === !0 }, checked: function (e) { var t = e.nodeName.toLowerCase(); return "input" === t && !!e.checked || "option" === t && !!e.selected }, selected: function (e) { return e.parentNode && e.parentNode.selectedIndex, e.selected === !0 }, empty: function (e) { for (e = e.firstChild; e; e = e.nextSibling) if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType) return !1; return !0 }, parent: function (e) { return !o.pseudos.empty(e) }, header: function (e) { return tt.test(e.nodeName) }, input: function (e) { return et.test(e.nodeName) }, button: function (e) { var t = e.nodeName.toLowerCase(); return "input" === t && "button" === e.type || "button" === t }, text: function (e) { var t; return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type) }, first: ht(function () { return [0] }), last: ht(function (e, t) { return [t - 1] }), eq: ht(function (e, t, n) { return [0 > n ? n + t : n] }), even: ht(function (e, t) { var n = 0; for (; t > n; n += 2) e.push(n); return e }), odd: ht(function (e, t) { var n = 1; for (; t > n; n += 2) e.push(n); return e }), lt: ht(function (e, t, n) { var r = 0 > n ? n + t : n; for (; --r >= 0;) e.push(r); return e }), gt: ht(function (e, t, n) { var r = 0 > n ? n + t : n; for (; t > ++r;) e.push(r); return e }) } }, o.pseudos.nth = o.pseudos.eq; for (n in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) o.pseudos[n] = ft(n); for (n in { submit: !0, reset: !0 }) o.pseudos[n] = dt(n); function gt() { } gt.prototype = o.filters = o.pseudos, o.setFilters = new gt; function mt(e, t) { var n, r, i, a, s, l, u, c = k[e + " "]; if (c) return t ? 0 : c.slice(0); s = e, l = [], u = o.preFilter; while (s) { (!n || (r = X.exec(s))) && (r && (s = s.slice(r[0].length) || s), l.push(i = [])), n = !1, (r = U.exec(s)) && (n = r.shift(), i.push({ value: n, type: r[0].replace(z, " ") }), s = s.slice(n.length)); for (a in o.filter) !(r = Q[a].exec(s)) || u[a] && !(r = u[a](r)) || (n = r.shift(), i.push({ value: n, type: a, matches: r }), s = s.slice(n.length)); if (!n) break } return t ? s.length : s ? at.error(e) : k(e, l).slice(0) } function yt(e) { var t = 0, n = e.length, r = ""; for (; n > t; t++) r += e[t].value; return r } function vt(e, t, n) { var r = t.dir, o = n && "parentNode" === r, a = C++; return t.first ? function (t, n, i) { while (t = t[r]) if (1 === t.nodeType || o) return e(t, n, i) } : function (t, n, s) { var l, u, c, p = T + " " + a; if (s) { while (t = t[r]) if ((1 === t.nodeType || o) && e(t, n, s)) return !0 } else while (t = t[r]) if (1 === t.nodeType || o) if (c = t[b] || (t[b] = {}), (u = c[r]) && u[0] === p) { if ((l = u[1]) === !0 || l === i) return l === !0 } else if (u = c[r] = [p], u[1] = e(t, n, s) || i, u[1] === !0) return !0 } } function bt(e) { return e.length > 1 ? function (t, n, r) { var i = e.length; while (i--) if (!e[i](t, n, r)) return !1; return !0 } : e[0] } function xt(e, t, n, r, i) { var o, a = [], s = 0, l = e.length, u = null != t; for (; l > s; s++) (o = e[s]) && (!n || n(o, r, i)) && (a.push(o), u && t.push(s)); return a } function wt(e, t, n, r, i, o) { return r && !r[b] && (r = wt(r)), i && !i[b] && (i = wt(i, o)), lt(function (o, a, s, l) { var u, c, p, f = [], d = [], h = a.length, g = o || Nt(t || "*", s.nodeType ? [s] : s, []), m = !e || !o && t ? g : xt(g, f, e, s, l), y = n ? i || (o ? e : h || r) ? [] : a : m; if (n && n(m, y, s, l), r) { u = xt(y, d), r(u, [], s, l), c = u.length; while (c--) (p = u[c]) && (y[d[c]] = !(m[d[c]] = p)) } if (o) { if (i || e) { if (i) { u = [], c = y.length; while (c--) (p = y[c]) && u.push(m[c] = p); i(null, y = [], u, l) } c = y.length; while (c--) (p = y[c]) && (u = i ? F.call(o, p) : f[c]) > -1 && (o[u] = !(a[u] = p)) } } else y = xt(y === a ? y.splice(h, y.length) : y), i ? i(null, a, y, l) : M.apply(a, y) }) } function Tt(e) { var t, n, r, i = e.length, a = o.relative[e[0].type], s = a || o.relative[" "], l = a ? 1 : 0, c = vt(function (e) { return e === t }, s, !0), p = vt(function (e) { return F.call(t, e) > -1 }, s, !0), f = [function (e, n, r) { return !a && (r || n !== u) || ((t = n).nodeType ? c(e, n, r) : p(e, n, r)) }]; for (; i > l; l++) if (n = o.relative[e[l].type]) f = [vt(bt(f), n)]; else { if (n = o.filter[e[l].type].apply(null, e[l].matches), n[b]) { for (r = ++l; i > r; r++) if (o.relative[e[r].type]) break; return wt(l > 1 && bt(f), l > 1 && yt(e.slice(0, l - 1).concat({ value: " " === e[l - 2].type ? "*" : "" })).replace(z, "$1"), n, r > l && Tt(e.slice(l, r)), i > r && Tt(e = e.slice(r)), i > r && yt(e)) } f.push(n) } return bt(f) } function Ct(e, t) { var n = 0, r = t.length > 0, a = e.length > 0, s = function (s, l, c, p, d) { var h, g, m, y = [], v = 0, b = "0", x = s && [], w = null != d, C = u, N = s || a && o.find.TAG("*", d && l.parentNode || l), k = T += null == C ? 1 : Math.random() || .1; for (w && (u = l !== f && l, i = n) ; null != (h = N[b]) ; b++) { if (a && h) { g = 0; while (m = e[g++]) if (m(h, l, c)) { p.push(h); break } w && (T = k, i = ++n) } r && ((h = !m && h) && v--, s && x.push(h)) } if (v += b, r && b !== v) { g = 0; while (m = t[g++]) m(x, y, l, c); if (s) { if (v > 0) while (b--) x[b] || y[b] || (y[b] = q.call(p)); y = xt(y) } M.apply(p, y), w && !s && y.length > 0 && v + t.length > 1 && at.uniqueSort(p) } return w && (T = k, u = C), x }; return r ? lt(s) : s } l = at.compile = function (e, t) { var n, r = [], i = [], o = E[e + " "]; if (!o) { t || (t = mt(e)), n = t.length; while (n--) o = Tt(t[n]), o[b] ? r.push(o) : i.push(o); o = E(e, Ct(i, r)) } return o }; function Nt(e, t, n) { var r = 0, i = t.length; for (; i > r; r++) at(e, t[r], n); return n } function kt(e, t, n, i) { var a, s, u, c, p, f = mt(e); if (!i && 1 === f.length) { if (s = f[0] = f[0].slice(0), s.length > 2 && "ID" === (u = s[0]).type && r.getById && 9 === t.nodeType && h && o.relative[s[1].type]) { if (t = (o.find.ID(u.matches[0].replace(rt, it), t) || [])[0], !t) return n; e = e.slice(s.shift().value.length) } a = Q.needsContext.test(e) ? 0 : s.length; while (a--) { if (u = s[a], o.relative[c = u.type]) break; if ((p = o.find[c]) && (i = p(u.matches[0].replace(rt, it), V.test(s[0].type) && t.parentNode || t))) { if (s.splice(a, 1), e = i.length && yt(s), !e) return M.apply(n, i), n; break } } } return l(e, f)(i, t, !h, n, V.test(e)), n } r.sortStable = b.split("").sort(A).join("") === b, r.detectDuplicates = S, p(), r.sortDetached = ut(function (e) { return 1 & e.compareDocumentPosition(f.createElement("div")) }), ut(function (e) { return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href") }) || ct("type|href|height|width", function (e, n, r) { return r ? t : e.getAttribute(n, "type" === n.toLowerCase() ? 1 : 2) }), r.attributes && ut(function (e) { return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value") }) || ct("value", function (e, n, r) { return r || "input" !== e.nodeName.toLowerCase() ? t : e.defaultValue }), ut(function (e) { return null == e.getAttribute("disabled") }) || ct(B, function (e, n, r) { var i; return r ? t : (i = e.getAttributeNode(n)) && i.specified ? i.value : e[n] === !0 ? n.toLowerCase() : null }), x.find = at, x.expr = at.selectors, x.expr[":"] = x.expr.pseudos, x.unique = at.uniqueSort, x.text = at.getText, x.isXMLDoc = at.isXML, x.contains = at.contains }(e); var O = {}; function F(e) { var t = O[e] = {}; return x.each(e.match(T) || [], function (e, n) { t[n] = !0 }), t } x.Callbacks = function (e) { e = "string" == typeof e ? O[e] || F(e) : x.extend({}, e); var n, r, i, o, a, s, l = [], u = !e.once && [], c = function (t) { for (r = e.memory && t, i = !0, a = s || 0, s = 0, o = l.length, n = !0; l && o > a; a++) if (l[a].apply(t[0], t[1]) === !1 && e.stopOnFalse) { r = !1; break } n = !1, l && (u ? u.length && c(u.shift()) : r ? l = [] : p.disable()) }, p = { add: function () { if (l) { var t = l.length; (function i(t) { x.each(t, function (t, n) { var r = x.type(n); "function" === r ? e.unique && p.has(n) || l.push(n) : n && n.length && "string" !== r && i(n) }) })(arguments), n ? o = l.length : r && (s = t, c(r)) } return this }, remove: function () { return l && x.each(arguments, function (e, t) { var r; while ((r = x.inArray(t, l, r)) > -1) l.splice(r, 1), n && (o >= r && o--, a >= r && a--) }), this }, has: function (e) { return e ? x.inArray(e, l) > -1 : !(!l || !l.length) }, empty: function () { return l = [], o = 0, this }, disable: function () { return l = u = r = t, this }, disabled: function () { return !l }, lock: function () { return u = t, r || p.disable(), this }, locked: function () { return !u }, fireWith: function (e, t) { return !l || i && !u || (t = t || [], t = [e, t.slice ? t.slice() : t], n ? u.push(t) : c(t)), this }, fire: function () { return p.fireWith(this, arguments), this }, fired: function () { return !!i } }; return p }, x.extend({ Deferred: function (e) { var t = [["resolve", "done", x.Callbacks("once memory"), "resolved"], ["reject", "fail", x.Callbacks("once memory"), "rejected"], ["notify", "progress", x.Callbacks("memory")]], n = "pending", r = { state: function () { return n }, always: function () { return i.done(arguments).fail(arguments), this }, then: function () { var e = arguments; return x.Deferred(function (n) { x.each(t, function (t, o) { var a = o[0], s = x.isFunction(e[t]) && e[t]; i[o[1]](function () { var e = s && s.apply(this, arguments); e && x.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + "With"](this === r ? n.promise() : this, s ? [e] : arguments) }) }), e = null }).promise() }, promise: function (e) { return null != e ? x.extend(e, r) : r } }, i = {}; return r.pipe = r.then, x.each(t, function (e, o) { var a = o[2], s = o[3]; r[o[1]] = a.add, s && a.add(function () { n = s }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function () { return i[o[0] + "With"](this === i ? r : this, arguments), this }, i[o[0] + "With"] = a.fireWith }), r.promise(i), e && e.call(i, i), i }, when: function (e) { var t = 0, n = g.call(arguments), r = n.length, i = 1 !== r || e && x.isFunction(e.promise) ? r : 0, o = 1 === i ? e : x.Deferred(), a = function (e, t, n) { return function (r) { t[e] = this, n[e] = arguments.length > 1 ? g.call(arguments) : r, n === s ? o.notifyWith(t, n) : --i || o.resolveWith(t, n) } }, s, l, u; if (r > 1) for (s = Array(r), l = Array(r), u = Array(r) ; r > t; t++) n[t] && x.isFunction(n[t].promise) ? n[t].promise().done(a(t, u, n)).fail(o.reject).progress(a(t, l, s)) : --i; return i || o.resolveWith(u, n), o.promise() } }), x.support = function (t) {
        var n, r, o, s, l, u, c, p, f, d = a.createElement("div"); if (d.setAttribute("className", "t"), d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = d.getElementsByTagName("*") || [], r = d.getElementsByTagName("a")[0], !r || !r.style || !n.length) return t; s = a.createElement("select"), u = s.appendChild(a.createElement("option")), o = d.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = "t" !== d.className, t.leadingWhitespace = 3 === d.firstChild.nodeType, t.tbody = !d.getElementsByTagName("tbody").length, t.htmlSerialize = !!d.getElementsByTagName("link").length, t.style = /top/.test(r.getAttribute("style")), t.hrefNormalized = "/a" === r.getAttribute("href"), t.opacity = /^0.5/.test(r.style.opacity), t.cssFloat = !!r.style.cssFloat, t.checkOn = !!o.value, t.optSelected = u.selected, t.enctype = !!a.createElement("form").enctype, t.html5Clone = "<:nav></:nav>" !== a.createElement("nav").cloneNode(!0).outerHTML, t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, o.checked = !0, t.noCloneChecked = o.cloneNode(!0).checked, s.disabled = !0, t.optDisabled = !u.disabled; try { delete d.test } catch (h) { t.deleteExpando = !1 } o = a.createElement("input"), o.setAttribute("value", ""), t.input = "" === o.getAttribute("value"), o.value = "t", o.setAttribute("type", "radio"), t.radioValue = "t" === o.value, o.setAttribute("checked", "t"), o.setAttribute("name", "t"), l = a.createDocumentFragment(), l.appendChild(o), t.appendChecked = o.checked, t.checkClone = l.cloneNode(!0).cloneNode(!0).lastChild.checked, d.attachEvent && (d.attachEvent("onclick", function () { t.noCloneEvent = !1 }), d.cloneNode(!0).click()); for (f in { submit: !0, change: !0, focusin: !0 }) d.setAttribute(c = "on" + f, "t"), t[f + "Bubbles"] = c in e || d.attributes[c].expando === !1; d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = "content-box" === d.style.backgroundClip; for (f in x(t)) break; return t.ownLast = "0" !== f, x(function () { var n, r, o, s = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", l = a.getElementsByTagName("body")[0]; l && (n = a.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", l.appendChild(n).appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", o = d.getElementsByTagName("td"), o[0].style.cssText = "padding:0;margin:0;border:0;display:none", p = 0 === o[0].offsetHeight, o[0].style.display = "", o[1].style.display = "none", t.reliableHiddenOffsets = p && 0 === o[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", x.swap(l, null != l.style.zoom ? { zoom: 1 } : {}, function () { t.boxSizing = 4 === d.offsetWidth }), e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(d, null) || {}).top, t.boxSizingReliable = "4px" === (e.getComputedStyle(d, null) || { width: "4px" }).width, r = d.appendChild(a.createElement("div")), r.style.cssText = d.style.cssText = s, r.style.marginRight = r.style.width = "0", d.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), typeof d.style.zoom !== i && (d.innerHTML = "", d.style.cssText = s + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", t.shrinkWrapBlocks = 3 !== d.offsetWidth, t.inlineBlockNeedsLayout && (l.style.zoom = 1)), l.removeChild(n), n = d = o = r = null) }), n = s = l = u = r = o = null, t
    }({}); var B = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, P = /([A-Z])/g; function R(e, n, r, i) { if (x.acceptData(e)) { var o, a, s = x.expando, l = e.nodeType, u = l ? x.cache : e, c = l ? e[s] : e[s] && s; if (c && u[c] && (i || u[c].data) || r !== t || "string" != typeof n) return c || (c = l ? e[s] = p.pop() || x.guid++ : s), u[c] || (u[c] = l ? {} : { toJSON: x.noop }), ("object" == typeof n || "function" == typeof n) && (i ? u[c] = x.extend(u[c], n) : u[c].data = x.extend(u[c].data, n)), a = u[c], i || (a.data || (a.data = {}), a = a.data), r !== t && (a[x.camelCase(n)] = r), "string" == typeof n ? (o = a[n], null == o && (o = a[x.camelCase(n)])) : o = a, o } } function W(e, t, n) { if (x.acceptData(e)) { var r, i, o = e.nodeType, a = o ? x.cache : e, s = o ? e[x.expando] : x.expando; if (a[s]) { if (t && (r = n ? a[s] : a[s].data)) { x.isArray(t) ? t = t.concat(x.map(t, x.camelCase)) : t in r ? t = [t] : (t = x.camelCase(t), t = t in r ? [t] : t.split(" ")), i = t.length; while (i--) delete r[t[i]]; if (n ? !I(r) : !x.isEmptyObject(r)) return } (n || (delete a[s].data, I(a[s]))) && (o ? x.cleanData([e], !0) : x.support.deleteExpando || a != a.window ? delete a[s] : a[s] = null) } } } x.extend({ cache: {}, noData: { applet: !0, embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" }, hasData: function (e) { return e = e.nodeType ? x.cache[e[x.expando]] : e[x.expando], !!e && !I(e) }, data: function (e, t, n) { return R(e, t, n) }, removeData: function (e, t) { return W(e, t) }, _data: function (e, t, n) { return R(e, t, n, !0) }, _removeData: function (e, t) { return W(e, t, !0) }, acceptData: function (e) { if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType) return !1; var t = e.nodeName && x.noData[e.nodeName.toLowerCase()]; return !t || t !== !0 && e.getAttribute("classid") === t } }), x.fn.extend({ data: function (e, n) { var r, i, o = null, a = 0, s = this[0]; if (e === t) { if (this.length && (o = x.data(s), 1 === s.nodeType && !x._data(s, "parsedAttrs"))) { for (r = s.attributes; r.length > a; a++) i = r[a].name, 0 === i.indexOf("data-") && (i = x.camelCase(i.slice(5)), $(s, i, o[i])); x._data(s, "parsedAttrs", !0) } return o } return "object" == typeof e ? this.each(function () { x.data(this, e) }) : arguments.length > 1 ? this.each(function () { x.data(this, e, n) }) : s ? $(s, e, x.data(s, e)) : null }, removeData: function (e) { return this.each(function () { x.removeData(this, e) }) } }); function $(e, n, r) { if (r === t && 1 === e.nodeType) { var i = "data-" + n.replace(P, "-$1").toLowerCase(); if (r = e.getAttribute(i), "string" == typeof r) { try { r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : B.test(r) ? x.parseJSON(r) : r } catch (o) { } x.data(e, n, r) } else r = t } return r } function I(e) { var t; for (t in e) if (("data" !== t || !x.isEmptyObject(e[t])) && "toJSON" !== t) return !1; return !0 } x.extend({ queue: function (e, n, r) { var i; return e ? (n = (n || "fx") + "queue", i = x._data(e, n), r && (!i || x.isArray(r) ? i = x._data(e, n, x.makeArray(r)) : i.push(r)), i || []) : t }, dequeue: function (e, t) { t = t || "fx"; var n = x.queue(e, t), r = n.length, i = n.shift(), o = x._queueHooks(e, t), a = function () { x.dequeue(e, t) }; "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire() }, _queueHooks: function (e, t) { var n = t + "queueHooks"; return x._data(e, n) || x._data(e, n, { empty: x.Callbacks("once memory").add(function () { x._removeData(e, t + "queue"), x._removeData(e, n) }) }) } }), x.fn.extend({ queue: function (e, n) { var r = 2; return "string" != typeof e && (n = e, e = "fx", r--), r > arguments.length ? x.queue(this[0], e) : n === t ? this : this.each(function () { var t = x.queue(this, e, n); x._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && x.dequeue(this, e) }) }, dequeue: function (e) { return this.each(function () { x.dequeue(this, e) }) }, delay: function (e, t) { return e = x.fx ? x.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function (t, n) { var r = setTimeout(t, e); n.stop = function () { clearTimeout(r) } }) }, clearQueue: function (e) { return this.queue(e || "fx", []) }, promise: function (e, n) { var r, i = 1, o = x.Deferred(), a = this, s = this.length, l = function () { --i || o.resolveWith(a, [a]) }; "string" != typeof e && (n = e, e = t), e = e || "fx"; while (s--) r = x._data(a[s], e + "queueHooks"), r && r.empty && (i++, r.empty.add(l)); return l(), o.promise(n) } }); var z, X, U = /[\t\r\n\f]/g, V = /\r/g, Y = /^(?:input|select|textarea|button|object)$/i, J = /^(?:a|area)$/i, G = /^(?:checked|selected)$/i, Q = x.support.getSetAttribute, K = x.support.input; x.fn.extend({ attr: function (e, t) { return x.access(this, x.attr, e, t, arguments.length > 1) }, removeAttr: function (e) { return this.each(function () { x.removeAttr(this, e) }) }, prop: function (e, t) { return x.access(this, x.prop, e, t, arguments.length > 1) }, removeProp: function (e) { return e = x.propFix[e] || e, this.each(function () { try { this[e] = t, delete this[e] } catch (n) { } }) }, addClass: function (e) { var t, n, r, i, o, a = 0, s = this.length, l = "string" == typeof e && e; if (x.isFunction(e)) return this.each(function (t) { x(this).addClass(e.call(this, t, this.className)) }); if (l) for (t = (e || "").match(T) || []; s > a; a++) if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : " ")) { o = 0; while (i = t[o++]) 0 > r.indexOf(" " + i + " ") && (r += i + " "); n.className = x.trim(r) } return this }, removeClass: function (e) { var t, n, r, i, o, a = 0, s = this.length, l = 0 === arguments.length || "string" == typeof e && e; if (x.isFunction(e)) return this.each(function (t) { x(this).removeClass(e.call(this, t, this.className)) }); if (l) for (t = (e || "").match(T) || []; s > a; a++) if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : "")) { o = 0; while (i = t[o++]) while (r.indexOf(" " + i + " ") >= 0) r = r.replace(" " + i + " ", " "); n.className = e ? x.trim(r) : "" } return this }, toggleClass: function (e, t) { var n = typeof e; return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : x.isFunction(e) ? this.each(function (n) { x(this).toggleClass(e.call(this, n, this.className, t), t) }) : this.each(function () { if ("string" === n) { var t, r = 0, o = x(this), a = e.match(T) || []; while (t = a[r++]) o.hasClass(t) ? o.removeClass(t) : o.addClass(t) } else (n === i || "boolean" === n) && (this.className && x._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : x._data(this, "__className__") || "") }) }, hasClass: function (e) { var t = " " + e + " ", n = 0, r = this.length; for (; r > n; n++) if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(U, " ").indexOf(t) >= 0) return !0; return !1 }, val: function (e) { var n, r, i, o = this[0]; { if (arguments.length) return i = x.isFunction(e), this.each(function (n) { var o; 1 === this.nodeType && (o = i ? e.call(this, n, x(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : x.isArray(o) && (o = x.map(o, function (e) { return null == e ? "" : e + "" })), r = x.valHooks[this.type] || x.valHooks[this.nodeName.toLowerCase()], r && "set" in r && r.set(this, o, "value") !== t || (this.value = o)) }); if (o) return r = x.valHooks[o.type] || x.valHooks[o.nodeName.toLowerCase()], r && "get" in r && (n = r.get(o, "value")) !== t ? n : (n = o.value, "string" == typeof n ? n.replace(V, "") : null == n ? "" : n) } } }), x.extend({ valHooks: { option: { get: function (e) { var t = x.find.attr(e, "value"); return null != t ? t : e.text } }, select: { get: function (e) { var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || 0 > i, a = o ? null : [], s = o ? i + 1 : r.length, l = 0 > i ? s : o ? i : 0; for (; s > l; l++) if (n = r[l], !(!n.selected && l !== i || (x.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && x.nodeName(n.parentNode, "optgroup"))) { if (t = x(n).val(), o) return t; a.push(t) } return a }, set: function (e, t) { var n, r, i = e.options, o = x.makeArray(t), a = i.length; while (a--) r = i[a], (r.selected = x.inArray(x(r).val(), o) >= 0) && (n = !0); return n || (e.selectedIndex = -1), o } } }, attr: function (e, n, r) { var o, a, s = e.nodeType; if (e && 3 !== s && 8 !== s && 2 !== s) return typeof e.getAttribute === i ? x.prop(e, n, r) : (1 === s && x.isXMLDoc(e) || (n = n.toLowerCase(), o = x.attrHooks[n] || (x.expr.match.bool.test(n) ? X : z)), r === t ? o && "get" in o && null !== (a = o.get(e, n)) ? a : (a = x.find.attr(e, n), null == a ? t : a) : null !== r ? o && "set" in o && (a = o.set(e, r, n)) !== t ? a : (e.setAttribute(n, r + ""), r) : (x.removeAttr(e, n), t)) }, removeAttr: function (e, t) { var n, r, i = 0, o = t && t.match(T); if (o && 1 === e.nodeType) while (n = o[i++]) r = x.propFix[n] || n, x.expr.match.bool.test(n) ? K && Q || !G.test(n) ? e[r] = !1 : e[x.camelCase("default-" + n)] = e[r] = !1 : x.attr(e, n, ""), e.removeAttribute(Q ? n : r) }, attrHooks: { type: { set: function (e, t) { if (!x.support.radioValue && "radio" === t && x.nodeName(e, "input")) { var n = e.value; return e.setAttribute("type", t), n && (e.value = n), t } } } }, propFix: { "for": "htmlFor", "class": "className" }, prop: function (e, n, r) { var i, o, a, s = e.nodeType; if (e && 3 !== s && 8 !== s && 2 !== s) return a = 1 !== s || !x.isXMLDoc(e), a && (n = x.propFix[n] || n, o = x.propHooks[n]), r !== t ? o && "set" in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && "get" in o && null !== (i = o.get(e, n)) ? i : e[n] }, propHooks: { tabIndex: { get: function (e) { var t = x.find.attr(e, "tabindex"); return t ? parseInt(t, 10) : Y.test(e.nodeName) || J.test(e.nodeName) && e.href ? 0 : -1 } } } }), X = { set: function (e, t, n) { return t === !1 ? x.removeAttr(e, n) : K && Q || !G.test(n) ? e.setAttribute(!Q && x.propFix[n] || n, n) : e[x.camelCase("default-" + n)] = e[n] = !0, n } }, x.each(x.expr.match.bool.source.match(/\w+/g), function (e, n) { var r = x.expr.attrHandle[n] || x.find.attr; x.expr.attrHandle[n] = K && Q || !G.test(n) ? function (e, n, i) { var o = x.expr.attrHandle[n], a = i ? t : (x.expr.attrHandle[n] = t) != r(e, n, i) ? n.toLowerCase() : null; return x.expr.attrHandle[n] = o, a } : function (e, n, r) { return r ? t : e[x.camelCase("default-" + n)] ? n.toLowerCase() : null } }), K && Q || (x.attrHooks.value = { set: function (e, n, r) { return x.nodeName(e, "input") ? (e.defaultValue = n, t) : z && z.set(e, n, r) } }), Q || (z = { set: function (e, n, r) { var i = e.getAttributeNode(r); return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(r)), i.value = n += "", "value" === r || n === e.getAttribute(r) ? n : t } }, x.expr.attrHandle.id = x.expr.attrHandle.name = x.expr.attrHandle.coords = function (e, n, r) { var i; return r ? t : (i = e.getAttributeNode(n)) && "" !== i.value ? i.value : null }, x.valHooks.button = { get: function (e, n) { var r = e.getAttributeNode(n); return r && r.specified ? r.value : t }, set: z.set }, x.attrHooks.contenteditable = { set: function (e, t, n) { z.set(e, "" === t ? !1 : t, n) } }, x.each(["width", "height"], function (e, n) { x.attrHooks[n] = { set: function (e, r) { return "" === r ? (e.setAttribute(n, "auto"), r) : t } } })), x.support.hrefNormalized || x.each(["href", "src"], function (e, t) { x.propHooks[t] = { get: function (e) { return e.getAttribute(t, 4) } } }), x.support.style || (x.attrHooks.style = { get: function (e) { return e.style.cssText || t }, set: function (e, t) { return e.style.cssText = t + "" } }), x.support.optSelected || (x.propHooks.selected = { get: function (e) { var t = e.parentNode; return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null } }), x.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () { x.propFix[this.toLowerCase()] = this }), x.support.enctype || (x.propFix.enctype = "encoding"), x.each(["radio", "checkbox"], function () { x.valHooks[this] = { set: function (e, n) { return x.isArray(n) ? e.checked = x.inArray(x(e).val(), n) >= 0 : t } }, x.support.checkOn || (x.valHooks[this].get = function (e) { return null === e.getAttribute("value") ? "on" : e.value }) }); var Z = /^(?:input|select|textarea)$/i, et = /^key/, tt = /^(?:mouse|contextmenu)|click/, nt = /^(?:focusinfocus|focusoutblur)$/, rt = /^([^.]*)(?:\.(.+)|)$/; function it() { return !0 } function ot() { return !1 } function at() { try { return a.activeElement } catch (e) { } } x.event = { global: {}, add: function (e, n, r, o, a) { var s, l, u, c, p, f, d, h, g, m, y, v = x._data(e); if (v) { r.handler && (c = r, r = c.handler, a = c.selector), r.guid || (r.guid = x.guid++), (l = v.events) || (l = v.events = {}), (f = v.handle) || (f = v.handle = function (e) { return typeof x === i || e && x.event.triggered === e.type ? t : x.event.dispatch.apply(f.elem, arguments) }, f.elem = e), n = (n || "").match(T) || [""], u = n.length; while (u--) s = rt.exec(n[u]) || [], g = y = s[1], m = (s[2] || "").split(".").sort(), g && (p = x.event.special[g] || {}, g = (a ? p.delegateType : p.bindType) || g, p = x.event.special[g] || {}, d = x.extend({ type: g, origType: y, data: o, handler: r, guid: r.guid, selector: a, needsContext: a && x.expr.match.needsContext.test(a), namespace: m.join(".") }, c), (h = l[g]) || (h = l[g] = [], h.delegateCount = 0, p.setup && p.setup.call(e, o, m, f) !== !1 || (e.addEventListener ? e.addEventListener(g, f, !1) : e.attachEvent && e.attachEvent("on" + g, f))), p.add && (p.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)), a ? h.splice(h.delegateCount++, 0, d) : h.push(d), x.event.global[g] = !0); e = null } }, remove: function (e, t, n, r, i) { var o, a, s, l, u, c, p, f, d, h, g, m = x.hasData(e) && x._data(e); if (m && (c = m.events)) { t = (t || "").match(T) || [""], u = t.length; while (u--) if (s = rt.exec(t[u]) || [], d = g = s[1], h = (s[2] || "").split(".").sort(), d) { p = x.event.special[d] || {}, d = (r ? p.delegateType : p.bindType) || d, f = c[d] || [], s = s[2] && RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = f.length; while (o--) a = f[o], !i && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (f.splice(o, 1), a.selector && f.delegateCount--, p.remove && p.remove.call(e, a)); l && !f.length && (p.teardown && p.teardown.call(e, h, m.handle) !== !1 || x.removeEvent(e, d, m.handle), delete c[d]) } else for (d in c) x.event.remove(e, d + t[u], n, r, !0); x.isEmptyObject(c) && (delete m.handle, x._removeData(e, "events")) } }, trigger: function (n, r, i, o) { var s, l, u, c, p, f, d, h = [i || a], g = v.call(n, "type") ? n.type : n, m = v.call(n, "namespace") ? n.namespace.split(".") : []; if (u = f = i = i || a, 3 !== i.nodeType && 8 !== i.nodeType && !nt.test(g + x.event.triggered) && (g.indexOf(".") >= 0 && (m = g.split("."), g = m.shift(), m.sort()), l = 0 > g.indexOf(":") && "on" + g, n = n[x.expando] ? n : new x.Event(g, "object" == typeof n && n), n.isTrigger = o ? 2 : 3, n.namespace = m.join("."), n.namespace_re = n.namespace ? RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = i), r = null == r ? [n] : x.makeArray(r, [n]), p = x.event.special[g] || {}, o || !p.trigger || p.trigger.apply(i, r) !== !1)) { if (!o && !p.noBubble && !x.isWindow(i)) { for (c = p.delegateType || g, nt.test(c + g) || (u = u.parentNode) ; u; u = u.parentNode) h.push(u), f = u; f === (i.ownerDocument || a) && h.push(f.defaultView || f.parentWindow || e) } d = 0; while ((u = h[d++]) && !n.isPropagationStopped()) n.type = d > 1 ? c : p.bindType || g, s = (x._data(u, "events") || {})[n.type] && x._data(u, "handle"), s && s.apply(u, r), s = l && u[l], s && x.acceptData(u) && s.apply && s.apply(u, r) === !1 && n.preventDefault(); if (n.type = g, !o && !n.isDefaultPrevented() && (!p._default || p._default.apply(h.pop(), r) === !1) && x.acceptData(i) && l && i[g] && !x.isWindow(i)) { f = i[l], f && (i[l] = null), x.event.triggered = g; try { i[g]() } catch (y) { } x.event.triggered = t, f && (i[l] = f) } return n.result } }, dispatch: function (e) { e = x.event.fix(e); var n, r, i, o, a, s = [], l = g.call(arguments), u = (x._data(this, "events") || {})[e.type] || [], c = x.event.special[e.type] || {}; if (l[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) { s = x.event.handlers.call(this, e, u), n = 0; while ((o = s[n++]) && !e.isPropagationStopped()) { e.currentTarget = o.elem, a = 0; while ((i = o.handlers[a++]) && !e.isImmediatePropagationStopped()) (!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i, e.data = i.data, r = ((x.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, l), r !== t && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation())) } return c.postDispatch && c.postDispatch.call(this, e), e.result } }, handlers: function (e, n) { var r, i, o, a, s = [], l = n.delegateCount, u = e.target; if (l && u.nodeType && (!e.button || "click" !== e.type)) for (; u != this; u = u.parentNode || this) if (1 === u.nodeType && (u.disabled !== !0 || "click" !== e.type)) { for (o = [], a = 0; l > a; a++) i = n[a], r = i.selector + " ", o[r] === t && (o[r] = i.needsContext ? x(r, this).index(u) >= 0 : x.find(r, this, null, [u]).length), o[r] && o.push(i); o.length && s.push({ elem: u, handlers: o }) } return n.length > l && s.push({ elem: this, handlers: n.slice(l) }), s }, fix: function (e) { if (e[x.expando]) return e; var t, n, r, i = e.type, o = e, s = this.fixHooks[i]; s || (this.fixHooks[i] = s = tt.test(i) ? this.mouseHooks : et.test(i) ? this.keyHooks : {}), r = s.props ? this.props.concat(s.props) : this.props, e = new x.Event(o), t = r.length; while (t--) n = r[t], e[n] = o[n]; return e.target || (e.target = o.srcElement || a), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, s.filter ? s.filter(e, o) : e }, props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: { props: "char charCode key keyCode".split(" "), filter: function (e, t) { return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e } }, mouseHooks: { props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (e, n) { var r, i, o, s = n.button, l = n.fromElement; return null == e.pageX && null != n.clientX && (i = e.target.ownerDocument || a, o = i.documentElement, r = i.body, e.pageX = n.clientX + (o && o.scrollLeft || r && r.scrollLeft || 0) - (o && o.clientLeft || r && r.clientLeft || 0), e.pageY = n.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)), !e.relatedTarget && l && (e.relatedTarget = l === e.target ? n.toElement : l), e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), e } }, special: { load: { noBubble: !0 }, focus: { trigger: function () { if (this !== at() && this.focus) try { return this.focus(), !1 } catch (e) { } }, delegateType: "focusin" }, blur: { trigger: function () { return this === at() && this.blur ? (this.blur(), !1) : t }, delegateType: "focusout" }, click: { trigger: function () { return x.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : t }, _default: function (e) { return x.nodeName(e.target, "a") } }, beforeunload: { postDispatch: function (e) { e.result !== t && (e.originalEvent.returnValue = e.result) } } }, simulate: function (e, t, n, r) { var i = x.extend(new x.Event, n, { type: e, isSimulated: !0, originalEvent: {} }); r ? x.event.trigger(i, null, t) : x.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault() } }, x.removeEvent = a.removeEventListener ? function (e, t, n) { e.removeEventListener && e.removeEventListener(t, n, !1) } : function (e, t, n) { var r = "on" + t; e.detachEvent && (typeof e[r] === i && (e[r] = null), e.detachEvent(r, n)) }, x.Event = function (e, n) { return this instanceof x.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? it : ot) : this.type = e, n && x.extend(this, n), this.timeStamp = e && e.timeStamp || x.now(), this[x.expando] = !0, t) : new x.Event(e, n) }, x.Event.prototype = { isDefaultPrevented: ot, isPropagationStopped: ot, isImmediatePropagationStopped: ot, preventDefault: function () { var e = this.originalEvent; this.isDefaultPrevented = it, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1) }, stopPropagation: function () { var e = this.originalEvent; this.isPropagationStopped = it, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0) }, stopImmediatePropagation: function () { this.isImmediatePropagationStopped = it, this.stopPropagation() } }, x.each({ mouseenter: "mouseover", mouseleave: "mouseout" }, function (e, t) { x.event.special[e] = { delegateType: t, bindType: t, handle: function (e) { var n, r = this, i = e.relatedTarget, o = e.handleObj; return (!i || i !== r && !x.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n } } }), x.support.submitBubbles || (x.event.special.submit = { setup: function () { return x.nodeName(this, "form") ? !1 : (x.event.add(this, "click._submit keypress._submit", function (e) { var n = e.target, r = x.nodeName(n, "input") || x.nodeName(n, "button") ? n.form : t; r && !x._data(r, "submitBubbles") && (x.event.add(r, "submit._submit", function (e) { e._submit_bubble = !0 }), x._data(r, "submitBubbles", !0)) }), t) }, postDispatch: function (e) { e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && x.event.simulate("submit", this.parentNode, e, !0)) }, teardown: function () { return x.nodeName(this, "form") ? !1 : (x.event.remove(this, "._submit"), t) } }), x.support.changeBubbles || (x.event.special.change = { setup: function () { return Z.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (x.event.add(this, "propertychange._change", function (e) { "checked" === e.originalEvent.propertyName && (this._just_changed = !0) }), x.event.add(this, "click._change", function (e) { this._just_changed && !e.isTrigger && (this._just_changed = !1), x.event.simulate("change", this, e, !0) })), !1) : (x.event.add(this, "beforeactivate._change", function (e) { var t = e.target; Z.test(t.nodeName) && !x._data(t, "changeBubbles") && (x.event.add(t, "change._change", function (e) { !this.parentNode || e.isSimulated || e.isTrigger || x.event.simulate("change", this.parentNode, e, !0) }), x._data(t, "changeBubbles", !0)) }), t) }, handle: function (e) { var n = e.target; return this !== n || e.isSimulated || e.isTrigger || "radio" !== n.type && "checkbox" !== n.type ? e.handleObj.handler.apply(this, arguments) : t }, teardown: function () { return x.event.remove(this, "._change"), !Z.test(this.nodeName) } }), x.support.focusinBubbles || x.each({ focus: "focusin", blur: "focusout" }, function (e, t) { var n = 0, r = function (e) { x.event.simulate(t, e.target, x.event.fix(e), !0) }; x.event.special[t] = { setup: function () { 0 === n++ && a.addEventListener(e, r, !0) }, teardown: function () { 0 === --n && a.removeEventListener(e, r, !0) } } }), x.fn.extend({ on: function (e, n, r, i, o) { var a, s; if ("object" == typeof e) { "string" != typeof n && (r = r || n, n = t); for (a in e) this.on(a, n, r, e[a], o); return this } if (null == r && null == i ? (i = n, r = n = t) : null == i && ("string" == typeof n ? (i = r, r = t) : (i = r, r = n, n = t)), i === !1) i = ot; else if (!i) return this; return 1 === o && (s = i, i = function (e) { return x().off(e), s.apply(this, arguments) }, i.guid = s.guid || (s.guid = x.guid++)), this.each(function () { x.event.add(this, e, i, r, n) }) }, one: function (e, t, n, r) { return this.on(e, t, n, r, 1) }, off: function (e, n, r) { var i, o; if (e && e.preventDefault && e.handleObj) return i = e.handleObj, x(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this; if ("object" == typeof e) { for (o in e) this.off(o, n, e[o]); return this } return (n === !1 || "function" == typeof n) && (r = n, n = t), r === !1 && (r = ot), this.each(function () { x.event.remove(this, e, r, n) }) }, trigger: function (e, t) { return this.each(function () { x.event.trigger(e, t, this) }) }, triggerHandler: function (e, n) { var r = this[0]; return r ? x.event.trigger(e, n, r, !0) : t } }); var st = /^.[^:#\[\.,]*$/, lt = /^(?:parents|prev(?:Until|All))/, ut = x.expr.match.needsContext, ct = { children: !0, contents: !0, next: !0, prev: !0 }; x.fn.extend({ find: function (e) { var t, n = [], r = this, i = r.length; if ("string" != typeof e) return this.pushStack(x(e).filter(function () { for (t = 0; i > t; t++) if (x.contains(r[t], this)) return !0 })); for (t = 0; i > t; t++) x.find(e, r[t], n); return n = this.pushStack(i > 1 ? x.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n }, has: function (e) { var t, n = x(e, this), r = n.length; return this.filter(function () { for (t = 0; r > t; t++) if (x.contains(this, n[t])) return !0 }) }, not: function (e) { return this.pushStack(ft(this, e || [], !0)) }, filter: function (e) { return this.pushStack(ft(this, e || [], !1)) }, is: function (e) { return !!ft(this, "string" == typeof e && ut.test(e) ? x(e) : e || [], !1).length }, closest: function (e, t) { var n, r = 0, i = this.length, o = [], a = ut.test(e) || "string" != typeof e ? x(e, t || this.context) : 0; for (; i > r; r++) for (n = this[r]; n && n !== t; n = n.parentNode) if (11 > n.nodeType && (a ? a.index(n) > -1 : 1 === n.nodeType && x.find.matchesSelector(n, e))) { n = o.push(n); break } return this.pushStack(o.length > 1 ? x.unique(o) : o) }, index: function (e) { return e ? "string" == typeof e ? x.inArray(this[0], x(e)) : x.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1 }, add: function (e, t) { var n = "string" == typeof e ? x(e, t) : x.makeArray(e && e.nodeType ? [e] : e), r = x.merge(this.get(), n); return this.pushStack(x.unique(r)) }, addBack: function (e) { return this.add(null == e ? this.prevObject : this.prevObject.filter(e)) } }); function pt(e, t) { do e = e[t]; while (e && 1 !== e.nodeType); return e } x.each({ parent: function (e) { var t = e.parentNode; return t && 11 !== t.nodeType ? t : null }, parents: function (e) { return x.dir(e, "parentNode") }, parentsUntil: function (e, t, n) { return x.dir(e, "parentNode", n) }, next: function (e) { return pt(e, "nextSibling") }, prev: function (e) { return pt(e, "previousSibling") }, nextAll: function (e) { return x.dir(e, "nextSibling") }, prevAll: function (e) { return x.dir(e, "previousSibling") }, nextUntil: function (e, t, n) { return x.dir(e, "nextSibling", n) }, prevUntil: function (e, t, n) { return x.dir(e, "previousSibling", n) }, siblings: function (e) { return x.sibling((e.parentNode || {}).firstChild, e) }, children: function (e) { return x.sibling(e.firstChild) }, contents: function (e) { return x.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : x.merge([], e.childNodes) } }, function (e, t) { x.fn[e] = function (n, r) { var i = x.map(this, t, n); return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = x.filter(r, i)), this.length > 1 && (ct[e] || (i = x.unique(i)), lt.test(e) && (i = i.reverse())), this.pushStack(i) } }), x.extend({ filter: function (e, t, n) { var r = t[0]; return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? x.find.matchesSelector(r, e) ? [r] : [] : x.find.matches(e, x.grep(t, function (e) { return 1 === e.nodeType })) }, dir: function (e, n, r) { var i = [], o = e[n]; while (o && 9 !== o.nodeType && (r === t || 1 !== o.nodeType || !x(o).is(r))) 1 === o.nodeType && i.push(o), o = o[n]; return i }, sibling: function (e, t) { var n = []; for (; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e); return n } }); function ft(e, t, n) { if (x.isFunction(t)) return x.grep(e, function (e, r) { return !!t.call(e, r, e) !== n }); if (t.nodeType) return x.grep(e, function (e) { return e === t !== n }); if ("string" == typeof t) { if (st.test(t)) return x.filter(t, e, n); t = x.filter(t, e) } return x.grep(e, function (e) { return x.inArray(e, t) >= 0 !== n }) } function dt(e) { var t = ht.split("|"), n = e.createDocumentFragment(); if (n.createElement) while (t.length) n.createElement(t.pop()); return n } var ht = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", gt = / jQuery\d+="(?:null|\d+)"/g, mt = RegExp("<(?:" + ht + ")[\\s/>]", "i"), yt = /^\s+/, vt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bt = /<([\w:]+)/, xt = /<tbody/i, wt = /<|&#?\w+;/, Tt = /<(?:script|style|link)/i, Ct = /^(?:checkbox|radio)$/i, Nt = /checked\s*(?:[^=]|=\s*.checked.)/i, kt = /^$|\/(?:java|ecma)script/i, Et = /^true\/(.*)/, St = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, At = { option: [1, "<select multiple='multiple'>", "</select>"], legend: [1, "<fieldset>", "</fieldset>"], area: [1, "<map>", "</map>"], param: [1, "<object>", "</object>"], thead: [1, "<table>", "</table>"], tr: [2, "<table><tbody>", "</tbody></table>"], col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: x.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"] }, jt = dt(a), Dt = jt.appendChild(a.createElement("div")); At.optgroup = At.option, At.tbody = At.tfoot = At.colgroup = At.caption = At.thead, At.th = At.td, x.fn.extend({ text: function (e) { return x.access(this, function (e) { return e === t ? x.text(this) : this.empty().append((this[0] && this[0].ownerDocument || a).createTextNode(e)) }, null, e, arguments.length) }, append: function () { return this.domManip(arguments, function (e) { if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) { var t = Lt(this, e); t.appendChild(e) } }) }, prepend: function () { return this.domManip(arguments, function (e) { if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) { var t = Lt(this, e); t.insertBefore(e, t.firstChild) } }) }, before: function () { return this.domManip(arguments, function (e) { this.parentNode && this.parentNode.insertBefore(e, this) }) }, after: function () { return this.domManip(arguments, function (e) { this.parentNode && this.parentNode.insertBefore(e, this.nextSibling) }) }, remove: function (e, t) { var n, r = e ? x.filter(e, this) : this, i = 0; for (; null != (n = r[i]) ; i++) t || 1 !== n.nodeType || x.cleanData(Ft(n)), n.parentNode && (t && x.contains(n.ownerDocument, n) && _t(Ft(n, "script")), n.parentNode.removeChild(n)); return this }, empty: function () { var e, t = 0; for (; null != (e = this[t]) ; t++) { 1 === e.nodeType && x.cleanData(Ft(e, !1)); while (e.firstChild) e.removeChild(e.firstChild); e.options && x.nodeName(e, "select") && (e.options.length = 0) } return this }, clone: function (e, t) { return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function () { return x.clone(this, e, t) }) }, html: function (e) { return x.access(this, function (e) { var n = this[0] || {}, r = 0, i = this.length; if (e === t) return 1 === n.nodeType ? n.innerHTML.replace(gt, "") : t; if (!("string" != typeof e || Tt.test(e) || !x.support.htmlSerialize && mt.test(e) || !x.support.leadingWhitespace && yt.test(e) || At[(bt.exec(e) || ["", ""])[1].toLowerCase()])) { e = e.replace(vt, "<$1></$2>"); try { for (; i > r; r++) n = this[r] || {}, 1 === n.nodeType && (x.cleanData(Ft(n, !1)), n.innerHTML = e); n = 0 } catch (o) { } } n && this.empty().append(e) }, null, e, arguments.length) }, replaceWith: function () { var e = x.map(this, function (e) { return [e.nextSibling, e.parentNode] }), t = 0; return this.domManip(arguments, function (n) { var r = e[t++], i = e[t++]; i && (r && r.parentNode !== i && (r = this.nextSibling), x(this).remove(), i.insertBefore(n, r)) }, !0), t ? this : this.remove() }, detach: function (e) { return this.remove(e, !0) }, domManip: function (e, t, n) { e = d.apply([], e); var r, i, o, a, s, l, u = 0, c = this.length, p = this, f = c - 1, h = e[0], g = x.isFunction(h); if (g || !(1 >= c || "string" != typeof h || x.support.checkClone) && Nt.test(h)) return this.each(function (r) { var i = p.eq(r); g && (e[0] = h.call(this, r, i.html())), i.domManip(e, t, n) }); if (c && (l = x.buildFragment(e, this[0].ownerDocument, !1, !n && this), r = l.firstChild, 1 === l.childNodes.length && (l = r), r)) { for (a = x.map(Ft(l, "script"), Ht), o = a.length; c > u; u++) i = l, u !== f && (i = x.clone(i, !0, !0), o && x.merge(a, Ft(i, "script"))), t.call(this[u], i, u); if (o) for (s = a[a.length - 1].ownerDocument, x.map(a, qt), u = 0; o > u; u++) i = a[u], kt.test(i.type || "") && !x._data(i, "globalEval") && x.contains(s, i) && (i.src ? x._evalUrl(i.src) : x.globalEval((i.text || i.textContent || i.innerHTML || "").replace(St, ""))); l = r = null } return this } }); function Lt(e, t) { return x.nodeName(e, "table") && x.nodeName(1 === t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e } function Ht(e) { return e.type = (null !== x.find.attr(e, "type")) + "/" + e.type, e } function qt(e) { var t = Et.exec(e.type); return t ? e.type = t[1] : e.removeAttribute("type"), e } function _t(e, t) { var n, r = 0; for (; null != (n = e[r]) ; r++) x._data(n, "globalEval", !t || x._data(t[r], "globalEval")) } function Mt(e, t) { if (1 === t.nodeType && x.hasData(e)) { var n, r, i, o = x._data(e), a = x._data(t, o), s = o.events; if (s) { delete a.handle, a.events = {}; for (n in s) for (r = 0, i = s[n].length; i > r; r++) x.event.add(t, n, s[n][r]) } a.data && (a.data = x.extend({}, a.data)) } } function Ot(e, t) { var n, r, i; if (1 === t.nodeType) { if (n = t.nodeName.toLowerCase(), !x.support.noCloneEvent && t[x.expando]) { i = x._data(t); for (r in i.events) x.removeEvent(t, r, i.handle); t.removeAttribute(x.expando) } "script" === n && t.text !== e.text ? (Ht(t).text = e.text, qt(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), x.support.html5Clone && e.innerHTML && !x.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ct.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue) } } x.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (e, t) { x.fn[e] = function (e) { var n, r = 0, i = [], o = x(e), a = o.length - 1; for (; a >= r; r++) n = r === a ? this : this.clone(!0), x(o[r])[t](n), h.apply(i, n.get()); return this.pushStack(i) } }); function Ft(e, n) { var r, o, a = 0, s = typeof e.getElementsByTagName !== i ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== i ? e.querySelectorAll(n || "*") : t; if (!s) for (s = [], r = e.childNodes || e; null != (o = r[a]) ; a++) !n || x.nodeName(o, n) ? s.push(o) : x.merge(s, Ft(o, n)); return n === t || n && x.nodeName(e, n) ? x.merge([e], s) : s } function Bt(e) { Ct.test(e.type) && (e.defaultChecked = e.checked) } x.extend({
        clone: function (e, t, n) { var r, i, o, a, s, l = x.contains(e.ownerDocument, e); if (x.support.html5Clone || x.isXMLDoc(e) || !mt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Dt.innerHTML = e.outerHTML, Dt.removeChild(o = Dt.firstChild)), !(x.support.noCloneEvent && x.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || x.isXMLDoc(e))) for (r = Ft(o), s = Ft(e), a = 0; null != (i = s[a]) ; ++a) r[a] && Ot(i, r[a]); if (t) if (n) for (s = s || Ft(e), r = r || Ft(o), a = 0; null != (i = s[a]) ; a++) Mt(i, r[a]); else Mt(e, o); return r = Ft(o, "script"), r.length > 0 && _t(r, !l && Ft(e, "script")), r = s = i = null, o }, buildFragment: function (e, t, n, r) { var i, o, a, s, l, u, c, p = e.length, f = dt(t), d = [], h = 0; for (; p > h; h++) if (o = e[h], o || 0 === o) if ("object" === x.type(o)) x.merge(d, o.nodeType ? [o] : o); else if (wt.test(o)) { s = s || f.appendChild(t.createElement("div")), l = (bt.exec(o) || ["", ""])[1].toLowerCase(), c = At[l] || At._default, s.innerHTML = c[1] + o.replace(vt, "<$1></$2>") + c[2], i = c[0]; while (i--) s = s.lastChild; if (!x.support.leadingWhitespace && yt.test(o) && d.push(t.createTextNode(yt.exec(o)[0])), !x.support.tbody) { o = "table" !== l || xt.test(o) ? "<table>" !== c[1] || xt.test(o) ? 0 : s : s.firstChild, i = o && o.childNodes.length; while (i--) x.nodeName(u = o.childNodes[i], "tbody") && !u.childNodes.length && o.removeChild(u) } x.merge(d, s.childNodes), s.textContent = ""; while (s.firstChild) s.removeChild(s.firstChild); s = f.lastChild } else d.push(t.createTextNode(o)); s && f.removeChild(s), x.support.appendChecked || x.grep(Ft(d, "input"), Bt), h = 0; while (o = d[h++]) if ((!r || -1 === x.inArray(o, r)) && (a = x.contains(o.ownerDocument, o), s = Ft(f.appendChild(o), "script"), a && _t(s), n)) { i = 0; while (o = s[i++]) kt.test(o.type || "") && n.push(o) } return s = null, f }, cleanData: function (e, t) {
            var n, r, o, a, s = 0, l = x.expando, u = x.cache, c = x.support.deleteExpando, f = x.event.special; for (; null != (n = e[s]) ; s++) if ((t || x.acceptData(n)) && (o = n[l], a = o && u[o])) {
                if (a.events) for (r in a.events) f[r] ? x.event.remove(n, r) : x.removeEvent(n, r, a.handle);
                u[o] && (delete u[o], c ? delete n[l] : typeof n.removeAttribute !== i ? n.removeAttribute(l) : n[l] = null, p.push(o))
            }
        }, _evalUrl: function (e) { return x.ajax({ url: e, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0 }) }
    }), x.fn.extend({ wrapAll: function (e) { if (x.isFunction(e)) return this.each(function (t) { x(this).wrapAll(e.call(this, t)) }); if (this[0]) { var t = x(e, this[0].ownerDocument).eq(0).clone(!0); this[0].parentNode && t.insertBefore(this[0]), t.map(function () { var e = this; while (e.firstChild && 1 === e.firstChild.nodeType) e = e.firstChild; return e }).append(this) } return this }, wrapInner: function (e) { return x.isFunction(e) ? this.each(function (t) { x(this).wrapInner(e.call(this, t)) }) : this.each(function () { var t = x(this), n = t.contents(); n.length ? n.wrapAll(e) : t.append(e) }) }, wrap: function (e) { var t = x.isFunction(e); return this.each(function (n) { x(this).wrapAll(t ? e.call(this, n) : e) }) }, unwrap: function () { return this.parent().each(function () { x.nodeName(this, "body") || x(this).replaceWith(this.childNodes) }).end() } }); var Pt, Rt, Wt, $t = /alpha\([^)]*\)/i, It = /opacity\s*=\s*([^)]*)/, zt = /^(top|right|bottom|left)$/, Xt = /^(none|table(?!-c[ea]).+)/, Ut = /^margin/, Vt = RegExp("^(" + w + ")(.*)$", "i"), Yt = RegExp("^(" + w + ")(?!px)[a-z%]+$", "i"), Jt = RegExp("^([+-])=(" + w + ")", "i"), Gt = { BODY: "block" }, Qt = { position: "absolute", visibility: "hidden", display: "block" }, Kt = { letterSpacing: 0, fontWeight: 400 }, Zt = ["Top", "Right", "Bottom", "Left"], en = ["Webkit", "O", "Moz", "ms"]; function tn(e, t) { if (t in e) return t; var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = en.length; while (i--) if (t = en[i] + n, t in e) return t; return r } function nn(e, t) { return e = t || e, "none" === x.css(e, "display") || !x.contains(e.ownerDocument, e) } function rn(e, t) { var n, r, i, o = [], a = 0, s = e.length; for (; s > a; a++) r = e[a], r.style && (o[a] = x._data(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && nn(r) && (o[a] = x._data(r, "olddisplay", ln(r.nodeName)))) : o[a] || (i = nn(r), (n && "none" !== n || !i) && x._data(r, "olddisplay", i ? n : x.css(r, "display")))); for (a = 0; s > a; a++) r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none")); return e } x.fn.extend({ css: function (e, n) { return x.access(this, function (e, n, r) { var i, o, a = {}, s = 0; if (x.isArray(n)) { for (o = Rt(e), i = n.length; i > s; s++) a[n[s]] = x.css(e, n[s], !1, o); return a } return r !== t ? x.style(e, n, r) : x.css(e, n) }, e, n, arguments.length > 1) }, show: function () { return rn(this, !0) }, hide: function () { return rn(this) }, toggle: function (e) { return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () { nn(this) ? x(this).show() : x(this).hide() }) } }), x.extend({ cssHooks: { opacity: { get: function (e, t) { if (t) { var n = Wt(e, "opacity"); return "" === n ? "1" : n } } } }, cssNumber: { columnCount: !0, fillOpacity: !0, fontWeight: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: { "float": x.support.cssFloat ? "cssFloat" : "styleFloat" }, style: function (e, n, r, i) { if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) { var o, a, s, l = x.camelCase(n), u = e.style; if (n = x.cssProps[l] || (x.cssProps[l] = tn(u, l)), s = x.cssHooks[n] || x.cssHooks[l], r === t) return s && "get" in s && (o = s.get(e, !1, i)) !== t ? o : u[n]; if (a = typeof r, "string" === a && (o = Jt.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(x.css(e, n)), a = "number"), !(null == r || "number" === a && isNaN(r) || ("number" !== a || x.cssNumber[l] || (r += "px"), x.support.clearCloneStyle || "" !== r || 0 !== n.indexOf("background") || (u[n] = "inherit"), s && "set" in s && (r = s.set(e, r, i)) === t))) try { u[n] = r } catch (c) { } } }, css: function (e, n, r, i) { var o, a, s, l = x.camelCase(n); return n = x.cssProps[l] || (x.cssProps[l] = tn(e.style, l)), s = x.cssHooks[n] || x.cssHooks[l], s && "get" in s && (a = s.get(e, !0, r)), a === t && (a = Wt(e, n, i)), "normal" === a && n in Kt && (a = Kt[n]), "" === r || r ? (o = parseFloat(a), r === !0 || x.isNumeric(o) ? o || 0 : a) : a } }), e.getComputedStyle ? (Rt = function (t) { return e.getComputedStyle(t, null) }, Wt = function (e, n, r) { var i, o, a, s = r || Rt(e), l = s ? s.getPropertyValue(n) || s[n] : t, u = e.style; return s && ("" !== l || x.contains(e.ownerDocument, e) || (l = x.style(e, n)), Yt.test(l) && Ut.test(n) && (i = u.width, o = u.minWidth, a = u.maxWidth, u.minWidth = u.maxWidth = u.width = l, l = s.width, u.width = i, u.minWidth = o, u.maxWidth = a)), l }) : a.documentElement.currentStyle && (Rt = function (e) { return e.currentStyle }, Wt = function (e, n, r) { var i, o, a, s = r || Rt(e), l = s ? s[n] : t, u = e.style; return null == l && u && u[n] && (l = u[n]), Yt.test(l) && !zt.test(n) && (i = u.left, o = e.runtimeStyle, a = o && o.left, a && (o.left = e.currentStyle.left), u.left = "fontSize" === n ? "1em" : l, l = u.pixelLeft + "px", u.left = i, a && (o.left = a)), "" === l ? "auto" : l }); function on(e, t, n) { var r = Vt.exec(t); return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t } function an(e, t, n, r, i) { var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; for (; 4 > o; o += 2) "margin" === n && (a += x.css(e, n + Zt[o], !0, i)), r ? ("content" === n && (a -= x.css(e, "padding" + Zt[o], !0, i)), "margin" !== n && (a -= x.css(e, "border" + Zt[o] + "Width", !0, i))) : (a += x.css(e, "padding" + Zt[o], !0, i), "padding" !== n && (a += x.css(e, "border" + Zt[o] + "Width", !0, i))); return a } function sn(e, t, n) { var r = !0, i = "width" === t ? e.offsetWidth : e.offsetHeight, o = Rt(e), a = x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, o); if (0 >= i || null == i) { if (i = Wt(e, t, o), (0 > i || null == i) && (i = e.style[t]), Yt.test(i)) return i; r = a && (x.support.boxSizingReliable || i === e.style[t]), i = parseFloat(i) || 0 } return i + an(e, t, n || (a ? "border" : "content"), r, o) + "px" } function ln(e) { var t = a, n = Gt[e]; return n || (n = un(e, t), "none" !== n && n || (Pt = (Pt || x("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), t = (Pt[0].contentWindow || Pt[0].contentDocument).document, t.write("<!doctype html><html><body>"), t.close(), n = un(e, t), Pt.detach()), Gt[e] = n), n } function un(e, t) { var n = x(t.createElement(e)).appendTo(t.body), r = x.css(n[0], "display"); return n.remove(), r } x.each(["height", "width"], function (e, n) { x.cssHooks[n] = { get: function (e, r, i) { return r ? 0 === e.offsetWidth && Xt.test(x.css(e, "display")) ? x.swap(e, Qt, function () { return sn(e, n, i) }) : sn(e, n, i) : t }, set: function (e, t, r) { var i = r && Rt(e); return on(e, t, r ? an(e, n, r, x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, i), i) : 0) } } }), x.support.opacity || (x.cssHooks.opacity = { get: function (e, t) { return It.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : "" }, set: function (e, t) { var n = e.style, r = e.currentStyle, i = x.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "", o = r && r.filter || n.filter || ""; n.zoom = 1, (t >= 1 || "" === t) && "" === x.trim(o.replace($t, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || r && !r.filter) || (n.filter = $t.test(o) ? o.replace($t, i) : o + " " + i) } }), x(function () { x.support.reliableMarginRight || (x.cssHooks.marginRight = { get: function (e, n) { return n ? x.swap(e, { display: "inline-block" }, Wt, [e, "marginRight"]) : t } }), !x.support.pixelPosition && x.fn.position && x.each(["top", "left"], function (e, n) { x.cssHooks[n] = { get: function (e, r) { return r ? (r = Wt(e, n), Yt.test(r) ? x(e).position()[n] + "px" : r) : t } } }) }), x.expr && x.expr.filters && (x.expr.filters.hidden = function (e) { return 0 >= e.offsetWidth && 0 >= e.offsetHeight || !x.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || x.css(e, "display")) }, x.expr.filters.visible = function (e) { return !x.expr.filters.hidden(e) }), x.each({ margin: "", padding: "", border: "Width" }, function (e, t) { x.cssHooks[e + t] = { expand: function (n) { var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; for (; 4 > r; r++) i[e + Zt[r] + t] = o[r] || o[r - 2] || o[0]; return i } }, Ut.test(e) || (x.cssHooks[e + t].set = on) }); var cn = /%20/g, pn = /\[\]$/, fn = /\r?\n/g, dn = /^(?:submit|button|image|reset|file)$/i, hn = /^(?:input|select|textarea|keygen)/i; x.fn.extend({ serialize: function () { return x.param(this.serializeArray()) }, serializeArray: function () { return this.map(function () { var e = x.prop(this, "elements"); return e ? x.makeArray(e) : this }).filter(function () { var e = this.type; return this.name && !x(this).is(":disabled") && hn.test(this.nodeName) && !dn.test(e) && (this.checked || !Ct.test(e)) }).map(function (e, t) { var n = x(this).val(); return null == n ? null : x.isArray(n) ? x.map(n, function (e) { return { name: t.name, value: e.replace(fn, "\r\n") } }) : { name: t.name, value: n.replace(fn, "\r\n") } }).get() } }), x.param = function (e, n) { var r, i = [], o = function (e, t) { t = x.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t) }; if (n === t && (n = x.ajaxSettings && x.ajaxSettings.traditional), x.isArray(e) || e.jquery && !x.isPlainObject(e)) x.each(e, function () { o(this.name, this.value) }); else for (r in e) gn(r, e[r], n, o); return i.join("&").replace(cn, "+") }; function gn(e, t, n, r) { var i; if (x.isArray(t)) x.each(t, function (t, i) { n || pn.test(e) ? r(e, i) : gn(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r) }); else if (n || "object" !== x.type(t)) r(e, t); else for (i in t) gn(e + "[" + i + "]", t[i], n, r) } x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) { x.fn[t] = function (e, n) { return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t) } }), x.fn.extend({ hover: function (e, t) { return this.mouseenter(e).mouseleave(t || e) }, bind: function (e, t, n) { return this.on(e, null, t, n) }, unbind: function (e, t) { return this.off(e, null, t) }, delegate: function (e, t, n, r) { return this.on(t, e, n, r) }, undelegate: function (e, t, n) { return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n) } }); var mn, yn, vn = x.now(), bn = /\?/, xn = /#.*$/, wn = /([?&])_=[^&]*/, Tn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Cn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Nn = /^(?:GET|HEAD)$/, kn = /^\/\//, En = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, Sn = x.fn.load, An = {}, jn = {}, Dn = "*/".concat("*"); try { yn = o.href } catch (Ln) { yn = a.createElement("a"), yn.href = "", yn = yn.href } mn = En.exec(yn.toLowerCase()) || []; function Hn(e) { return function (t, n) { "string" != typeof t && (n = t, t = "*"); var r, i = 0, o = t.toLowerCase().match(T) || []; if (x.isFunction(n)) while (r = o[i++]) "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n) } } function qn(e, n, r, i) { var o = {}, a = e === jn; function s(l) { var u; return o[l] = !0, x.each(e[l] || [], function (e, l) { var c = l(n, r, i); return "string" != typeof c || a || o[c] ? a ? !(u = c) : t : (n.dataTypes.unshift(c), s(c), !1) }), u } return s(n.dataTypes[0]) || !o["*"] && s("*") } function _n(e, n) { var r, i, o = x.ajaxSettings.flatOptions || {}; for (i in n) n[i] !== t && ((o[i] ? e : r || (r = {}))[i] = n[i]); return r && x.extend(!0, e, r), e } x.fn.load = function (e, n, r) { if ("string" != typeof e && Sn) return Sn.apply(this, arguments); var i, o, a, s = this, l = e.indexOf(" "); return l >= 0 && (i = e.slice(l, e.length), e = e.slice(0, l)), x.isFunction(n) ? (r = n, n = t) : n && "object" == typeof n && (a = "POST"), s.length > 0 && x.ajax({ url: e, type: a, dataType: "html", data: n }).done(function (e) { o = arguments, s.html(i ? x("<div>").append(x.parseHTML(e)).find(i) : e) }).complete(r && function (e, t) { s.each(r, o || [e.responseText, t, e]) }), this }, x.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) { x.fn[t] = function (e) { return this.on(t, e) } }), x.extend({ active: 0, lastModified: {}, etag: {}, ajaxSettings: { url: yn, type: "GET", isLocal: Cn.test(mn[1]), global: !0, processData: !0, async: !0, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: { "*": Dn, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript" }, contents: { xml: /xml/, html: /html/, json: /json/ }, responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" }, converters: { "* text": String, "text html": !0, "text json": x.parseJSON, "text xml": x.parseXML }, flatOptions: { url: !0, context: !0 } }, ajaxSetup: function (e, t) { return t ? _n(_n(e, x.ajaxSettings), t) : _n(x.ajaxSettings, e) }, ajaxPrefilter: Hn(An), ajaxTransport: Hn(jn), ajax: function (e, n) { "object" == typeof e && (n = e, e = t), n = n || {}; var r, i, o, a, s, l, u, c, p = x.ajaxSetup({}, n), f = p.context || p, d = p.context && (f.nodeType || f.jquery) ? x(f) : x.event, h = x.Deferred(), g = x.Callbacks("once memory"), m = p.statusCode || {}, y = {}, v = {}, b = 0, w = "canceled", C = { readyState: 0, getResponseHeader: function (e) { var t; if (2 === b) { if (!c) { c = {}; while (t = Tn.exec(a)) c[t[1].toLowerCase()] = t[2] } t = c[e.toLowerCase()] } return null == t ? null : t }, getAllResponseHeaders: function () { return 2 === b ? a : null }, setRequestHeader: function (e, t) { var n = e.toLowerCase(); return b || (e = v[n] = v[n] || e, y[e] = t), this }, overrideMimeType: function (e) { return b || (p.mimeType = e), this }, statusCode: function (e) { var t; if (e) if (2 > b) for (t in e) m[t] = [m[t], e[t]]; else C.always(e[C.status]); return this }, abort: function (e) { var t = e || w; return u && u.abort(t), k(0, t), this } }; if (h.promise(C).complete = g.add, C.success = C.done, C.error = C.fail, p.url = ((e || p.url || yn) + "").replace(xn, "").replace(kn, mn[1] + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = x.trim(p.dataType || "*").toLowerCase().match(T) || [""], null == p.crossDomain && (r = En.exec(p.url.toLowerCase()), p.crossDomain = !(!r || r[1] === mn[1] && r[2] === mn[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (mn[3] || ("http:" === mn[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = x.param(p.data, p.traditional)), qn(An, p, n, C), 2 === b) return C; l = p.global, l && 0 === x.active++ && x.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Nn.test(p.type), o = p.url, p.hasContent || (p.data && (o = p.url += (bn.test(o) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = wn.test(o) ? o.replace(wn, "$1_=" + vn++) : o + (bn.test(o) ? "&" : "?") + "_=" + vn++)), p.ifModified && (x.lastModified[o] && C.setRequestHeader("If-Modified-Since", x.lastModified[o]), x.etag[o] && C.setRequestHeader("If-None-Match", x.etag[o])), (p.data && p.hasContent && p.contentType !== !1 || n.contentType) && C.setRequestHeader("Content-Type", p.contentType), C.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Dn + "; q=0.01" : "") : p.accepts["*"]); for (i in p.headers) C.setRequestHeader(i, p.headers[i]); if (p.beforeSend && (p.beforeSend.call(f, C, p) === !1 || 2 === b)) return C.abort(); w = "abort"; for (i in { success: 1, error: 1, complete: 1 }) C[i](p[i]); if (u = qn(jn, p, n, C)) { C.readyState = 1, l && d.trigger("ajaxSend", [C, p]), p.async && p.timeout > 0 && (s = setTimeout(function () { C.abort("timeout") }, p.timeout)); try { b = 1, u.send(y, k) } catch (N) { if (!(2 > b)) throw N; k(-1, N) } } else k(-1, "No Transport"); function k(e, n, r, i) { var c, y, v, w, T, N = n; 2 !== b && (b = 2, s && clearTimeout(s), u = t, a = i || "", C.readyState = e > 0 ? 4 : 0, c = e >= 200 && 300 > e || 304 === e, r && (w = Mn(p, C, r)), w = On(p, w, C, c), c ? (p.ifModified && (T = C.getResponseHeader("Last-Modified"), T && (x.lastModified[o] = T), T = C.getResponseHeader("etag"), T && (x.etag[o] = T)), 204 === e || "HEAD" === p.type ? N = "nocontent" : 304 === e ? N = "notmodified" : (N = w.state, y = w.data, v = w.error, c = !v)) : (v = N, (e || !N) && (N = "error", 0 > e && (e = 0))), C.status = e, C.statusText = (n || N) + "", c ? h.resolveWith(f, [y, N, C]) : h.rejectWith(f, [C, N, v]), C.statusCode(m), m = t, l && d.trigger(c ? "ajaxSuccess" : "ajaxError", [C, p, c ? y : v]), g.fireWith(f, [C, N]), l && (d.trigger("ajaxComplete", [C, p]), --x.active || x.event.trigger("ajaxStop"))) } return C }, getJSON: function (e, t, n) { return x.get(e, t, n, "json") }, getScript: function (e, n) { return x.get(e, t, n, "script") } }), x.each(["get", "post"], function (e, n) { x[n] = function (e, r, i, o) { return x.isFunction(r) && (o = o || i, i = r, r = t), x.ajax({ url: e, type: n, dataType: o, data: r, success: i }) } }); function Mn(e, n, r) { var i, o, a, s, l = e.contents, u = e.dataTypes; while ("*" === u[0]) u.shift(), o === t && (o = e.mimeType || n.getResponseHeader("Content-Type")); if (o) for (s in l) if (l[s] && l[s].test(o)) { u.unshift(s); break } if (u[0] in r) a = u[0]; else { for (s in r) { if (!u[0] || e.converters[s + " " + u[0]]) { a = s; break } i || (i = s) } a = a || i } return a ? (a !== u[0] && u.unshift(a), r[a]) : t } function On(e, t, n, r) { var i, o, a, s, l, u = {}, c = e.dataTypes.slice(); if (c[1]) for (a in e.converters) u[a.toLowerCase()] = e.converters[a]; o = c.shift(); while (o) if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift()) if ("*" === o) o = l; else if ("*" !== l && l !== o) { if (a = u[l + " " + o] || u["* " + o], !a) for (i in u) if (s = i.split(" "), s[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) { a === !0 ? a = u[i] : u[i] !== !0 && (o = s[0], c.unshift(s[1])); break } if (a !== !0) if (a && e["throws"]) t = a(t); else try { t = a(t) } catch (p) { return { state: "parsererror", error: a ? p : "No conversion from " + l + " to " + o } } } return { state: "success", data: t } } x.ajaxSetup({ accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, contents: { script: /(?:java|ecma)script/ }, converters: { "text script": function (e) { return x.globalEval(e), e } } }), x.ajaxPrefilter("script", function (e) { e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1) }), x.ajaxTransport("script", function (e) { if (e.crossDomain) { var n, r = a.head || x("head")[0] || a.documentElement; return { send: function (t, i) { n = a.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function (e, t) { (t || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, t || i(200, "success")) }, r.insertBefore(n, r.firstChild) }, abort: function () { n && n.onload(t, !0) } } } }); var Fn = [], Bn = /(=)\?(?=&|$)|\?\?/; x.ajaxSetup({ jsonp: "callback", jsonpCallback: function () { var e = Fn.pop() || x.expando + "_" + vn++; return this[e] = !0, e } }), x.ajaxPrefilter("json jsonp", function (n, r, i) { var o, a, s, l = n.jsonp !== !1 && (Bn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Bn.test(n.data) && "data"); return l || "jsonp" === n.dataTypes[0] ? (o = n.jsonpCallback = x.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, l ? n[l] = n[l].replace(Bn, "$1" + o) : n.jsonp !== !1 && (n.url += (bn.test(n.url) ? "&" : "?") + n.jsonp + "=" + o), n.converters["script json"] = function () { return s || x.error(o + " was not called"), s[0] }, n.dataTypes[0] = "json", a = e[o], e[o] = function () { s = arguments }, i.always(function () { e[o] = a, n[o] && (n.jsonpCallback = r.jsonpCallback, Fn.push(o)), s && x.isFunction(a) && a(s[0]), s = a = t }), "script") : t }); var Pn, Rn, Wn = 0, $n = e.ActiveXObject && function () { var e; for (e in Pn) Pn[e](t, !0) }; function In() { try { return new e.XMLHttpRequest } catch (t) { } } function zn() { try { return new e.ActiveXObject("Microsoft.XMLHTTP") } catch (t) { } } x.ajaxSettings.xhr = e.ActiveXObject ? function () { return !this.isLocal && In() || zn() } : In, Rn = x.ajaxSettings.xhr(), x.support.cors = !!Rn && "withCredentials" in Rn, Rn = x.support.ajax = !!Rn, Rn && x.ajaxTransport(function (n) { if (!n.crossDomain || x.support.cors) { var r; return { send: function (i, o) { var a, s, l = n.xhr(); if (n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), n.xhrFields) for (s in n.xhrFields) l[s] = n.xhrFields[s]; n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType), n.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"); try { for (s in i) l.setRequestHeader(s, i[s]) } catch (u) { } l.send(n.hasContent && n.data || null), r = function (e, i) { var s, u, c, p; try { if (r && (i || 4 === l.readyState)) if (r = t, a && (l.onreadystatechange = x.noop, $n && delete Pn[a]), i) 4 !== l.readyState && l.abort(); else { p = {}, s = l.status, u = l.getAllResponseHeaders(), "string" == typeof l.responseText && (p.text = l.responseText); try { c = l.statusText } catch (f) { c = "" } s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = p.text ? 200 : 404 } } catch (d) { i || o(-1, d) } p && o(s, c, p, u) }, n.async ? 4 === l.readyState ? setTimeout(r) : (a = ++Wn, $n && (Pn || (Pn = {}, x(e).unload($n)), Pn[a] = r), l.onreadystatechange = r) : r() }, abort: function () { r && r(t, !0) } } } }); var Xn, Un, Vn = /^(?:toggle|show|hide)$/, Yn = RegExp("^(?:([+-])=|)(" + w + ")([a-z%]*)$", "i"), Jn = /queueHooks$/, Gn = [nr], Qn = { "*": [function (e, t) { var n = this.createTween(e, t), r = n.cur(), i = Yn.exec(t), o = i && i[3] || (x.cssNumber[e] ? "" : "px"), a = (x.cssNumber[e] || "px" !== o && +r) && Yn.exec(x.css(n.elem, e)), s = 1, l = 20; if (a && a[3] !== o) { o = o || a[3], i = i || [], a = +r || 1; do s = s || ".5", a /= s, x.style(n.elem, e, a + o); while (s !== (s = n.cur() / r) && 1 !== s && --l) } return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), n }] }; function Kn() { return setTimeout(function () { Xn = t }), Xn = x.now() } function Zn(e, t, n) { var r, i = (Qn[t] || []).concat(Qn["*"]), o = 0, a = i.length; for (; a > o; o++) if (r = i[o].call(n, t, e)) return r } function er(e, t, n) { var r, i, o = 0, a = Gn.length, s = x.Deferred().always(function () { delete l.elem }), l = function () { if (i) return !1; var t = Xn || Kn(), n = Math.max(0, u.startTime + u.duration - t), r = n / u.duration || 0, o = 1 - r, a = 0, l = u.tweens.length; for (; l > a; a++) u.tweens[a].run(o); return s.notifyWith(e, [u, o, n]), 1 > o && l ? n : (s.resolveWith(e, [u]), !1) }, u = s.promise({ elem: e, props: x.extend({}, t), opts: x.extend(!0, { specialEasing: {} }, n), originalProperties: t, originalOptions: n, startTime: Xn || Kn(), duration: n.duration, tweens: [], createTween: function (t, n) { var r = x.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing); return u.tweens.push(r), r }, stop: function (t) { var n = 0, r = t ? u.tweens.length : 0; if (i) return this; for (i = !0; r > n; n++) u.tweens[n].run(1); return t ? s.resolveWith(e, [u, t]) : s.rejectWith(e, [u, t]), this } }), c = u.props; for (tr(c, u.opts.specialEasing) ; a > o; o++) if (r = Gn[o].call(u, e, c, u.opts)) return r; return x.map(c, Zn, u), x.isFunction(u.opts.start) && u.opts.start.call(e, u), x.fx.timer(x.extend(l, { elem: e, anim: u, queue: u.opts.queue })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always) } function tr(e, t) { var n, r, i, o, a; for (n in e) if (r = x.camelCase(n), i = t[r], o = e[n], x.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = x.cssHooks[r], a && "expand" in a) { o = a.expand(o), delete e[r]; for (n in o) n in e || (e[n] = o[n], t[n] = i) } else t[r] = i } x.Animation = x.extend(er, { tweener: function (e, t) { x.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" "); var n, r = 0, i = e.length; for (; i > r; r++) n = e[r], Qn[n] = Qn[n] || [], Qn[n].unshift(t) }, prefilter: function (e, t) { t ? Gn.unshift(e) : Gn.push(e) } }); function nr(e, t, n) { var r, i, o, a, s, l, u = this, c = {}, p = e.style, f = e.nodeType && nn(e), d = x._data(e, "fxshow"); n.queue || (s = x._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function () { s.unqueued || l() }), s.unqueued++, u.always(function () { u.always(function () { s.unqueued--, x.queue(e, "fx").length || s.empty.fire() }) })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], "inline" === x.css(e, "display") && "none" === x.css(e, "float") && (x.support.inlineBlockNeedsLayout && "inline" !== ln(e.nodeName) ? p.zoom = 1 : p.display = "inline-block")), n.overflow && (p.overflow = "hidden", x.support.shrinkWrapBlocks || u.always(function () { p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2] })); for (r in t) if (i = t[r], Vn.exec(i)) { if (delete t[r], o = o || "toggle" === i, i === (f ? "hide" : "show")) continue; c[r] = d && d[r] || x.style(e, r) } if (!x.isEmptyObject(c)) { d ? "hidden" in d && (f = d.hidden) : d = x._data(e, "fxshow", {}), o && (d.hidden = !f), f ? x(e).show() : u.done(function () { x(e).hide() }), u.done(function () { var t; x._removeData(e, "fxshow"); for (t in c) x.style(e, t, c[t]) }); for (r in c) a = Zn(f ? d[r] : 0, r, u), r in d || (d[r] = a.start, f && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0)) } } function rr(e, t, n, r, i) { return new rr.prototype.init(e, t, n, r, i) } x.Tween = rr, rr.prototype = { constructor: rr, init: function (e, t, n, r, i, o) { this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (x.cssNumber[n] ? "" : "px") }, cur: function () { var e = rr.propHooks[this.prop]; return e && e.get ? e.get(this) : rr.propHooks._default.get(this) }, run: function (e) { var t, n = rr.propHooks[this.prop]; return this.pos = t = this.options.duration ? x.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : rr.propHooks._default.set(this), this } }, rr.prototype.init.prototype = rr.prototype, rr.propHooks = { _default: { get: function (e) { var t; return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = x.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop] }, set: function (e) { x.fx.step[e.prop] ? x.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[x.cssProps[e.prop]] || x.cssHooks[e.prop]) ? x.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now } } }, rr.propHooks.scrollTop = rr.propHooks.scrollLeft = { set: function (e) { e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now) } }, x.each(["toggle", "show", "hide"], function (e, t) { var n = x.fn[t]; x.fn[t] = function (e, r, i) { return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(ir(t, !0), e, r, i) } }), x.fn.extend({ fadeTo: function (e, t, n, r) { return this.filter(nn).css("opacity", 0).show().end().animate({ opacity: t }, e, n, r) }, animate: function (e, t, n, r) { var i = x.isEmptyObject(e), o = x.speed(t, n, r), a = function () { var t = er(this, x.extend({}, e), o); (i || x._data(this, "finish")) && t.stop(!0) }; return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a) }, stop: function (e, n, r) { var i = function (e) { var t = e.stop; delete e.stop, t(r) }; return "string" != typeof e && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function () { var t = !0, n = null != e && e + "queueHooks", o = x.timers, a = x._data(this); if (n) a[n] && a[n].stop && i(a[n]); else for (n in a) a[n] && a[n].stop && Jn.test(n) && i(a[n]); for (n = o.length; n--;) o[n].elem !== this || null != e && o[n].queue !== e || (o[n].anim.stop(r), t = !1, o.splice(n, 1)); (t || !r) && x.dequeue(this, e) }) }, finish: function (e) { return e !== !1 && (e = e || "fx"), this.each(function () { var t, n = x._data(this), r = n[e + "queue"], i = n[e + "queueHooks"], o = x.timers, a = r ? r.length : 0; for (n.finish = !0, x.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1)); for (t = 0; a > t; t++) r[t] && r[t].finish && r[t].finish.call(this); delete n.finish }) } }); function ir(e, t) { var n, r = { height: e }, i = 0; for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = Zt[i], r["margin" + n] = r["padding" + n] = e; return t && (r.opacity = r.width = e), r } x.each({ slideDown: ir("show"), slideUp: ir("hide"), slideToggle: ir("toggle"), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function (e, t) { x.fn[e] = function (e, n, r) { return this.animate(t, e, n, r) } }), x.speed = function (e, t, n) { var r = e && "object" == typeof e ? x.extend({}, e) : { complete: n || !n && t || x.isFunction(e) && e, duration: e, easing: n && t || t && !x.isFunction(t) && t }; return r.duration = x.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in x.fx.speeds ? x.fx.speeds[r.duration] : x.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function () { x.isFunction(r.old) && r.old.call(this), r.queue && x.dequeue(this, r.queue) }, r }, x.easing = { linear: function (e) { return e }, swing: function (e) { return .5 - Math.cos(e * Math.PI) / 2 } }, x.timers = [], x.fx = rr.prototype.init, x.fx.tick = function () { var e, n = x.timers, r = 0; for (Xn = x.now() ; n.length > r; r++) e = n[r], e() || n[r] !== e || n.splice(r--, 1); n.length || x.fx.stop(), Xn = t }, x.fx.timer = function (e) { e() && x.timers.push(e) && x.fx.start() }, x.fx.interval = 13, x.fx.start = function () { Un || (Un = setInterval(x.fx.tick, x.fx.interval)) }, x.fx.stop = function () { clearInterval(Un), Un = null }, x.fx.speeds = { slow: 600, fast: 200, _default: 400 }, x.fx.step = {}, x.expr && x.expr.filters && (x.expr.filters.animated = function (e) { return x.grep(x.timers, function (t) { return e === t.elem }).length }), x.fn.offset = function (e) { if (arguments.length) return e === t ? this : this.each(function (t) { x.offset.setOffset(this, e, t) }); var n, r, o = { top: 0, left: 0 }, a = this[0], s = a && a.ownerDocument; if (s) return n = s.documentElement, x.contains(n, a) ? (typeof a.getBoundingClientRect !== i && (o = a.getBoundingClientRect()), r = or(s), { top: o.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0), left: o.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0) }) : o }, x.offset = { setOffset: function (e, t, n) { var r = x.css(e, "position"); "static" === r && (e.style.position = "relative"); var i = x(e), o = i.offset(), a = x.css(e, "top"), s = x.css(e, "left"), l = ("absolute" === r || "fixed" === r) && x.inArray("auto", [a, s]) > -1, u = {}, c = {}, p, f; l ? (c = i.position(), p = c.top, f = c.left) : (p = parseFloat(a) || 0, f = parseFloat(s) || 0), x.isFunction(t) && (t = t.call(e, n, o)), null != t.top && (u.top = t.top - o.top + p), null != t.left && (u.left = t.left - o.left + f), "using" in t ? t.using.call(e, u) : i.css(u) } }, x.fn.extend({ position: function () { if (this[0]) { var e, t, n = { top: 0, left: 0 }, r = this[0]; return "fixed" === x.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), x.nodeName(e[0], "html") || (n = e.offset()), n.top += x.css(e[0], "borderTopWidth", !0), n.left += x.css(e[0], "borderLeftWidth", !0)), { top: t.top - n.top - x.css(r, "marginTop", !0), left: t.left - n.left - x.css(r, "marginLeft", !0) } } }, offsetParent: function () { return this.map(function () { var e = this.offsetParent || s; while (e && !x.nodeName(e, "html") && "static" === x.css(e, "position")) e = e.offsetParent; return e || s }) } }), x.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (e, n) { var r = /Y/.test(n); x.fn[e] = function (i) { return x.access(this, function (e, i, o) { var a = or(e); return o === t ? a ? n in a ? a[n] : a.document.documentElement[i] : e[i] : (a ? a.scrollTo(r ? x(a).scrollLeft() : o, r ? o : x(a).scrollTop()) : e[i] = o, t) }, e, i, arguments.length, null) } }); function or(e) { return x.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1 } x.each({ Height: "height", Width: "width" }, function (e, n) { x.each({ padding: "inner" + e, content: n, "": "outer" + e }, function (r, i) { x.fn[i] = function (i, o) { var a = arguments.length && (r || "boolean" != typeof i), s = r || (i === !0 || o === !0 ? "margin" : "border"); return x.access(this, function (n, r, i) { var o; return x.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (o = n.documentElement, Math.max(n.body["scroll" + e], o["scroll" + e], n.body["offset" + e], o["offset" + e], o["client" + e])) : i === t ? x.css(n, r, s) : x.style(n, r, i, s) }, n, a ? i : t, a, null) } }) }), x.fn.size = function () { return this.length }, x.fn.andSelf = x.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = x : (e.jQuery = e.$ = x, "function" == typeof define && define.amd && define("jquery", [], function () { return x }))
})(window);

var mn_items = [
	[2, "Weapons", , [
		[, "One-Handed", "?items=2&filter=ty=15:13:0:4:7;"],
		[15, "Daggers"],
		[13, "Fist Weapons"],
		[0, "One-Handed Axes"],
		[4, "One-Handed Maces"],
		[7, "One-Handed Swords"],
		[, "Two-Handed", "?items=2&filter=ty=6:10:1:5:8;"],
		[6, "Polearms"],
		[10, "Staves"],
		[1, "Two-Handed Axes"],
		[5, "Two-Handed Maces"],
		[8, "Two-Handed Swords"],
		[, "Ranged", "?items=2&filter=ty=2:18:3:16:19;"],
		[2, "Bows"],
		[18, "Crossbows"],
		[3, "Guns"],
		[16, "Thrown"],
		[19, "Wands"],
		[, "Other", "?items=2&filter=ty=20:14;"],
		[20, "Fishing Poles"],
		[14, "Miscellaneous"]
	]],
	[4, "Armor", , [
		[, "By Type", "?items=4&filter=ty=1:2:3:4;"],
		[1, "Cloth", , [
			[5, "Chest"],
			[8, "Feet"],
			[10, "Hands"],
			[1, "Head"],
			[7, "Legs"],
			[3, "Shoulder"],
			[6, "Waist"],
			[9, "Wrist"]
		]],
		[2, "Leather", , [
			[5, "Chest"],
			[8, "Feet"],
			[10, "Hands"],
			[1, "Head"],
			[7, "Legs"],
			[3, "Shoulder"],
			[6, "Waist"],
			[9, "Wrist"]
		]],
		[3, "Mail", , [
			[5, "Chest"],
			[8, "Feet"],
			[10, "Hands"],
			[1, "Head"],
			[7, "Legs"],
			[3, "Shoulder"],
			[6, "Waist"],
			[9, "Wrist"]
		]],
		[4, "Plate", , [
			[5, "Chest"],
			[8, "Feet"],
			[10, "Hands"],
			[1, "Head"],
			[7, "Legs"],
			[3, "Shoulder"],
			[6, "Waist"],
			[9, "Wrist"]
		]],
		[, "Other", "?items=4&filter=sl=16:23:14:4:19;"],
		[16, "Cloaks"],
		[6, "Shields"],
		[0, "Miscellaneous", , [
			[2, "Amulets"],
			[4, "Shirts"],
			[11, "Rings"],
			[12, "Trinkets"],
			[19, "Tabards"],
			[23, "Off-hand Frills"]
		]],
		[, "Relics", "?items=4&filter=sl=28;"],
		[8, "Idols"],
		[7, "Librams"],
		[9, "Totems"]
	]],
	[1, "Containers", , [
		[0, "Bags"],
		[3, "Enchanting Bags"],
		[2, "Herb Bags"],
		[1, "Soul Bags"]
	]],
	[0, "Consumables", , [
		[5, "Bandages"],
		[0, "Consumables"],
		[2, "Elixirs"],
		[3, "Flasks"],
		[7, "Food & Drink"],
		[6, "Item Enhancements (Permanent)"],
		[1, "Potions"],
		[4, "Scrolls"],
		[8, "Other"]
	]],
	[7, "Trade Goods", , [
		[14, "Armor Enchantments"],
		[5, "Cloth"],
		[3, "Devices"],
		[10, "Elemental"],
		[12, "Enchanting"],
		[2, "Explosives"],
		[9, "Herbs"],
		[6, "Leather"],
		[13, "Materials"],
		[8, "Meat"],
		[7, "Metal & Stone"],
		[1, "Parts"],
		[15, "Weapon Enchantments"],
		[11, "Other"]
	]],
	[6, "Projectiles", , [
		[2, "Arrows"],
		[3, "Bullets"]
	]],
	[11, "Quivers", , [
		[3, "Ammo Pouches"],
		[2, "Quivers"]
	]],
	[9, "Recipes", , [
		[0, "Books"],
		[6, "Alchemy"],
		[4, "Blacksmithing"],
		[5, "Cooking"],
		[8, "Enchanting"],
		[3, "Engineering"],
		[7, "First Aid"],
		[9, "Fishing"],
		[1, "Leatherworking"],
		[2, "Tailoring"]
	]],
	[15, "Miscellaneous", , [
		[3, "Holiday"],
		[0, "Junk"],
		[1, "Reagents"],
		[5, "Mounts"],
		[2, "Companions"],
		[4, "Other"]
	]],
	[12, "Quest"],
	[13, "Keys"]
];
/* mn_items[0].tinyIcon = "achievement_boss_onyxia";
mn_items[2].tinyIcon = "spell_nature_starfall";
mn_items[3].tinyIcon = "inv_misc_head_dragon_black";
mn_items[4].tinyIcon = "achievement_dungeon_naxxramas_normal"; */
var mn_itemSets = [
	[11, "Druid"],
	[3, "Hunter"],
	[8, "Mage"],
	[2, "Paladin"],
	[5, "Priest"],
	[4, "Rogue"],
	[7, "Shaman"],
	[9, "Warlock"],
	[1, "Warrior"]
];
var mn_npcs = [
	[1, "Beasts"],
	[8, "Critters"],
	[3, "Demons"],
	[2, "Dragonkin"],
	[4, "Elementals"],
	[5, "Giants"],
	[7, "Humanoids"],
	[9, "Mechanicals"],
	[6, "Undead"],
	[10, "Uncategorized"]
];
var mn_objects = [
	[9, "Books"],
	[3, "Containers"],
	[-5, "Footlockers"],
	[-3, "Herbs"],
	[-4, "Mineral Veins"],
	[-2, "Quest"]
];
var mn_quests = [
	[0, "Eastern Kingdoms", , [
		[36, "Alterac Mountains"],
		[45, "Arathi Highlands"],
		[3, "Badlands"],
		[25, "Blackrock Mountain"],
		[4, "Blasted Lands"],
		[46, "Burning Steppes"],
		[41, "Deadwind Pass"],
		[2257, "Deeprun Tram"],
		[1, "Dun Morogh"],
		[10, "Duskwood"],
		[139, "Eastern Plaguelands"],
		[12, "Elwynn Forest"],
		[9, "Northshire Abbey (Elwynn Forest)"],
		[267, "Hillsbrad Foothills"],
		[1537, "Ironforge"],
		[38, "Loch Modan"],
		[44, "Redridge Mountains"],
		[51, "Searing Gorge"],
		[130, "Silverpine Forest"],
		[1519, "Stormwind City"],
		[33, "Stranglethorn Vale"],
		[8, "Swamp of Sorrows"],
		[47, "The Hinterlands"],
		[85, "Tirisfal Glades"],
		[1497, "Undercity"],
		[28, "Western Plaguelands"],
		[40, "Westfall"],
		[11, "Wetlands"]
	]],
	[1, "Kalimdor", , [
		[331, "Ashenvale"],
		[16, "Azshara"],
		[148, "Darkshore"],
		[1657, "Darnassus"],
		[405, "Desolace"],
		[14, "Durotar"],
		[15, "Dustwallow Marsh"],
		[361, "Felwood"],
		[357, "Feralas"],
		[493, "Moonglade"],
		[215, "Mulgore"],
		[1637, "Orgrimmar"],
		[1377, "Silithus"],
		[406, "Stonetalon Mountains"],
		[440, "Tanaris"],
		[141, "Teldrassil"],
		[17, "The Barrens"],
		[400, "Thousand Needles"],
		[1638, "Thunder Bluff"],
		//[1216,"Timbermaw Hold"],
		[490, "Un'Goro Crater"],
		[618, "Winterspring"]
	]],
	[2, "Dungeons", , [
		[719, "Blackfathom Deeps"],
		[1584, "Blackrock Depths"],
		[1583, "Blackrock Spire"],
		[2557, "Dire Maul"],
		[133, "Gnomeregan"],
		[2100, "Maraudon"],
		[2437, "Ragefire Chasm"],
		[722, "Razorfen Downs"],
		[1717, "Razorfen Kraul"],
		[796, "Scarlet Monastery"],
		[2057, "Scholomance"],
		[209, "Shadowfang Keep"],
		[2017, "Stratholme"],
		[1417, "Sunken Temple"],
		[1581, "The Deadmines"],
		[717, "The Stockade"],
		[1517, "Uldaman"],
		[718, "Wailing Caverns"],
		[978, "Zul'Farrak"]
	]],
	[3, "Raids", , [
		[2677, "Blackwing Lair"],
		/* [3606,"Hyjal Summit"], */
		[2717, "Molten Core"],
		[3456, "Naxxramas"],
		[2159, "Onyxia's Lair"],
		[3429, "Ruins of Ahn'Qiraj"],
		[3428, "Temple of Ahn'Qiraj"],
		[19, "Zul'Gurub"]
	]],
	[4, "Classes", , [
		[-263, "Druid"],
		[-261, "Hunter"],
		[-161, "Mage"],
		[-141, "Paladin"],
		[-262, "Priest"],
		[-162, "Rogue"],
		[-82, "Shaman"],
		[-61, "Warlock"],
		[-81, "Warrior"]
	]],
	[5, "Professions", , [
		[-181, "Alchemy"],
		[-121, "Blacksmithing"],
		[-304, "Cooking"],
		[-201, "Engineering"],
		[-324, "First Aid"],
		[-101, "Fishing"],
		[-24, "Herbalism"],
		[-182, "Leatherworking"],
		[-264, "Tailoring"]
	]],
	[6, "Battlegrounds", , [
		[2597, "Alterac Valley"],
		[3358, "Arathi Basin"],
		[-25, "Battlegrounds"],
		[3277, "Warsong Gulch"]
	]],
	[9, "World Events", , [
		[-370, "Brewfest"],
		[-284, "Children's Week"],
		[-364, "Darkmoon Faire"],
		[-41, "Day of the Dead"],
		[-22, "Hallow's End"],
		[-22, "Harvest Festival"],
		[-22, "Love is in the Air"],
		[-22, "Lunar Festival"],
		[-369, "Midsummer"],
		[-22, "New Year's Eve"],
		[-375, "Pilgrim's Bounty"],
		[-374, "Noblegarden"],
		[-22, "Winter Veil"]
	]],
	[7, "Miscellaneous", , [
		[-365, "Ahn'Qiraj War Effort"],
		[-1, "Epic"],
		[-344, "Legendary"],
		[-367, "Reputation"],
		[-368, "Scourge Invasion"],
	]],
	[-2, "Uncategorized"]
];
var mn_titles = [
	[0, "General"],
	[4, "Quests"],
	[1, "Player vs. Player"],
	[3, "Dungeons & Raids"],
	[5, "Professions"],
	[2, "Reputation"],
	[6, "World Events"]
];
var mn_spells = [
	[, "Character"],
	[7, "Class Skills", , [
		[11, "Druid", , [
			[574, "Balance"],
			[134, "Feral Combat"],
			[573, "Restoration"]
		]],
		[3, "Hunter", , [
			[50, "Beast Mastery"],
			[163, "Marksmanship"],
			[51, "Survival"]
		]],
		[8, "Mage", , [
			[237, "Arcane"],
			[8, "Fire"],
			[6, "Frost"]
		]],
		[2, "Paladin", , [
			[594, "Holy"],
			[267, "Protection"],
			[184, "Retribution"]
		]],
		[5, "Priest", , [
			[613, "Discipline"],
			[56, "Holy"],
			[78, "Shadow Magic"]
		]],
		[4, "Rogue", , [
			[253, "Assassination"],
			[38, "Combat"],
			[39, "Subtlety"],
			[633, "Lockpicking"]
		]],
		[7, "Shaman", , [
			[375, "Elemental Combat"],
			[373, "Enhancement"],
			[374, "Restoration"]
		]],
		[9, "Warlock", , [
			[355, "Affliction"],
			[354, "Demonology"],
			[593, "Destruction"]
		]],
		[1, "Warrior", , [
			[26, "Arms"],
			[256, "Fury"],
			[257, "Protection"]
		]]
	]],
	[-2, "Talents", , [
		[11, "Druid", , [
			[574, "Balance"],
			[134, "Feral Combat"],
			[573, "Restoration"]
		]],
		[3, "Hunter", , [
			[50, "Beast Mastery"],
			[163, "Marksmanship"],
			[51, "Survival"]
		]],
		[8, "Mage", , [
			[237, "Arcane"],
			[8, "Fire"],
			[6, "Frost"]
		]],
		[2, "Paladin", , [
			[594, "Holy"],
			[267, "Protection"],
			[184, "Retribution"]
		]],
		[5, "Priest", , [
			[613, "Discipline"],
			[56, "Holy"],
			[78, "Shadow Magic"]
		]],
		[4, "Rogue", , [
			[253, "Assassination"],
			[38, "Combat"],
			[39, "Subtlety"]
		]],
		[7, "Shaman", , [
			[375, "Elemental Combat"],
			[373, "Enhancement"],
			[374, "Restoration"]
		]],
		[9, "Warlock", , [
			[355, "Affliction"],
			[354, "Demonology"],
			[593, "Destruction"]
		]],
		[1, "Warrior", , [
			[26, "Arms"],
			[256, "Fury"],
			[257, "Protection"]
		]]
	]],
	[-4, "Racial Traits"],
	/* [-3,"Pet Skills",,[
		[,"Hunter"],
		[270,"Generic"],
		[653,"Bat"],
		[210,"Bear"],
		[211,"Boar"],
		[209,"Cat"],
		[214,"Crab"],
		[212,"Crocolisk"],
		[215,"Gorilla"],
		[654,"Hyena"],
		[217,"Raptor"],
		[236,"Scorpid"],
		[768,"Serpent"],
		[203,"Spider"],
		[218,"Tallstrider"],
		[251,"Turtle"],
		[208,"Wolf"],
		[,"Warlock"],
		[189,"Felhunter"],
		[188,"Imp"],
		[205,"Succubus"],
		[204,"Voidwalker"]
	]], */
	[, "Professions & skills"],
	[11, "Professions", , [
		[171, "Alchemy"],
		[164, "Blacksmithing"/* ,,[
			[9788,"Armorsmithing"],
			[9787,"Weaponsmithing"],
			[17041,"Master Axesmithing"],
			[17040,"Master Hammersmithing"],
			[17039,"Master Swordsmithing"]
		] */],
		[333, "Enchanting"],
		[202, "Engineering"/* ,,[
			[20219,"Gnomish Engineering"],
			[20222,"Goblin Engineering"]
		] */],
		[182, "Herbalism"],
		[165, "Leatherworking"/* ,,[
			[10656,"Dragonscale Leatherworking"],
			[10658,"Elemental Leatherworking"],
			[10660,"Tribal Leatherworking"]
		] */],
		[186, "Mining"],
		[393, "Skinning"],
		[197, "Tailoring"]
	]],
	[9, "Secondary Skills", , [
		[185, "Cooking"],
		[129, "First Aid"],
		[356, "Fishing"],
		[762, "Riding"]
	]],
	[, "Other"],
	[8, "Armor Proficiencies"],
	//[-6,"Companions"],
	[10, "Languages"],
	//[-5,"Mounts"],
	[6, "Weapon Skills"],
	[0, "Uncategorized"]
];
var mn_zones = [
	[0, "Eastern Kingdoms"],
	[1, "Kalimdor"],
	[8, "Outland"],
	[2, "Dungeons"],
	[3, "Raids"],
	[6, "Battlegrounds"]
];
var mn_factions = [
		[469, "Alliance"],
		[891, "Alliance Forces"],
		[67, "Horde"],
		[892, "Horde Forces"],
		[169, "Steamwheedle Cartel"],
	[0, "Other"]
];
var mn_pets = [
	[2, "Cunning"],
	[0, "Ferocity"],
	[1, "Tenacity"]
];
var mn_achievements = [
	[92, "General"],
	[96, "Quests", , [
		[14861, "Classic"],
		[14862, "The Burning Crusade"],
		[14863, "Wrath of the Lich King"]
	]],
	[97, "Exploration", , [
		[14777, "Eastern Kingdoms"],
		[14778, "Kalimdor"],
		[14779, "Outland"],
		[14780, "Northrend"]
	]],
	[95, "Player vs. Player", , [
		[165, "Arena"],
		[14801, "Alterac Valley"],
		[14802, "Arathi Basin"],
		[14803, "Eye of the Storm"],
		[14804, "Warsong Gulch"],
		[14881, "Strand of the Ancients"],
		[14901, "Wintergrasp"],
		[15003, "Isle of Conquest"]
	]],
	[168, "Dungeons & Raids", , [
		[14808, "Classic"],
		[14805, "The Burning Crusade"],
		[14806, "Lich King Dungeon"],
		[14921, "Lich King Heroic"],
		[14922, "Lich King 10-Player Raid"],
		[14923, "Lich King 25-Player Raid"],
		[14961, "Secrets of Ulduar 10-Player Raid"],
		[14962, "Secrets of Ulduar 25-Player Raid"],
		[15001, "Call of the Crusade 10-Player Raid"],
		[15002, "Call of the Crusade 25-Player Raid"],
		[15041, "Fall of the Lich King 10-Player Raid"],
		[15042, "Fall of the Lich King 25-Player Raid"]
	]],
	[169, "Professions", , [
		[170, "Cooking"],
		[171, "Fishing"],
		[172, "First Aid"]
	]],
	[201, "Reputation", , [
		[14864, "Classic"],
		[14865, "The Burning Crusade"],
		[14866, "Wrath of the Lich King"]
	]],
	[155, "World Events", , [
		[160, "Lunar Festival"],
		[187, "Love is in the Air"],
		[159, "Noblegarden"],
		[163, "Children's Week"],
		[161, "Midsummer"],
		[162, "Brewfest"],
		[158, "Hallow's End"],
		[14981, "Pilgrim's Bounty"],
		[156, "Winter Veil"],
		[14941, "Argent Tournament"]
	]],
	[81, "Feats of Strength"]
];
var mn_talentCalc = [
	[11, "Druid", "?talent#0"],
	[3, "Hunter", "?talent#c"],
	[8, "Mage", "?talent#o"],
	[2, "Paladin", "?talent#s"],
	[5, "Priest", "?talent#b"],
	[4, "Rogue", "?talent#f"],
	[7, "Shaman", "?talent#h"],
	[9, "Warlock", "?talent#I"],
	[1, "Warrior", "?talent#L"],
	[31, "Druid", "?talent#x"],
	[23, "Hunter", "?talent#e"],
	[28, "Mage", "?talent#l"],
	[22, "Paladin", "?talent#D"],
	[25, "Priest", "?talent#J"],
	[24, "Rogue", "?talent#P"],
	[27, "Shaman", "?talent#U"],
	[29, "Warlock", "?talent#Y"],
	[21, "Warrior", "?talent#2"]
];
var mn_petCalc = [
	[24, "Bat", "?petcalc#MR"],
	[4, "Bear", "?petcalc#0R"],
	[26, "Bird of Prey", "?petcalc#Mb"],
	[5, "Boar", "?petcalc#0a"],
	[7, "Carrion Bird", "?petcalc#0r"],
	[2, "Cat", "?petcalc#0m"],
	[45, "Core Hound", "?petcalc#ma"],
	[38, "Chimaera", "?petcalc#cw"],
	[8, "Crab", "?petcalc#0w"],
	[6, "Crocolisk", "?petcalc#0b"],
	[39, "Devilsaur", "?petcalc#ch"],
	[30, "Dragonhawk", "?petcalc#c0"],
	[9, "Gorilla", "?petcalc#0h"],
	[25, "Hyena", "?petcalc#Ma"],
	[37, "Moth", "?petcalc#cr"],
	[34, "Nether Ray", "?petcalc#cR"],
	[11, "Raptor", "?petcalc#zM"],
	[31, "Ravager", "?petcalc#cM"],
	[43, "Rhino", "?petcalc#mo"],
	[20, "Scorpid", "?petcalc#M0"],
	[35, "Serpent", "?petcalc#ca"],
	[41, "Silithid", "?petcalc#mM"],
	[3, "Spider", "?petcalc#0o"],
	[46, "Spirit Beast", "?petcalc#mb"],
	[33, "Sporebat", "?petcalc#co"],
	[12, "Tallstrider", "?petcalc#zm"],
	[21, "Turtle", "?petcalc#MM"],
	[32, "Warp Stalker", "?petcalc#cm"],
	[44, "Wasp", "?petcalc#mR"],
	[27, "Wind Serpent", "?petcalc#Mr"],
	[1, "Wolf", "?petcalc#0M"],
	[42, "Worm", "?petcalc#mm"]
];
var mn_holidays = [
	[1, "Holidays", "?events=1"],
	[2, "Recurring", "?events=2"],
	[3, "Player vs. Player", "?events=3"]
];
var mn_database = [
	[0, "Items", "?items", mn_items],
	[2, "Item Sets", "?itemsets"/*,mn_itemSets*/],
	[4, "NPCs", "?npcs", mn_npcs],
	[3, "Quests", "?quests", mn_quests],
	[6, "Zones", "?zones", mn_zones],
	[1, "Spells", "?spells", mn_spells],
	//[9,"Achievements","?achievements",mn_achievements],
	[5, "Objects", "?objects", mn_objects],
	[7, "Factions", "?factions=1118", mn_factions],
	//[10,"Titles","?titles",mn_titles],
	//[8,"Hunter Pets","?pets",mn_pets],
	[11, "World Events", "?events"/*,mn_holidays*/],
	//[8,"Users","?users"]
];
var mn_tools = [
	[0, "Talent Calculator", "?talent", mn_talentCalc],
	//[2,"Hunter Pet Calculator","?petcalc",mn_petCalc],
	//[5,"Profiler","?profiles"],
	//[3,"Item Comparison","?compare"],
	[1, "Maps", "?maps"],
	[, "Other"],
	[6, "Guides", "?guide", [
		[6, "PvE", "?guide=pve"],
		[, "Expansions"],
		[3, "Cataclysm", "?guide=cataclysm"],
		[2, "Wrath of the Lich King", "?guide=wotlk"],
		[, "Patches"],
		[0, "3.3: Fall of the Lich King", "?guide=3.3"],
		[, "World Events"],
		[5, "Lunar Festival", "?guide=lunar-festival"],
		[4, "Love is in the Air", "?guide=love-is-in-the-air"],
		[1, "Feast of Winter Veil", "?guide=winter-veil"]
	]],
	[4, "Patch Notes", "", [
		[, "Wrath of the Lich King"],
		[14, "3.3.3", "?patchnotes=3.3.3"],
		[13, "3.3.2", "?patchnotes=3.3.2"],
		[12, "3.3.0", "?patchnotes=3.3.0"],
		[0, "3.2.2", "?patchnotes=3.2.2"],
		[1, "3.2.0", "?patchnotes=3.2.0"],
		[2, "3.1.3", "?patchnotes=3.1.3"],
		[3, "3.1.2", "?patchnotes=3.1.2"],
		[4, "3.1.0", "?patchnotes=3.1.0"],
		[5, "3.0.9", "?patchnotes=3.0.9"],
		[6, "3.0.8", "?patchnotes=3.0.8"],
		[7, "3.0.3", "?patchnotes=3.0.3"],
		[8, "3.0.2", "?patchnotes=3.0.2"],
		[, "The Burning Crusade"],
		[9, "2.4.3", "?patchnotes=2.4.3"],
		[10, "2.4.2", "?patchnotes=2.4.2"],
		[11, "2.4.0", "?patchnotes=2.4.0"]
	]],
	/* [8,"Utilities",,[
		[,"Database"],
		[0,"Latest Additions","?latest-additions"],
		[1,"Latest Articles","?latest-articles"],
		[2,"Latest Comments","?latest-comments"],
		[3,"Latest Screenshots","?latest-screenshots"],
		[9,"New Items in Patch",,[
			[2,"3.3","?new-items=3.3"],
			[1,"3.2","?new-items=3.2"],
			[0,"3.1","?new-items=3.1"]
		]],
		[4,"Random Page","?random"],
		[5,"Unrated Comments","?unrated-comments"],
		[,"Forums"],
		[6,"Latest Replies","?latest-replies"],
		[7,"Latest Topics","?latest-topics"],
		[8,"Unanswered Topics","?unanswered-topics"]
	]], */
	[30, "Latest Comments", "?latest=comments"],
	[31, "Latest Screenshots", "?latest=screenshots"]
];
//var mn_community=[
//	[3,"Forums","?forums",mn_forums],
//	[7,"News / Blog","?blog"],
//	[1,"Contests","?contests"],
//	[4,"IRC Channel","?irc"],
//	[,"Social"],
//	[6,"Facebook Page","http://facebook.com/Wowhead"],
//	[5,"Twitter Page","http://twitter.com/Wowhead"]
//];
var mn_more = [
	[, "All About Wowhead"],
	[0, "About Us & Contact", "?aboutus"],
	[3, "FAQ", "?faq"],
	[13, "Help", , [
		[0, "Commenting and You", "?help=commenting-and-you"],
		[5, "Item Comparison", "?help=item-comparison"],
		[1, "Model Viewer", "?help=modelviewer"],
		[6, "Profiler", "?help=profiler"],
		[2, "Screenshots: Tips & Tricks", "?help=screenshots-tips-tricks"],
		[3, "Stat Weighting", "?help=stat-weighting"],
		[4, "Talent Calculator", "?help=talent-calculator"]
	]],
	[12, "Jobs", "?jobs"],
	[4, "Premium", "?premium"],
	[7, "What's New", "?whats-new"],
	[2, "Wowhead Client", "?client"],
	[4, "Wowhead Store", "http://store.wowhead.com/"],
	[, "Goodies"],
	[99, "LMWHTFY", "http://www.lmwhtfy.com"],
	[10, "Powered by Wowhead", "?powered"],
	[8, "Search Plugins", "?searchplugins"],
	[9, "Spread Wowhead", "?spread"],
	[, "Even More"],
	[5, "Network Sites", , [
		[99, "ZAM", "http://www.zam.com/", [
			[99, "Aion", "http://aion.zam.com"],
			[99, "Dark Age of Camelot", "http://camelot.allakhazam.com"],
			[99, "EVE Online", "http://eve.allakhazam.com"],
			[99, "EverQuest", "http://everquest.allakhazam.com"],
			[99, "EverQuest II", "http://eq2.allakhazam.com"],
			[99, "EverQuest Online Adventures", "http://eqoa.allakhazam.com"],
			[99, "Final Fantasy XI", "http://ffxi.allakhazam.com"],
			[99, "Final Fantasy XIV", "http://ffxiv.zam.com"],
			[99, "FreeRealms", "http://fr.zam.com"],
			[99, "Legends of Norrath", "http://lon.allakhazam.com"],
			[99, "Lord of the Rings Online", "http://lotro.allakhazam.com"],
			[99, "Star Wars Galaxies", "http://swg.allakhazam.com"],
			[99, "Warhammer Online", "http://war.allakhazam.com"],
			[99, "World of Warcraft", "http://wow.allakhazam.com"]
		]],
		[99, "MMOUI", "http://www.mmoui.com/", [
			[99, "EverQuest", "http://www.eqinterface.com"],
			[99, "EverQuest II", "http://www.eq2interface.com"],
			[99, "Lord of the Rings Online", "http://www.lotrointerface.com"],
			[99, "Vanguard: Saga of Heroes", "http://www.vginterface.com"],
			[99, "Warhammer Online", "http://war.mmoui.com"],
			[99, "World of Warcraft", "http://www.wowinterface.com"]
		]],
		[99, "Online Gaming Radio", "http://www.onlinegamingradio.com/"],
		[99, "Thottbot", "http://www.thottbot.com/"]
	]]
];
var mn_path = [
	[0, "Database", , mn_database],
	[1, "Tools", , mn_tools],
	//[2,"Forums",,mn_forums],
	//[3,"More",,mn_more]
];
var g_report_reasons = {
    0: "Violence",
    1: "Advertising",
    2: "Ненормативная лексика",
    3: "Spam",
    4: "Other"
};
var g_contact_reasons = {
    1: "General feedback",
    2: "Bug report",
    3: "Typo/mistranslation",
    4: "Advertise with us",
    5: "Partnership opportunities",
    6: "Press inquiry",
    7: "Other",
    15: "Advertising",
    16: "Inaccurate",
    17: "Out of date",
    18: "Spam",
    19: "Vulgar/inappropriate",
    20: "Other",
    30: "Advertising",
    31: "Inaccurate",
    32: "Out of date",
    33: "Spam",
    34: "Sticky request",
    35: "Vulgar/inappropriate",
    36: "Other",
    37: "Avatar",
    45: "Inaccurate",
    46: "Out of date",
    47: "Vulgar/inappropriate",
    48: "Other",
    60: "Inaccurate completion data",
    61: "Other"
};
var g_chr_classes = {
    1: "Warrior",
    2: "Paladin",
    3: "Hunter",
    4: "Rogue",
    5: "Priest",
    7: "Shaman",
    8: "Mage",
    9: "Warlock",
    11: "Druid",
    21: "Warrior",
    22: "Paladin",
    23: "Hunter",
    24: "Rogue",
    25: "Priest",
    27: "Shaman",
    28: "Mage",
    29: "Warlock",
    31: "Druid"
    //13:"Rogue, Druid",
    //14:"Hunter, Shaman",
    //15:"Warrior, Paladin",
    //16:"Priest, Mage, Warlock",
};
var g_itemset_classes = {
    1: "Warrior",
    2: "Paladin",
    3: "Hunter",
    4: "Rogue",
    5: "Priest",
    7: "Shaman",
    8: "Mage",
    9: "Warlock",
    11: "Druid",
    13: "Rogue, Druid",
    14: "Hunter, Shaman",
    15: "Warrior, Paladin",
    16: "Priest, Mage, Warlock"
};
var g_chr_races = {
    1: "Human",
    2: "Orc",
    3: "Dwarf",
    4: "Night Elf",
    5: "Undead",
    6: "Tauren",
    7: "Gnome",
    8: "Troll",
    10: "Blood Elf",
    11: "Draenei"
};
var g_chr_specs = {
    "-1": "Untalented",
    0: "Hybrid",
    6: ["Blood", "Frost", "Unholy"],
    11: ["Balance", "Feral Combat", "Restoration"],
    3: ["Beast Mastery", "Marksmanship", "Survival"],
    8: ["Arcane", "Fire", "Frost"],
    2: ["Holy", "Protection", "Retribution"],
    5: ["Discipline", "Holy", "Shadow Magic"],
    4: ["Assassination", "Combat", "Subtlety"],
    7: ["Elemental Combat", "Enhancement", "Restoration"],
    9: ["Affliction", "Demonology", "Destruction"],
    21: ["Arms", "Fury", "Protection"],
    26: ["Blood", "Frost", "Unholy"],
    31: ["Balance", "Feral Combat", "Restoration"],
    23: ["Beast Mastery", "Marksmanship", "Survival"],
    28: ["Arcane", "Fire", "Frost"],
    22: ["Holy", "Protection", "Retribution"],
    25: ["Discipline", "Holy", "Shadow Magic"],
    24: ["Assassination", "Combat", "Subtlety"],
    27: ["Elemental Combat", "Enhancement", "Restoration"],
    29: ["Affliction", "Demonology", "Destruction"],
    21: ["Arms", "Fury", "Protection"]
};
var g_item_glyphs = {
    1: "Major",
    2: "Minor"
};
var g_item_slots = {
    1: "Head",
    2: "Neck",
    3: "Shoulder",
    4: "Shirt",
    5: "Chest",
    6: "Waist",
    7: "Legs",
    8: "Feet",
    9: "Wrist",
    10: "Hands",
    11: "Finger",
    12: "Trinket",
    13: "One-Hand",
    14: "Shield",
    15: "Ranged",
    16: "Back",
    17: "Two-Hand",
    18: "Bag",
    19: "Tabard",
    21: "Main Hand",
    22: "Off Hand",
    23: "Held In Off-hand",
    24: "Projectile",
    25: "Thrown",
    28: "Relic"
};
var g_item_classes = {
    5: "Reagent",
    10: "Currency",
    12: "Quest",
    13: "Key"
};
var g_item_subclasses = {
    0: {
        0: "Consumable",
        1: "Potion",
        2: "Elixir",
        3: "Flask",
        4: "Scroll",
        5: "Bandage",
        6: "Perm. Enhancement",
        "-3": "Temp. Enhancement",
        7: "Bandage",
        8: "Other (Consumables)"
    },
    1: {
        0: "Bag",
        1: "Soul Bag",
        2: "Herb Bag",
        3: "Enchanting Bag",
        4: "Engineering Bag",
        5: "Gem Bag",
        6: "Mining Bag",
        7: "Leatherworking Bag",
        8: "Inscription Bag"
    },
    2: {
        0: "One-Handed Axe",
        1: "Two-Handed Axe",
        2: "Bow",
        3: "Gun",
        4: "One-Handed Mace",
        5: "Two-Handed Mace",
        6: "Polearm",
        7: "One-Handed Sword",
        8: "Two-Handed Sword",
        10: "Staff",
        13: "Fist Weapon",
        14: "Misc. (Weapons)",
        15: "Dagger",
        16: "Thrown",
        18: "Crossbow",
        19: "Wand",
        20: "Fishing Pole"
    },
    3: {
        0: "Red Gem",
        1: "Blue Gem",
        2: "Yellow Gem",
        3: "Purple Gem",
        4: "Green Gem",
        5: "Orange Gem",
        6: "Meta Gem",
        7: "Simple Gem",
        8: "Prismatic Gem"
    },
    4: {
        "-8": "Shirt",
        "-7": "Tabard",
        "-6": "Cloak",
        "-5": "Off-hand Frill",
        "-4": "Trinket",
        "-3": "Amulet",
        "-2": "Ring",
        0: "Misc. (Armor)",
        1: "Cloth Armor",
        2: "Leather Armor",
        3: "Mail Armor",
        4: "Plate Armor",
        6: "Shield",
        7: "Libram",
        8: "Idol",
        9: "Totem",
        10: "Sigil"
    },
    6: {
        2: "Arrow",
        3: "Bullet"
    },
    7: {
        1: "Part",
        2: "Explosive",
        3: "Device",
        4: "Jewelcrafting",
        5: "Cloth",
        6: "Leather",
        7: "Metal & Stone",
        8: "Meat",
        9: "Herb",
        10: "Elemental",
        12: "Enchanting",
        13: "Material",
        14: "Armor Enchantment",
        15: "Weapon Enchantment",
        11: "Other (Trade Goods)"
    },
    9: {
        0: "Book",
        1: "Leatherworking Pattern",
        2: "Tailoring Pattern",
        3: "Engineering Schematic",
        4: "Blacksmithing Plans",
        5: "Cooking Recipe",
        6: "Alchemy Recipe",
        7: "First Aid Book",
        8: "Enchanting Formula",
        9: "Fishing Book",
        10: "Jewelcrafting Design",
        11: "Inscription Technique"
    },
    11: {
        2: "Quiver",
        3: "Ammo Pouch"
    },
    15: {
        "-7": "Flying Mount",
        "-6": "Combat Pet",
        "-2": "Armor Token",
        0: "Junk",
        1: "Reagent",
        2: "Companion",
        3: "Holiday",
        4: "Other (Miscellaneous)",
        5: "Mount"
    },
    16: {
        6: "Death Knight Glyph",
        11: "Druid Glyph",
        3: "Hunter Glyph",
        8: "Mage Glyph",
        2: "Paladin Glyph",
        5: "Priest Glyph",
        4: "Rogue Glyph",
        7: "Shaman Glyph",
        9: "Warlock Glyph",
        1: "Warrior Glyph"
    }
};
var g_item_subsubclasses = {
    0: {
        2: {
            1: "Battle Elixir",
            2: "Guardian Elixir"
        }
    }
};
var g_itemset_types = {
    1: "Cloth",
    2: "Leather",
    3: "Mail",
    4: "Plate",
    5: "Dagger, Mace",
    6: "Rings",
    7: "Fist Weapon",
    8: "One-Handed Axe",
    9: "One-Handed Mace",
    10: "Swords",
    11: "Trinkets",
    12: "Amulet"
};
var g_itemset_notes = {
    1: "Dungeon Set 1",
    2: "Dungeon Set 2",
    14: "Dungeon Set 3",
    3: "Tier 1 Raid Set",
    4: "Tier 2 Raid Set",
    5: "Tier 3 Raid Set",
    12: "Tier 4 Raid Set",
    13: "Tier 5 Raid Set",
    18: "Tier 6 Raid Set",
    23: "Tier 7 Raid Set",
    25: "Tier 8 Raid Set",
    27: "Tier 9 Raid Set",
    29: "Tier 10 Raid Set",
    6: "PvP Rare Set",
    7: "Level 60 PvP Rare Set (Old)",
    8: "PvP Epic Set",
    16: "Level 70 PvP Rare Set",
    21: "Level 70 PvP Rare Set 2",
    17: "Arena Season 1 Set",
    19: "Arena Season 2 Set",
    20: "Arena Season 3 Set",
    22: "Arena Season 4 Set",
    24: "Arena Season 5 Set",
    26: "Arena Season 6 Set",
    28: "Arena Season 7 Set",
    30: "Arena Season 8 Set",
    15: "Arathi Basin Set",
    9: "Ruins of Ahn'Qiraj Set",
    10: "Temple of Ahn'Qiraj Set",
    11: "Zul'Gurub Set"
};
var g_npc_classifications = {
    0: "Normal",
    1: "Elite",
    2: "Rare Elite",
    3: "Boss",
    4: "Rare"
};
var g_npc_types = {
    1: "Beast",
    8: "Critter",
    3: "Demon",
    4: "Elemental",
    2: "Dragonkin",
    5: "Giant",
    7: "Humanoid",
    9: "Mechanical",
    6: "Undead",
    10: "Uncategorized"
};
var g_pet_families = {
    "1": "Wolf",
    "2": "Cat",
    "3": "Spider",
    "4": "Bear",
    "5": "Boar",
    "6": "Crocolisk",
    "7": "Carrion Bird",
    "8": "Crab",
    "9": "Gorilla",
    "11": "Raptor",
    "12": "Tallstrider",
    "20": "Scorpid",
    "21": "Turtle",
    "24": "Bat",
    "25": "Hyena",
    "26": "Bird of Prey",
    "27": "Wind Serpent",
    "30": "Dragonhawk",
    "31": "Ravager",
    "32": "Warp Stalker",
    "33": "Sporebat",
    "34": "Nether Ray",
    "35": "Serpent",
    "37": "Moth",
    "38": "Chimaera",
    "39": "Devilsaur",
    "41": "Silithid",
    "42": "Worm",
    "43": "Rhino",
    "44": "Wasp",
    "45": "Core Hound",
    "46": "Spirit Beast"
};
var g_pet_types = {
    0: "Ferocity",
    1: "Tenacity",
    2: "Cunning"
};
var g_pet_foods = {
    1: "Meat",
    2: "Fish",
    4: "Cheese",
    8: "Bread",
    16: "Fungus",
    32: "Fruit",
    64: "Raw Meat",
    128: "Raw Fish"
};
var g_object_types = {
    9: "Book",
    3: "Container",
    "-5": "Footlocker",
    "-3": "Herb",
    "-4": "Mineral Vein",
    "-2": "Quest"
};
var g_reputation_standings = {
    0: "Hated",
    1: "Hostile",
    2: "Unfriendly",
    3: "Neutral",
    4: "Friendly",
    5: "Honored",
    6: "Revered",
    7: "Exalted"
};
var g_quest_categories = {
    "-2": "Uncategorized",
    0: "Eastern Kingdoms",
    1: "Kalimdor",
    2: "Dungeons",
    3: "Raids",
    4: "Classes",
    5: "Professions",
    6: "Battlegrounds",
    7: "Miscellaneous",
    8: "Outland",
    9: "World Events",
    10: "Northrend"
};
var g_quest_sorts = {
    "0": "Eastern Kingdoms",
    "368": "Scourge Invasion",
    "-1001": "Winter Veil",
    "-1002": "Children's Week",
    "-1003": "Hallow's End",
    "-1004": "Love is in the Air",
    "-1005": "Harvest Festival",
    "-1006": "New Year's Eve",
    "-1007": "Day of the Dead",
    "-1008": "Pilgrim's Bounty",
    "1939": "Abyssal Sands",
    "365": "Ahn'Qiraj War",
    "4494": "Ahn'kahet: The Old Kingdom",
    "181": "Alchemy",
    "3896": "Aldor Rise",
    "36": "Alterac Mountains",
    "2597": "Alterac Valley",
    "2839": "Alterac Valley",
    "3358": "Arathi Basin",
    "45": "Arathi Highlands",
    "331": "Ashenvale",
    "3790": "Auchenai Crypts",
    "3477": "Azjol-Nerub",
    "16": "Azshara",
    "3524": "Azuremyst Isle",
    "3": "Badlands",
    "-25": "Battlegrounds",
    "719": "Blackfathom Deeps",
    "1584": "Blackrock Depths",
    "25": "Blackrock Mountain",
    "1583": "Blackrock Spire",
    "121": "Blacksmithing",
    "2677": "Blackwing Lair",
    "3522": "Blade's Edge Mountains",
    "4": "Blasted Lands",
    "3525": "Bloodmyst Isle",
    "3537": "Borean Tundra",
    "-370": "Brewfest",
    "46": "Burning Steppes",
    "1941": "Caverns of Time",
    "3905": "Coilfang Reservoir",
    "4024": "Coldarra",
    "304": "Cooking",
    "4395": "Dalaran",
    "4613": "Dalaran City",
    "279": "Dalaran Crater",
    "-364": "Darkmoon Faire",
    "148": "Darkshore",
    "393": "Darkspear Strand",
    "1657": "Darnassus",
    "41": "Deadwind Pass",
    "-372": "Death Knight",
    "2257": "Deeprun Tram",
    "151": "Designer Island",
    "405": "Desolace",
    "2557": "Dire Maul",
    "65": "Dragonblight",
    "4196": "Drak'Tharon Keep",
    "263": "Druid",
    "1": "Dun Morogh",
    "14": "Durotar",
    "10": "Duskwood",
    "15": "Dustwallow Marsh",
    "139": "Eastern Plaguelands",
    "12": "Elwynn Forest",
    "9": "Northshire Abbey (Elwynn Forest)",
    "201": "Engineering",
    "-1": "Epic",
    "3430": "Eversong Woods",
    "3820": "Eye of the Storm",
    "361": "Felwood",
    "357": "Feralas",
    "324": "First Aid",
    "101": "Fishing",
    "3433": "Ghostlands",
    "133": "Gnomeregan",
    "394": "Grizzly Hills",
    "4375": "Gundrak",
    "4272": "Halls of Lightning",
    "4820": "Halls of Reflection",
    "4264": "Halls of Stone",
    "3535": "Hellfire Citadel",
    "3483": "Hellfire Peninsula",
    "3562": "Hellfire Ramparts",
    "24": "Herbalism",
    "267": "Hillsbrad Foothills",
    "495": "Howling Fjord",
    "261": "Hunter",
    "3606": "Hyjal Summit",
    "210": "Icecrown",
    "4812": "Icecrown Citadel",
    "-371": "Inscription",
    "-368": "Invasion",
    "1537": "Ironforge",
    "4710": "Isle of Conquest",
    "4080": "Isle of Quel'Danas",
    "-373": "Jewelcrafting",
    "2562": "Karazhan",
    "131": "Kharanos",
    "182": "Leatherworking",
    "344": "Legendary",
    "38": "Loch Modan",
    "-376": "Love is in the Air",
    "-366": "Lunar Festival",
    "161": "Mage",
    "4095": "Magisters' Terrace",
    "3836": "Magtheridon's Lair",
    "3792": "Mana-Tombs",
    "2100": "Maraudon",
    "-369": "Midsummer",
    "2717": "Molten Core",
    "493": "Moonglade",
    "215": "Mulgore",
    "3518": "Nagrand",
    "3456": "Naxxramas",
    "3523": "Netherstorm",
    "-374": "Noblegarden",
    "2367": "Old Hillsbrad Foothills",
    "2159": "Onyxia's Lair",
    "1637": "Orgrimmar",
    "-141": "Paladin",
    "4813": "Pit of Saron",
    "262": "Priest",
    "22": "Programmer Isle",
    "2437": "Ragefire Chasm",
    "722": "Razorfen Downs",
    "1717": "Razorfen Kraul",
    "44": "Redridge Mountains",
    "367": "Reputation",
    "162": "Rogue",
    "3429": "Ruins of Ahn'Qiraj",
    "796": "Scarlet Monastery",
    "2057": "Scholomance",
    "51": "Searing Gorge",
    "-22": "Seasonal",
    "3607": "Serpentshrine Cavern",
    "3791": "Sethekk Halls",
    "3789": "Shadow Labyrinth",
    "209": "Shadowfang Keep",
    "236": "Shadowfang Keep",
    "3520": "Shadowmoon Valley",
    "82": "Shaman",
    "3703": "Shattrath City",
    "3711": "Sholazar Basin",
    "1377": "Silithus",
    "3487": "Silvermoon City",
    "130": "Silverpine Forest",
    "3679": "Skettis",
    "-284": "Special",
    "406": "Stonetalon Mountains",
    "1519": "Stormwind City",
    "4384": "Strand of the Ancients",
    "33": "Stranglethorn Vale",
    "2017": "Stratholme",
    "1417": "Sunken Temple",
    "4075": "Sunwell Plateau",
    "8": "Swamp of Sorrows",
    "264": "Tailoring",
    "440": "Tanaris",
    "141": "Paladin",
    "3845": "Tempest Keep",
    "3428": "Temple of Ahn'Qiraj",
    "3519": "Terokkar Forest",
    "3846": "The Arcatraz",
    "17": "The Barrens",
    "2366": "The Black Morass",
    "3840": "The Black Temple",
    "3713": "The Blood Furnace",
    "3847": "The Botanica",
    "4100": "The Culling of Stratholme",
    "1581": "The Deadmines",
    "3557": "The Exodar",
    "3842": "The Eye",
    "4500": "The Eye of Eternity",
    "4809": "The Forge of Souls",
    "47": "The Hinterlands",
    "3849": "The Mechanar",
    "4120": "The Nexus",
    "4493": "The Obsidian Sanctum",
    "4228": "The Oculus",
    "3714": "The Shattered Halls",
    "3717": "The Slave Pens",
    "3715": "The Steamvault",
    "717": "The Stockade",
    "67": "The Storm Peaks",
    "3716": "The Underbog",
    "4415": "The Violet Hold",
    "400": "Thousand Needles",
    "1638": "Thunder Bluff",
    "1216": "Timbermaw Hold",
    "85": "Tirisfal Glades",
    "-241": "Tournament",
    "4723": "Trial of the Champion",
    "4722": "Trial of the Crusader",
    "1517": "Uldaman",
    "4273": "Ulduar",
    "490": "Un'Goro Crater",
    "1497": "Undercity",
    "206": "Utgarde Keep",
    "1196": "Utgarde Pinnacle",
    "718": "Wailing Caverns",
    "61": "Warlock",
    "81": "Warrior",
    "3277": "Warsong Gulch",
    "28": "Western Plaguelands",
    "40": "Westfall",
    "11": "Wetlands",
    "4197": "Wintergrasp",
    "618": "Winterspring",
    "3521": "Zangarmarsh",
    "3805": "Zul'Aman",
    "66": "Zul'Drak",
    "978": "Zul'Farrak",
    "19": "Zul'Gurub",
    "-1010": "Dungeon Finder"
};
var g_quest_types = {
    0: "Normal",
    1: "Group",
    81: "Dungeon",
    62: "Raid",
    41: "PvP",
    82: "World Event",
    84: "Escort",
    85: "Heroic",
    88: "Raid 10",
    89: "Raid 25"
};
var g_sides = {
    1: "Alliance",
    2: "Horde",
    3: "Both"
};
var g_sides_tp = {
    1: "Alliance",
    2: "Horde"
};
var g_sources = {
    1: "Crafted",
    2: "Drop",
    3: "PvP",
    4: "Quest",
    5: "Vendor",
    6: "Trainer",
    7: "Discovery",
    8: "Redemption",
    9: "Talent",
    10: "Starter",
    11: "Event",
    12: "Achievement"
};
var g_sources_pvp = {
    1: "Arena",
    2: "Battleground",
    4: "World"
};
var g_spell_resistances = {
    0: "Physical",
    1: "Holy",
    2: "Fire",
    3: "Nature",
    4: "Frost",
    5: "Shadow",
    6: "Arcane"
};
var g_spell_skills = {
    "6": "Frost",
    "8": "Fire",
    "26": "Arms",
    "38": "Combat",
    "39": "Subtlety",
    "43": "Swords",
    "44": "Axes",
    "45": "Bows",
    "46": "Guns",
    "50": "Beast Mastery",
    "51": "Survival",
    "54": "Maces",
    "55": "Two-Handed Swords",
    "56": "Holy",
    "78": "Shadow Magic",
    "95": "Defense",
    "98": "Common",
    "101": "Dwarven Racial",
    "109": "Orcish",
    "111": "Dwarven",
    "113": "Darnassian",
    "115": "Taurahe",
    "118": "Dual Wield",
    "124": "Tauren Racial",
    "125": "Orc Racial",
    "126": "Night Elf Racial",
    "129": "First Aid",
    "134": "Feral Combat",
    "136": "Staves",
    "137": "Thalassian",
    "138": "Draconic",
    "139": "Demon Tongue",
    "140": "Titan",
    "141": "Old Tongue",
    "142": "Survival",
    "148": "Horse Riding",
    "149": "Wolf Riding",
    "150": "Tiger Riding",
    "152": "Ram Riding",
    "155": "Swimming",
    "160": "Two-Handed Maces",
    "162": "Unarmed",
    "163": "Marksmanship",
    "164": "Blacksmithing",
    "165": "Leatherworking",
    "171": "Alchemy",
    "172": "Two-Handed Axes",
    "173": "Daggers",
    "176": "Thrown",
    "182": "Herbalism",
    "183": "GENERIC (DND)",
    "184": "Retribution",
    "185": "Cooking",
    "186": "Mining",
    "188": "Imp",
    "189": "Felhunter",
    "197": "Tailoring",
    "202": "Engineering",
    "203": "Spider",
    "204": "Voidwalker",
    "205": "Succubus",
    "206": "Infernal",
    "207": "Doomguard",
    "208": "Wolf",
    "209": "Cat",
    "210": "Bear",
    "211": "Boar",
    "212": "Crocolisk",
    "213": "Carrion Bird",
    "214": "Crab",
    "215": "Gorilla",
    "217": "Raptor",
    "218": "Tallstrider",
    "220": "Undead",
    "226": "Crossbows",
    "228": "Wands",
    "229": "Polearms",
    "236": "Scorpid",
    "237": "Arcane",
    "251": "Turtle",
    "253": "Assassination",
    "256": "Fury",
    "257": "Protection",
    "267": "Protection",
    "270": "Generic Hunter",
    "293": "Plate Mail",
    "313": "Gnomish",
    "315": "Troll",
    "333": "Enchanting",
    "354": "Demonology",
    "355": "Affliction",
    "356": "Fishing",
    "373": "Enhancement",
    "374": "Restoration",
    "375": "Elemental Combat",
    "393": "Skinning",
    "413": "Mail",
    "414": "Leather",
    "415": "Cloth",
    "433": "Shield",
    "473": "Fist Weapons",
    "533": "Raptor Riding",
    "553": "Mechanostrider Piloting",
    "554": "Undead Horsemanship",
    "573": "Restoration",
    "574": "Balance",
    "593": "Destruction",
    "594": "Holy",
    "613": "Discipline",
    "633": "Lockpicking",
    "653": "Bat",
    "654": "Hyena",
    "655": "Bird of Prey",
    "656": "Wind Serpent",
    "673": "Gutterspeak",
    "713": "Kodo Riding",
    "733": "Troll",
    "753": "Gnome",
    "754": "Human",
    "755": "Jewelcrafting",
    "756": "Blood Elf Racial",
    "758": "Remote Control",
    "759": "Draenei",
    "760": "Draenei Racial",
    "761": "Felguard",
    "762": "Riding",
    "763": "Dragonhawk",
    "764": "Nether Ray",
    "765": "Sporebat",
    "766": "Warp Stalker",
    "767": "Ravager",
    "768": "Serpent",
    "769": "Internal",
    "770": "Blood",
    "771": "Frost",
    "772": "Unholy",
    "773": "Inscription",
    "775": "Moth",
    "776": "Runeforging",
    "777": "Mounts",
    "778": "Companions",
    "780": "Exotic Chimaera",
    "781": "Exotic Devlisaur",
    "782": "Ghoul",
    "783": "Exotic Silithid",
    "784": "Exotic Worm",
    "785": "Wasp",
    "786": "Exotic Rhino",
    "787": "Exotic Core Hound",
    "788": "Exotic Spirit Beast"
};
var g_zones = {
    "368": "Scourge Invasion",
    "1": "Dun Morogh",
    "3": "Badlands",
    "4": "Blasted Lands",
    "8": "Swamp of Sorrows",
    "9": "Northshire Abbey (Elwynn Forest)",
    "10": "Duskwood",
    "11": "Wetlands",
    "12": "Elwynn Forest",
    "14": "Durotar",
    "15": "Dustwallow Marsh",
    "16": "Azshara",
    "17": "The Barrens",
    "19": "Zul'Gurub",
    "25": "Blackrock Mountain",
    "28": "Western Plaguelands",
    "33": "Stranglethorn Vale",
    "36": "Alterac Mountains",
    "38": "Loch Modan",
    "40": "Westfall",
    "41": "Deadwind Pass",
    "44": "Redridge Mountains",
    "45": "Arathi Highlands",
    "46": "Burning Steppes",
    "47": "The Hinterlands",
    "51": "Searing Gorge",
    "65": "Dragonblight",
    "66": "Zul'Drak",
    "67": "The Storm Peaks",
    "85": "Tirisfal Glades",
    "130": "Silverpine Forest",
    "133": "Gnomeregan",
    "139": "Eastern Plaguelands",
    "141": "Teldrassil",
    "148": "Darkshore",
    "206": "Utgarde Keep",
    "209": "Shadowfang Keep",
    "210": "Icecrown",
    "215": "Mulgore",
    "267": "Hillsbrad Foothills",
    "331": "Ashenvale",
    "357": "Feralas",
    "361": "Felwood",
    "394": "Grizzly Hills",
    "400": "Thousand Needles",
    "405": "Desolace",
    "406": "Stonetalon Mountains",
    "440": "Tanaris",
    "457": "The Veiled Sea",
    "490": "Un'Goro Crater",
    "1717": "Razorfen Kraul",
    "493": "Moonglade",
    "495": "Howling Fjord",
    "618": "Winterspring",
    "717": "The Stockade",
    "718": "Wailing Caverns",
    "719": "Blackfathom Deeps",
    "722": "Razorfen Downs",
    "796": "Scarlet Monastery",
    "978": "Zul'Farrak",
    "1196": "Utgarde Pinnacle",
    "1517": "Uldaman",
    "1377": "Silithus",
    "1417": "Sunken Temple",
    "1497": "Undercity",
    "1519": "Stormwind City",
    "1537": "Ironforge",
    "1581": "The Deadmines",
    "1583": "Blackrock Spire",
    "1584": "Blackrock Depths",
    "1637": "Orgrimmar",
    "1638": "Thunder Bluff",
    "1657": "Darnassus",
    "2017": "Stratholme",
    "2057": "Scholomance",
    "2100": "Maraudon",
    "2159": "Onyxia's Lair",
    "2257": "Deeprun Tram",
    "2366": "The Black Morass",
    "2367": "Old Hillsbrad Foothills",
    "2437": "Ragefire Chasm",
    "2557": "Dire Maul",
    "2562": "Karazhan",
    "2597": "Alterac Valley",
    "2677": "Blackwing Lair",
    "2717": "Molten Core",
    "2817": "Crystalsong Forest",
    "3277": "Warsong Gulch",
    "3358": "Arathi Basin",
    "3428": "Temple of Ahn'Qiraj",
    "3429": "Ruins of Ahn'Qiraj",
    "3430": "Eversong Woods",
    "3433": "Ghostlands",
    "3456": "Naxxramas",
    "3477": "Azjol-Nerub",
    "3483": "Hellfire Peninsula",
    "3487": "Silvermoon City",
    "3518": "Nagrand",
    "3519": "Terokkar Forest",
    "3520": "Shadowmoon Valley",
    "3521": "Zangarmarsh",
    "3522": "Blade's Edge Mountains",
    "3523": "Netherstorm",
    "3524": "Azuremyst Isle",
    "3525": "Bloodmyst Isle",
    "3537": "Borean Tundra",
    "3557": "The Exodar",
    "3562": "Hellfire Ramparts",
    "3606": "Hyjal Summit",
    "3607": "Serpentshrine Cavern",
    "3618": "Gruul's Lair",
    "3698": "The Ring of Trials",
    "3702": "The Circle of Blood",
    "3703": "Shattrath City",
    "3711": "Sholazar Basin",
    "3713": "The Blood Furnace",
    "3714": "The Shattered Halls",
    "3715": "The Steamvault",
    "3716": "The Underbog",
    "3717": "The Slave Pens",
    "3789": "Shadow Labyrinth",
    "3790": "Auchenai Crypts",
    "3791": "Sethekk Halls",
    "3792": "Mana-Tombs",
    "3805": "Zul'Aman",
    "3820": "Eye of the Storm",
    "3836": "Magtheridon's Lair",
    "3842": "The Eye",
    "3846": "The Arcatraz",
    "3847": "The Botanica",
    "3849": "The Mechanar",
    "3959": "Black Temple",
    "3968": "Ruins of Lordaeron",
    "4075": "Sunwell Plateau",
    "4080": "Isle of Quel'Danas",
    "4095": "Magisters' Terrace",
    "4100": "The Culling of Stratholme",
    "4120": "The Nexus",
    "4196": "Drak'Tharon Keep",
    "4197": "Wintergrasp",
    "4228": "The Oculus",
    "4264": "Halls of Stone",
    "4272": "Halls of Lightning",
    "4273": "Ulduar",
    "4298": "The Scarlet Enclave",
    "4375": "Gundrak",
    "4378": "Dalaran Sewers",
    "4384": "Strand of the Ancients",
    "4395": "Dalaran",
    "4406": "The Ring of Valor",
    "4415": "The Violet Hold",
    "4493": "The Obsidian Sanctum",
    "4494": "Ahn'kahet: The Old Kingdom",
    "4500": "The Eye of Eternity",
    "4603": "Vault of Archavon",
    "4710": "Isle of Conquest",
    "4722": "Trial of the Crusader",
    "4723": "Trial of the Champion",
    "4742": "Hrothgar's Landing",
    "4809": "The Forge of Souls",
    "4812": "Icecrown Citadel",
    "4813": "Pit of Saron",
    "4820": "Halls of Reflection",
    "4987": "The Ruby Sanctum"
};
var g_zone_areas = {
    206: ["Norndir Preparation", "Dragonflayer Ascent", "Tyr's Terrace"],
    1196: ["Lower Pinnacle", "Upper Pinnacle"],
    3456: ["The Construct Quarter", "The Arachnid Quarter", "The Military Quarter", "The Plague Quarter", "Overview", "Frostwyrm Lair"],
    3477: ["The Brood Pit", "Hadronox's Lair", "The Gilded Gate"],
    4100: ["Stratholme City", "Outside Stratholme"],
    4196: ["The Vestibules of Drak'Tharon", "Drak'Tharon Overlook"],
    4228: ["Band of Variance", "Band of Acceleration", "Band of Transmutation", "Band of Alignment"],
    4272: ["Unyielding Garrison", "Walk of the Makers"],
    4273: ["The Grand Approach ", "The Antechamber of Ulduar", "The Inner Sanctum of Ulduar", "The Prison of Yogg-Saron", "The Spark of Imagination", "The Mind's Eye"],
    4395: ["Dalaran City", "The Underbelly"],
    4494: ["Ahn'Kahet", "Level 2"],
    4722: ["Crusaders' Coliseum", "The Icy Depths"],
    4812: ["The Lower Citadel", "The Rampart of Skulls", "Deathbringer's Rise", "The Frost Queen's Lair", "The Upper Reaches", "Royal Quarters", "The Frozen Throne", "Frostmourne"]
};
var g_zone_categories = {
    0: "Eastern Kingdoms",
    1: "Kalimdor",
    8: "Outland",
    10: "Northrend",
    2: "Dungeons",
    3: "Raids",
    6: "Battlegrounds",
    9: "Arenas"
};
var g_zone_instancetypes = {
    1: "Transit",
    2: "Dungeon",
    3: "Raid",
    4: "Battleground",
    5: "Dungeon",
    6: "Arena",
    7: "Raid"
};
var g_zone_territories = {
    0: "Alliance",
    1: "Horde",
    2: "Contested",
    3: "Sanctuary",
    4: "PvP"
};
var g_faction_categories = {
    "0": "Other",
    "469": "Alliance",
    "891": "Alliance Forces",
    "1037": "Alliance Vanguard",
    "1118": "Classic",
    "67": "Horde",
    "1052": "Horde Expedition",
    "892": "Horde Forces",
    "936": "Shattrath City",
    "1117": "Sholazar Basin",
    "169": "Steamwheedle Cartel",
    "980": "The Burning Crusade",
    "1097": "Wrath of the Lich King"
};
var g_achievement_categories = {
    "1": "Statistics",
    "21": "Player vs. Player",
    "81": "Feats of Strength",
    "92": "General",
    "95": "Player vs. Player",
    "96": "Quests",
    "97": "Exploration",
    "122": "Deaths",
    "123": "Arenas",
    "124": "Battlegrounds",
    "125": "Dungeons",
    "126": "World",
    "127": "Resurrection",
    "128": "Kills",
    "130": "Character",
    "131": "Social",
    "132": "Skills",
    "133": "Quests",
    "134": "Travel",
    "135": "Creatures",
    "136": "Honorable Kills",
    "137": "Killing Blows",
    "140": "Wealth",
    "141": "Combat",
    "145": "Consumables",
    "147": "Reputation",
    "152": "Rated Arenas",
    "153": "Battlegrounds",
    "154": "World",
    "155": "World Events",
    "156": "Winter Veil",
    "158": "Hallow's End",
    "159": "Noblegarden",
    "160": "Lunar Festival",
    "161": "Midsummer",
    "162": "Brewfest",
    "163": "Children's Week",
    "165": "Arena",
    "168": "Dungeons & Raids",
    "169": "Professions",
    "170": "Cooking",
    "171": "Fishing",
    "172": "First Aid",
    "173": "Professions",
    "178": "Secondary Skills",
    "187": "Love is in the Air",
    "191": "Gear",
    "201": "Reputation",
    "14777": "Eastern Kingdoms",
    "14778": "Kalimdor",
    "14779": "Outland",
    "14780": "Northrend",
    "14801": "Alterac Valley",
    "14802": "Arathi Basin",
    "14803": "Eye of the Storm",
    "14804": "Warsong Gulch",
    "14805": "The Burning Crusade",
    "14806": "Lich King Dungeon",
    "14807": "Dungeons & Raids",
    "14808": "Classic",
    "14821": "Classic",
    "14822": "The Burning Crusade",
    "14823": "Wrath of the Lich King",
    "14861": "Classic",
    "14862": "The Burning Crusade",
    "14863": "Wrath of the Lich King",
    "14864": "Classic",
    "14865": "The Burning Crusade",
    "14866": "Wrath of the Lich King",
    "14881": "Strand of the Ancients",
    "14901": "Wintergrasp",
    "14921": "Lich King Heroic",
    "14922": "Lich King 10-Player Raid",
    "14923": "Lich King 25-Player Raid",
    "14941": "Argent Tournament",
    "14961": "Secrets of Ulduar 10-Player Raid",
    "14962": "Secrets of Ulduar 25-Player Raid",
    "14963": "Secrets of Ulduar",
    "14981": "Pilgrim's Bounty",
    "15001": "Call of the Crusade 10-Player Raid",
    "15002": "Call of the Crusade 25-Player Raid",
    "15003": "Isle of Conquest",
    "15021": "Call of the Crusade",
    "15041": "Fall of the Lich King 10-Player Raid",
    "15042": "Fall of the Lich King 25-Player Raid",
    "15062": "Fall of the Lich King"
};
var g_title_categories = {
    0: "General",
    1: "PvP",
    2: "Reputation",
    3: "Dungeons & Raids",
    4: "Quests",
    5: "Professions",
    6: "World Events"
};
var g_holiday_categories = {
    1: "Holidays",
    2: "Recurring",
    3: "Player vs. Player",
    0: "Uncategorized"
};
var g_user_roles = {
    1: "Tester",
    2: "Administrator",
    3: "Editor",
    4: "Moderator",
    5: "Bureaucrat",
    6: "Developer",
    7: "VIP",
    8: "Blogger",
    9: "Premium",
    10: "Localizer",
    11: "Sales agent"
};
var g_gem_colors = {
    1: "Meta",
    2: "Red",
    4: "Yellow",
    6: "Orange",
    8: "Blue",
    10: "Purple",
    12: "Green",
    14: "Prismatic"
};
var g_socket_names = {
    1: "Meta Socket",
    2: "Red Socket",
    4: "Yellow Socket",
    8: "Blue Socket",
    14: "Prismatic Socket"
};
var LANG = {
    message_ingamelink: "paste this in your chat window",
    book_of: " of ",
    book_previous: " Previous",
    book_next: "Next ",
    comma: ", ",
    ellipsis: "...",
    dash: " \u2013 ",
    hyphen: " - ",
    colon: ": ",
    qty: " ($1)",
    date: "Date",
    date_colon: "Date: ",
    date_on: "on ",
    date_ago: "$1 ago",
    date_at: " at ",
    date_simple: "$2/$1/$3",
    date_months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abilities: "Abilities",
    armor: "Armor",
    author: "Author",
    battlegroup: "Battlegroup",
    category: "Category",
    classes: "Classes",
    classs: "Class",
    close: "Close",
    completed: "Completed",
    contactus: "Contact us",
    cost: "Cost",
    count: "Count",
    daily: "Daily",
    weekly: "Weekly",
    damage: "Damage",
    diet: "Diet",
    dps: "DPS",
    earned: "Earned",
    enchant: "Enchant",
    faction: "Faction",
    gains: "Gains",
    gems: "Gems",
    gearscore: "Gear",
    glyphtype: "Glyph type",
    group: "Group",
    guild: "Guild",
    guildleader: "Guild Leader",
    guildrank: "Guild Rank",
    health: "Health",
    instancetype: "Instance type",
    lastpost: "Last post",
    level: "Level",
    location: "Location",
    losses: "Losses",
    members: "Members",
    name: "Name",
    race: "Race",
    rankno: "Rank $1",
    rating: "Rating",
    react: "React",
    realm: "Realm",
    reagents: "Reagents",
    region: "Region",
    rep: "Rep.",
    req: "Req. ",
    reputation: "Reputation",
    rewards: "Rewards",
    petfamily: "Pet family",
    pieces: "Pieces",
    points: "Points",
    posted: "Posted",
    preview: "Preview",
    privateprofile: "Private",
    prize: "Prize",
    progress: "Progress",
    publicprofile: "Public",
    replies: "Replies",
    report: "Report",
    report_tooltip: "Click for many reporting options",
    school: "School",
    score: "Score",
    settings: "Settings",
    side: "Side",
    signout: "Sign Out",
    sockets: "Sockets",
    source: "Source",
    skill: "Skill",
    skin: "Skin",
    slot: "Slot",
    slots: "Slots",
    smartloot: "Smart loot",
    speed: "Speed",
    stack: "Stack",
    standing: "Standing",
    stock: "Stock",
    subject: "Subject",
    submit: "Submit",
    talents: "Talents",
    territory: "Territory",
    topics: "Topics",
    tp: "TP",
    type: "Type",
    user: "User",
    views: "Views",
    userpage: "User Page",
    wins: "Wins",
    when: "When",
    male: "Male",
    female: "Female",
    source_zonedrop: "Zone Drop",
    source_quests: "Quests",
    source_vendors: "Vendors",
    infobox_noneyet: "None yet &ndash; $1!",
    infobox_submitone: "Submit one",
    infobox_showall: "Show all ($1)",
    lvcomment_add: "Add your comment",
    lvcomment_sort: "Sort by: ",
    lvcomment_sortdate: "Date",
    lvcomment_sortrating: "Highest rated",
    lvcomment_patchfilter: "Filter by patch: ",
    lvcomment_by: "By ",
    lvcomment_patch1: " (Patch ",
    lvcomment_patch2: ")",
    lvcomment_patch: " (Patch $1)",
    lvcomment_show: "Show comment",
    lvcomment_hide: "Hide comment",
    lvcomment_rating: "Rating: ",
    lvcomment_lastedit: "Last edited by ",
    lvcomment_nedits: "edited $1 times",
    lvcomment_edit: "Edit",
    lvcomment_delete: "Delete",
    lvcomment_detach: "Detach",
    lvcomment_reply: "Reply",
    lvcomment_report: "Report",
    lvcomment_reported: "Reported!",
    lvcomment_deleted: " (Deleted)",
    lvcomment_purged: " (Purged)",
    lvdrop_outof: "out of $1",
    lvitem_dd: " ($1$2)",
    lvitem_normal: "N",
    lvitem_heroic: "H",
    lvitem_raid10: "10",
    lvitem_raid25: "25",
    lvitem_heroicitem: "Heroic",
    lvitem_vendorin: "Vendor in ",
    lvitem_reqlevel: "Req. ",
    lvnpc_alliance: "A",
    lvnpc_horde: "H",
    lvquest_daily: "Daily $1",
    lvquest_weekly: "Weekly $1",
    lvquest_pickone: "Pick: ",
    lvquest_alsoget: "Also get: ",
    lvquest_xp: "$1 XP",
    lvzone_xman: "$1-man",
    lvzone_xvx: "$1v$2",
    lvpet_exotic: "Exotic",
    lvpage_of: " of ",
    lvpage_first: " First",
    lvpage_previous: " Previous",
    lvpage_next: "Next ",
    lvpage_last: "Last ",
    lvscreenshot_submit: "Submit a screenshot",
    lvscreenshot_from: "From ",
    lvscreenshot_hires: "View",
    lvscreenshot_hires2: " higher resolution version ($1x$2)",
    lvscreenshot_approve: "Approve that image!<br>Users will be able to see it.",
    lvscreenshot_delete: "Delete screenshot. Completely.",
    lvscreenshot_submit_disabled: "Only Wowhead images are enabled. Uploads are disabled.",
    lvscreenshot_stick: "Stick that image to Quick Facts panel!",
    lvnodata: "There is no data to display.",
    lvnodata2: "No matches found.",
    lvnodata_co1: "No comments have been posted yet.",
    lvnodata_co2: "Be the first to <a>add a comment</a> to this page!",
    lvnodata_co3: "Please <a>sign in</a> to add your comment, or <a>sign up</a> if you don't already have an account.",
    lvnodata_ss1: "No screenshots have been submitted yet.",
    lvnodata_ss2: "Be the first to <a>submit a screenshot</a> for this page!",
    lvnodata_ss3: "Please <a>sign in</a> to submit a screenshot, or <a>sign up</a> if you don't already have an account.",
    lvnodata_ss4: "No Wowhead screenshots have been submitted yet",
    lvnodata_ss5: "Submit one there if you want it to be here :P",
    lvnote_tryfiltering: "Try <a>filtering</a> your results",
    lvnote_trynarrowing: "Try narrowing your search",
    lvnote_itemsfound: "$1 items found ($2 displayed)",
    lvnote_itemsetsfound: "$1 item sets found ($2 displayed)",
    lvnote_npcsfound: "$1 NPCs found ($2 displayed)",
    lvnote_objectsfound: "$1 objects found ($2 displayed)",
    lvnote_questsfound: "$1 quests found ($2 displayed)",
    lvnote_spellsfound: "$1 spells found ($2 displayed)",
    lvnote_zonesfound: "$1 zones found ($2 displayed)",
    lvnote_factionsfound: "$1 factions found ($2 displayed)",
    lvnote_petsfound: "$1 pets found ($2 displayed)",
    lvnote_achievementsfound: "$1 achievements found ($2 displayed)",
    lvnote_charactersfound: "$1 total characters",
    lvnote_charactersfound2: "$1 total characters, $2 matching",
    lvnote_guildsfound: "$1 total guilds",
    lvnote_guildsfound2: "$1 total guilds, $2 matching",
    lvnote_arenateamsfound: "$1 total arena teams",
    lvnote_arenateamsfound2: "$1 total arena teams, $2 matching",
    lvnote_createafilter: '<small><a href="$1">Create a filter</a></small>',
    lvnote_filterresults: '<small><a href="$1">Filter these results</a></small>',
    lvnote_questgivers: '<small>View <a href="?zone=$1">quest givers</a> in <b>$2</b> &nbsp;<b>|</b>&nbsp; Filter <a href="?items&filter=cr=126;crs=$3;crv=0">quest rewards</a></small>',
    lvnote_allpets: '<small>All pets can learn all of the <a href="?spells=-3.270">passive skills</a></small>',
    lvnote_zonequests: '<small>Browse <a href="?quests=$1.$2">quests</a> in the <b>$3</b> category &nbsp;<b>|</b>&nbsp; Filter <a href="?items&filter=cr=126;crs=$4;crv=0">quest rewards</a></small>',
    lvnote_crafteditems: '<small>Filter <a href="?items&filter=cr=86;crs=$1;crv=0">crafted items</a></small>',
    lvnote_viewmoreslot: '<small>View <a href="?items$1&filter=$2">more results</a> for this slot</small>',
    lvnote_itemdisenchanting: "This item has been disenchanted $1 times.",
    lvnote_itemdropsinnormalonly: "This item only drops in Normal mode.",
    lvnote_itemdropsinheroiconly: "This item only drops in Heroic mode.",
    lvnote_itemdropsinnormalheroic: "This item drops in both Normal and Heroic modes.",
    lvnote_itemdropsinnormal10only: "This item only drops in Normal 10 mode.",
    lvnote_itemdropsinnormal25only: "This item only drops in Normal 25 mode.",
    lvnote_itemdropsinheroic10only: "This item only drops in Heroic 10 mode.",
    lvnote_itemdropsinheroic25only: "This item only drops in Heroic 25 mode.",
    lvnote_itemmilling: "This herb has been milled $1 times.",
    lvnote_itemopening: "This item has been opened $1 times.",
    lvnote_itemprospecting: "This mineral ore has been prospected $1 times.",
    lvnote_npcdrops: "This NPC has been looted $1 times.",
    lvnote_npcdropsnormal: "This NPC has been looted $1 times in Normal mode.",
    lvnote_npcdropsheroic: "This NPC has been looted $1 times in Heroic mode.",
    lvnote_npcdropsnormalX: "This NPC has been looted $1 times in Normal $2 mode.",
    lvnote_npcdropsheroicX: "This NPC has been looted $1 times in Heroic $2 mode.",
    lvnote_npcobject: '<a href="?object=$1">$2</a> has been opened $3 times.',
    lvnote_npcobjectnormal: '<a href="?object=$1">$2</a> has been opened $3 times in Normal mode.',
    lvnote_npcobjectheroic: '<a href="?object=$1">$2</a> has been opened $3 times in Heroic mode.',
    lvnote_npcobjectnormalX: '<a href="?object=$1">$2</a> has been opened $3 times in Normal $4 mode.',
    lvnote_npcobjectheroicX: '<a href="?object=$1">$2</a> has been opened $3 times in Heroic $4 mode.',
    lvnote_npcherbgathering: "This NPC has been skinned with Herbalism $1 times.",
    lvnote_npcmining: "This NPC has been skinned with Mining $1 times.",
    lvnote_npcpickpocketing: "This NPC has been pickpocketed $1 times.",
    lvnote_npcskinning: "This NPC has been skinned $1 times.",
    lvnote_objectherbgathering: "This herb has been gathered $1 times.",
    lvnote_objectmining: "This mineral vein has been mined $1 times.",
    lvnote_objectopening: "This object has been opened $1 times.",
    lvnote_objectopeningnormal: "This object has been opened $1 times in Normal mode.",
    lvnote_objectopeningheroic: "This object has been opened $1 times in Heroic mode.",
    lvnote_objectopeningnormalX: "This object has been opened $1 times in Normal $2 mode.",
    lvnote_objectopeningheroicX: "This object has been opened $1 times in Heroic $2 mode.",
    lvnote_zonefishing: "Waters in this zone have been fished $1 times.",
    lvnote_usercomments: "This user has posted a total of $1 comments.",
    lvnote_userscreenshots: "This user has submitted a total of $1 screenshots.",
    lvnote_usertopics: "This user has posted a total of $1 topics.",
    lvnote_userreplies: "This user has posted a total of $1 replies.",
    button_compare: "Compare",
    button_delete: "Delete",
    button_deselect: "Deselect",
    button_exclude: "Exclude",
    button_include: "Include",
    button_lmwhtfy: "LMWHTFY",
    button_makepriv: "Make private",
    button_makepub: "Make public",
    button_new: "New",
    button_quickexclude: "Manage exclusions",
    button_remove: "Remove",
    button_resync: "Resync",
    button_selectall: "Select all",
    button_viewin3d: "View in 3D",
    dialog_cantdisplay: "Note: Some of the items you selected were ignored. Select them individually to display them in 3D.",
    dialog_compare: "Item Comparison",
    dialog_image: "Image",
    dialog_imagedetails: "Image Details",
    dialog_imagename: "Name: ",
    dialog_imageselector: "Image Selection",
    dialog_losechanges: "You are viewing an Armory character. Any changes you make will be lost unless you save this character as a custom profile.",
    dialog_nosaveandview: "View without saving",
    dialog_saveandview: "Save and view now",
    dialog_saveforlater: "Save for later",
    dialog_selecteditem: "<b>$1</b> item has been selected.",
    dialog_selecteditems: "<b>$1</b> items have been selected.",
    message_ajaxnotsupported: "Please upgrade to a modern browser (such as Firefox) that supports 'Ajax' requests.",
    message_cantdeletecomment: "This comment has been automatically purged due to a negative rating. It cannot be deleted.",
    message_cantdetachcomment: "This comment has already been detached.",
    message_codenotentered: "You did not enter the code.",
    message_commentdetached: "This comment is now detached.",
    message_commenttooshort: "Your comment must be at least 10 characters long.\n\nPlease elaborate a little.",
    message_descriptiontooshort: "Your description must be at least 10 characters long.\n\nPlease elaborate a little.",
    message_emailnotvalid: "That email address is not valid.",
    message_entercurrpass: "Please enter your current password.",
    message_enteremail: "Please enter your email address.",
    message_enternewemail: "Please enter your new email address.",
    message_enternewpass: "Please enter your new password.",
    message_enterpassword: "Please enter your password.",
    message_enterusername: "Please enter your username.",
    message_forumposttooshort: "Your post is empty!",
    message_invalidfilter: "Invalid filter.",
    message_invalidname: "Image name is invalid. Must be alphanumeric, 20 characters max, and start with a letter.",
    message_newemaildifferent: "Your new email address must be different than your previous one.",
    message_newpassdifferent: "Your new password must be different than your previous one.",
    message_noscreenshot: "Please select the screenshot to upload.",
    message_nothingtoviewin3d: "No items were selected that can be viewed in 3D.",
    message_passwordmin: "Your password must be at least 6 characters long.",
    message_passwordsdonotmatch: "Passwords do not match.",
    message_savebeforeexit: "You will lose any unsaved changes you have made.",
    message_sharetheurlbelow: "Share the url below:",
    message_usernamemin: "Your username must be at least 4 characters long.",
    message_usernamenotvalid: "Your username can only contain letters and numbers.",
    confirm_addtosaved: "Add to your saved comparison?",
    confirm_commenttoolong: "Your comment is longer than $1 characters and will be truncated after:\n\n$2\n\nDo you want to proceed anyway?",
    confirm_deletecomment: "Are you sure that you want to delete this comment?",
    confirm_descriptiontoolong: "Your description is longer than $1 characters and will be truncated after:\n\n$2\n\nDo you want to proceed anyway?",
    confirm_detachcomment: "Are you sure that you want to make this comment a standalone one?",
    confirm_forumposttoolong: "Your post is longer than $1 characters and will be truncated after:\n\n$2\n\nDo you want to proceed anyway?",
    confirm_report2: "Are you sure that you want to report this post as $1?",
    confirm_report3: "Are you sure that you want to report this user's avatar as vulgar/inappropriate?",
    confirm_report4: "Are you sure that you want to report this image as vulgar/inappropriate?",
    confirm_report: "Are you sure that you want to report this comment as $1?",
    confirm_signaturetoolong: "Your signature is longer than $1 characters and will be truncated after:\n\n$2\n\nDo you want to proceed anyway?",
    confirm_signaturetoomanylines: "Your signature contains more than $1 lines and will be truncated.\n\nDo you want to proceed anyway?",
    prompt_colfilter1: "You may set a filter for the $1 column:\n\n",
    prompt_colfilter2: 'e.g. "sword"',
    prompt_colfilter3: 'e.g. ">100", "32-34" or "!<=10"',
    prompt_customrating: "Please enter a rating value between -$1 and $2:",
    prompt_details: "Please provide details below:",
    prompt_gotopage: "Please enter the page number you wish to go to ($1 - $2):",
    prompt_ingamelink: "Copy/paste the following to your in-game chat window:",
    prompt_linkurl: "Please enter the URL of your link:",
    prompt_ratinglevel: "Please enter the level used in the calculation ($1 - $2):",
    tooltip_achievementcomplete: "Achievement earned by $1 on $2/$3/$4",
    tooltip_achievementnotfound: "Achievement not found :(",
    tooltip_achievementpoints: "Achievement points",
    tooltip_arenapoints: "Arena Points",
    tooltip_armorbonus: "Has $1 bonus armor.",
    tooltip_avgmoneycontained: "Average money contained",
    tooltip_avgmoneydropped: "Average money dropped",
    tooltip_banned_rating: "You have been banned from rating comments.",
    tooltip_buyoutprice: "Average buyout price (AH)",
    tooltip_captcha: "Click to generate a new one",
    tooltip_changelevel2: "Drag to change level",
    tooltip_changelevel: "Click to change level",
    tooltip_colfilter1: "Filter: $1",
    tooltip_colfilter2: "Inverted filter: $1",
    tooltip_combatrating: "$1&nbsp;@&nbsp;L$2",
    tooltip_consumedonuse: "Consumed when used",
    tooltip_customrating: "Custom rating",
    tooltip_dailyquest: "You may complete up to<br />25 daily quests per day.",
    tooltip_downrate: "Poor/redundant",
    tooltip_extendedachievementsearch: "Check this option to search in the<br />description as well.",
    tooltip_extendednpcsearch: "Check this option to search in the<br />&lt;tag&gt; as well.",
    tooltip_extendedquestsearch: "Check this option to search in the<br />objectives and description as well.",
    tooltip_extendedspellsearch: "Check this option to search in the<br />description and buff as well.",
    tooltip_gotopage: "Click to go to a specific page",
    tooltip_honorpoints: "Honor Points",
    tooltip_itemnotfound: "Item not found :(",
    tooltip_loading: "Loading...",
    tooltip_lmwhtfy: '<b class="q">LMWHTFY</b><br />Get a LMWHTFY.com link to this search.',
    tooltip_lvheader1: "Click to sort",
    tooltip_lvheader2: "Right-click to filter",
    tooltip_lvheader3: "Shift-click to filter",
    tooltip_noresponse: "No response from server, try again",
    tooltip_normal: "Normal",
    tooltip_notconsumedonuse: "Not consumed when used",
    tooltip_npcnotfound: "NPC not found :(",
    tooltip_objectnotfound: "Object not found :(",
    tooltip_partyloot: "When this item drops, each<br />member of the group can loot one.",
    tooltip_pending: "Pending",
    tooltip_questnotfound: "Quest not found :(",
    tooltip_refundable: "May be returned for a refund at a vendor<br />if within two hours after the purchase.",
    tooltip_repgain: "Reputation gain",
    tooltip_reqenchanting: "Required Enchanting skill",
    tooltip_reqinscription: "Required Inscription skill",
    tooltip_reqjewelcrafting: "Required Jewelcrafting skill",
    tooltip_reqlevel: "Required level",
    tooltip_reqlockpicking: "Required Lockpicking skill",
    tooltip_smartloot: "Only available to players who have<br />the profession and don't already<br />have the recipe.",
    tooltip_spellnotfound: "Spell not found :(",
    tooltip_sticky: "Sticky",
    tooltip_totaldatauploads: "Total size of all data uploads",
    tooltip_totalratings: "Sum of the ratings of all of their comments",
    tooltip_trainingpoints: "Training points",
    tooltip_uprate: "Insightful/funny",
    tooltip_zonelink: "Clicking on this link will<br />take you to the zone page.",
    tab_abilities: "Abilities",
    tab_achievements: "Achievements",
    tab_addyourcomment: "Add your comment",
    tab_article: "Article",
    tab_articles: "Articles",
    tab_bosses: "Bosses",
    tab_canbeplacedin: "Can be placed in",
    tab_cancontain: "Can contain",
    tab_characters: "Characters",
    tab_comments: "Comments",
    tab_wh_comments: "WH Comments",
    tab_wh_screenshots: "WH Screenshots",
    tab_companions: "Companions",
    tab_containedin: "Contained in",
    tab_contains: "Contains",
    tab_createdby: "Created by",
    tab_criteriaof: "Criteria of",
    tab_currencyfor: "Currency for",
    tab_disenchantedfrom: "Disenchanted from",
    tab_disenchanting: "Disenchanting",
    tab_droppedby: "Dropped by",
    tab_drops: "Drops",
    tab_ends: "Ends",
    tab_factions: "Factions",
    tab_fishedin: "Fished in",
    tab_fishing: "Fishing",
    tab_gallery: "Gallery",
    tab_gatheredfrom: "Gathered from",
    tab_gatheredfromnpc: "Gathered from NPC",
    tab_herbalism: "Herbalism",
    tab_heroicdrops: "Heroic drops",
    tab_heroicXdrops: "Heroic $1 drops",
    tab_holidays: "World Events",
    tab_info: "Info",
    tab_items: "Items",
    tab_itemsets: "Item sets",
    tab_latestcomments: "Latest Comments",
    tab_latestreplies: "Latest Replies",
    tab_latestscreenshots: "Latest Screenshots",
    tab_latesttopics: "Latest Topics",
    tab_members: "Members",
    tab_milledfrom: "Milled from",
    tab_milling: "Milling",
    tab_minedfrom: "Mined from",
    tab_minedfromnpc: "Mined from NPC",
    tab_mining: "Mining",
    tab_modifiedby: "Modified by",
    tab_modifies: "Modifies",
    tab_mounts: "Mounts",
    tab_normaldrops: "Normal drops",
    tab_normalXdrops: "Normal $1 drops",
    tab_npcs: "NPCs",
    tab_objectiveof: "Objective of",
    tab_objects: "Objects",
    tab_pets: "Hunter Pets",
    tab_pickpocketedfrom: "Pickpocketed from",
    tab_pickpocketing: "Pickpocketing",
    tab_professions: "Professions",
    tab_profiles: "Profiles",
    tab_prospectedfrom: "Prospected from",
    tab_prospecting: "Prospecting",
    tab_providedfor: "Provided for",
    tab_questrewards: "Quest rewards",
    tab_quests: "Quests",
    tab_reagentfor: "Reagent for",
    tab_recipes: "Recipes",
    tab_replies: "Replies",
    tab_rewardfrom: "Reward from",
    tab_samemodelas: "Same model as",
    tab_screenshots: "Screenshots",
    tab_seealso: "See also",
    tab_sells: "Sells",
    tab_sharedcooldown: "Shared cooldown",
    tab_skills: "Skills",
    tab_skinnedfrom: "Skinned from",
    tab_skinning: "Skinning",
    tab_soldby: "Sold by",
    tab_starts: "Starts",
    tab_startsquest: "Starts quest",
    tab_submitascreenshot: "Submit a screenshot",
    tab_summonedby: "Summoned by",
    tab_talents: "Talents",
    tab_tameable: "Tameable",
    tab_taughtby: "Taught by",
    tab_teaches: "Teaches",
    tab_titles: "Titles",
    tab_toolfor: "Tool for",
    tab_topics: "Topics",
    tab_triggeredby: "Triggered by",
    tab_uncategorizedspells: "Spells",
    tab_unlocks: "Unlocks",
    tab_usedby: "Used by",
    tab_zones: "Zones",
    menu_browse: "Browse",
    mapper_tipzoom: "Tip: Click map to zoom",
    mapper_tippin: "Tip: Click map to add/remove pins",
    mapper_hidepins: "Hide pins",
    mapper_showpins: "Show pins",
    mapper_floor: "Change floor",
    showonmap: "Show on map...",
    som_questgivers: "Quest givers",
    markup_b: "Bold",
    markup_i: "Italic",
    markup_u: "Underline",
    markup_s: "Strikethrough",
    markup_small: "Small text",
    markup_url: "Link",
    markup_quote: "Quote box",
    markup_code: "Code box",
    markup_ul: "Unordered list (bullets)",
    markup_ol: "Ordered list (numbers)",
    markup_li: "List item",
    markup_img: "Image",
    markup_said: "said: ",
    markup_toc: "Table of Contents",
    ct_dialog_captcha: "Please enter the code above: ",
    ct_dialog_contactwowhead: "Contact Wowhead",
    ct_dialog_description: "Description",
    ct_dialog_desc_caption: "Please be as specific as possible.",
    ct_dialog_email: "Email address: ",
    ct_dialog_email_caption: "Only if you want to be contacted",
    ct_dialog_optional: "Optional",
    ct_dialog_reason: "Reason: ",
    ct_dialog_relatedurl: "Related URL: ",
    ct_dialog_currenturl: "Current URL: ",
    ct_dialog_report: "Report",
    ct_dialog_reportchar: "Report Character",
    ct_dialog_reportcomment: "Report Comment by $1",
    ct_dialog_reportpost: "Report Post by $1",
    ct_dialog_reportscreen: "Report Screenshot from $1",
    ct_dialog_reporttopic: "Report Topic by $1",
    ct_dialog_thanks: "Your message has been received. Thanks for contacting us!",
    ct_dialog_thanks_user: "Your message has been received, $1. Thanks for contacting us!",
    ct_dialog_error_captcha: "The code you entered is invalid. Please try again.",
    ct_dialog_error_desc: "Please provide a thorough description, but not too long.",
    ct_dialog_error_email: "Please enter a valid email address.",
    ct_dialog_error_emaillen: "Please enter an email address with less than 100 characters.",
    ct_dialog_error_reason: "Please choose a reason for contacting us.",
    ct_dialog_error_relatedurl: "Please provide a related URL with less than 250 characters.",
    ct_dialog_error_invalidurl: "Please enter a valid URL.",
    cn_fieldrequired: "$1 is required.",
    cn_fieldinvalid: "$1 must be valid.",
    cn_confirm: "Make sure you have verified the information you entered, and then click OK.",
    cn_entrylogin: 'Please <a href="?account=signin">sign in</a> to enter the contest, or <a href="?account=signup">sign up</a> if you don\'t already have an account.',
    cn_entryerror: "An error occurred. Please try again.",
    cn_entrywhen: "You entered the contest on <b>$1</b>.",
    cn_entrywhen2: "You have already entered the contest.",
    cn_entrysuccess: "You have just entered the contest. Best of luck!",
    cn_entryended: "This contest has ended.",
    cn_entryupcoming: "This contest has not yet begun. Stay tuned to enter!",
    cn_entryregion: "You are not eligible to enter this contest in your region.",
    cn_mustbe18: "You must be 18 years old or older to enter the contest.",
    cn_winnerslist: "Winners List",
    cn_updated: "Updated ",
    ct_resp_error1: "The code you entered is invalid. Please try again.",
    ct_resp_error2: "Please provide a thorough description, but not too long.",
    ct_resp_error3: "Please choose a reason for contacting us.",
    ct_resp_error7: "You've already reported this.",
    compose_mode: "Mode: ",
    compose_edit: "Edit",
    compose_preview: "Preview",
    compose_livepreview: "Live Preview",
    compose_save: "Save",
    compose_cancel: "Cancel",
    compose_limit: "Up to $1 characters",
    compose_limit2: "Up to $1 characters and/or $2 lines",
    user_nodescription: "This user hasn't composed one yet.",
    user_nodescription2: "You haven't composed one yet.",
    user_composeone: "Compose one now!",
    user_editdescription: "Edit",
    myaccount_passmatch: "Passwords match",
    myaccount_passdontmatch: "Passwords do not match",
    myaccount_purged: "Purged",
    myaccount_purgefailed: "Purge failed :(",
    myaccount_purgesuccess: "Announcement data has been successfully purged!",
    mangos_npc_scripted_eai: "NPC is scripted by Event AI",
    mangos_npc_scripted_sd2: "NPC is scripted by ScriptDev",
    types: {
        1: ["NPC", "NPC", "NPCs", "NPCs"],
        2: ["Object", "object", "Objects", "objects"],
        3: ["Item", "item", "Items", "items"],
        4: ["Item Set", "item set", "Item Sets", "item sets"],
        5: ["Quest", "quest", "Quests", "quests"],
        6: ["Spell", "spell", "Spells", "spells"],
        7: ["Zone", "zone", "Zones", "zones"],
        8: ["Faction", "faction", "Factions", "factions"],
        9: ["Hunter Pet", "pet", "Hunter Pets", "pets"],
        10: ["Achievement", "achievement", "Achievements", "achievements"],
        11: ["Title", "title", "Titles", "titles"],
        12: ["World Event", "world event", "World Events", "world events"]
    },
    timeunitssg: ["year", "month", "week", "day", "hour", "minute", "second"],
    timeunitspl: ["years", "months", "weeks", "days", "hours", "minutes", "seconds"],
    timeunitsab: ["yr", "mo", "wk", "", "hr", "min", "sec"],
    presets: {
        pve: "PvE",
        pvp: "PvP",
        afflic: "Affliction",
        arcane: "Arcane",
        arms: "Arms (DPS)",
        assas: "Assassination",
        balance: "Balance (DPS)",
        beast: "Beast Mastery",
        blooddps: "Blood (DPS)",
        bloodtank: "Blood (Tank)",
        combat: "Combat",
        demo: "Demonology",
        destro: "Destruction",
        disc: "Discipline (Healing)",
        elem: "Elemental Combat (DPS)",
        enhance: "Enhancement (DPS)",
        feraldps: "Feral Combat (DPS)",
        feraltank: "Feral Combat (Tank)",
        fire: "Fire",
        frost: "Frost",
        frostdps: "Frost (DPS)",
        frosttank: "Frost (Tank)",
        fury: "Fury (DPS)",
        generic: "Generic",
        holy: "Holy (Healing)",
        marks: "Marksmanship",
        prot: "Protection (Tank)",
        resto: "Restoration (Healing)",
        retrib: "Retribution (DPS)",
        shadow: "Shadow Magic (DPS)",
        subtle: "Subtlety",
        surv: "Survival",
        unholydps: "Unholy (DPS)"
    },
    traits: {
        agi: ["Agility", "Agi", "Agi"],
        arcres: ["Arcane resistance", "Arcane Resist", "ArcR"],
        arcsplpwr: ["Arcane spell power", "Arcane Power", "ArcP"],
        armor: ["Armor", "Armor", "Armor"],
        armorbonus: ["Additional armor", "Bonus Armor", "AddAr"],
        armorpenrtng: ["Armor penetration rating", "Armor Pen", "Pen"],
        atkpwr: ["Attack power", "AP", "AP"],
        avgbuyout: ["Average buyout price", "Buyout", "AH"],
        avgmoney: ["Average money contained", "Money", "Money"],
        block: ["Block value", "Block Value", "BkVal"],
        blockrtng: ["Block rating", "Block", "Block"],
        buyprice: ["Buy price (coppers)", "Buy", "Buy"],
        cooldown: ["Cooldown (seconds)", "Cooldown", "CD"],
        critstrkrtng: ["Critical strike rating", "Crit", "Crit"],
        defrtng: ["Defense rating", "Defense", "Def"],
        dmg: ["Weapon damage", "Damage", "Dmg"],
        dmgmax1: ["Maximum damage", "Max Damage", "Max"],
        dmgmin1: ["Minimum damage", "Min Damage", "Min"],
        dodgertng: ["Dodge rating", "Dodge", "Dodge"],
        dps: ["Damage per second", "DPS", "DPS"],
        dura: ["Durability", "Durability", "Dura"],
        exprtng: ["Expertise rating", "Expertise", "Exp"],
        feratkpwr: ["Feral attack power", "Feral AP", "FAP"],
        firres: ["Fire resistance", "Fire Resist", "FirR"],
        firsplpwr: ["Fire spell power", "Fire Power", "FireP"],
        frores: ["Frost resistance", "Frost Resist", "FroR"],
        frosplpwr: ["Frost spell power", "Frost Power", "FroP"],
        hastertng: ["Haste rating", "Haste", "Haste"],
        health: ["Health", "Health", "Hlth"],
        healthrgn: ["Health regeneration", "HP5", "HP5"],
        hitrtng: ["Hit rating", "Hit", "Hit"],
        holres: ["Holy resistance", "Holy Resist", "HolR"],
        holsplpwr: ["Holy spell power", "Holy Power", "HolP"],
        "int": ["Intellect", "Int", "Int"],
        level: ["Level", "Level", "Lvl"],
        mana: ["Mana", "Mana", "Mana"],
        manargn: ["Mana regeneration", "MP5", "MP5"],
        mleatkpwr: ["Melee attack power", "Melee AP", "AP"],
        mlecritstrkrtng: ["Melee critical strike rating", "Melee Crit", "Crit"],
        mledmgmax: ["Melee maximum damage", "Melee Max Damage", "Max"],
        mledmgmin: ["Melee minimum damage", "Melee Min Damage", "Min"],
        mledps: ["Melee DPS", "Melee DPS", "DPS"],
        mlehastertng: ["Melee haste rating", "Melee Haste", "Haste"],
        mlehitrtng: ["Melee hit rating", "Melee Hit", "Hit"],
        mlespeed: ["Melee speed", "Melee Speed", "Speed"],
        natres: ["Nature resistance", "Nature Resist", "NatR"],
        natsplpwr: ["Nature spell power", "Nature Power", "NatP"],
        nsockets: ["Number of sockets", "Sockets", "Sockt"],
        parryrtng: ["Parry rating", "Parry", "Parry"],
        reqarenartng: ["Required personal and team arena rating", "Req Rating", "Rating"],
        reqlevel: ["Required level", "Req Level", "Level"],
        reqskillrank: ["Required skill level", "Req Skill", "Skill"],
        resirtng: ["Resilience rating", "Resilience", "Resil"],
        rgdatkpwr: ["Ranged attack power", "Ranged AP", "RAP"],
        rgdcritstrkrtng: ["Ranged critical strike rating", "Ranged Crit", "Crit"],
        rgddmgmax: ["Ranged maximum damage", "Ranged Max Damage", "Max"],
        rgddmgmin: ["Ranged minimum damage", "Ranged Min Damage", "Min"],
        rgddps: ["Ranged DPS", "Ranged DPS", "DPS"],
        rgdhastertng: ["Ranged haste rating", "Ranged Haste", "Haste"],
        rgdhitrtng: ["Ranged hit rating", "Ranged Hit", "Hit"],
        rgdspeed: ["Ranged speed", "Ranged Speed", "Speed"],
        sellprice: ["Sale price (coppers)", "Sell", "Sell"],
        sepbasestats: "Base stats",
        sepdefensivestats: "Defensive stats",
        sepgeneral: "General",
        sepindividualstats: "Individual stats",
        sepmisc: "Miscellaneous",
        sepoffensivestats: "Offensive stats",
        sepresistances: "Resistances",
        sepweaponstats: "Weapon stats",
        shares: ["Shadow resistance", "Shadow Resist", "ShaR"],
        shasplpwr: ["Shadow spell power", "Shadow Power", "ShaP"],
        speed: ["Speed", "Speed", "Speed"],
        spi: ["Spirit", "Spi", "Spi"],
        splcritstrkrtng: ["Spell critical strike rating", "Spell Crit", "Crit"],
        spldmg: ["Damage done by spells", "Spell Damage", "Dmg"],
        splheal: ["Healing done by spells", "Healing", "Heal"],
        splpwr: ["Spell power", "Spell Power", "SP"],
        splhastertng: ["Spell haste rating", "Spell Haste", "Haste"],
        splhitrtng: ["Spell hit rating", "Spell Hit", "Hit"],
        splpen: ["Spell penetration", "Spell Pen", "Pen"],
        sta: ["Stamina", "Sta", "Sta"],
        str: ["Strength", "Str", "Str"]
    },
    fonavtopic: "$1 topic",
    fonavtopics: "$1 topics",
    fonavpost: "$1 post",
    fonavposts: "$1 posts",
    foboards: {
        0: "WoW General",
        21: "Cataclysm",
        16: "Help & Support",
        20: "Theorycrafting",
        14: "PvE",
        15: "PvP",
        18: "Death Knight",
        3: "Druid",
        4: "Hunter",
        6: "Mage",
        7: "Paladin",
        8: "Priest",
        5: "Rogue",
        9: "Shaman",
        10: "Warlock",
        11: "Warrior",
        13: "Professions",
        12: "UI & Macros",
        19: "Lore & Roleplaying",
        17: "Guild Recruitment",
        2: "Randomness",
        1: "Site Feedback"
    },
    lvboard_by: "By ",
    lvboard_pages: "Pages:",
    lvtopic_whuser: "Wowhead User",
    lvtopic_joined: "Joined ",
    lvtopic_posts: "Posted Bugreports: ",
    lvtopic_role: "Role: ",
    lvtopic_roles: "Roles: ",
    lvtopic_posts: "Posts: ",
    lvtopic_edit: "Edit",
    lvtopic_delete: "Delete",
    lvtopic_quote: "Quote",
    lvtopic_reply: "Reply",
    lvtopic_by: "By ",
    lvtopic_lastedit: "Last edited by ",
    status: "Status",
    message_postdeleted: "The post is now deleted.",
    message_allow5min: "Please allow up to 5 minutes for this to be reflected on the site.",
    message_topicsubject: "Please enter a subject for your topic.",
    message_subjectlimit: "Subjects cannot have more than 100 characters.",
    message_topicrenamed: "The topic has been renamed.",
    message_topiclocked: "The topic is now locked.",
    message_topicunlocked: "The topic is no longer locked.",
    message_topicdeleted: "The topic is now deleted.",
    message_topicundeleted: "The topic is no longer deleted.",
    tooltip_lastpost: "Last Comment",
    confirm_deletepost: "Are you sure you want to delete this post?",
    prompt_renametopic: "You may set a new subject for this topic:",
    subcategory: "Subcategory",
    bugtracker_stchange: "Status changed: ",
    bugtracker_urlchange: "Url changed: ",
    bugtracker_titlechange: "Title changed: ",
    status_message_1stpost: "Current bugreport status: ",
    bt_pleaseusesearch: "Please, before creating new reports, use search.",
    bt_findmore: "Find More Bugreports ",
    bugreport_statuses: [
		"New",
		"Accepted",
		"Not a Bug",
		"Fixed",
		"Retest Now",
		"Duplicate",
		"Incorrect"
    ],
    bugtracker_categories: [
		"Items", // 0
		"Quests",
		"Spells",
		"NPC",
		"Other", // 4
		"Achievements"
    ],
    bugtracker_categories2: {
        3: {
            1: ["Warrior", "c1", "class_warrior"],
            2: ["Paladin", "c2", "class_paladin"],
            3: ["Hunter", "c3", "class_hunter"],
            4: ["Rogue", "c4", "class_rogue"],
            5: ["Priest", "c5", "class_priest"],
            6: ["Death Knight", "c6", "class_deathknight"],
            7: ["Shaman", "c7", "class_shaman"],
            8: ["Mage", "c8", "class_mage"],
            9: ["Warlock", "c9", "class_warlock"],
            11: ["Druid", "c11", "class_druid"]
        }
    },

    spell_desc: {
        "AP": "Attack Power",
        "RAP": "Ranged Attack Power",
        "MWB": "Main Weapon Highest Damage",
        "mwb": "Main Weapon Lowest Damage",
        "MWS": "Main Weapon Speed",
        "SPH": "Holy Spell Power",
        "SPI": "Spirit",
        "max": "Maximum value of two",
        "PL": "Player Level",
        "HND": "One-Handed or Two-Handed weapon"
    },
    bugtracker_starred: "You are starred this bugreport.",
    bugtracker_notstarred: "Vote for this bugreport to track it at your page.",
    bugtracker_dev1: "Dev",
    bugtracker_dev2: "Developer",
    bugtracker_devsanswer1: "DA",
    bugtracker_devsanswer2: "Developer's Answer",
    bugtracker_devsanswer3: "Next Developer's Answer",
    tab_starred: "Stared Bugreports",
    tab_accepted: "Accepted Bugreports"
};

function $_QueryElement(c) {
    if (arguments.length > 1) {
        var b = [];
        var a;
        for (var d = 0, a = arguments.length; d < a; ++d) {
            b.push($_QueryElement(arguments[d]))
        }
        return b
    }
    if (typeof c == "string") {
        c = ge(c)
    }
    return c
}
function $E(a) {
    if (!a) {
        if (typeof event != "undefined") {
            a = event
        } else {
            return null
        }
    }
    if (a.which) {
        a._button = a.which
    } else {
        a._button = a.button;
        if (Browser.ie) {
            if (a._button & 4) {
                a._button = 2
            } else {
                if (a._button & 2) {
                    a._button = 3
                }
            }
        } else {
            a._button = a.button + 1
        }
    }
    a._target = a.target ? a.target : a.srcElement;
    a._wheelDelta = a.wheelDelta ? a.wheelDelta : -a.detail;
    return a
}
function $A(c) {
    var e = [];
    for (var d = 0, b = c.length; d < b; ++d) {
        e.push(c[d])
    }
    return e
}
Function.prototype.bind = function () {
    var c = this,
	a = $A(arguments),
	b = a.shift();
    return function () {
        return c.apply(b, a.concat($A(arguments)))
    }
};
function strcmp(d, c) {
    if (d == c) {
        return 0
    }
    if (d == null) {
        return -1
    }
    if (c == null) {
        return 1
    }
    return d < c ? -1 : 1
}
function trim(a) {
    return a.replace(/(^\s*|\s*$)/g, "")
}
function rtrim(c, d) {
    var b = c.length;
    while (--b > 0 && c.charAt(b) == d) { }
    c = c.substring(0, b + 1);
    if (c == d) {
        c = ""
    }
    return c
}
function sprintf(b) {
    var a;
    for (a = 1, len = arguments.length; a < len; ++a) {
        b = b.replace("$" + a, arguments[a])
    }
    return b
}
function sprintfa(b) {
    var a;
    for (a = 1, len = arguments.length; a < len; ++a) {
        b = b.replace(new RegExp("\\$" + a, "g"), arguments[a])
    }
    return b
}
function sprintfo(c) {
    if (typeof c == "object" && c.length) {
        var a = c;
        c = a[0];
        var b;
        for (b = 1; b < a.length; ++b) {
            c = c.replace("$" + b, a[b])
        }
        return c
    }
}
function str_replace(e, d, c) {
    while (e.indexOf(d) != -1) {
        e = e.replace(d, c)
    }
    return e
}
function urlencode(a) {
    a = encodeURIComponent(a);
    a = str_replace(a, "+", "%2B");
    return a
}
function urlencode2(a) {
    a = encodeURIComponent(a);
    a = str_replace(a, "%20", "+");
    return a
}
function number_format(a) {
    a = "" + parseInt(a);
    if (a.length <= 3) {
        return a
    }
    return number_format(a.substr(0, a.length - 3)) + "," + a.substr(a.length - 3)
}
function in_array(c, g, h, e) {
    if (c == null) {
        return -1
    }
    if (h) {
        return in_arrayf(c, g, h, e)
    }
    for (var d = e || 0, b = c.length; d < b; ++d) {
        if (c[d] == g) {
            return d
        }
    }
    return -1
}
function in_arrayf(c, g, h, e) {
    for (var d = e || 0, b = c.length; d < b; ++d) {
        if (h(c[d]) == g) {
            return d
        }
    }
    return -1
}
function array_walk(d, h, c) {
    var g;
    for (var e = 0, b = d.length; e < b; ++e) {
        g = h(d[e], c, d, e);
        if (g != null) {
            d[e] = g
        }
    }
}
function array_apply(d, h, c) {
    var g;
    for (var e = 0, b = d.length; e < b; ++e) {
        h(d[e], c, d, e)
    }
}
function ge(a) {
    return document.getElementById(a)
}
function gE(a, b) {
    return a.getElementsByTagName(b)
}
function ce(c, b) {
    var a = document.createElement(c);
    if (b) {
        cOr(a, b)
    }
    return a
}
function de(a) {
    a.parentNode.removeChild(a)
}
function ae_AddElement(a, b) {
    return a.appendChild(b)
}
function aef_AddElementFirst(a, b) {
    return a.insertBefore(b, a.firstChild)
}
function ee(a, b) {
    if (!b) {
        b = 0
    }
    while (a.childNodes[b]) {
        a.removeChild(a.childNodes[b])
    }
}
function ct(a) {
    return document.createTextNode(a)
}
function st(a, b) {
    if (a.firstChild && a.firstChild.nodeType == 3) {
        a.firstChild.nodeValue = b
    } else {
        aef_AddElementFirst(a, ct(b))
    }
}
function nw(a) {
    a.style.whiteSpace = "nowrap"
}
function rf() {
    return false
}
function rf2(a) {
    a = $E(a);
    if (a.ctrlKey || a.shiftKey || a.altKey || a.metaKey) {
        return
    }
    return false
}
function tb() {
    this.blur()
}
function ac(c, d) {
    var a = 0,
	g = 0,
	b;
    while (c) {
        a += c.offsetLeft;
        g += c.offsetTop;
        b = c.parentNode;
        while (b && b != c.offsetParent && b.offsetParent) {
            if (b.scrollLeft || b.scrollTop) {
                a -= (b.scrollLeft | 0);
                g -= (b.scrollTop | 0);
                break
            }
            b = b.parentNode
        }
        c = c.offsetParent
    }
    if (Lightbox.isVisible()) {
        d = true
    }
    if (d && !Browser.ie6) {
        var f = g_getScroll();
        a += f.x;
        g += f.y
    }
    var e = [a, g];
    e.x = a;
    e.y = g;
    return e
}
function aE(b, c, a) {
    if (Browser.ie) {
        b.attachEvent("on" + c, a)
    } else {
        b.addEventListener(c, a, false)
    }
}
function dE(b, c, a) {
    if (Browser.ie) {
        b.detachEvent("on" + c, a)
    } else {
        b.removeEventListener(c, a, false)
    }
}
function sp(a) {
    if (!a) {
        a = event
    }
    if (Browser.ie) {
        a.cancelBubble = true
    } else {
        a.stopPropagation()
    }
}
function sc(h, i, d, f, g) {
    var e = new Date();
    var c = h + "=" + escape(d) + "; ";
    e.setDate(e.getDate() + i);
    c += "expires=" + e.toUTCString() + "; ";
    if (f) {
        c += "path=" + f + "; "
    }
    if (g) {
        c += "domain=" + g + "; "
    }
    document.cookie = c;
    gc.C[h] = d
}
function dc(a) {
    sc(a, -1);
    gc.C[a] = null
}
function gc(f) {
    if (gc.I == null) {
        var e = unescape(document.cookie).split("; ");
        gc.C = {};
        for (var c = 0, a = e.length; c < a; ++c) {
            var g = e[c].indexOf("="),
			b,
			d;
            if (g != -1) {
                b = e[c].substr(0, g);
                d = e[c].substr(g + 1)
            } else {
                b = e[c];
                d = ""
            }
            gc.C[b] = d
        }
        gc.I = 1
    }
    if (!f) {
        return gc.C
    } else {
        return gc.C[f]
    }
}
function ns(a) {
    if (Browser.ie) {
        a.onfocus = tb;
        a.onmousedown = a.onselectstart = a.ondragstart = rf
    }
}
function eO(b) {
    for (var a in b) {
        delete b[a]
    }
}
function cO(f, c, b) { // f == g_items objectet, c == tooltip
    for (var e in c) {
        if (b && typeof c[e] == "object" && c[e].length) {
            f[e] = c[e].slice(0)
        } else {
            f[e] = c[e]
        }
    }
}
function cOr(f, c, b) {
    for (var e in c) {
        if (typeof c[e] == "object") {
            if (b && c[e].length) {
                f[e] = c[e].slice(0)
            } else {
                if (!f[e]) {
                    f[e] = {}
                }
                cOr(f[e], c[e], b)
            }
        } else {
            f[e] = c[e]
        }
    }
}
var Browser = {
    ie: !!(window.attachEvent && !window.opera),
    opera: !!window.opera,
    safari: navigator.userAgent.indexOf("Safari") != -1,
    gecko: navigator.userAgent.indexOf("Gecko") != -1 && navigator.userAgent.indexOf("KHTML") == -1
};
Browser.ie8 = Browser.ie && navigator.userAgent.indexOf("MSIE 8.0") != -1;
Browser.ie7 = Browser.ie && navigator.userAgent.indexOf("MSIE 7.0") != -1 && !Browser.ie8;
Browser.ie6 = Browser.ie && navigator.userAgent.indexOf("MSIE 6.0") != -1 && !Browser.ie7;
Browser.ie67 = Browser.ie6 || Browser.ie7;
navigator.userAgent.match(/Gecko\/([0-9]+)/);
Browser.geckoVersion = parseInt(RegExp.$1) | 0;
var OS = {
    windows: navigator.appVersion.indexOf("Windows") != -1,
    mac: navigator.appVersion.indexOf("Macintosh") != -1,
    linux: navigator.appVersion.indexOf("Linux") != -1
};
var DomContentLoaded = new
function () {
    var a = [];
    this.now = function () {
        array_apply(a, function (b) {
            b()
        });
        DomContentLoaded = null
    };
    this.addEvent = function (b) {
        a.push(b)
    }
};
function g_getWindowSize() {
    var a = 0,
	b = 0;
    if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        a = document.documentElement.clientWidth;
        b = document.documentElement.clientHeight
    } else {
        if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            a = document.body.clientWidth;
            b = document.body.clientHeight
        } else {
            if (typeof window.innerWidth == "number") {
                a = window.innerWidth;
                b = window.innerHeight
            }
        }
    }
    return {
        w: a,
        h: b
    }
}
function g_getScroll() {
    var a = 0,
	b = 0;
    if (typeof (window.pageYOffset) == "number") {
        a = window.pageXOffset;
        b = window.pageYOffset
    } else {
        if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
            a = document.body.scrollLeft;
            b = document.body.scrollTop
        } else {
            if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                a = document.documentElement.scrollLeft;
                b = document.documentElement.scrollTop
            }
        }
    }
    return {
        x: a,
        y: b
    }
}
function g_getCursorPos(c) {
    var a, d;
    if (window.innerHeight) {
        a = c.pageX;
        d = c.pageY
    } else {
        var b = g_getScroll();
        a = c.clientX + b.x;
        d = c.clientY + b.y
    }
    return {
        x: a,
        y: d
    }
}
function g_scrollTo(c, b) {
    var l, k = g_getWindowSize(),
	m = g_getScroll(),
	i = k.w,
	e = k.h,
	g = m.x,
	d = m.y;
    c = $_QueryElement(c);
    if (b == null) {
        b = []
    } else {
        if (typeof b == "number") {
            b = [b]
        }
    }
    l = b.length;
    if (l == 0) {
        b[0] = b[1] = b[2] = b[3] = 0
    } else {
        if (l == 1) {
            b[1] = b[2] = b[3] = b[0]
        } else {
            if (l == 2) {
                b[2] = b[0];
                b[3] = b[1]
            } else {
                if (l == 3) {
                    b[3] = b[1]
                }
            }
        }
    }
    l = ac(c);
    var a = l[0] - b[3],
	h = l[1] - b[0],
	j = l[0] + c.offsetWidth + b[1],
	f = l[1] + c.offsetHeight + b[2];
    if (j - a > i || a < g) {
        g = a
    } else {
        if (j - i > g) {
            g = j - i
        }
    }
    if (f - h > e || h < d) {
        d = h
    } else {
        if (f - e > d) {
            d = f - e
        }
    }
    scrollTo(g, d)
}
//NEW FUNC
function g_addCss(b) {
    var c = ce("style");
    c.type = "text/css";
    if (c.styleSheet) {
        c.styleSheet.cssText = b
    } else {
        ae_AddElement(c, ct(b))
    }
    var a = document.getElementsByTagName("head")[0];
    ae_AddElement(a, c)
}
function g_setTextNodes(c, b) {
    if (c.nodeType == 3) {
        c.nodeValue = b
    } else {
        for (var a = 0; a < c.childNodes.length; ++a) {
            g_setTextNodes(c.childNodes[a], b)
        }
    }
}
function g_getTextContent(c) {
    var a = "";
    for (var b = 0; b < c.childNodes.length; ++b) {
        if (c.childNodes[b].nodeValue) {
            a += c.childNodes[b].nodeValue
        } else {
            if (c.childNodes[b].nodeName == "BR") {
                if (Browser.ie) {
                    a += "\r"
                } else {
                    a += "\n"
                }
            }
        }
        a += g_getTextContent(c.childNodes[b])
    }
    return a
}
function g_setSelectedLink(c, b) {
    if (!g_setSelectedLink.groups) {
        g_setSelectedLink.groups = {}
    }
    var a = g_setSelectedLink.groups;
    if (a[b]) {
        a[b].className = a[b].className.replace("selected", "")
    }
    c.className += " selected";
    a[b] = c
}
function g_toggleDisplay(a) {
    if (a.style.display == "none") {
        a.style.display = "";
        return true
    } else {
        a.style.display = "none";
        return false
    }
}
function g_enableScroll(a) {
    if (!a) {
        aE(document, "mousewheel", g_enableScroll.F);
        aE(window, "DOMMouseScroll", g_enableScroll.F)
    } else {
        dE(document, "mousewheel", g_enableScroll.F);
        dE(window, "DOMMouseScroll", g_enableScroll.F)
    }
}
g_enableScroll.F = function (a) {
    if (a.stopPropagation) {
        a.stopPropagation()
    }
    if (a.preventDefault) {
        a.preventDefault()
    }
    a.returnValue = false;
    a.cancelBubble = true;
    return false
};
function g_getGets() {
    if (g_getGets.C != null) {
        return g_getGets.C
    }
    var e = {};
    if (location.search) {
        var f = decodeURIComponent(location.search.substr(1)).split("&");
        for (var c = 0, a = f.length; c < a; ++c) {
            var g = f[c].indexOf("="),
			b,
			d;
            if (g != -1) {
                b = f[c].substr(0, g);
                d = f[c].substr(g + 1)
            } else {
                b = f[c];
                d = ""
            }
            e[b] = d
        }
    }
    g_getGets.C = e;
    return e
}
function g_createRect(d, c, a, b) {
    return {
        l: d,
        t: c,
        r: d + a,
        b: c + b
    }
}
function g_intersectRect(d, c) {
    return !(d.l >= c.r || c.l >= d.r || d.t >= c.b || c.t >= d.b)
}
function g_createRange(c, a) {
    range = {};
    for (var b = c; b <= a; ++b) {
        range[b] = b
    }
    return range
}
function g_sortIdArray(a, b, c) {
    a.sort(c ?
	function (e, d) {
	    return strcmp(b[e][c], b[d][c])
	} : function (e, d) {
	    return strcmp(b[e], b[d])
	})
}
function g_sortJsonArray(e, d, f, a) {
    var c = [];
    for (var b in e) {
        if (d[b] && (a == null || a(d[b]))) {
            c.push(b)
        }
    }
    if (f != null) {
        c.sort(f)
    } else {
        g_sortIdArray(c, d)
    }
    return c
}
function g_urlize(a, b) {
    a = str_replace(a, "'", "");
    a = trim(a);
    if (b) {
        a = str_replace(a, " ", "-")
    } else {
        a = a.replace(/[^a-z0-9]/i, "-")
    }
    a = str_replace(a, "--", "-");
    a = str_replace(a, "--", "-");
    a = rtrim(a, "-");
    a = a.toLowerCase();
    return a
}
function g_getLocale(a) {
    if (a && g_locale.id == 25) {
        return 0
    }
    return g_locale.id
}
function g_createReverseLookupJson(b) {
    var c = {};
    for (var a in b) {
        c[b[a]] = a
    }
    return c
}
function g_formatTimeElapsed(e) {
    function c(m, l, i) {
        if (i && LANG.timeunitsab[l] == "") {
            i = 0
        }
        if (i) {
            return m + " " + LANG.timeunitsab[l]
        } else {
            return m + " " + (m == 1 ? LANG.timeunitssg[l] : LANG.timeunitspl[l])
        }
    }
    var g = [31557600, 2629800, 604800, 86400, 3600, 60, 1];
    var a = [1, 3, 3, -1, 5, -1, -1];
    e = Math.max(e, 1);
    for (var f = 3, h = g.length; f < h; ++f) {
        if (e >= g[f]) {
            var d = f;
            var k = Math.floor(e / g[d]);
            if (a[d] != -1) {
                var b = a[d];
                e %= g[d];
                var j = Math.floor(e / g[b]);
                if (j > 0) {
                    return c(k, d, 1) + " " + c(j, b, 1)
                }
            }
            return c(k, d, 0)
        }
    }
    return "(n/a)"
}
function g_formatDateSimple(g, c) {
    function a(b) {
        return (b < 10 ? "0" + b : b)
    }
    var i = "",
	j = g.getDate(),
	f = g.getMonth() + 1,
	h = g.getFullYear();
    i += sprintf(LANG.date_simple, a(j), a(f), h);
    if (c == 1) {
        var k = g.getHours() + 1,
		e = g.getMinutes() + 1;
        i += LANG.date_at + a(k) + ":" + a(e)
    }
    return i
}
function g_cleanCharacterName(e) {
    var d = "";
    for (var c = 0, a = e.length; c < a; ++c) {
        var b = e.charAt(c).toLowerCase();
        if (b >= "a" && b <= "z") {
            d += b
        } else {
            d += e.charAt(c)
        }
    }
    return d
}
function g_createGlow(a, h) {
    var e = ce("span");
    for (var c = -1; c <= 1; ++c) {
        for (var b = -1; b <= 1; ++b) {
            var g = ce("div");
            g.style.position = "absolute";
            g.style.whiteSpace = "nowrap";
            g.style.left = c + "px";
            g.style.top = b + "px";
            if (c == 0 && b == 0) {
                g.style.zIndex = 4
            } else {
                g.style.color = "black";
                g.style.zIndex = 2
            }
            ae_AddElement(g, ct(a));
            ae_AddElement(e, g)
        }
    }
    e.style.position = "relative";
    e.className = "glow" + (h != null ? " " + h : "");
    var f = ce("span");
    f.style.visibility = "hidden";
    ae_AddElement(f, ct(a));
    ae_AddElement(e, f);
    return e
}
function g_createProgressBar(c) {
    if (c == null) {
        c = {}
    }
    if (!c.text) {
        c.text = " "
    }
    if (c.color == null) {
        c.color = "rep0"
    }
    if (c.width == null) {
        c.width = 100
    }
    var d, e;
    if (c.hoverText) {
        d = ce("a");
        d.href = "javascript:;"
    } else {
        d = ce("span")
    }
    d.className = "progressbar";
    if (c.text || c.hoverText) {
        e = ce("div");
        e.className = "progressbar-text";
        if (c.text) {
            var a = ce("del");
            ae_AddElement(a, ct(c.text));
            ae_AddElement(e, a)
        }
        if (c.hoverText) {
            var b = ce("ins");
            ae_AddElement(b, ct(c.hoverText));
            ae_AddElement(e, b)
        }
        ae_AddElement(d, e)
    }
    e = ce("div");
    e.className = "progressbar-" + c.color;
    e.style.width = c.width + "%";
    ae_AddElement(e, ct(String.fromCharCode(160)));
    ae_AddElement(d, e);
    return d
}
function g_createReputationBar(g) {
    var f = g_createReputationBar.P;
    if (!g) {
        g = 0
    }
    g += 42000;
    if (g < 0) {
        g = 0
    } else {
        if (g > 84999) {
            g = 84999
        }
    }
    var e = g,
	h, b = 0;
    for (var d = 0, a = f.length; d < a; ++d) {
        if (f[d] > e) {
            break
        }
        if (d < a - 1) {
            e -= f[d];
            b = d + 1
        }
    }
    h = f[b];
    var c = {
        text: g_reputation_standings[b],
        hoverText: e + " / " + h,
        color: "rep" + b,
        width: parseInt(e / h * 100)
    };
    return g_createProgressBar(c)
}
g_createReputationBar.P = [36000, 3000, 3000, 3000, 6000, 12000, 21000, 999];
function g_createAchievementBar(a, c) {
    if (!a) {
        a = 0
    }
    var b = {
        text: a + (c > 0 ? " / " + c : ""),
        color: (c > 700 ? "rep7" : "ach" + (c > 0 ? 0 : 1)),
        width: (c > 0 ? parseInt(a / c * 100) : 100)
    };
    return g_createProgressBar(b)
}
function g_convertRatingToPercent(g, b, f, d) {
    var e = {
        12: 1.5,
        13: 12,
        14: 15,
        15: 5,
        16: 10,
        17: 10,
        18: 8,
        19: 14,
        20: 14,
        21: 14,
        22: 10,
        23: 10,
        24: 0,
        25: 0,
        26: 0,
        27: 0,
        28: 10,
        29: 10,
        30: 10,
        31: 10,
        32: 14,
        33: 0,
        34: 0,
        35: 25,
        36: 10,
        37: 2.5,
        44: 3.756097412109376
    };
    if (g < 0) {
        g = 1
    } else {
        if (g > 80) {
            g = 80
        }
    }
    if ((b == 14 || b == 12 || b == 15) && g < 34) {
        g = 34
    }
    if ((b == 28 || b == 36) && (d == 2 || d == 6 || d == 7 || d == 11)) {
        e[b] /= 1.3
    }
    if (f < 0) {
        f = 0
    }
    var a;
    if (e[b] == null) {
        a = 0
    } else {
        var c;
        if (g > 70) {
            c = (82 / 52) * Math.pow((131 / 63), ((g - 70) / 10))
        } else {
            if (g > 60) {
                c = (82 / (262 - 3 * g))
            } else {
                if (g > 10) {
                    c = ((g - 8) / 52)
                } else {
                    c = 2 / 52
                }
            }
        }
        a = f / e[b] / c
    }
    return a
}
function g_setRatingLevel(f, e, b, c) {
    var d = prompt(sprintf(LANG.prompt_ratinglevel, 1, 80), e);
    if (d != null) {
        d |= 0;
        if (d != e && d >= 1 && d <= 80) {
            e = d;
            var a = g_convertRatingToPercent(e, b, c);
            a = (Math.round(a * 100) / 100);
            if (b != 12 && b != 37) {
                a += "%"
            }
            f.innerHTML = sprintf(LANG.tooltip_combatrating, a, e);
            f.onclick = g_setRatingLevel.bind(0, f, e, b, c)
        }
    }
}
function g_getMoneyHtml(c) {
    var b = 0,
	a = "";
    if (c >= 10000) {
        b = 1;
        a += '<span class="moneygold">' + Math.floor(c / 10000) + "</span>";
        c %= 10000
    }
    if (c >= 100) {
        if (b) {
            a += " "
        } else {
            b = 1
        }
        a += '<span class="moneysilver">' + Math.floor(c / 100) + "</span>";
        c %= 100
    }
    if (c >= 1) {
        if (b) {
            a += " "
        } else {
            b = 1
        }
        a += '<span class="moneycopper">' + c + "</span>"
    }
    return a
}
function g_getPatchVersion(e) {
    var d = g_getPatchVersion;
    var b = 0,
	c = d.T.length - 2,
	a;
    while (c > b) {
        a = Math.floor((c + b) / 2);
        if (e >= d.T[a] && e < d.T[a + 1]) {
            return d.V[a]
        }
        if (e >= d.T[a]) {
            b = a + 1
        } else {
            c = a - 1
        }
    }
    a = Math.ceil((c + b) / 2);
    return d.V[a]
}
g_getPatchVersion.V = ["1.12.0", "1.12.1", "1.12.2", "2.0.1", "2.0.3", "2.0.4", "2.0.5", "2.0.6", "2.0.7", "2.0.8", "2.0.10", "2.0.12", "2.1.0", "2.1.1", "2.1.2", "2.1.3", "2.2.0", "2.2.2", "2.2.3", "2.3.0", "2.3.2", "2.3.3", "2.4.0", "2.4.1", "2.4.2", "2.4.3", "3.0.2", "3.0.3", "3.0.8", "3.0.9", "3.1.0", "3.1.1", "3.1.2", "3.1.3", "3.3.5"];
g_getPatchVersion.T = [1153540800000, 1159243200000, 1160712000000, 1165294800000, 1168318800000, 1168578000000, 1168750800000, 1169528400000, 1171342800000, 1171602000000, 1173157200000, 1175572800000, 1179806400000, 1181016000000, 1182225600000, 1184040000000, 1190692800000, 1191297600000, 1191902400000, 1194930000000, 1199768400000, 1200978000000, 1206417600000, 1207022400000, 1210651200000, 1216094400000, 1223956800000, 1225774800000, 1232427600000, 1234242000000, 1239681600000, 1240286400000, 1242705600000, 1243915200000, 9999999999999];
function g_expandSite() {
    ge("wrapper").className = "nosidebar";
    Ads.removeAll();
    var a = ge("topbar-expand");
    if (a) {
        de(a)
    }
    a = ge("sidebar");
    if (a) {
        de(a)
    }
}
function g_insertTag(d, a, i, j) {
    var b = $_QueryElement(d);
    b.focus();
    if (b.selectionStart != null) {
        var l = b.selectionStart,
		h = b.selectionEnd,
		k = b.scrollLeft,
		c = b.scrollTop;
        var g = b.value.substring(l, h);
        if (typeof j == "function") {
            g = j(g)
        }
        b.value = b.value.substr(0, l) + a + g + i + b.value.substr(h);
        b.selectionStart = b.selectionEnd = h + a.length;
        b.scrollLeft = k;
        b.scrollTop = c
    } else {
        if (document.selection && document.selection.createRange) {
            var f = document.selection.createRange();
            if (f.parentElement() != b) {
                return
            }
            var g = f.text;
            if (typeof j == "function") {
                g = j(g)
            }
            f.text = a + g + i
        }
    }
    if (b.onkeyup) {
        b.onkeyup()
    }
}
function g_getLocaleFromDomain(a) {
    var c = g_getLocaleFromDomain.L;
    if (a) {
        var b = a.indexOf(".");
        if (b != -1) {
            a = a.substring(0, b)
        }
    }
    return (c[a] ? c[a] : 0)
}
g_getLocaleFromDomain.L = {
    fr: 2,
    de: 3,
    es: 6,
    ru: 7,
    ptr: 25
};
function g_getDomainFromLocale(a) {
    var b;
    if (g_getDomainFromLocale.L) {
        b = g_getDomainFromLocale.L
    } else {
        b = g_getDomainFromLocale.L = g_createReverseLookupJson(g_getLocaleFromDomain.L)
    }
    return (b[a] ? b[a] : "www")
}
function g_getIdFromTypeName(a) {
    var b = g_getIdFromTypeName.L;
    return (b[a] ? b[a] : -1)
}
g_getIdFromTypeName.L = {
    npc: 1,
    object: 2,
    item: 3,
    itemset: 4,
    quest: 5,
    spell: 6,
    zone: 7,
    faction: 8,
    pet: 9,
    achievement: 10,
    profile: 100
};
function g_onClick(c, d) {
    var b = 0;
    function a(e) {
        if (b) {
            if (b != e) {
                return
            }
        } else {
            b = e
        }
        d(true)
    }
    c.oncontextmenu = function () {
        a(1);
        return false
    };
    c.onmouseup = function (f) {
        f = $E(f);
        if (f._button == 3 || f.ctrlKey) {
            a(2)
        } else {
            if (f._button == 1) {
                d(false)
            }
        }
        return false
    }
}
function g_isLeftClick(a) {
    a = $E(a);
    return (a && a._button == 1)
}
function g_createOrRegex(c) {
    var e = c.split(" "),
	d = "";
    for (var b = 0, a = e.length; b < a; ++b) {
        if (b > 0) {
            d += "|"
        }
        d += e[b]
    }
    return new RegExp("(" + d + ")", "gi")
}
function Ajax(b, c) {
    if (!b) {
        return
    }
    var a;
    try {
        a = new XMLHttpRequest()
    } catch (d) {
        try {
            a = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (d) {
            try {
                a = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (d) {
                if (window.createRequest) {
                    a = window.createRequest()
                } else {
                    alert(LANG.message_ajaxnotsupported);
                    return
                }
            }
        }
    }
    this.request = a;
    cO(this, c);
    this.method = this.method || (this.params && "POST") || "GET";
    a.open(this.method, b, this.async == null ? true : this.async);
    a.onreadystatechange = Ajax.onReadyStateChange.bind(this);
    if (this.method.toUpperCase() == "POST") {
        a.setRequestHeader("Content-Type", (this.contentType || "application/x-www-form-urlencoded") + "; charset=" + (this.encoding || "UTF-8"))
    }
    a.send(this.params)
}
Ajax.onReadyStateChange = function () {
    if (this.request.readyState == 4) {
        if (this.request.status == 0 || (this.request.status >= 200 && this.request.status < 300)) {
            this.onSuccess != null && this.onSuccess(this.request, this)
        } else {
            this.onFailure != null && this.onFailure(this.request, this)
        }
        if (this.onComplete != null) {
            this.onComplete(this.request, this)
        }
    }
};
function g_ajaxIshRequest(b) {
    var c = document.getElementsByTagName("head")[0],
	a = g_getGets();
    if (a.refresh != null) {
        b += "&refresh"
    }

    if (VF_AjaxControl_Request) {
        VF_AjaxControl_Request(b);
    }
    else {
        ae_AddElement(c, ce("script", {
            type: "text/javascript",
            src: b
        }))
    }
}
var Icon = {
    sizes: ["small", "medium", "large"],
    sizes2: [18, 36, 56],
    create: function (c, k, h, b, e, j) {
        var g = ce("div"),
		d = ce("ins"),
		f = ce("del");
        if (k == null) {
            k = 1
        }
        g.className = "icon" + Icon.sizes[k];
        ae_AddElement(g, d);
        ae_AddElement(g, f);
        Icon.setTexture(g, k, c);
        if (b) {
            var i = ce("a");
            i.href = b;
            ae_AddElement(g, i)
        } else {
            g.ondblclick = Icon.onDblClick
        }
        Icon.setNumQty(g, e, j);
        return g
    },
    setTexture: function (d, c, b) {
        if (!b) {
            return
        }
        var a = d.firstChild.style;
        if (b.indexOf("?") != -1) {
            a.backgroundImage = "url(" + b + ")"
        } else {
            a.backgroundImage = "url(/Assets/icons/" + b.toLowerCase() + ")"
        }
        Icon.moveTexture(d, c, 0, 0)
    },
    moveTexture: function (d, c, a, e) {
        var b = d.firstChild.style;
        if (a || e) {
            b.backgroundPosition = (-a * Icon.sizes2[c]) + "px " + (-e * Icon.sizes2[c]) + "px"
        } else {
            if (b.backgroundPosition) {
                b.backgroundPosition = ""
            }
        }
    },
    setNumQty: function (e, c, f) {
        var b = gE(e, "span");
        for (var d = 0, a = b.length; d < a; ++d) {
            if (b[d]) {
                de(b[d])
            }
        }
        if (c != null && ((c > 1 && c < 2147483647) || c.length)) {
            b = g_createGlow(c, "q1");
            b.style.right = "0";
            b.style.bottom = "0";
            b.style.position = "absolute";
            ae_AddElement(e, b)
        }
        if (f != null && f > 0) {
            b = g_createGlow("(" + f + ")", "q");
            b.style.left = "0";
            b.style.top = "0";
            b.style.position = "absolute";
            ae_AddElement(e, b)
        }
    },
    getLink: function (a) {
        return gE(a, "a")[0]
    },
    onDblClick: function () {
        if (this.firstChild) {
            var b = this.firstChild.style;
            if (b.backgroundImage.length && b.backgroundImage.indexOf("url(http://static.wowhead.com") == 0) {
                var c = b.backgroundImage.lastIndexOf("/"),
				a = b.backgroundImage.indexOf(".jpg");
                if (c != -1 && a != -1) {
                    prompt("", b.backgroundImage.substring(c + 1, a))
                }
            }
        }
    }
};
var Tooltip = {
    create: function (h) {
        var f = ce("div"),
		k = ce("table"),
		b = ce("tbody"),
		e = ce("tr"),
		c = ce("tr"),
		a = ce("td"),
		j = ce("th"),
		i = ce("th"),
		g = ce("th");
        f.className = "tooltip";
        j.style.backgroundPosition = "top right";
        i.style.backgroundPosition = "bottom left";
        g.style.backgroundPosition = "bottom right";
        if (h) {
            a.innerHTML = h
        }
        ae_AddElement(e, a);
        ae_AddElement(e, j);
        ae_AddElement(b, e);
        ae_AddElement(c, i);
        ae_AddElement(c, g);
        ae_AddElement(b, c);
        ae_AddElement(k, b);
        Tooltip.icon = ce("p");
        Tooltip.icon.style.visibility = "hidden";
        ae_AddElement(Tooltip.icon, ce("div"));
        ae_AddElement(f, Tooltip.icon);
        ae_AddElement(f, k);
        return f
    },
    fix: function (d, b, f) {
        var e = gE(d, "table")[0],
		h = gE(e, "td")[0],
		g = h.childNodes;
        if (g.length >= 2 && g[0].nodeName == "TABLE" && g[1].nodeName == "TABLE") {
            g[0].style.whiteSpace = "nowrap";
            var a;
            if (g[1].offsetWidth > 300) {
                a = Math.max(300, g[0].offsetWidth) + 20
            } else {
                a = Math.max(g[0].offsetWidth, g[1].offsetWidth) + 20
            }
            if (a > 20) {
                d.style.width = a + "px";
                g[0].style.width = g[1].style.width = "100%";
                if (!b && d.offsetHeight > document.body.clientHeight) {
                    e.className = "shrink"
                }
            }
        }
        if (f) {
            d.style.visibility = "visible"
        }
    },
    fixSafe: function (c, b, a) {
        if (Browser.ie) {
            setTimeout(Tooltip.fix.bind(this, c, b, a), 1)
        } else {
            Tooltip.fix(c, b, a)
        }
    },
    append: function (c, b) {
        var c = $_QueryElement(c);
        var a = Tooltip.create(b);
        ae_AddElement(c, a);
        Tooltip.fixSafe(a, 1, 1)
    },
    prepare: function () {
        if (Tooltip.tooltip) {
            return
        }
        var b = Tooltip.create();
        b.style.position = "absolute";
        b.style.left = b.style.top = "-2323px";
        var a = ge("layers_0945757");
        if (a == null) {
            var _body = document.getElementsByTagName('body')[0];
            var _div = document.createElement('div');
            _div.id = "layers_0945757";
            _body.appendChild(_div);
            a = ge("layers_0945757");
        }
        ae_AddElement(a, b);
        Tooltip.tooltip = b;
        Tooltip.tooltipTable = gE(b, "table")[0];
        Tooltip.tooltipTd = gE(b, "td")[0];
        if (Browser.ie6) {
            b = ce("iframe");
            b.src = "javascript:0;";
            b.frameBorder = 0;
            ae_AddElement(a, b);
            Tooltip.iframe = b
        }
    },
    set: function (b) {
        var a = Tooltip.tooltip;
        a.style.width = "550px";
        a.style.left = "-2323px";
        a.style.top = "-2323px";
        Tooltip.tooltipTd.innerHTML = b;
        a.style.display = "";
        Tooltip.fix(a, 0, 0)
    },
    moveTests: [[null, null], [null, false], [false, null], [false, false]],
    move: function (m, l, d, n, c, a) {
        if (!Tooltip.tooltipTable) {
            return
        }
        var k = Tooltip.tooltip,
		g = Tooltip.tooltipTable.offsetWidth,
		b = Tooltip.tooltipTable.offsetHeight,
		o;
        k.style.width = g + "px";
        var j, e;
        for (var f = 0, h = Tooltip.moveTests.length; f < h; ++f) {
            o = Tooltip.moveTests[f];
            j = Tooltip.moveTest(m, l, d, n, c, a, o[0], o[1]);
            if (!Ads.intersect(j)) {
                e = true;
                break
            }
        }
        k.style.left = j.l + "px";
        k.style.top = j.t + "px";
        k.style.visibility = "visible";
        if (Browser.ie6 && Tooltip.iframe) {
            var o = Tooltip.iframe;
            o.style.left = j.l + "px";
            o.style.top = j.t + "px";
            o.style.width = g + "px";
            o.style.height = b + "px";
            o.style.display = "";
            o.style.visibility = "visible"
        }
    },
    moveTest: function (e, l, n, w, c, a, m, b) {
        var k = e,
		v = l,
		f = Tooltip.tooltip,
		i = Tooltip.tooltipTable.offsetWidth,
		p = Tooltip.tooltipTable.offsetHeight,
		g = g_getWindowSize(),
		j = g_getScroll(),
		h = g.w,
		o = g.h,
		d = j.x,
		u = j.y,
		t = d,
		s = u,
		r = d + h,
		q = u + o;
        if (m == null) {
            m = (e + n + i <= r)
        }
        if (b == null) {
            b = (l - p >= s)
        }
        if (m) {
            e += n + c
        } else {
            e = Math.max(e - i, t) - c
        }
        if (b) {
            l -= p + a
        } else {
            l += w + a
        }
        if (e < t) {
            e = t
        } else {
            if (e + i > r) {
                e = r - i
            }
        }
        if (l < s) {
            l = s
        } else {
            if (l + p > q) {
                l = Math.max(u, q - p)
            }
        }
        if (Tooltip.iconVisible) {
            if (k >= e - 48 && k <= e && v >= l - 4 && v <= l + 48) {
                l -= 48 - (v - l)
            }
        }
        return g_createRect(e, l, i, p)
    },
    show: function (f, e, d, b, c) {
        if (Tooltip.disabled) {
            return
        }
        if (!d || d < 1) {
            d = 1
        }
        if (!b || b < 1) {
            b = 1
        }
        if (c) {
            e = '<span class="' + c + '">' + e + "</span>"
        }
        var a = ac(f);
        Tooltip.prepare();
        Tooltip.set(e);
        Tooltip.move(a.x, a.y, f.offsetWidth, f.offsetHeight, d, b)
    },
    showAtCursor: function (d, f, c, a, b) {
        if (Tooltip.disabled) {
            return
        }
        if (!c || c < 10) {
            c = 10
        }
        if (!a || a < 10) {
            a = 10
        }
        if (b) {
            f = '<span class="' + b + '">' + f + "</span>"
        }
        d = $E(d);
        var g = g_getCursorPos(d);
        Tooltip.prepare();
        Tooltip.set(f);
        Tooltip.move(g.x, g.y, 0, 0, c, a)
    },
    showAtXY: function (d, a, e, c, b) {
        if (Tooltip.disabled) {
            return
        }
        Tooltip.prepare();
        Tooltip.set(d);
        Tooltip.move(a, e, 0, 0, c, b)
    },
    cursorUpdate: function (b, a, d) {
        if (Tooltip.disabled || !Tooltip.tooltip) {
            return
        }
        b = $E(b);
        if (!a || a < 10) {
            a = 10
        }
        if (!d || d < 10) {
            d = 10
        }
        var c = g_getCursorPos(b);
        Tooltip.move(c.x, c.y, 0, 0, a, d)
    },
    hide: function () {
        if (Tooltip.tooltip) {
            Tooltip.tooltip.style.display = "none";
            Tooltip.tooltip.visibility = "hidden";
            Tooltip.tooltipTable.className = "";
            if (Browser.ie6) {
                Tooltip.iframe.style.display = "none"
            }
            Tooltip.setIcon(null);
        }
    },
    setIcon: function (a) {
        Tooltip.prepare();
        if (a) {
            Tooltip.icon.style.backgroundImage = "url(/Assets/icons/" + a.toLowerCase() + ".jpg)";
            Tooltip.icon.style.visibility = "visible"
        } else {
            Tooltip.icon.style.backgroundImage = "none";
            Tooltip.icon.style.visibility = "hidden"
        }
        Tooltip.iconVisible = a ? 1 : 0
    }
};
var g_dev = false;
var g_locale = {
    id: 0,
    name: "enus"
};
var g_localTime = new Date();
var g_user = {
    id: 0,
    name: "",
    roles: 0
};
var g_items = {};
var g_quests = {};
var g_spells = {};
var g_achievements = {};
var g_users = {};
var g_types = {
    1: "npc",
    2: "object",
    3: "item",
    4: "itemset",
    5: "quest",
    6: "spell",
    7: "zone",
    8: "faction",
    9: "pet",
    10: "achievement"
};
var g_locales = {
    0: "enus",
    2: "frfr",
    3: "dede",
    6: "eses",
    8: "ruru",
    25: "ptr"
};
var g_file_races = {
    10: "bloodelf",
    11: "draenei",
    3: "dwarf",
    7: "gnome",
    1: "human",
    4: "nightelf",
    2: "orc",
    6: "tauren",
    8: "troll",
    5: "scourge"
};
var g_file_classes = {
    6: "deathknight",
    11: "druid",
    3: "hunter",
    8: "mage",
    2: "paladin",
    5: "priest",
    4: "rogue",
    7: "shaman",
    9: "warlock",
    1: "warrior",
    31: "druid",
    23: "hunter",
    28: "mage",
    22: "paladin",
    25: "priest",
    24: "rogue",
    27: "shaman",
    29: "warlock",
    21: "warrior"
};
var g_file_genders = {
    0: "male",
    1: "female"
};
var g_file_factions = {
    1: "alliance",
    2: "horde"
};
var g_file_gems = {
    1: "meta",
    2: "red",
    4: "yellow",
    6: "orange",
    8: "blue",
    10: "purple",
    12: "green",
    14: "prismatic"
};
var g_customColors = {
    Miyari: "pink"
};
g_items.add = function (b, a) {
    if (g_items[b] != null) {
        cO(g_items[b], a)
    } else {
        g_items[b] = a
    }
};
g_items.getIcon = function (a) {
    if (g_items[a] != null) {
        return g_items[a].icon
    } else {
        return "inv_misc_questionmark"
    }
};
g_items.createIcon = function (d, b, a, c) {
    return Icon.create(g_items.getIcon(d) + ".jpg", b, null, "?item=" + d, a, c)
};
g_spells.getIcon = function (a) {
    if (g_spells[a] != null) {
        return g_spells[a].icon
    } else {
        return "inv_misc_questionmark"
    }
};
g_spells.createIcon = function (d, b, a, c) {
    return Icon.create(g_spells.getIcon(d) + ".jpg", b, null, "?spell=" + d, a, c)
};
g_achievements.getIcon = function (a) {
    if (g_achievements[a] != null) {
        return g_achievements[a].icon
    } else {
        return "inv_misc_questionmark"
    }
};
g_achievements.createIcon = function (d, b, a, c) {
    return Icon.create(g_achievements.getIcon(d) + ".jpg", b, null, "?achievement=" + d, a, c)
};
var $WowheadPower = new
function () {
    var e, D, H, q, J, B, z, g = 0,
	C = {},
	f = {},
	c = {},
	G = 0,
	E = 1,
	h = 2,
	r = 3,
	F = 4,
	s = 1,
	j = 2,
	v = 3,
	y = 5,
	t = 6,
	m = 10,
	i = 100,
	o = 15,
	x = 15,
	p = {
	    1: [C, "npc"],
	    2: [f, "object"],
	    3: [g_items, "item"],
	    5: [g_quests, "quest"],
	    6: [g_spells, "spell"],
	    10: [g_achievements, "achievement"],
	    100: [c, "profile"]
	};
    function K() {
        aE(document, "mouseover", u)
    }
    function n(O) {
        var P = g_getCursorPos(O);
        B = P.x;
        z = P.y
    }
    function M(aa, W) {
        if (aa.nodeName != "A" && aa.nodeName != "AREA") {
            return -2323
        }
        if (!aa.href.length) {
            return
        }
        if (aa.rel.indexOf("np") != -1) {
            return
        }
        var T, S, Q, P, U = {};
        q = U;
        var O = function (ab, af, ad) {
            if (af == "buff" || af == "sock") {
                U[af] = true
            } else {
                if (af == "rand" || af == "uniq" || af == "ench" || af == "lvl" || af == "c") {
                    U[af] = parseInt(ad)
                } else {
                    if (af == "gems" || af == "pcs") {
                        U[af] = ad.split(":")
                    } else {
                        if (af == "who" || af == "domain") {
                            U[af] = ad
                        } else {
                            if (af == "when") {
                                U[af] = new Date(parseInt(ad))
                            }
                        }
                    }
                }
            }
        };
        S = 2;
        Q = 3;

        /*if (aa.href.indexOf("http://") == 0) {
			T = 1;
			P = aa.href.match(/http:\/\/(.+?)?\.?landoflegends\.de\/\?(item|quest|spell|achievement|npc|object|profile)=([^&#]+)/)*/
        //} else {
        P = aa.href.match(/()\?(version|item|quest|spell|achievement|npc|object|profile)=([^&#]+)/)
        //}

        // P =
        // aa.href.match(/()\?(item|quest|spell|achievement|npc|object|profile)=([^&#]+)/)
        if (P == null && aa.rel) {
            T = 0;
            S = 1;
            Q = 2;
            P = aa.rel.match(/(version|item|quest|spell|achievement|npc|object|profile).?([^&#]+)/)
        }
        if (aa.rel) {
            aa.rel.replace(/([a-zA-Z]+)=?([a-zA-Z0-9:-]*)/g, O);
            if (U.gems && U.gems.length > 0) {
                var V;
                for (V = Math.min(3, U.gems.length - 1) ; V >= 0; --V) {
                    if (parseInt(U.gems[V])) {
                        break
                    }
                } ++V;
                if (V == 0) {
                    delete U.gems
                } else {
                    if (V < U.gems.length) {
                        U.gems = U.gems.slice(0, V)
                    }
                }
            }
        }
        if (P) {
            var Z, R = "www";
            J = aa;
            if (U.domain) {
                R = U.domain
            } else {
                if (T && P[T]) {
                    R = P[T]
                }
            }
            Z = g_locale.id;// g_getLocaleFromDomain(R);
            if (aa.href.indexOf("#") != -1 && document.location.href.indexOf(P[S] + "=" + P[Q]) != -1) {
                return
            }
            g = (aa.parentNode.className.indexOf("icon") == 0 ? 1 : 0);
            if (!aa.onmouseout) {
                if (g == 0) {
                    aa.onmousemove = a
                }
                aa.onmouseout = L
            }
            n(W);
            var Y = g_getIdFromTypeName(P[S]),
			X = P[Q];
            if (Y == i && !g_dev) {
                Z = 0
            }
            w(Y, X, Z, U)
        }
    }
    function u(Q) {
        Q = $E(Q);
        var P = Q._target;
        var O = 0;
        while (P != null && O < 3 && M(P, Q) == -2323) {
            P = P.parentNode; ++O
        }
    }
    function a(O) {
        O = $E(O);
        n(O);
        Tooltip.move(B, z, 0, 0, o, x)
    }
    function L() {
        e = null;
        J = null;
        Tooltip.hide()
    }
    function I(O) {
        return (q.buff ? "buff_" : "tooltip_") + g_locales[O]
    }
    function k(P, R, Q) {//P == 3, R == ItemID, Q == 0?
        var O = p[P][0];
        if (O[R] == null) {
            O[R] = {}
        }
        if (O[R].status == null) {
            O[R].status = {}
        }
        if (O[R].status[Q] == null) {
            O[R].status[Q] = G
        }
    }
    function w(P, T, R, S) {
        if (!S) {
            S = {}
        }
        var Q = d(T, S);
        e = P;
        D = Q;
        H = R;
        q = S;
        k(P, Q, R);
        var O = p[P][0];
        if (O[Q].status[R] == F || O[Q].status[R] == r) {
            N(O[Q][I(R)], O[Q].icon)
        } else {
            if (O[Q].status[R] == E) {
                N(LANG.tooltip_loading)
            } else {
                b(P, T, R, null, S)
            }
        }
    }
    function b(W, S, X, Q, T) {
        var O = d(S, T);
        var V = p[W][0];
        if (V[O].status[X] != G && V[O].status[X] != h) {
            return
        }
        V[O].status[X] = E;
        if (!Q) {
            V[O].timer = setTimeout(function () {
                l.apply(this, [W, O, X])
            },
			333)
        }
        var R = "";
        for (var U in T) {
            if (U != "rand" && U != "uniq" && U != "ench" && U != "gems" && U != "sock" && U != "pcs") {
                continue
            }
            if (typeof T[U] == "object") {
                R += "&" + U + "=" + T[U].join(":")
            } else {
                if (U == "sock") {
                    R += "&sock"
                } else {
                    R += "&" + U + "=" + T[U]
                }
            }
        }
        /*
		 * var P = ""; if (!g_dev) { if (e == i) { P +=
		 * "http://profiler.wowhead.com" } else { P += "http://" +
		 * g_getDomainFromLocale(X) + ".wowhead.com" } } P += "?" + p[W][1] +
		 * "=" + S + "&power" + R;
		 */
        var P = "" + p[W][1] + "=" + S + "&power" + R;
        g_ajaxIshRequest(P)
    }
    function N(R, S) {
        if (J._fixTooltip) {
            R = J._fixTooltip(R, e, D, J)
        }
        if (!R) {
            R = LANG["tooltip_" + g_types[e] + "notfound"];
            S = "inv_misc_questionmark"
        } else {
            if (q != null) {
                if (q.pcs && q.pcs.length) {
                    var T = 0;
                    for (var Q = 0, P = q.pcs.length; Q < P; ++Q) {
                        var O;
                        if (O = R.match(new RegExp("<span><!--si([0-9]+:)*" + q.pcs[Q] + "(:[0-9]+)*-->"))) {
                            R = R.replace(O[0], '<span class="q8"><!--si' + q.pcs[Q] + "-->"); ++T
                        }
                    }
                    if (T > 0) {
                        R = R.replace("(0/", "(" + T + "/");
                        R = R.replace(new RegExp("<span>\\(([0-" + T + "])\\)", "g"), '<span class="q2">($1)')
                    }
                }
                if (q.c) {
                    R = R.replace(/<span class="c([0-9]+?)">(.+?)<\/span><br \/>/g, '<span class="c$1" style="display: none">$2</span>');
                    R = R.replace(new RegExp('<span class="c(' + q.c + ')" style="display: none">(.+?)</span>', "g"), '<span class="c$1">$2</span><br />')
                }
                if (q.lvl) {
                    R = R.replace(/\(<!--r([0-9]+):([0-9]+):([0-9]+)-->([0-9.%]+)(.+?)([0-9]+)\)/g, function (X, Z, Y, W, U, ab, V) {
                        var aa = g_convertRatingToPercent(q.lvl, Y, W);
                        aa = (Math.round(aa * 100) / 100);
                        if (Y != 12 && Y != 37) {
                            aa += "%"
                        }
                        return "(<!--r" + q.lvl + ":" + Y + ":" + W + "-->" + aa + ab + q.lvl + ")"
                    })
                }
                if (q.who && q.when) {
                    R = R.replace("<table><tr><td><br />", '<table><tr><td><br /><span class="q2">' + sprintf(LANG.tooltip_achievementcomplete, q.who, q.when.getMonth() + 1, q.when.getDate(), q.when.getFullYear()) + "</span><br /><br />");
                    R = R.replace(/class="q0"/g, 'class="r3"')
                }
            }
        }
        if (g == 1) {
            Tooltip.setIcon(null);
            Tooltip.show(J, R)
        } else {
            Tooltip.setIcon(S);
            Tooltip.showAtXY(R, B, z, o, x)
        }
    }
    function l(P, R, Q) {//Normalt sett buggad funktion
        var O = p[P][0];
        O[R].timer = setTimeout(function () {
            A.apply(this, [P, R, Q])
        },
        3850)
        if (e == P && D == R && H == Q) {//om detta objektet �r det som f�rs�ker visas i tooltip just nu
            N(LANG.tooltip_loading);
        }
    }
    function A(P, R, Q) {
        var O = p[P][0];
        O[R].status[Q] = h;
        if (e == P && D == R && H == Q) {//om detta objektet �r det som f�rs�ker visas i tooltip just nu
            N(LANG.tooltip_noresponse)
        }
    }
    function d(P, O) {//returns [ITEMID]r[SUFFIX]e[ENCHANT] example: 1952r2839e2747
        return P + (O.rand ? "r" + O.rand : "") + (O.uniq ? "u" + O.uniq : "") + (O.ench ? "e" + O.ench : "") + (O.gems ? "g" + O.gems.join(",") : "") + (O.sock ? "s" : "")
    }
    this.register = function (Q, S, R, P) { //Q == 3 (global v(item=3, npc, etc etc)), S == itemID, R == 0?, P == tooltip stuffs json
        var O = p[Q][0];
        k(Q, S, R);//s�kerst�ll att g_items objectet existerar, annars skapa
        if (O[S].timer) {
            clearTimeout(O[S].timer);
            O[S].timer = null
        }
        cO(O[S], P);//kopiera in den nya datan
        if (O[S].status[R] == E) {
            if (O[S][I(R)]) {
                O[S].status[R] = F
            } else {
                O[S].status[R] = r
            }
        }
        if (e == Q && S == D && H == R) {//om detta objektet �r det som f�rs�ker visas i tooltip just nu
            N(O[S][I(R)], O[S].icon)
        }
    };
    this.registerNpc = function (Q, P, O) {
        this.register(s, Q, P, O)
    };
    this.registerObject = function (Q, P, O) {
        this.register(j, Q, P, O)
    };
    this.registerItem = function (Q, P, O) {
        this.register(v, Q, P, O)
    };
    this.registerQuest = function (Q, P, O) {
        this.register(y, Q, P, O)
    };
    this.registerSpell = function (Q, P, O) {
        this.register(t, Q, P, O)
    };
    this.registerAchievement = function (Q, P, O) {
        this.register(m, Q, P, O)
    };
    this.registerProfile = function (Q, P, O) {
        this.register(i, Q, P, O)
    };
    this.request = function (O, S, Q, R) {
        if (!R) {
            R = {}
        }
        var P = d(S, R);
        k(O, P, Q);
        b(O, S, Q, 1, R)
    };
    this.requestItem = function (P, O) {
        this.request(v, P, g_locale.id, O)
    };
    this.requestSpell = function (O) {
        this.request(t, O, g_locale.id)
    };
    this.getStatus = function (P, R, Q) {
        var O = p[P][0];
        if (O[R] != null) {
            return O[R].status[Q]
        } else {
            return G
        }
    };
    this.getItemStatus = function (P, O) {
        this.getStatus(v, P, O)
    };
    this.getSpellStatus = function (P, O) {
        this.getStatus(t, P, O)
    };
    K()

    var g_locale = { id: 0, name: 'enus' };
};
var Ads = {
    dimensions: {
        leaderboard: [728, 90],
        skyscraper: [160, 600],
        medrect: [300, 250]
    },
    spots: {
        leaderboard: ["header-ad"],
        skyscraper: ["sidebar-ad"],
        medrect: ["infobox-ad", "blog-sidebar-medrect", "talentcalc-sidebar-ad", "pl-rightbar-ad", "contribute-ad", "profiler-inventory-medrect", "profiler-reputation-medrect", "profiler-achievements-medrect"]
    },
    hidden: [],
    hide: function (b) {
        var a = gE(b, "iframe")[0];
        if (a) {
            a.style.display = "none";
            Ads.hidden.push(b)
        }
    },
    isHidden: function (b) {
        var a = gE(b, "iframe")[0];
        if (a) {
            return a.style.display == "none"
        }
        return false
    },
    intersect: function (g, e) {
        var b;
        for (var h in Ads.dimensions) {
            var d = Ads.spots[h];
            for (var c = 0, a = d.length; c < a; ++c) {
                var f = ge(d[c]);
                if (f) {
                    if (!Ads.isHidden(f)) {
                        coords = ac(f);
                        b = g_createRect(coords.x, coords.y, f.offsetWidth, f.offsetHeight);
                        if (g_intersectRect(g, b)) {
                            if (e) {
                                Ads.hide(f)
                            }
                            return true
                        }
                    }
                }
            }
        }
        return false
    }
};


function getXMLHttpRequest() {
    if (window.ActiveXObject) {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e1) {
                return null;
            }
        }
    } else if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        return null;
    }
}

function sendRequest(url, params, callback, method) {
    var httpRequest = getXMLHttpRequest();
    var httpMethod = method ? method : 'GET';
    if (httpMethod != 'GET' && httpMethod != 'POST') {
        httpMethod = 'GET';
    }
    var httpParams = (params == null || params == '') ? null : params;
    var httpUrl = url;
    if (httpMethod == 'GET' && httpParams != null) {
        httpUrl = httpUrl + "?" + httpParams;
    }
    httpRequest.open(httpMethod, httpUrl, true);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.onreadystatechange = function () { callback(httpRequest); };
    httpRequest.send(httpMethod == 'POST' ? httpParams : null);
}

function VF_AjaxControl_Request(_Value) {
    sendRequest("/Ajax.aspx", _Value, function (httpRequest) { if (httpRequest.readyState == 4 && httpRequest.status == 200) VF_AjaxControl_Response(httpRequest.responseText); }, 'GET');
}
function VF_AjaxControl_Response(returnValue) {
    if (returnValue != "")
        eval(returnValue);
}

var Lightbox = new
function () {
    var d, m, n, h = {},
    c = {},
    i, f;
    function o() {
        aE(d, "click", e);
        aE(document, Browser.opera ? "keypress" : "keydown", g);
        aE(window, "resize", a);
        if (Browser.ie6) {
            aE(window, "scroll", j)
        }
    }
    function l() {
        dE(d, "click", e);
        dE(document, Browser.opera ? "keypress" : "keydown", g);
        dE(window, "resize", a);
        if (Browser.ie6) {
            dE(window, "scroll", j)
        }
    }
    function b() {
        if (i) {
            return
        }
        i = 1;
        var p = ge("layers");
        d = ce("div");
        d.className = "lightbox-overlay";
        m = ce("div");
        m.className = "lightbox-outer";
        n = ce("div");
        n.className = "lightbox-inner";
        d.style.display = m.style.display = "none";
        ae_AddElement(p, d);
        ae_AddElement(m, n);
        ae_AddElement(p, m)
    }
    function g(p) {
        p = $E(p);
        switch (p.keyCode) {
            case 27:
                e();
                break
        }
    }
    function a(p) {
        if (p != 1234) {
            if (c.onResize) {
                c.onResize()
            }
        }
        d.style.height = document.body.offsetHeight + "px";
        if (Browser.ie6) {
            j()
        }
    }
    function j() {
        var q = g_getScroll().y,
        p = g_getWindowSize().h;
        m.style.top = (q + p / 2) + "px"
    }
    function e() {
        l();
        if (c.onHide) {
            c.onHide()
        }
        d.style.display = m.style.display = "none";
        Ads.restoreHidden();
        g_enableScroll(true)
    }
    function k() {
        d.style.display = m.style.display = h[f].style.display = ""
    }
    this.setSize = function (p, q) {
        n.style.visibility = "hidden";
        n.style.width = p + "px";
        n.style.height = q + "px";
        n.style.left = -parseInt(p / 2) + "px";
        n.style.top = -parseInt(q / 2) + "px";
        n.style.visibility = "visible"
    };
    this.show = function (t, s, p) {
        c = s || {};
        Ads.hideAll();
        b();
        o();
        if (f != t && h[f] != null) {
            h[f].style.display = "none"
        }
        f = t;
        var r = 0,
        q;
        if (h[t] == null) {
            r = 1;
            q = ce("div");
            ae_AddElement(n, q);
            h[t] = q
        } else {
            q = h[t]
        }
        if (c.onShow) {
            c.onShow(q, r, p)
        }
        a(1234);
        k();
        g_enableScroll(false)
    };
    this.reveal = function () {
        k()
    };
    this.hide = function () {
        e()
    };
    this.isVisible = function () {
        return (d && d.style.display != "none")
    }
};
function g_initPath(p, f) {
    var h = mn_path,
    c = null,
    k = null,
    o = 0;
    if (g_initPath.lastIt) {
        g_initPath.lastIt.checked = null
    }
    if (f != null) {
        var m = ce("div");
        m.className = "path-right";
        var q = ce("a");
        q.href = "javascript:;";
        q.id = "fi_toggle";
        ns(q);
        q.onclick = fi_toggle;
        if (f) {
            q.className = "disclosure-on";
            ae_AddElement(q, ct(LANG.fihide))
        } else {
            q.className = "disclosure-off";
            ae_AddElement(q, ct(LANG.fishow))
        }
        ae_AddElement(m, q);
        ae_AddElement(l, m)
    }
    if (o && k) {
        k.className = ""
    } else {
        if (c && c[3]) {
            k.className = "menuarrow";
            q = ce("a");
            b = ce("span");
            q.href = "javascript:;";
            ns(q);
            q.style.textDecoration = "none";
            q.style.paddingRight = "16px";
            q.style.color = "white";
            q.style.cursor = "default";
            ae_AddElement(q, ct("..."));
            q.menu = c[3];
            q.onmouseover = Menu.show;
            q.onmouseout = Menu.hide;
            ae_AddElement(b, q);
            ae_AddElement(n, b)
        }
    }
    g_initPath.lastIt = c
}

cO(LANG, {
    tc_rank: "Rank $1/$2",
    tc_tier: "Requires $1 points in $2 Talents",
    tc_prereq: "Requires $1 point in $2",
    tc_prereqpl: "Requires $1 points in $2",
    tc_learn: "Click to learn, hold shift to learn all",
    tc_unlearn: "Right-click to unlearn, hold shift to unlearn all",
    tc_unlearn2: "Ctrl-click to unlearn",
    tc_nextrank: "Next rank:",
    tc_inccap: "Click to increase to 80",
    tc_deccap: "Click to decrease to 70",
    tc_addbon: "Click to add 4 bonus points from<br />the Beast Mastery talent",
    tc_rembon: "Click to remove the bonus<br />points from Beast Mastery",
    tc_point: "point",
    tc_points: "points",
    tc_none: "None",
    tc_printh: "Level $1 $2",
    tc_link: "Link to this build",
    tc_resetall: "Reset",
    tc_lock: "Lock",
    tc_unlock: "Unlock",
    tc_reset: "reset",
    tc_ptsleft: "Points left: ",
    tc_ptsspent: "Points spent: ",
    tc_reqlevel: "Required level: ",
    tc_levelcap: "Level cap: ",
    tc_bonuspts: "Bonus points: ",
    tc_help: "Help",
    tc_import: "Import",
    tc_summary: "Summary",
    tc_restore: "Restore",
    tc_export: "Export",
    tc_glyphs: "Glyphs",
    tc_empty: "Empty",
    tc_majgly: "Major Glyph",
    tc_mingly: "Minor Glyph",
    tc_addgly: "Click to inscribe your spellbook",
    tc_remgly: "Right-click to remove",
    tc_remgly2: "Shift-click to remove",
    tc_nonegly: "None",
    alert_invalidurl: "Invalid URL.",
    alert_chooseclass: "Please choose a class first.",
    alert_choosefamily: "Please choose a pet family first.",
    alert_buildempty: "Your build is empty.",
    prompt_importwh: "Please paste the URL of a build made with Wowhead's talent calculator:",
    prompt_importblizz: "Please paste the URL of a build made with Blizzard's talent calculator:",
    prompt_importbuild: "Please paste the URL of a build made with wowprovider talent calculator:"
});

/*
 talentcalc.js version 278
 Differences from origin:
  1. /?		->		?		(8)
  2. http://static.wowhead.com/images/talent/	-> images/talent/
*/
var $WowheadTalentCalculator;
function TalentCalc() {
    var a6 = 0,
	aI_PetMode = 1,
	C_Version = 85,
	aZ = this,
	t, M_ClassData = {},
	a0 = {},
	g, aC, N, a7, aF_CurrentClass = -1,
	ad = -1,
	K = 0,
	aa, a2 = (Browser.opera),
	J_TalentsLocked = false,
    g_TalentsCanBeLocked = false,
	aB_CurrMode,
	w,
	a1_TalentRows,
	Z,
	aj,
	ag,
	aT_MaxTalentPoints,
	r = 0,
	R,
	aY,
	aK,
	z,
	ao,
	j,
	aM,
	v_LockButtonDiv,
	aD,
	d,
	at,
	e,
	p = {},
	D = {},
	y,
	a4,
	V,
	aR,
	aH,
	I,
	l_MainDiv,
	ay,
	aS = [],
	ah_EncodingArray = "0zMcmVokRsaqbdrfwihuGINALpTjnyxtgevElBCDFHJKOPQSUWXYZ123456789",
	L = "Z",
	W = [7, 24, 26, 27, 30, 34, 37, 38],
	aq,
	aG,
	A = {};
    this.addGlyph = function (bc) {
        if (bc) {
            au(aa, bc)
        } else {
            X(aa)
        }
        Lightbox.hide()
    };
    this.getBlizzBuild = function () {
        if (aF_CurrentClass == -1) {
            return
        }
        var bf = M_ClassData[aF_CurrentClass],
		be = "";
        for (var bc = 0; bc < w; ++bc) {
            for (var bd = 0; bd < bf[bc].t.length; ++bd) {
                be += bf[bc].t[bd].k
            }
        }
        be = rtrim(be, "0");
        return be
    };
    this.getBlizzGlyphs = function () {
        if (aF_CurrentClass == -1) {
            return
        }
        var be = M_ClassData[aF_CurrentClass],
		bc = "";
        for (var bd = 0; bd < Z; ++bd) {
            if (bd > 0) {
                bc += ":"
            }
            if (be.glyphs[bd]) {
                bc += be.glyphs[bd]
            } else {
                bc += "0"
            }
        }
        return bc
    };
    this.getGlyphs = function () {
        var bc = [];
        if (aF_CurrentClass != -1) {
            var be = M_ClassData[aF_CurrentClass];
            if (be) {
                for (var bd = 0; bd < Z; ++bd) {
                    if (be.glyphs[bd]) {
                        bc.push(g_glyphs[be.glyphs[bd]])
                    }
                }
            }
        }
        return bc
    };
    this.getSpentFromBlizzBuild = function (bj, bh) {
        var bi = M_ClassData[bh],
		bg = [0, 0, 0];
        if (bi) {
            var bk = 0,
			bc = 0;
            for (var bf = 0; bf < bj.length; ++bf) {
                var bd = Math.min(parseInt(bj.charAt(bf)), bi[bk].t[bc].m);
                if (isNaN(bd)) {
                    continue
                }
                for (var be = 0; be < bd; ++be) {
                    ++bg[bk]
                }
                if (++bc > bi[bk].t.length - 1) {
                    bc = 0;
                    if (++bk > w - 1) {
                        break
                    }
                }
            }
        }
        return bg
    };
    this.getTalents = function () {
        var bd = [];
        if (aF_CurrentClass != -1) {
            var be = M_ClassData[aF_CurrentClass];
            if (be) {
                for (var bc = 0; bc < w; ++bc) {
                    for (i = 0; i < be[bc].t.length; ++i) {
                        if (be[bc].t[i].k) {
                            bd.push(be[bc].t[i])
                        }
                    }
                }
            }
        }
        return bd
    };
    this.getWhBuild = function () {
        if (aF_CurrentClass == -1) {
            return
        }
        var bh_CurrClassData = M_ClassData[aF_CurrentClass],
		bd = "",
		bg,
        bf;
        for (var bc = 0; bc < w; ++bc) {
            bg = "";
            for (bf = 0; bf < bh_CurrClassData[bc].t.length; ++bf) {
                bg += bh_CurrClassData[bc].t[bf].k
            }
            bg = rtrim(bg, "0");
            bd += x(bg);
            bf = bg.length;
            if (bf % 2 == 1) {
                ++bf
            }
            if (bf < bh_CurrClassData[bc].t.length) {
                bd += L
            }
        }
        var be;
        if (aB_CurrMode == aI_PetMode) {
            be = ah_EncodingArray.charAt(Math.floor(aF_CurrentClass / 10)) + ah_EncodingArray.charAt((2 * (aF_CurrentClass % 10)) + (r ? 1 : 0))
        } else {
            be = ah_EncodingArray.charAt(aw_ConvertClassID(aF_CurrentClass) * 3)
        }
        be += rtrim(bd, L);
        return be
    };
    this.getWhGlyphs = function () {
        if (aF_CurrentClass == -1) {
            return
        }
        var bf = M_ClassData[aF_CurrentClass],
		bc = {
		    1: "",
		    2: ""
		};
        for (var be = 0; be < Z; ++be) {
            if (bf.glyphs[be]) {
                bc[aJ(be)] += ah_EncodingArray.charAt(g_glyphs[bf.glyphs[be]].index)
            }
        }
        var bd = bc[1];
        if (bd.length < 3) {
            bd += L
        }
        bd += bc[2];
        bd = rtrim(bd, L);
        return bd
    };
    this.installAd = function () {
        if (t.noAd) {
            az()
        }
        if (!t.adFilled) {
            Ads.fillSpot("medrect", ge("talentcalc-sidebar-ad"))
        }
        t.adFilled = 1
    };
    this.initialize = function (bd, bc) {
        if (z) {
            return
        }
        bd = $_QueryElement(bd);
        if (!bd) {
            return
        }
        z = bd;
        z.className = "talentcalc";
        if (bc == null) {
            bc = {}
        }
        t = bc;
        if (t.onChange) {
            aG = t.onChange
        }
        if (t.mode == aI_PetMode) {
            aB_CurrMode = aI_PetMode;
            w = 1;
            a1_TalentRows = 6;
            Z = 0;
            ag = 3;
            aT_MaxTalentPoints = 16;
            aY = g_pet_families;
            z.className += " talentcalc-pet"
        } else {
            aB_CurrMode = a6;
            w = 3;
            a1_TalentRows = 9;
            Z = 6;
            aj = {
                1: [0, 1, 2],
                2: [3, 4, 5]
            };
            ag = 5;
            aT_MaxTalentPoints = 51;
            aY = g_chr_classes;
            z.className += " talentcalc-default";
            $WowheadTalentCalculator = aZ;
            o()
        }
        R = aT_MaxTalentPoints + r;
        k_InitializeTalentSideBarMenuDiv();
        a9_CreateTalentHeaderDiv();
        ac_InitializeTalentSpecDiv();
        ap_InitializeTalentMainDiv();
        if (t.whBuild) {
            aN_setWhBuild(t.whBuild)
        } else {
            if (t.classId > 0 && aY[t.classId]) {
                if (t.blizzBuild) {
                    Q(t.classId, t.blizzBuild)
                } else {
                    q(t.classId)
                }
            }
        }
        if (t.whGlyphs) {
            G_setWhGlyphs(t.whGlyphs)
        } else {
            if (t.blizzGlyphs) {
                a8(t.blizzGlyphs)
            }
        }
    };
    this.promptImportBuild = function () {
        if (aB_CurrMode == aI_PetMode) {
            return
        }
        var be, bc = prompt(LANG.prompt_importbuild, "");
        if (!bc) {
            return
        }
        if (bc.match("([]*)wowprovider.com/([O-Za-z0-9.]*).?talent=([0-9a-z_]+)")) {
            var talentData = RegExp.$3;

            //http: //www.wowprovider.com/Old.aspx?talent=11215875_5_85042c1305001002320500323d55r

            if (talentData.match("11215875_([0-9]+)_([0-9a-z]+)")) {
                //Vanilla
                var classNumber = RegExp.$1;
                var specc = RegExp.$2;

                //console.debug("class=" + classNumber + ", specc = " + specc);

                if (specc.charAt(0) != "8") {
                    alert("wowprovider link was possibly broken!");
                    return;
                }

                specc = specc.substr(1, specc.length - 1);
                specc = specc.replace("z", "0000000000000000000000000");
                specc = specc.replace("y", "000000000000000000000000");
                specc = specc.replace("x", "00000000000000000000000");
                specc = specc.replace("w", "0000000000000000000000");
                specc = specc.replace("v", "000000000000000000000");
                specc = specc.replace("u", "00000000000000000000");
                specc = specc.replace("t", "0000000000000000000");
                specc = specc.replace("s", "000000000000000000");
                specc = specc.replace("r", "00000000000000000");
                specc = specc.replace("q", "0000000000000000");
                specc = specc.replace("p", "000000000000000");
                specc = specc.replace("o", "00000000000000");
                specc = specc.replace("n", "0000000000000");
                specc = specc.replace("m", "000000000000");
                specc = specc.replace("l", "00000000000");
                specc = specc.replace("k", "0000000000");
                specc = specc.replace("j", "000000000");
                specc = specc.replace("i", "00000000");
                specc = specc.replace("h", "0000000");
                specc = specc.replace("g", "000000");
                specc = specc.replace("f", "00000");
                specc = specc.replace("e", "0000");
                specc = specc.replace("d", "000");
                specc = specc.replace("c", "00");

                //console.debug("talents = " + specc);
                Q(classNumber, specc);
                return;
            }
            else {
                //Unknown, TBC?
                alert("Did not recognize wowprovider link, do note only vanilla version 11215875 is supported!");
                return;
            }
        }
        else if (bc.match(/\?cid=([0-9]+)&tal=([0-9]+)/)) {
            be = parseInt(RegExp.$1);
            Q(be, RegExp.$2);
            return
        } else {
            var bf = bc.indexOf("?tal=");
            if (bf != -1) {
                for (var bd in g_file_classes) {
                    if (bc.indexOf(g_file_classes[bd]) != -1) {
                        be = parseInt(bd);
                        break
                    }
                }
                if (be) {
                    Q(be, bc.substring(bf + 5));
                    return
                }
            }
        }
        alert(LANG.alert_invalidurl)
    }
    this.promptBlizzBuild = function () {
        if (aB_CurrMode == aI_PetMode) {
            return
        }
        var be, bc = prompt(LANG.prompt_importblizz, "");
        if (!bc) {
            return
        }
        if (bc.match(/\?cid=([0-9]+)&tal=([0-9]+)/)) {
            be = parseInt(RegExp.$1);
            Q(be, RegExp.$2);
            return
        } else {
            var bf = bc.indexOf("?tal=");
            if (bf != -1) {
                for (var bd in g_file_classes) {
                    if (bc.indexOf(g_file_classes[bd]) != -1) {
                        be = parseInt(bd);
                        break
                    }
                }
                if (be) {
                    Q(be, bc.substring(bf + 5));
                    return
                }
            }
        }
        alert(LANG.alert_invalidurl)
    };
    this.promptWhBuild = function () {
        var bd;
        var be, bc = prompt(LANG.prompt_importwh, "");
        if (!bc) {
            return
        }
        var bf = bc.indexOf("=");
        if (bf != -1) {
            be = bc.substr(bf + 1);
            bd = aN_setWhBuild(be)
        }
        if (!bd) {
            alert(LANG.alert_invalidurl);
            return
        }
    };
    this.registerClass = function (bd, bc) {
        T(bd, bc)
    };
    this.reset = function (bc) {
        if (aF_CurrentClass == -1) {
            return
        }
        if (bc > w - 1) {
            return
        }
        J_TalentsLocked = false;
        aV(bc, aF_CurrentClass, true)
    };
    this.resetAll = function () {
        if (!M_ClassData[aF_CurrentClass]) {
            return
        }
        J_TalentsLocked = false;
        am(aF_CurrentClass);
        S()
    };
    this.resetBuild = function () {
        if (!M_ClassData[aF_CurrentClass]) {
            return
        }
        J_TalentsLocked = false;
        a5(aF_CurrentClass);
        c(aF_CurrentClass);
        S()
    };
    this.resetGlyphs = function () {
        aL();
        S()
    };
    this.restore = function () {
        af()
    };
    this.setBlizzBuild = function (bc, bd) {
        if (parseInt(bc) > 20) //TBC
        {
            $WowheadTalentCalculator.setLevelCap(70);
        }
        else {
            $WowheadTalentCalculator.setLevelCap(60);
        }
        Q(bc, bd)
    };
    this.setBlizzGlyphs = function (bc) {
        if (aF_CurrentClass == -1) {
            return
        }
        a8(bc)
    };
    this.setBonusPoints = function (bc) {
        if (aB_CurrMode != aI_PetMode) {
            return
        }
        ab(bc)
    };
    this.setClass = function (bc) {
        return q(bc)
    };
    this.setLevelCap = function (bd) {
        bd = parseInt(bd);
        if (isNaN(bd) || bd < 1 || bd > 70) {
            return
        }
        var bc;
        if (aB_CurrMode == aI_PetMode) {
            bc = Math.max(0, Math.floor((bd - 16) / 4))
        } else {
            bc = Math.max(0, bd - 9)
        }
        m(bc, -1)
    };
    this.setLock = function (bc) {
        if (aF_CurrentClass == -1) {
            return
        }
        ai(bc)
    };
    this.setWhBuild = function (bc) {
        return aN_setWhBuild(bc)
    };
    this.setWhGlyphs = function (bc) {
        if (aF_CurrentClass == -1) {
            return
        }
        G_setWhGlyphs(bc)
    };
    this.showSummary = function (bh) {
        if (aF_CurrentClass == -1) {
            return
        }
        var bi = M_ClassData[aF_CurrentClass],
		bg = window.open("", "", "toolbar=no,menubar=yes,status=yes,scrollbars=yes,resizable=yes"),
		be,
		bd,
		bc,
		bf = "<html><head><title>" + document.title + '</title></head><body style="font-family: Arial, sans-serif; font-size: 13px">';
        bg.document.open();
        if (bh) {
            bf += "<h2>";
            if (aB_CurrMode == aI_PetMode) {
                bf += sprintf(LANG.tc_printh, aQ(), g_pet_families[bi.n])
            } else {
                bf += sprintf(LANG.tc_printh, aQ(), g_chr_classes[bi.n]) + " (" + bi[0].k + "/" + bi[1].k + "/" + bi[2].k + ")"
            }
            bf += "</h2>";
            bf += "<p></p>";
            for (be = 0; be < w; ++be) {
                bf += "<h3>" + bi[be].n + " (" + bi[be].k + " " + LANG[bi[be].k == 1 ? "tc_point" : "tc_points"] + ")</h3>";
                bf += "<blockquote>";
                bc = 0;
                for (bd = 0; bd < bi[be].t.length; ++bd) {
                    if (bi[be].t[bd].k) {
                        if (bc) {
                            bf += "<br /><br />"
                        }
                        bf += "<b>" + bi[be].t[bd].n + "</b>" + LANG.hyphen + sprintf(LANG.tc_rank, bi[be].t[bd].k, bi[be].t[bd].m) + "<br />";
                        bf += ar(bi[be].t[bd]); ++bc
                    }
                }
                if (bc == 0) {
                    bf += LANG.tc_none
                }
                bf += "</blockquote>"
            }
            bf += "<h3>" + LANG.tc_glyphs + "</h3>";
            bf += "<blockquote>";
            glyphCount = 0;
            for (be = 0; be < Z; ++be) {
                glyph = g_glyphs[bi.glyphs[be]];
                if (glyph) {
                    if (glyphCount) {
                        bf += "<br /><br />"
                    }
                    bf += "<b>" + glyph.name + "</b> ";
                    if (glyph.type == 1) {
                        bf += "(" + LANG.tc_majgly + ")<br />"
                    } else {
                        bf += "(" + LANG.tc_mingly + ")<br />"
                    }
                    bf += glyph.description;
                    glyphCount++
                }
            }
            if (glyphCount == 0) {
                bf += LANG.tc_none
            }
            bf += "</blockquote>"
        } else {
            bf += "<pre>";
            for (be = 0; be < w; ++be) {
                bf += "<b>" + bi[be].n + " (" + bi[be].k + " " + LANG[bi[be].k == 1 ? "tc_point" : "tc_points"] + ")</b>\n\n";
                bc = 0;
                for (bd = 0; bd < bi[be].t.length; ++bd) {
                    if (bi[be].t[bd].k) {
                        bf += "&nbsp;&nbsp;&nbsp;&nbsp;" + bi[be].t[bd].k + "/" + bi[be].t[bd].m + " " + bi[be].t[bd].n + "\n"; ++bc
                    }
                }
                if (bc == 0) {
                    bf += "&nbsp;&nbsp;&nbsp;&nbsp;" + LANG.tc_none + "\n"
                }
                bf += "\n"
            }
            bf += "</pre>"
        }
        bf += "</body></html>";
        bg.document.write(bf);
        bg.document.close()
    };
    this.simplifyGlyphName = function (bc) {
        return av(bc)
    };
    this.toggleLock = function () {
        if (aF_CurrentClass == -1) {
            return
        }
        s_ToggleLock()
    };
    function au(bf, bd, bc) {
        var be = M_ClassData[aF_CurrentClass];
        glyph = g_glyphs[bd];
        if (glyph && n(glyph, bf)) {
            if (be.glyphs[bf]) {
                be.glyphItems[be.glyphs[bf]] = 0
            }
            be.glyphs[bf] = bd;
            be.glyphItems[bd] = 1;
            if (!bc) {
                aX(bf);
                S()
            }
        }
    }
    function u() {
        var bg = M_ClassData[aF_CurrentClass];
        if (bg.k > R) {
            for (var bc = w - 1; bc >= 0; --bc) {
                for (var bf = bg[bc].t.length - 1; bf >= 0; --bf) {
                    var bd = bg[bc].t[bf].k;
                    for (var be = 0; be < bd; ++be) {
                        h_SubtractTalentPoint(bg[bc].t[bf]);
                        if (bg.k <= R) {
                            return
                        }
                    }
                }
            }
        }
    }
    function E(bd, bc) {
        if (r) {
            ab(0)
        } else {
            ab(4)
        }
        an(bd, bc)
    }
    function an(bd, bc) {
        Tooltip.showAtCursor(bc, LANG[r ? "tc_rembon" : "tc_addbon"], null, null, "q")
    }
    function aU(bc, bf, bg) {
        var bh = ce("div"),
		be,
		bd;
        bh.className = "talentcalc-arrow";
        switch (bc) {
            case 0:
                bf = 15;
                be = aO_CreateTable(1, 2);
                be.className = "talentcalc-arrow-down";
                bd = be.firstChild.childNodes[0].childNodes[0].style;
                bd.width = "15px";
                bd.height = "4px";
                bd = be.firstChild.childNodes[1].childNodes[0].style;
                bd.backgroundPosition = "bottom";
                bd.height = (bg - 4) + "px";
                break;
            case 1:
                be = aO_CreateTable(2, 2, true);
                be.className = "talentcalc-arrow-leftdown";
                bd = be.firstChild.childNodes[0].childNodes[0].style;
                bd.backgroundPosition = "left";
                bd.width = (bf - 4) + "px";
                bd.height = "11px";
                bd = be.firstChild.childNodes[0].childNodes[1].style;
                bd.backgroundPosition = "right";
                bd.width = "4px";
                bd = be.firstChild.childNodes[1].childNodes[0].style;
                bd.backgroundPosition = "bottom left";
                bd.backgroundRepeat = "no-repeat";
                bd.height = (bg - 11) + "px";
                break;
            case 2:
                be = aO_CreateTable(2, 2, true);
                be.className = "talentcalc-arrow-rightdown";
                bd = be.firstChild.childNodes[0].childNodes[0].style;
                bd.backgroundPosition = "left";
                bd.width = "4px";
                bd = be.firstChild.childNodes[0].childNodes[1].style;
                bd.backgroundPosition = "right";
                bd.width = (bf - 4) + "px";
                bd.height = "11px";
                bd = be.firstChild.childNodes[1].childNodes[0].style;
                bd.backgroundPosition = "bottom right";
                bd.backgroundRepeat = "no-repeat";
                bd.height = (bg - 11) + "px";
                break;
            case 3:
                bg = 15;
                be = aO_CreateTable(2, 1);
                be.className = "talentcalc-arrow-right";
                bd = be.firstChild.childNodes[0].childNodes[0].style;
                bd.backgroundPosition = "left";
                bd.width = "4px";
                bd = be.firstChild.childNodes[0].childNodes[1].style;
                bd.backgroundPosition = "right";
                bd.width = (bf - 4) + "px";
                break;
            case 4:
                bg = 15;
                be = aO_CreateTable(2, 1);
                be.className = "talentcalc-arrow-left";
                bd = be.firstChild.childNodes[0].childNodes[0].style;
                bd.backgroundPosition = "left";
                bd.width = (bf - 4) + "px";
                bd = be.firstChild.childNodes[0].childNodes[1].style;
                bd.backgroundPosition = "right";
                bd.width = "4px";
                break
        }
        bh.style.width = bf + "px";
        bh.style.height = bg + "px";
        ae_AddElement(bh, be);
        return bh
    }
    function ac_InitializeTalentSpecDiv() {
        var be, bf, bd;
        ay = ce("div");
        ay.className = "talentcalc-lower";
        ay.style.display = "none";
        for (var bc = 0; bc < w; ++bc) {
            be = aS[bc] = ce("div");
            be.className = "talentcalc-lower-tree" + (bc + 1);
            bf = ce("p");
            bf.className = "rcorners";
            ae_AddElement(bf, ce("b"));
            ae_AddElement(bf, ce("span"));
            bd = ce("a");
            bd.href = "javascript:;";
            bd.onclick = aZ.reset.bind(null, bc);
            ae_AddElement(bf, bd);
            ae_AddElement(bf, ce("tt"));
            ae_AddElement(bf, ce("strong"));
            ae_AddElement(bf, ce("var"));
            ae_AddElement(bf, ce("em"));
            ae_AddElement(be, bf);
            ae_AddElement(ay, be)
        }
        ae_AddElement(z, ay)
    }
    function ap_InitializeTalentMainDiv() {
        l_MainDiv = ce("div");
        l_MainDiv.className = "talentcalc-main";
        var bc = ce("div");
        bc.className = "clear";
        ae_AddElement(l_MainDiv, bc);
        ae_AddElement(z, l_MainDiv)
    }
    function bb(bk) {
        var bi = [{}],
		bc,
		bl;
        var be = in_array(W, bk) != -1;
        for (var bh = 0, bj = g_pet_talents.length; bh < bj; ++bh) {
            var bd = g_pet_talents[bh];
            if (in_array(bd.f, bk) >= 0) {
                bi[0].n = bd.n;
                bi[0].t = [];
                bi[0].i = bh;
                for (var bg = 0, bf = bd.t.length; bg < bf; ++bg) {
                    bc = bd.t[bg];
                    bl = bi[0].t[bg] = {};
                    cO(bl, bc);
                    if (bh == 0 && ((bg == 1 && be) || (bg == 2 && !be) || (bg == 11 && be) || (bg == 12 && !be))) {
                        bl.hidden = true
                    }
                    if (bh == 2 && ((bg == 1 && be) || (bg == 2 && !be) || (bg == 6 && be) || (bg == 7 && !be))) {
                        bl.hidden = true
                    }
                }
                break
            }
        }
        return bi
    }
    function k_InitializeTalentSideBarMenuDiv() {
        var bc, bp, bo, bg;
        ao = ce("div");
        ao.className = "talentcalc-upper rcorners";
        ae_AddElement(ao, ce("tt"));
        ae_AddElement(ao, ce("strong"));
        ae_AddElement(ao, ce("var"));
        ae_AddElement(ao, ce("em"));
        bc = ce("div");
        bc.className = "";
        j = ce("div");
        j.className = "talentcalc-sidebar-controls";
        j.style.display = "none";
        j.style.width = "500px";
        bp = ce("a");
        bp.className = "talentcalc-button-reset";
        bp.href = "javascript:;";
        bp.onclick = aZ.resetAll;
        ae_AddElement(bp, ct(LANG.tc_resetall));
        ae_AddElement(j, bp);
        if (g_TalentsCanBeLocked == true) {
            bp = v_LockButtonDiv = ce("a");
            bp.className = "talentcalc-button-lock";
            bp.href = "javascript:;";
            bp.onclick = s_ToggleLock;
            ae_AddElement(bp, ct(LANG.tc_lock));
            ae_AddElement(j, bp);
        }
        ae_AddElement(bc, j);
        bp = j;//ce("div");
        //bp.className = "talentcalc-sidebar-controls2";
        bo = ce("a");
        bo.className = "talentcalc-button-import";
        bo.href = "javascript:;";
        bo.onclick = aZ.promptBlizzBuild;
        ae_AddElement(bo, ct(LANG.tc_import));
        ae_AddElement(bp, bo);
        bo = aD = ce("a");
        bo.className = "talentcalc-button-summary";
        bo.style.display = "none";
        bo.href = "javascript:;";
        bo.onclick = aZ.showSummary.bind(null, 1);
        ae_AddElement(bo, ct(LANG.tc_summary));
        ae_AddElement(bp, bo);
        bo = d = ce("a");
        bo.className = "talentcalc-button-restore";
        bo.style.display = "none";
        bo.href = "javascript:;";
        bo.onclick = af;
        ae_AddElement(bo, ct(LANG.tc_restore));
        ae_AddElement(bp, bo);
        if (t.profiler) {
            bo = at = ce("a");
            bo.className = "talentcalc-button-export";
            bo.style.display = "none";
            bo.href = "#";
            bo.target = "_blank";
            ae_AddElement(bo, ct(LANG.tc_export));
            ae_AddElement(bp, bo)
        }
        bo = ce("div");
        bo.className = "clear";
        ae_AddElement(bp, bo);
        ae_AddElement(bc, bp);
        aM = bp = ce("div");
        ae_AddElement(bc, bp);
        if (!t.noAd) {
            az()
        }
        if (aB_CurrMode == a6) {
            e = ce("div");
            e.style.display = "none";
            bp = ce("h3");
            bp.style.display = "none";
            //bp.style.display = "none";
            ae_AddElement(bp, ct(LANG.tc_glyphs));
            ae_AddElement(e, bp);
            bo = ce("a");
            bo.style.display = "none";
            bo.href = "javascript:;";
            bo.onclick = aZ.resetGlyphs;
            ae_AddElement(bo, ct("[x]"));
            ae_AddElement(bp, bo);
            bp = ce("div");
            bp.style.display = "none";
            bp.className = "talentcalc-sidebar-majorglyphs q9";
            bo = ce("b");
            ae_AddElement(bo, ct(g_item_glyphs[1]));
            ae_AddElement(bp, bo);
            ae_AddElement(e, bp);
            bp = ce("div");
            bp.className = "talentcalc-sidebar-minorglyphs q9";
            bp.style.display = "none";
            bo = ce("b");
            ae_AddElement(bo, ct(g_item_glyphs[2]));
            ae_AddElement(bp, bo);
            ae_AddElement(e, bp);
            bp = ce("div");
            bp.className = "clear";
            ae_AddElement(e, bp);
            var bq = ce("table"),
			bf = ce("tbody"),
			bh,
			bd,
			be,
			bk,
			bj,
			bm;
            bq.className = "icontab";
            bq.style.display = "none";
            for (var bi = 0; bi < 3; ++bi) {
                bh = ce("tr");
                for (var bl = 0; bl < 2; ++bl) {
                    var bn = (bl * 3) + bi;
                    bd = ce("th");
                    bk = Icon.create("inventoryslot_empty.jpg", 1, null, "javascript:;");
                    bj = Icon.getLink(bk);
                    p[bn] = bk;
                    ae_AddElement(bd, bk);
                    ae_AddElement(bh, bd);
                    be = ce("td");
                    bm = ce("a");
                    D[bn] = bm;
                    ae_AddElement(be, bm);
                    ae_AddElement(bh, be);
                    bm.target = bj.target = "_blank";
                    bm.rel = bj.rel = "np";
                    bm.onmousedown = bj.onmousedown = rf;
                    bm.onclick = bj.onclick = rf;
                    g_onClick(bm, ak.bind(bm, bn));
                    bm.onmouseover = F.bind(null, bm, bn);
                    bm.onmousemove = Tooltip.cursorUpdate;
                    bm.onmouseout = Tooltip.hide;
                    g_onClick(bj, ak.bind(bj, bn));
                    bj.onmouseover = F.bind(null, bj, bn);
                    bj.onmouseout = Tooltip.hide;
                    be.oncontextmenu = rf
                }
                ae_AddElement(bf, bh)
            }
            ae_AddElement(bq, bf);
            ae_AddElement(e, bq);
            ae_AddElement(bc, e)
        }
        ae_AddElement(ao, bc);
        //Currently permanently hidden
        //ae_AddElement(z, ao)
    }
    function az() {
        var bc = ce("div");
        bc.id = "talentcalc-sidebar-ad";
        ae_AddElement(aM, bc);
        delete t.noAd
    }
    function aO_CreateTable(be_InputColumns, bi_InputRows, bc) {
        var bk_ResultTable = ce("table"),
		bd = ce("tbody"),
		bf,
		bj;
        for (var bg = 0; bg < bi_InputRows; ++bg) {
            bf = ce("tr");
            for (var bh = 0; bh < be_InputColumns; ++bh) {
                if (bc && bg > 0) {
                    bj = ce("th");
                    bj.colSpan = 2;
                    ae_AddElement(bf, bj);
                    break
                } else {
                    ae_AddElement(bf, ce("td"))
                }
            }
            ae_AddElement(bd, bf)
        }
        ae_AddElement(bk_ResultTable, bd);
        return bk_ResultTable
    }
    function P(bo) {
        var bw = M_ClassData[bo],
		bA;
        bw.k = 0;
        bw.div = ce("div");
        bw.div.style.display = "none";
        aef_AddElementFirst(l_MainDiv, bw.div);
        for (var bm = 0; bm < w; ++bm) {
            bw[bm].k = 0;
            var bv = ce("div");
            d2 = ce("div");
            bv.style.backgroundRepeat = "no-repeat";
            bv.style.cssFloat = bv.style.styleFloat = "left";
            if (bm > 0) {
                bv.style.borderLeft = "3px solid #000000"
            }
            d2.style.overflow = "hidden";
            d2.style.width = (aB_CurrMode == a6 ? "204px" : "244px");
            ae_AddElement(d2, aO_CreateTable(4, a1_TalentRows));
            ae_AddElement(bv, d2);
            ae_AddElement(bw.div, bv);
            var br = gE(bv, "td"),
			by,
			bx = "";
            if (!Browser.ie6) {
                bx = "?" + C_Version
            }
            if (aB_CurrMode == aI_PetMode) {
                bv.style.backgroundImage = "url(http://static.wowhead.com/images/pet/petcalc" + (g_locale.id == 25 ? "-ptr" : "") + "/bg_" + (bw[0].i + 1) + ".jpg" + bx + ")";
                by = "http://static.wowhead.com/images/pet/petcalc" + (g_locale.id == 25 ? "-ptr" : "") + "/icons_" + (bw[0].i + 1) + ".jpg" + bx
            } else {
                bv.style.backgroundImage = "url(/Assets/itemtooltip/" + g_file_classes[bo] + "_" + (bm + 1) + ".jpg" + bx + ")";
                if (bo > 20) {
                    //TBC
                    bv.style.backgroundSize = "204px 460px";
                    bv.style.height = "460px";
                }
                else {
                    bv.style.backgroundSize = "204px 360px";
                    bv.style.height = "360px";
                }
                //by = "images/talent/classes/icons" + (g_locale.id == 25 ? "-ptr": "") + "/" + g_file_classes[bo] + "_" + (bm + 1) + ".jpg" + bx
            }
            for (var bq = bw[bm].t.length - 1; bq >= 0; --bq) {
                var bj = bw[bm].t[bq],
				//bu = Icon.create(by + ".jpg", 1, null, "javascript:;"),
				bu = Icon.create(bj.iconname + ".png", 1, null, "javascript:;"),
				bf = Icon.getLink(bu),
				bn = br[(bj.y * 4 + bj.x + 1) - 1];
                if (Browser.ie6) {
                    bf.onfocus = tb
                }
                bf.rel = "np";
                bf.target = "_blank";
                bf.onmousedown = rf;
                bf.onclick = rf;
                g_onClick(bf, H_MouseClick.bind(bf, bj));
                bf.onmouseover = Y.bind(null, bf, bj);
                bf.onmouseout = Tooltip.hide;
                var bt = ce("div"),
				bz = ce("div");
                ae_AddElement(bz, ct("0"));
                bt.className = "icon-border";
                bz.className = "icon-bubble";
                ae_AddElement(bu, bt);
                ae_AddElement(bu, bz);
                bj.k = 0;
                bj.i = bq;
                bj.tree = bm;
                bj.classId = bo;
                bj.icon = bu;
                bj.link = bf;
                bj.border = bt;
                bj.bubble = bz;
                if (!bj.hidden) {
                    ae_AddElement(bn, bu)
                }
                if (bj.r) {
                    var bh = bw[bm].t[bj.r[0]],
					be = bj.x - bh.x,
					bd = bj.y - bh.y,
					bp,
					bk,
					bi,
					bs,
					bg = -1;
                    if (bh.links == null) {
                        bh.links = [bq]
                    } else {
                        bh.links.push(bq)
                    }
                    if (bd > 0) {
                        if (be == 0) {
                            bg = 0
                        } else {
                            if (be < 0) {
                                bg = 1
                            } else {
                                bg = 2
                            }
                        }
                    } else {
                        if (bd == 0) {
                            if (be > 0) {
                                bg = 3
                            } else {
                                if (be < 0) {
                                    bg = 4
                                }
                            }
                        }
                    }
                    if (aB_CurrMode == aI_PetMode) {
                        bi = (Math.abs(be) - 1) * 60;
                        bs = (Math.abs(bd) - 1) * 60
                    } else {
                        bi = (Math.abs(be) - 1) * 50;
                        bs = (Math.abs(bd) - 1) * 50
                    }
                    if (aB_CurrMode == aI_PetMode) {
                        switch (bg) {
                            case 0:
                                bs += 27;
                                bp = 21;
                                bk = 6 - bs;
                                break
                        }
                    } else {
                        switch (bg) {
                            case 0:
                                bs += 17;
                                bp = 16;
                                bk = 6 - bs;
                                break;
                            case 1:
                                bi += 36;
                                bs += 42;
                                bp = 16;
                                bk = 6 - bs;
                                break;
                            case 2:
                                bi += 37;
                                bs += 42;
                                bp = -6;
                                bk = 6 - bs;
                                break;
                            case 3:
                                bi += 15;
                                bp = -6;
                                bk = 12;
                                break;
                            case 4:
                                bi += 15;
                                bp = 37;
                                bk = 12;
                                break
                        }
                    }
                    var bc = aU(bg, bi, bs);
                    bc.style.left = bp + "px";
                    bc.style.top = bk + "px";
                    var bl = ce("div");
                    bl.className = "talentcalc-arrow-anchor";
                    ae_AddElement(bl, bc);
                    if (!bj.hidden) {
                        bn.insertBefore(bl, bn.firstChild)
                    }
                    bj.arrow = bc
                }
            }
        }
    }
    function a9_CreateTalentHeaderDiv() {
        var bf, bd, be;
        y = ce("div");
        y.className = "talentcalc-upper rcorners";
        y.style.display = "none";
        ae_AddElement(y, ce("tt"));
        ae_AddElement(y, ce("strong"));
        ae_AddElement(y, ce("var"));
        ae_AddElement(y, ce("em"));
        bf = ce("div");
        bf.className = "talentcalc-upper-inner";
        bd = ce("span");
        bd.className = "talentcalc-upper-class";
        be = a4 = ce("b");
        if (aB_CurrMode == aI_PetMode) {
            var bc = ce("a");
            bc.target = "_blank";
            ae_AddElement(a4, bc);
            a4 = bc
        }
        ae_AddElement(bd, be);
        ae_AddElement(bd, ct(" "));
        V = ce("b");
        ae_AddElement(bd, V);
        ae_AddElement(bf, bd);

        var bp = ce("a");
        bp.className = "talentcalc-button-reset";
        bp.href = "javascript:;";
        bp.onclick = aZ.resetAll;
        ae_AddElement(bp, ct(LANG.tc_resetall));
        ae_AddElement(bf, bp);

        var bo = ce("a");
        bo.className = "talentcalc-button-import";
        bo.href = "javascript:;";
        bo.onclick = aZ.promptImportBuild;
        ae_AddElement(bo, ct(LANG.tc_import));
        ae_AddElement(bf, bo);

        bd = ce("span");
        bd.className = "talentcalc-upper-ptsleft";
        ae_AddElement(bd, ct(LANG.tc_ptsleft));
        aH = ce("b");
        ae_AddElement(bd, aH);
        ae_AddElement(bf, bd);
        if (aB_CurrMode == aI_PetMode) {
            be = I = ce("a");
            be.href = "javascript:;";
            be.onclick = E.bind(null, be);
            be.onmouseover = an.bind(null, be);
            be.onmousemove = Tooltip.cursorUpdate;
            be.onmouseout = Tooltip.hide;
            ae_AddElement(bd, be)
        }
        bd = ce("span");
        bd.className = "talentcalc-upper-reqlevel";
        ae_AddElement(bd, ct(LANG.tc_reqlevel));
        aR = ce("b");
        ae_AddElement(bd, aR);
        ae_AddElement(bf, bd);
        bd = ce("div");
        bd.className = "clear";
        ae_AddElement(bf, bd);
        ae_AddElement(y, bf);
        ae_AddElement(z, y)
    }
    function x(bg) {
        var bc = "";
        var bf = [];
        for (var be = 0; be < bg.length; be += 2) {
            for (var bd = 0; bd < 2; ++bd) {
                bf[bd] = parseInt(bg.substring(be + bd, be + bd + 1));
                if (isNaN(bf[bd])) {
                    bf[bd] = 0
                }
            }
            bc += ah_EncodingArray.charAt(bf[0] * 6 + bf[1])
        }
        return bc
    }
    function h_SubtractTalentPoint(bj, bf, bi) {
        var bh = M_ClassData[bj.classId];
        if (bj.k > 0) {
            if (bj.links) {
                for (bd = 0; bd < bj.links.length; ++bd) {
                    if (bh[bj.tree].t[bj.links[bd]].k) {
                        return
                    }
                }
            }
            var be = 0;
            bj.k--;
            for (var bd = 0; bd < bh[bj.tree].t.length; ++bd) {
                var bg = bh[bj.tree].t[bd];
                if (bg.k && bj.y != bg.y) {
                    if (be < bg.y * ag) {
                        bj.k++;
                        return
                    }
                }
                be += bg.k
            }
            bh[bj.tree].k--;
            bd = bh.k--;
            ba(bj.tree, bf, null, bj.classId);
            if (bf) {
                Y(bi, bj);
                if (bd >= R) {
                    for (var bc = 0; bc < w; ++bc) {
                        ba(bc, true, null, bj.classId)
                    }
                }
                S()
            }
        }
    }
    function f_InverseConvertClassID(be) {
        var bc = f_InverseConvertClassID.L_Table;
        if (bc == null) {
            bc = f_InverseConvertClassID.L_Table = {};
            for (var bd in aw_ConvertClassID.L_Table) {
                bc[aw_ConvertClassID.L_Table[bd]] = bd
            }
        }
        return bc[be]
    }
    function aw_ConvertClassID(bc) {
        return aw_ConvertClassID.L_Table[bc]
    }
    aw_ConvertClassID.L_Table = {
        6: 9,
        11: 0,
        3: 1,
        8: 2,
        2: 3,
        5: 4,
        4: 5,
        7: 6,
        9: 7,
        1: 8,
        26: 19,
        31: 10,
        23: 11,
        28: 12,
        22: 13,
        25: 14,
        24: 15,
        27: 16,
        29: 17,
        21: 18
    };
    function aJ(bc) {
        return (bc >= 0 && bc <= 2 ? 1 : 2)
    }
    function aQ() {
        var bc = M_ClassData[aF_CurrentClass];
        if (aB_CurrMode == aI_PetMode) {
            return Math.max(r ? 60 : 0, bc.k > 0 ? (bc.k - r) * 4 + 16 : 0)
        } else {
            return (bc.k ? bc.k + 9 : 0)
        }
    }
    function ar(bf, bd) {
        var bc = bf.d;
        var be = Math.max(0, bf.k - 1) + (bd ? 1 : 0);
        return bf.d[be]
    }
    function ak(bd, bc) {
        if (!J_TalentsLocked) {
            if (bc) {
                if (X(bd)) {
                    F(this, bd)
                }
            } else {
                aa = bd;
                Lightbox.show("glyphpicker", {
                    onShow: a3
                })
            }
        }
    }
    function a3(bj, bg, bc) {
        Lightbox.setSize(800, 564);
        var be;
        if (bg) {
            bj.className = "talentcalc-glyphpicker listview";
            var bd = [],
			bh = ce("div"),
			bi = ce("a"),
			bf = ce("div");
            bd.push({
                none: 1
            });
            for (var bk in g_glyphs) {
                bd.push(g_glyphs[bk])
            }
            bh.className = "listview";
            ae_AddElement(bj, bh);
            bi.className = "screenshotviewer-close";
            bi.href = "javascript:;";
            bi.onclick = Lightbox.hide;
            ae_AddElement(bi, ce("span"));
            ae_AddElement(bj, bi);
            bf.className = "clear";
            ae_AddElement(bj, bf);
            be = new Listview({
                template: "glyph",
                id: "glyphs",
                parent: bh,
                data: bd,
                customFilter: n
            });
            if (Browser.gecko) {
                aE(be.getClipDiv(), "DOMMouseScroll", ax)
            } else {
                be.getClipDiv().onmousewheel = ax
            }
        } else {
            be = g_listviews.glyphs;
            be.clearSearch();
            be.updateFilters(true)
        }
        setTimeout(function () {
            be.focusSearch()
        },
		1)
    }
    function ax(bc) {
        bc = $E(bc);
        if (bc._wheelDelta < 0) {
            this.scrollTop += 27
        } else {
            this.scrollTop -= 27
        }
    }
    function H_MouseClick(bd, bc_InputIsRightClick) { //Mouseclick?
        if (J_TalentsLocked) {
            return
        }

        var shiftPressed = false;
        if (window.event) {
            if (!!window.event.shiftKey) {
                shiftPressed = true;
            }
        }

        if (bc_InputIsRightClick) {
            h_SubtractTalentPoint(bd, true, this);
            if (shiftPressed == true) {
                h_SubtractTalentPoint(bd, true, this);
                h_SubtractTalentPoint(bd, true, this);
                h_SubtractTalentPoint(bd, true, this);
                h_SubtractTalentPoint(bd, true, this);
            }
        } else {
            b_AddTalentPoint(bd, true, this);
            if (shiftPressed == true) {
                b_AddTalentPoint(bd, true, this);
                b_AddTalentPoint(bd, true, this);
                b_AddTalentPoint(bd, true, this);
                b_AddTalentPoint(bd, true, this);
            }
        }
    }
    function b_AddTalentPoint(bg, bd, bf) {
        var be = M_ClassData[bg.classId];
        if (be.k < R) {
            if (bg.enabled && bg.k < bg.m) {
                be.k++;
                be[bg.tree].k++;
                bg.k++;
                ba(bg.tree, bd, bg, bg.classId);
                if (bd) {
                    Y(bf, bg);
                    if (be.k == R) {
                        for (var bc = 0; bc < w; ++bc) {
                            if (bc != bg.tree) {
                                ba(bc, bd, null, bg.classId)
                            }
                        }
                    }
                    S()
                }
            }
        } else {
            if (aB_CurrMode == aI_PetMode && be.k == R && !bd) {
                m(-1, 4, true);
                b_AddTalentPoint(bg, bd, bf)
            }
        }
    }
    function o() {
        var bg, bi, be, bf = [];
        for (var bh in g_glyphs) {
            bf.push(bh)
        }
        bf.sort();
        for (var bd = 0, bc = bf.length; bd < bc; ++bd) {
            var bh = bf[bd];
            bg = g_glyphs[bh];
            bi = bg.classs;
            be = bg.type;
            if (!a0[bi]) {
                a0[bi] = {
                    1: [],
                    2: []
                }
            }
            bg.id = bh;
            bg.index = a0[bi][be].length;
            a0[bi][be].push(bg.id)
        }
    }
    function n(bc, be) {
        if (bc.none) {
            return true
        }
        var bd = M_ClassData[aF_CurrentClass];
        return (bc.classs == aF_CurrentClass && bc.type == aJ(be != null ? be : aa) && !bd.glyphItems[bc.id])
    }
    function S() {
        if (aq) {
            clearTimeout(aq)
        }
        aq = setTimeout(al, 50)
    }
    function al() {
        var be = M_ClassData[aF_CurrentClass];
        if (!be) {
            return
        }
        A.mode = aB_CurrMode;
        A.classId = aF_CurrentClass;
        A.locked = J_TalentsLocked;
        A.requiredLevel = aQ();
        A.pointsLeft = R - be.k;
        A.pointsSpent = (aB_CurrMode == aI_PetMode ? be[0].k : [be[0].k, be[1].k, be[2].k]);
        A.bonusPoints = r;
        st(V, "(" + (aB_CurrMode == aI_PetMode ? be.k : A.pointsSpent.join("/")) + ")");
        st(aR, A.requiredLevel ? A.requiredLevel : "-");
        st(aH, A.pointsLeft);
        if (v_LockButtonDiv) {
            if (J_TalentsLocked) {
                st(v_LockButtonDiv, LANG.tc_unlock);
                v_LockButtonDiv.className = "talentcalc-button-unlock"
            } else {
                st(v_LockButtonDiv, LANG.tc_lock);
                v_LockButtonDiv.className = "talentcalc-button-lock"
            }
        }
        if (aB_CurrMode == aI_PetMode) {
            if (r) {
                st(I, "[-]");
                I.className = "q10"
            } else {
                st(I, "[+]");
                I.className = "q2"
            }
        }
        if (at) {
            at.href = "?talent#" + aZ.getWhBuild() + ":" + aZ.getWhGlyphs()
        }
        for (var bc = 0; bc < w; ++bc) {
            var bd = aS[bc].firstChild.childNodes[1];
            st(bd, " (" + be[bc].k + ")")
        }
        if (aG) {
            aG(aZ, A, be)
        }
    }
    function aW() {
        if (aF_CurrentClass > 20) {
            //TBC
            $(".talentcalc-main").height(460);//.css("height", "460px");
            $WowheadTalentCalculator.setLevelCap(70);
        }
        else {
            $(".talentcalc-main").height(360);//.css("height", "460px");
            $WowheadTalentCalculator.setLevelCap(60);
        }
        st(a4, aY[aF_CurrentClass]);
        if (aB_CurrMode == aI_PetMode) {
            a4.href = "?pet=" + aF_CurrentClass
        } else {
            a4.className = "c" + aF_CurrentClass
        }
        if (K == 0) {
            j.style.display = "";
            aD.style.display = "";
            if (at) {
                at.style.display = ""
            }
            if (e) {
                e.style.display = ""
            }
            y.style.display = "";
            ay.style.display = ""

        }
        var be = M_ClassData[aF_CurrentClass];
        for (var bc = 0; bc < w; ++bc) {
            var bd = aS[bc].firstChild.childNodes[0];
            if (aB_CurrMode == a6) {
                bd.style.backgroundImage = "url(/Assets/itemtooltip/" + g_file_classes[aF_CurrentClass] + "_" + (bc + 1) + ".jpg)"
            }
            st(bd, be[bc].n)
        }
        u();
        c(aF_CurrentClass);
        S(); ++K
    }
    function aP(bk, bi) {
        var bj = M_ClassData[bi];
        var bl = 0,
		bd = 0;
        var bf = null,
		bc;
        for (var bh = 0; bh < bk.length; ++bh) {
            var be = Math.min(parseInt(bk.charAt(bh)), bj[bl].t[bd].m);
            if (isNaN(be)) {
                continue
            }
            for (var bg = 0; bg < be; ++bg) {
                b_AddTalentPoint(bj[bl].t[bd])
            }
            if (bf) {
                for (var bg = 0; bg < bc; ++bg) {
                    b_AddTalentPoint(bf)
                }
                bf = null
            }
            if (bj[bl].t[bd].k < be) {
                bf = bj[bl].t[bd];
                bc = be - bj[bl].t[bd].k
            }
            if (++bd > bj[bl].t.length - 1) {
                bd = 0;
                if (++bl > w - 1) {
                    break
                }
            }
        }
    }
    function a(bk) {
        var be = ("" + bk).split(":", Z),
		bh = 0,
		bd = 0;
        for (var bf = 0, bg = be.length; bf < bg && bf < Z; ++bf) {
            var bc = be[bf],
			bi = g_glyphs[bc];
            if (bi) {
                var bj = -1;
                if (bi.type == 1) {
                    if (bh < aj[1].length) {
                        bj = aj[1][bh]; ++bh
                    }
                } else {
                    if (bd < aj[2].length) {
                        bj = aj[2][bd]; ++bd
                    }
                }
                if (bj != -1) {
                    au(bj, bc, true)
                }
            } else {
                if (aJ(bf) == 1) {
                    ++bh
                } else {
                    ++bd
                }
            }
        }
    }
    function aA(bn, bk) {
        var bl = M_ClassData[bk];
        var bo = 0,
		be = 0;
        var bm = [];
        var bg = null,
		bd;
        for (var bj = 0; bj < bn.length; ++bj) {
            var bc = bn.charAt(bj);
            if (bc != L) {
                var bf = ah_EncodingArray.indexOf(bc);
                if (bf < 0) {
                    continue
                }
                bm[1] = bf % 6;
                bm[0] = (bf - bm[1]) / 6;
                for (var bi = 0; bi < 2; ++bi) {
                    bf = Math.min(bm[bi], bl[bo].t[be].m);
                    for (var bh = 0; bh < bf; ++bh) {
                        b_AddTalentPoint(bl[bo].t[be])
                    }
                    if (bg) {
                        for (var bh = 0; bh < bd; ++bh) {
                            b_AddTalentPoint(bg)
                        }
                        bg = null
                    }
                    if (bl[bo].t[be].k < bf) {
                        bg = bl[bo].t[be];
                        bd = bf - bl[bo].t[be].k
                    }
                    if (++be >= bl[bo].t.length) {
                        break
                    }
                }
            }
            if (be >= bl[bo].t.length || bc == L) {
                be = 0;
                if (++bo > w - 1) {
                    return
                }
            }
        }
    }
    function B(bd) {
        var bg = 0;
        for (var be = 0, bc = bd.length; be < bc && be < Z; ++be) {
            var bf = bd.charAt(be);
            if (bf == "Z") {
                bg = 3;
                continue
            }
            au(bg, a0[aF_CurrentClass][aJ(bg)][ah_EncodingArray.indexOf(bf)], true); ++bg
        }
    }
    function O(be) {
        if (!Browser.ie6) {
            return
        }
        if (!aK) {
            var bd = aK = ce("div");
            bd.style.position = "absolute";
            bd.style.left = bd.style.top = "-2323px";
            bd.style.visibility = "hidden";
            ae_AddElement(ge("layers"), bd)
        }
        var bh = M_ClassData[be];
        for (var bc = 0; bc < w; ++bc) {
            var bg = ce("img"),
			bf = ce("img");
            if (aB_CurrMode == aI_PetMode) {
                bg.src = "http://static.wowhead.com/images/pet/petcalc" + (g_locale.id == 25 ? "-ptr" : "") + "/bg_" + (bc + 1) + ".jpg";
                bf.src = "http://static.wowhead.com/images/pet/petcalc" + (g_locale.id == 25 ? "-ptr" : "") + "/icons_" + (bc + 1) + ".jpg"
            } else {
                bg.src = "/Assets/itemtooltip/" + g_file_classes[be] + "_" + (bc + 1) + ".jpg";
                //bf.src = "images/talent/classes/icons" + (g_locale.id == 25 ? "-ptr": "") + "/" + g_file_classes[be] + "_" + (bc + 1) + ".jpg"
            }
            ae_AddElement(aK, bg);
            ae_AddElement(aK, bf)
        }
    }
    function c(bd) {
        U();
        for (var bc = 0; bc < w; ++bc) {
            ba(bc, true, null, bd)
        }
    }
    function U() {
        if (aB_CurrMode != a6) {
            return
        }
        var bc = 0;
        for (var bd = 0; bd < Z; ++bd) {
            if (aX(bd)) {
                ++bc
            }
        }
        e.style.display = (bc == 0 && J_TalentsLocked && t.profiler ? "none" : "")
    }
    function T(be, bd) {
        if (M_ClassData[be] == null) {
            bd.n = be;
            M_ClassData[be] = bd;
            var bf = M_ClassData[be];
            bf.glyphs = [];
            bf.glyphItems = {};
            P(be);
            if (g && g.classId == be) {
                for (var bc = 0; bc < w; ++bc) {
                    ba(bc, false, null, be)
                }
                if (g.wh || g.blizz) {
                    if (g_TalentsCanBeLocked == true) J_TalentsLocked = true;
                    if (g.wh) {
                        aA(g.wh, be)
                    } else {
                        aP(g.blizz, be)
                    }
                }
            } else {
                J_TalentsLocked = false
            }
            g = null;
            if (a7 && a7.classId == be) {
                if (a7.wh) {
                    B(a7.wh)
                } else {
                    a(a7.blizz)
                }
            }
            a7 = null;
            if (be == aF_CurrentClass) {
                aW();
                bf.div.style.display = "";
                for (var bc = 0; bc < w; ++bc) {
                    ba(bc, true, null, be)
                }
            }
        }
    }
    function X(be, bc) {
        var bd = M_ClassData[aF_CurrentClass];
        if (bd.glyphs[be]) {
            bd.glyphItems[bd.glyphs[be]] = 0;
            bd.glyphs[be] = 0;
            if (!bc) {
                aX(be);
                S()
            }
            return true
        }
    }
    function am(bc) {
        a5(bc);
        aL();
        c(bc)
    }
    function a5(bd) {
        if (aB_CurrMode == aI_PetMode) {
            m(-1, 0, true)
        }
        for (var bc = 0; bc < w; ++bc) {
            aV(bc, bd, false)
        }
    }
    function aL(bc) {
        var be = M_ClassData[aF_CurrentClass];
        if (!be) {
            return
        }
        for (var bd = 0; bd < Z; ++bd) {
            X(bd, !bc)
        }
        U()
    }
    function aV(bc, bf, be) {
        var bg = M_ClassData[bf];
        var bd;
        for (bd = 0; bd < bg[bc].t.length; ++bd) {
            bg[bc].t[bd].k = 0
        }
        bd = (bg.k < R);
        bg.k -= bg[bc].k;
        bg[bc].k = 0;
        if (be) {
            if (bd) {
                ba(bc, true, null, bf)
            } else {
                for (bc = 0; bc < w; ++bc) {
                    ba(bc, true, null, bf)
                }
            }
            S()
        }
    }
    function af() {
        if (aC) {
            if (aC.wh) {
                aN_setWhBuild(aC.wh)
            } else {
                Q(aC.classId, aC.blizz)
            }
        }
        if (N) {
            if (N.wh) {
                G_setWhGlyphs(N.wh)
            }
        }
    }
    function Q(bc, bd) {
        if (aY[bc] == null) {
            return
        }
        if (!bd) {
            return
        }
        if (g_TalentsCanBeLocked == true) J_TalentsLocked = true;
        if (!aC) {
            aC = {
                classId: bc,
                blizz: bd
            };
            d.style.display = ""
        }
        if (M_ClassData[bc]) {
            a5(bc);
            c(bc);
            aP(bd, bc);
            c(bc)
        } else {
            g = {
                classId: bc,
                blizz: bd
            }
        }
        if (!q(bc)) {
            S()
        }
    }
    function a8(bc) {
        if (!bc) {
            return
        }
        if (M_ClassData[aF_CurrentClass]) {
            aL();
            a(bc);
            U();
            S()
        } else {
            a7 = {
                classId: aF_CurrentClass,
                blizz: bc
            }
        }
    }
    function ab(bc) {
        if (isNaN(bc) || (bc != 0 && bc != 4)) {
            return
        }
        m(-1, bc)
    }
    function q(bc) {
        if (aY[bc] == null) {
            return
        }
        if (bc != aF_CurrentClass) {
            ad = aF_CurrentClass;
            aF_CurrentClass = bc;

            if (aB_CurrMode == aI_PetMode && M_ClassData[bc] == null) {
                T(bc, bb(bc))
            } else {
                if (M_ClassData[bc]) {
                    aW();
                    var bd = M_ClassData[bc];
                    bd.div.style.display = ""
                } else {
                    O(bc);
                    g_ajaxIshRequest("data=talents&class=" + bc + "&" + C_Version)
                }
            }
            if (M_ClassData[ad]) {
                M_ClassData[ad].div.style.display = "none"
            }
            return true
        }
    }
    function ai(bc) {
        if (J_TalentsLocked != bc) {
            J_TalentsLocked = bc;
            c(aF_CurrentClass);
            S()
        }
    }
    function m(be, bf, bd) {
        var bc = R;
        if (be == -1) {
            be = aT_MaxTalentPoints
        }
        if (bf == -1) {
            bf = r
        }
        aT_MaxTalentPoints = be;
        r = bf;
        R = be + bf;
        if (aF_CurrentClass != -1) {
            if (R < bc) {
                u()
            }
            c(aF_CurrentClass);
            if (!bd) {
                S()
            }
        }
    }
    function aN_setWhBuild(bg_InputBuild) {
        if (!bg_InputBuild) {
            return
        }
        var bc = bg_InputBuild,
		bd = false,
		be;
        if (aB_CurrMode == aI_PetMode) {
            var bh = ah_EncodingArray.indexOf(bg_InputBuild.charAt(0));
            if (bh >= 0 && bh <= 4) {
                var bf = ah_EncodingArray.indexOf(bg_InputBuild.charAt(1));
                if (bf % 2 == 1) {
                    m(-1, 4, true); --bf
                } else {
                    m(-1, 0, true)
                }
                be = bh * 10 + (bf / 2);
                if (g_pet_families[be] != null) {
                    bg_InputBuild = bg_InputBuild.substr(2);
                    bd = true
                }
            }
        } else {
            var bh = ah_EncodingArray.indexOf(bg_InputBuild.charAt(0));
            if (bh >= 0 && bh <= 54) {
                var bf = bh % 3,
				be = (bh - bf) / 3;
                be = f_InverseConvertClassID(be);
                if (be != null) {
                    bg_InputBuild = bg_InputBuild.substr(1);
                    bd = true
                }
            }
        }
        if (be != null) {
            if (parseInt(be) > 20) {
                //TBC
                $(".talentcalc-main").height(460);//.css("height", "460px");
                $WowheadTalentCalculator.setLevelCap(70);
            }
            else {
                $(".talentcalc-main").height(360);//.css("height", "460px");
                $WowheadTalentCalculator.setLevelCap(60);
            }
        }
        if (bd) {
            if (bg_InputBuild.length) {
                if (g_TalentsCanBeLocked == true) J_TalentsLocked = true;
                if (!aC) {
                    aC = {
                        wh: bc
                    };
                    d.style.display = ""
                }
            }
            if (M_ClassData[be]) {
                a5(be);
                aA(bg_InputBuild, be);
                c(be)
            } else {
                g = {
                    classId: be,
                    wh: bg_InputBuild
                }
            }
            if (!q(be)) {
                S()
            }
            return be
        }
    }
    function G_setWhGlyphs(bc) {
        if (!bc) {
            return
        }
        if (!N) {
            N = {
                wh: bc
            }
        }
        if (M_ClassData[aF_CurrentClass]) {
            aL();
            B(bc);
            U();
            S()
        } else {
            a7 = {
                classId: aF_CurrentClass,
                wh: bc
            }
        }
    }
    function F(be, bd) {
        var bc = M_ClassData[aF_CurrentClass];
        upper = "",
		lower = "";
        glyph = g_glyphs[bc.glyphs[bd]];
        if (glyph) {
            upper += "<b>" + glyph.name + "</b>";
            upper += '<br /><span class="q9">' + LANG[bd <= 2 ? "tc_majgly" : "tc_mingly"] + "</span>";
            lower += '<span class="q">' + glyph.description + "</span>";
            if (!J_TalentsLocked) {
                lower += '<br /><span class="q10">' + LANG[a2 ? "tc_remgly2" : "tc_remgly"] + "</span>"
            }
        } else {
            upper += '<b class="q0">' + LANG.tc_empty + "</b>";
            upper += '<br /><span class="q9">' + LANG[bd <= 2 ? "tc_majgly" : "tc_mingly"] + "</span>";
            if (!J_TalentsLocked) {
                lower += '<span class="q2">' + LANG.tc_addgly + "</span>"
            }
        }
        if (glyph && be.parentNode.className.indexOf("icon") != 0) {
            Tooltip.setIcon(glyph.icon)
        } else {
            Tooltip.setIcon(null)
        }
        Tooltip.show(be, "<table><tr><td>" + upper + "</td></tr></table><table><tr><td>" + lower + "</td></tr></table>")
    }
    function Y(bf, be) {
        var bd = M_ClassData[be.classId],
		bc = "<table><tr><td><b>";
        if (be.z) {
            bc += '<span style="float: right" class="q0">' + be.z + "</span>"
        }
        bc += be.n + "</b><br />" + sprintf(LANG.tc_rank, be.k, be.m) + "<br />";
        if (be.r) {
            if (bd[be.tree].t[be.r[0]].k < be.r[1]) {
                bc += '<span class="q10">';
                bc += sprintf(LANG[be.r[1] == 1 ? "tc_prereq" : "tc_prereqpl"], be.r[1], bd[be.tree].t[be.r[0]].n);
                bc += "</span><br />"
            }
        }
        if (bd[be.tree].k < be.y * ag) {
            bc += '<span class="q10">' + sprintf(LANG.tc_tier, (be.y * ag), bd[be.tree].n) + "</span><br />"
        }
        if (be.t && be.t.length >= 1) {
            bc += be.t[0]
        }
        bc += "</td></tr></table><table><tr><td>";
        if (be.t && be.t.length > 1) {
            bc += be.t[1] + "<br />"
        }
        bc += '<span class="q">' + ar(be) + "</span><br />";
        if (J_TalentsLocked) { } else {
            if (be.enabled) {
                if (!be.k) {
                    bc += '<span class="q2">' + LANG.tc_learn + "</span><br />"
                } else {
                    if (be.k == be.m) {
                        bc += '<span class="q10">' + LANG[a2 ? "tc_unlearn2" : "tc_unlearn"] + "</span><br />"
                    }
                }
                if (be.k && be.k < be.m) {
                    bc += "<br />" + LANG.tc_nextrank + '<br /><span class="q">' + ar(be, 1) + "</span><br />"
                }
            }
        }
        bc += "</td></tr></table>";
        Tooltip.show(bf, bc)
    }
    function av(bc) {
        if (g_locale.id == 0 || g_locale.id == 25) {
            return bc.substr(9)
        }
        return bc
    }
    function s_ToggleLock() {
        if (g_TalentsCanBeLocked == true) J_TalentsLocked = !J_TalentsLocked;
        else J_TalentsLocked = false;

        c(aF_CurrentClass);
        S();
        return J_TalentsLocked
    }
    function aX(bh) {
        var bg = M_ClassData[aF_CurrentClass],
		bd = p[bh],
		bf = Icon.getLink(bd),
		bc = D[bh];
        if (bg.glyphs[bh]) {
            var be = g_glyphs[bg.glyphs[bh]];
            Icon.setTexture(bd, 1, be.icon + ".jpg");
            bc.href = bf.href = "?item=" + be.id;
            st(bc, av(be.name));
            bc.className = "q1";
            return true
        } else {
            Icon.setTexture(bd, 1, "inventoryslot_empty.jpg");
            bc.href = bf.href = "javascript:;";
            st(bc, LANG.tc_empty);
            bc.className = "q0";
            return false
        }
    }
    function ba(bl, bh, bd, bi) {
        var bj = M_ClassData[bi];
        var bg;
        var bc;
        if (!bd || bj.k == R) {
            bc = 0;
            bg = R - 21
        } else {
            bc = bd.i;
            bg = Math.floor(bj[bl].k / 5) * 5 + 5
        }
        if (bd != null && bd.links != null) {
            for (var be = 0, bf = bd.links.length; be < bf; ++be) {
                if (bc > bd.links[be]) {
                    bc = bd.links[be]
                }
            }
        }
        for (var be = bc; be < bj[bl].t.length; ++be) {
            bd = bj[bl].t[be];
            if (bj.k == R && !bd.k) {
                bd.enabled = 0
            } else {
                if (bj[bl].k >= bd.y * ag) {
                    if (bd.r) {
                        if (bj[bl].t[bd.r[0]].k >= bd.r[1]) {
                            bd.enabled = 1
                        } else {
                            bd.enabled = 0
                        }
                    } else {
                        bd.enabled = 1
                    }
                } else {
                    bd.enabled = 0
                }
            }
            if (bh) {
                if (bd.enabled && (!J_TalentsLocked || bd.k)) {
                    if ((bd.k == bd.m)) {
                        bd.border.style.backgroundPosition = "-42px 0";
                        bd.bubble.style.color = "#E7BA00"
                    } else {
                        bd.border.style.backgroundPosition = "-84px 0";
                        bd.bubble.style.color = "#17FD17"
                    }
                    //Icon.moveTexture(bd.icon, 1, be, 0);
                    Icon.setTexture(bd.icon, 1, bd.iconname + ".jpg");
                    bd.icon.setAttribute("style", "-webkit-filter:grayscale(0%)");
                    bd.icon.firstChild.style["background-size"] = "36px";
                    bd.link.className = "bubbly";
                    bd.bubble.style.visibility = "visible";
                    if (bd.r) {
                        var bk = bd.arrow.firstChild;
                        if (bk.className.charAt(bk.className.length - 1) != "2") {
                            bk.className += "2"
                        }
                    }
                } else {
                    bd.border.style.backgroundPosition = "0 0";
                    //Icon.moveTexture(bd.icon, 1, be, 1);
                    //Icon.setTexture(bd.icon, 1, "?data=talent-icon&icon=" + bd.iconname);
                    Icon.setTexture(bd.icon, 1, bd.iconname + ".jpg");
                    bd.icon.setAttribute("style", "-webkit-filter:grayscale(100%)");
                    bd.icon.firstChild.style["background-size"] = "36px";
                    bd.link.className = "";
                    bd.bubble.style.visibility = "hidden";
                    if (bd.r) {
                        var bk = bd.arrow.firstChild;
                        if (bk.className.charAt(bk.className.length - 1) == "2") {
                            bk.className = bk.className.substr(0, bk.className.length - 1)
                        }
                    }
                }
                bd.bubble.firstChild.nodeValue = bd.k;
                bd.link.href = "?spell=" + bd.s[Math.max(0, bd.k - 1)]
            }
        }
    }
}
TalentCalc.MODE_DEFAULT = 0;
TalentCalc.MODE_PET = 1;

/*
 talent.js version 278
 Differences from origin:
 
*/

var tc_loaded = false,
tc_object, tc_classId = -1,
tc_classIcons = {},
tc_build = "",
tc_glyphs = "";

var tc_chooseClasses = [
    1,
    2,
    3,
    4,
    5,
    7,
    8,
    9,
    11,
];
var tc_chooseClassesTBC = [
    21,
    22,
    23,
    24,
    25,
    27,
    28,
    29,
    31,
];
function tc_init() {
    var c;
    g_initPath([1, 0]);
    var e = g_sortJsonArray(g_chr_classes, g_chr_classes);
    c = ge("tc-classes-inner");
    var classTable = ce("table");
    var tableBody = ce("tbody");
    var tableRowHeader = ce("tr");
    var tableRow = ce("tr");
    var tableVanillaColumn = ce("td");
    var tableTBCColumn = ce("td");
    var tableVanillaHeaderColumn = ce("div");
    var tableTBCHeaderColumn = ce("div");

    var spaceColumn = ce("td");
    var spaceColumnDiv = ce("div");
    spaceColumnDiv.style.width = "5px";
    ae_AddElement(spaceColumn, spaceColumnDiv);

    st(tableVanillaHeaderColumn, "Classic");
    st(tableTBCHeaderColumn, "TBC");

    //ae_AddElement(tableRowHeader, tableVanillaHeaderColumn);
    //ae_AddElement(tableRowHeader, tableTBCHeaderColumn);
    //ae_AddElement(tableBody, tableRowHeader);
    ae_AddElement(tableRow, tableVanillaColumn);
    ae_AddElement(tableRow, spaceColumn);
    ae_AddElement(tableRow, tableTBCColumn);
    ae_AddElement(tableBody, tableRow);
    ae_AddElement(classTable, tableBody);
    var vanillaClasses = ce("div");
    ae_AddElement(vanillaClasses, tableVanillaHeaderColumn);
    vanillaClasses.className = "blackframe";
    vanillaClasses.style.height = "420px";
    for (var d = 0, b = tc_chooseClasses.length; d < b; ++d) {
        var h = tc_chooseClasses[d],
		f = Icon.create("classicon_" + g_file_classes[h] + ".png", 1, null, "javascript:;"),
		g = Icon.getLink(f);
        tc_classIcons[h] = f;
        if (Browser.ie6) {
            g.onfocus = tb
        }
        g.onclick = tc_classClick.bind(g, h);
        g.onmouseover = tc_classOver.bind(g, h);
        g.onmouseout = Tooltip.hide;
        ae_AddElement(vanillaClasses, f)
    }
    ae_AddElement(tableVanillaColumn, vanillaClasses);
    var tbcClasses = ce("div");
    ae_AddElement(tbcClasses, tableTBCHeaderColumn);
    tbcClasses.className = "blackframe";
    tbcClasses.style.height = "420px";
    for (var d = 0, b = tc_chooseClassesTBC.length; d < b; ++d) {
        var h = tc_chooseClassesTBC[d],
		f = Icon.create("classicon_" + g_file_classes[h] + ".png", 1, null, "javascript:;"),
		g = Icon.getLink(f);
        tc_classIcons[h] = f;
        if (Browser.ie6) {
            g.onfocus = tb
        }
        g.onclick = tc_classClick.bind(g, h);
        g.onmouseover = tc_classOver.bind(g, h);
        g.onmouseout = Tooltip.hide;
        ae_AddElement(tbcClasses, f)
    }
    ae_AddElement(tableTBCColumn, tbcClasses);
    //var a = ce("div");
    //a.className = "clear";
    //ae_AddElement(c, a);
    ae_AddElement(c, classTable);
    tc_object = new TalentCalc();
    tc_object.initialize("tc-itself", {
        onChange: tc_onChange,
        noAd: 1
    });
    tc_readPound();
    setInterval(tc_readPound, 1000)
}
function tc_classClick(a) {
    if (tc_object.setClass(a)) {
        Tooltip.hide()
    }
    return false
}
function tc_classOver(a) {
    Tooltip.show(this, "<b>" + g_chr_classes[a] + "</b>", 0, 0, "c" + a)
}
function tc_onChange(a, e, d) {
    var c;
    if (e.classId != tc_classId) {
        if (!tc_loaded) {
            tc_loaded = true
        }
        if (tc_classId != -1) {
            c = tc_classIcons[tc_classId];
            c.className = tc_classIcons[tc_classId].className.replace("iconmedium-gold", "")
        }
        tc_classId = e.classId;
        c = tc_classIcons[tc_classId];
        c.className += " iconmedium-gold";
        g_initPath([1, 0, tc_classId])
    }
    tc_build = a.getWhBuild();
    tc_glyphs = a.getWhGlyphs();
    var b = "#" + tc_build;
    if (tc_glyphs != "") {
        b += ":" + tc_glyphs
    }
    location.replace(b);
    var g = document.title;
    if (g.indexOf("/") != -1) {
        var f = g.indexOf("- ");
        if (f != -1) {
            g = g.substring(f + 2)
        }
    }
    document.title = g_chr_classes[tc_classId] + " (" + d[0].k + "/" + d[1].k + "/" + d[2].k + ") - " + g
}
function tc_readPound() {
    if (location.hash) {
        if (location.hash.indexOf("-") != -1) {
            var d = location.hash.substr(1).split("-"),
			a = d[0] || "",
			f = d[1] || "",
			c = -1;
            for (var g in g_file_classes) {
                if (g_file_classes[g] == a) {
                    c = g;
                    break
                }
            }
            if (c == -1) {
                try {
                    c = parseInt(a);
                } catch (e) { }
            }
            if (c != -1) {
                tc_object.setBlizzBuild(c, f)
            }
        } else {
            var d = location.hash.substr(1).split(":"),
			e = d[0] || "",
			b = d[1] || "";
            if (tc_build != e) {
                tc_build = e;
                tc_object.setWhBuild(tc_build)
            }
            if (tc_glyphs != b) {
                tc_glyphs = b;
                tc_object.setWhGlyphs(tc_glyphs)
            }
        }
    }
};
