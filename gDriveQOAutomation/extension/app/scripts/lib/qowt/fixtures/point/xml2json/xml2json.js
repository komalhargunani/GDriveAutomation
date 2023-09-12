/*
 * Utility to convert xml string to json string
 */
function xml2json(xml, tab, ei) {
	'use strict';

	var eid = ei.id;

	var X = {

		toObj : function(xml) {
			var o = {};
			var attributesObject = {};
			var children = {};
			if (xml.nodeType == 1) { // element node ..
				if (xml.attributes.length) { // element with attributes ..
					for ( var i = 0; i < xml.attributes.length; i++) {
						attributesObject[xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
					}
					o.attributes = attributesObject;
				}
				if (xml.firstChild) { // element has child nodes ..
					var textChild = 0, cdataChild = 0, hasElementChild = false;
					for ( var n = xml.firstChild; n; n = n.nextSibling) {
						if (n.nodeType == 1) {
							hasElementChild = true;
						} else if ((n.nodeType == 3) && n.nodeValue.match(/[^ \f\n\r\t\v]/)) {
							textChild++; // non-whitespace text
						} else if (n.nodeType == 4) {
							cdataChild++; // cdata section node
						}
					}

					if (hasElementChild) {
						if ((textChild < 2) && (cdataChild < 2)) {
							/*
							 * structured element with evtl. a single text or/and cdata node ..
							 */
							X.removeWhite(xml);
							for ( var nn = xml.firstChild; nn; nn = nn.nextSibling) {
								if (nn.nodeType == 3) { // text node
									// o["#text"] = X.escape(n.nodeValue);
									children["#text"] = X.escape(nn.nodeValue);
								} else if (nn.nodeType == 4) { // cdata node
									// o["#cdata"] = X.escape(n.nodeValue);
									children["#cdata"] = X.escape(nn.nodeValue);
								} else if (children[nn.localName]) { // multiple
									// occurence of
									// element ..
									if (children[nn.localName] instanceof Array) {
										children[nn.localName][children[nn.localName].length] = X.toObj(nn);
									} else {
										children[nn.localName] = [
												children[nn.localName],
												X.toObj(nn) ];
									}
								} else {
									// first occurence of element..
									children[nn.localName] = X.toObj(nn);
								}
							}
						} else { // mixed content
							if (!xml.attributes.length) {
								o = X.escape(X.innerXml(xml));
							} else {
								o["#text"] = X.escape(X.innerXml(xml));
							}
						}
					} else if (textChild) { // pure text
						if (!xml.attributes.length) {
							o = X.escape(X.innerXml(xml));
						} else {
							o["#text"] = X.escape(X.innerXml(xml));
						}
					} else if (cdataChild) { // cdata
						if (cdataChild > 1) {
							o = X.escape(X.innerXml(xml));
						} else {
							for ( var nnn = xml.firstChild; nnn; nnn = nnn.nextSibling) {
								o["#cdata"] = X.escape(nnn.nodeValue);
							}
						}
					}
					o.children = children;
				}
				if (!xml.attributes.length && !xml.firstChild) {
					o = null;
				}
			} else if (xml.nodeType == 9) { // document.node
				o = X.toObj(xml.documentElement);
			}
            ///else {
            /// Argh! Don't use alerts in QOWT code please!
                //alert("unhandled node type: " + xml.nodeType);
                ///console.error("unhandled node type: " + xml.nodeType);
			///}
			return o;
		},
		toJson : function(o, name, ind) {
			var json = ind + "{" + "\n";
			json += ind + "\"" + "etp" + "\"" + ":";
			json += name ? ("\"" + name + "\"") : "";
			json += ",";
			json += "\n" + ind + "\"" + "eid" + "\"" + ":";
			eid++;
			json += name ? ("\"" + (eid) + "\"") : "";
			if (o instanceof Array) {
				json = "";
				for ( var i = 0, n = o.length; i < n; i++) {
					o[i] = X.toJson(o[i], name, ind + "\t");
				}
				json += (o.length > 0 ? (o.join(",\n") + "\n" + ind) : o.join(""));
				return json;
			} else if (o === null) {
				json += "";
			} else if (typeof (o) == "object") {

				var arr = [];
				for ( var m in o.attributes) {
					arr[arr.length] = "\"" + m + "\"" + ":" + "\"" + o.attributes[m].toString() + "\"";
				}

				json += (arr.length > 0 ? (",\n" + ind + arr.join(",\n" + ind)) : arr.join(""));

				json += ",\n" + ind + "\"" + "elm" + "\"" + ":[" + "\n";
				var childArr = [];
				for ( var child in o.children) {
					childArr[childArr.length] = X.toJson(o.children[child], child, ind + "\t");
				}
				json += (childArr.length > 0 ? (childArr.join(",\n")) : childArr.join(""));

				if (childArr.length > 0) {
					json += "\n";
				}
				json += ind + "      ]";
			} else if (typeof (o) == "string") {
				json += ",\n\"" + "txt" + "\": " + "\"" + o.toString() + "\"";
			} else {
				json += (name && ":") + o.toString();
			}
			json += "\n" + ind + "}";
			return json;
		},
		innerXml : function(node) {
			var s = "";
			if ("innerHTML" in node) {
				s = node.innerHTML;
			} else {
				var asXml = function(n) {
					var s = "";
					if (n.nodeType == 1) {
						s += "<" + n.localName;
						for ( var i = 0; i < n.attributes.length; i++) {
							s += " " + n.attributes[i].localName + "=\"" + (n.attributes[i].nodeValue || "") .toString() + "\"";
						}
						if (n.firstChild) {
							s += ">";
							for ( var c = n.firstChild; c; c = c.nextSibling) {
								s += asXml(c);
							}
							s += "</" + n.localName + ">";
						} else {
							s += "/>";
						}
					} else if (n.nodeType == 3) {
						s += n.nodeValue;
					} else if (n.nodeType == 4) {
						s += "<![CDATA[" + n.nodeValue + "]]>";
					}
					return s;
				};
				for ( var c = node.firstChild; c; c = c.nextSibling) {
					s += asXml(c);
				}
			}
			return s;
		},
		escape : function(txt) {
			return txt.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"') .replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r');
		},
		removeWhite : function(e) {
			e.normalize();
			for ( var n = e.firstChild; n;) {
				if (n.nodeType == 3) { // text node
					if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
						var nxt = n.nextSibling;
						e.removeChild(n);
						n = nxt;
					} else {
						n = n.nextSibling;
					}
				} else if (n.nodeType == 1) { // element node
					X.removeWhite(n);
					n = n.nextSibling;
				} else {// any other node
					n = n.nextSibling;
				}
			}
			return e;
		}
	};
	if (xml.nodeType == 9) {
		xml = xml.documentElement;
	}
	var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.localName, "\t");
	eid++;
	ei.id = eid;
	return tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, ""));
}
