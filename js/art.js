/** Draws a patchwork denim illustration for a product, so the shop works without photos. */
window.ProductArt = (function () {
  "use strict";
  var BLUES = ["#1f335c", "#34558a", "#5c7fb0", "#93adcf"];
  var THREAD = "#e0a53a";
  var LEATHER = "#b86a34";

  function patches(id, clipShape, box, tones) {
    var x = box[0], y = box[1], w = box[2], h = box[3];
    var c = tones.map(function (t) { return BLUES[t % BLUES.length]; });
    var mx = x + w * 0.42, my = y + h * 0.55;
    return '<defs><clipPath id="' + id + '">' + clipShape + "</clipPath></defs>" +
      '<g clip-path="url(#' + id + ')">' +
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c[0] + '"/>' +
      '<rect x="' + mx + '" y="' + y + '" width="' + (w - (mx - x)) + '" height="' + (my - y) + '" fill="' + c[1] + '"/>' +
      '<rect x="' + mx + '" y="' + my + '" width="' + (w * 0.3) + '" height="' + (h - (my - y)) + '" fill="' + c[2] + '"/>' +
      '<rect x="' + (mx + w * 0.3) + '" y="' + my + '" width="' + w + '" height="' + h + '" fill="' + c[3] + '"/>' +
      "</g>" +
      '<path d="M' + mx + " " + (y + 4) + "V" + (y + h - 4) + "M" + mx + " " + my + "H" + (x + w - 4) + "M" + (mx + w * 0.3) + " " + my + "V" + (y + h - 4) +
      '" stroke="' + THREAD + '" stroke-width="1.8" stroke-dasharray="5 4" fill="none"/>';
  }

  var shapes = {
    pencil: function (id, t) {
      return patches(id, '<rect x="45" y="90" width="230" height="95" rx="20"/>', [45, 90, 230, 95], t) +
        '<rect x="45" y="90" width="230" height="13" rx="6.5" fill="' + LEATHER + '"/>' +
        '<path d="M54 96.5h212" stroke="#f2d39a" stroke-width="1.6" stroke-dasharray="2 4"/>' +
        '<rect x="256" y="92" width="30" height="9" rx="4.5" fill="' + THREAD + '"/>' +
        '<rect x="62" y="150" width="26" height="16" rx="2" fill="#c98a4f"/>';
    },
    bottle: function (id, t) {
      return '<path d="M132 120C90 60 100 30 160 26s70 34 28 94" fill="none" stroke="#34558a" stroke-width="9" stroke-linecap="round"/>' +
        '<rect x="141" y="52" width="38" height="60" rx="9" fill="#c9d1d9"/><rect x="147" y="40" width="26" height="16" rx="4" fill="#8d99a6"/>' +
        patches(id, '<rect x="118" y="100" width="84" height="128" rx="14"/>', [118, 100, 84, 128], t) +
        '<rect x="118" y="100" width="84" height="10" rx="5" fill="#1f335c"/>' +
        '<circle cx="128" cy="118" r="4" fill="' + LEATHER + '"/><circle cx="192" cy="118" r="4" fill="' + LEATHER + '"/>';
    },
    tote: function (id, t) {
      return '<path d="M118 108V70a42 42 0 0 1 84 0v38" fill="none" stroke="#1f335c" stroke-width="10"/>' +
        patches(id, '<path d="M78 100h164l12 128H66z"/>', [66, 100, 188, 128], t) +
        '<path d="M78 100h164v12H78z" fill="#1f335c"/>' +
        '<path d="M82 106h156" stroke="' + THREAD + '" stroke-width="1.6" stroke-dasharray="5 4"/>' +
        '<rect x="204" y="196" width="28" height="16" rx="2" fill="#c98a4f"/>';
    },
    pouch: function (id, t) {
      return patches(id, '<rect x="70" y="78" width="180" height="130" rx="14"/>', [70, 78, 180, 130], t) +
        '<rect x="70" y="78" width="180" height="12" rx="6" fill="' + LEATHER + '"/>' +
        '<path d="M96 112h62v48l-31 22-31-22z" fill="#34558a" stroke="' + THREAD + '" stroke-width="1.8" stroke-dasharray="5 4"/>' +
        '<circle cx="100" cy="116" r="3.5" fill="' + LEATHER + '"/><circle cx="154" cy="116" r="3.5" fill="' + LEATHER + '"/>';
    },
    sleeve: function (id, t) {
      return patches(id, '<rect x="55" y="66" width="210" height="150" rx="10"/>', [55, 66, 210, 150], t) +
        '<path d="M55 76a10 10 0 0 1 10-10h190a10 10 0 0 1 10 10v36l-105 26L55 112z" fill="#1f335c"/>' +
        '<path d="M62 108l98 24 98-24" fill="none" stroke="' + THREAD + '" stroke-width="1.8" stroke-dasharray="5 4"/>' +
        '<circle cx="160" cy="122" r="8" fill="' + LEATHER + '"/><circle cx="160" cy="122" r="3" fill="#8a4a20"/>';
    }
  };

  function svg(product) {
    var draw = shapes[product.shape] || shapes.pouch;
    return '<svg viewBox="0 0 320 250">' +
      '<ellipse cx="160" cy="232" rx="110" ry="8" fill="#16233f" fill-opacity=".16"/>' +
      draw("clip-" + product.id, product.tones || [0, 1, 2, 3]) + "</svg>";
  }

  return { svg: svg };
})();
