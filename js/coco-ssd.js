/**
 * @license
 * Copyright 2023 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
!(function (e, a) {
  "object" == typeof exports && "undefined" != typeof module
    ? a(
        exports,
        require("@tensorflow/tfjs-converter"),
        require("@tensorflow/tfjs-core")
      )
    : "function" == typeof define && define.amd
    ? define(
        ["exports", "@tensorflow/tfjs-converter", "@tensorflow/tfjs-core"],
        a
      )
    : a(((e = e || self).cocoSsd = e.cocoSsd || {}), e.tf, e.tf);
})(this, function (e, a, i) {
  "use strict";
  function n(e, a, i, n) {
    return new (i || (i = Promise))(function (t, m) {
      function d(e) {
        try {
          o(n.next(e));
        } catch (e) {
          m(e);
        }
      }
      function s(e) {
        try {
          o(n.throw(e));
        } catch (e) {
          m(e);
        }
      }
      function o(e) {
        var a;
        e.done
          ? t(e.value)
          : ((a = e.value),
            a instanceof i
              ? a
              : new i(function (e) {
                  e(a);
                })).then(d, s);
      }
      o((n = n.apply(e, a || [])).next());
    });
  }
  function t(e, a) {
    var i,
      n,
      t,
      m,
      d = {
        label: 0,
        sent: function () {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      };
    return (
      (m = { next: s(0), throw: s(1), return: s(2) }),
      "function" == typeof Symbol &&
        (m[Symbol.iterator] = function () {
          return this;
        }),
      m
    );
    function s(m) {
      return function (s) {
        return (function (m) {
          if (i) throw new TypeError("Generator is already executing.");
          for (; d; )
            try {
              if (
                ((i = 1),
                n &&
                  (t =
                    2 & m[0]
                      ? n.return
                      : m[0]
                      ? n.throw || ((t = n.return) && t.call(n), 0)
                      : n.next) &&
                  !(t = t.call(n, m[1])).done)
              )
                return t;
              switch (((n = 0), t && (m = [2 & m[0], t.value]), m[0])) {
                case 0:
                case 1:
                  t = m;
                  break;
                case 4:
                  return d.label++, { value: m[1], done: !1 };
                case 5:
                  d.label++, (n = m[1]), (m = [0]);
                  continue;
                case 7:
                  (m = d.ops.pop()), d.trys.pop();
                  continue;
                default:
                  if (
                    !((t = d.trys),
                    (t = t.length > 0 && t[t.length - 1]) ||
                      (6 !== m[0] && 2 !== m[0]))
                  ) {
                    d = 0;
                    continue;
                  }
                  if (3 === m[0] && (!t || (m[1] > t[0] && m[1] < t[3]))) {
                    d.label = m[1];
                    break;
                  }
                  if (6 === m[0] && d.label < t[1]) {
                    (d.label = t[1]), (t = m);
                    break;
                  }
                  if (t && d.label < t[2]) {
                    (d.label = t[2]), d.ops.push(m);
                    break;
                  }
                  t[2] && d.ops.pop(), d.trys.pop();
                  continue;
              }
              m = a.call(e, d);
            } catch (e) {
              (m = [6, e]), (n = 0);
            } finally {
              i = t = 0;
            }
          if (5 & m[0]) throw m[1];
          return { value: m[0] ? m[1] : void 0, done: !0 };
        })([m, s]);
      };
    }
  }
  var m = {
    1: { name: "/m/01g317", id: 1, displayName: "người" },
    2: { name: "/m/0199g", id: 2, displayName: "xe đạp" },
    3: { name: "/m/0k4j", id: 3, displayName: "xe hơi" },
    4: { name: "/m/04_sv", id: 4, displayName: "xe mô tô" },
    5: { name: "/m/05czz6l", id: 5, displayName: "máy bay" },
    6: { name: "/m/01bjv", id: 6, displayName: "xe buýt" },
    7: { name: "/m/07jdr", id: 7, displayName: "tàu hỏa" },
    8: { name: "/m/07r04", id: 8, displayName: "xe tải" },
    9: { name: "/m/019jd", id: 9, displayName: "thuyền" },
    10: { name: "/m/015qff", id: 10, displayName: "đèn giao thông" },
    11: { name: "/m/01pns0", id: 11, displayName: "trụ cứu hỏa" },
    13: { name: "/m/02pv19", id: 13, displayName: "biển báo dừng" },
    14: { name: "/m/015qbp", id: 14, displayName: "máy tính tiền bãi đậu xe" },
    15: { name: "/m/0cvnqh", id: 15, displayName: "ghế băng" },
    16: { name: "/m/015p6", id: 16, displayName: "chim" },
    17: { name: "/m/01yrx", id: 17, displayName: "mèo" },
    18: { name: "/m/0bt9lr", id: 18, displayName: "chó" },
    19: { name: "/m/03k3r", id: 19, displayName: "ngựa" },
    20: { name: "/m/07bgp", id: 20, displayName: "cừu" },
    21: { name: "/m/01xq0k1", id: 21, displayName: "bò" },
    22: { name: "/m/0bwd_0j", id: 22, displayName: "voi" },
    23: { name: "/m/01dws", id: 23, displayName: "gấu" },
    24: { name: "/m/0898b", id: 24, displayName: "ngựa vằn" },
    25: { name: "/m/03bk1", id: 25, displayName: "hươu cao cổ" },
    27: { name: "/m/01940j", id: 27, displayName: "ba lô" },
    28: { name: "/m/0hnnb", id: 28, displayName: "dù" },
    31: { name: "/m/080hkjn", id: 31, displayName: "túi xách" },
    32: { name: "/m/01rkbr", id: 32, displayName: "cà vạt" },
    33: { name: "/m/01s55n", id: 33, displayName: "va li" },
    34: { name: "/m/02wmf", id: 34, displayName: "đĩa ném" },
    35: { name: "/m/071p9", id: 35, displayName: "ván trượt tuyết" },
    36: { name: "/m/06__v", id: 36, displayName: "ván trượt tuyết" },
    37: { name: "/m/018xm", id: 37, displayName: "bóng thể thao" },
    38: { name: "/m/02zt3", id: 38, displayName: "diều" },
    39: { name: "/m/03g8mr", id: 39, displayName: "gậy bóng chày" },
    40: { name: "/m/03grzl", id: 40, displayName: "găng tay bóng chày" },
    41: { name: "/m/06_fw", id: 41, displayName: "ván trượt" },
    42: { name: "/m/019w40", id: 42, displayName: "ván lướt sóng" },
    43: { name: "/m/0dv9c", id: 43, displayName: "vợt tennis" },
    44: { name: "/m/04dr76w", id: 44, displayName: "chai" },
    46: { name: "/m/09tvcd", id: 46, displayName: "ly rượu" },
    47: { name: "/m/08gqpm", id: 47, displayName: "tách" },
    48: { name: "/m/0dt3t", id: 48, displayName: "nĩa" },
    49: { name: "/m/04ctx", id: 49, displayName: "dao" },
    50: { name: "/m/0cmx8", id: 50, displayName: "muỗng" },
    51: { name: "/m/04kkgm", id: 51, displayName: "tô" },
    52: { name: "/m/09qck", id: 52, displayName: "chuối" },
    53: { name: "/m/014j1m", id: 53, displayName: "táo" },
    54: { name: "/m/0l515", id: 54, displayName: "bánh sandwich" },
    55: { name: "/m/0cyhj_", id: 55, displayName: "cam" },
    56: { name: "/m/0hkxq", id: 56, displayName: "bông cải xanh" },
    57: { name: "/m/0fj52s", id: 57, displayName: "cà rốt" },
    58: { name: "/m/01b9xk", id: 58, displayName: "bánh mì kẹp xúc xích" },
    59: { name: "/m/0663v", id: 59, displayName: "pizza" },
    60: { name: "/m/0jy4k", id: 60, displayName: "bánh vòng" },
    61: { name: "/m/0fszt", id: 61, displayName: "bánh" },
    62: { name: "/m/01mzpv", id: 62, displayName: "ghế" },
    63: { name: "/m/02crq1", id: 63, displayName: "ghế dài" },
    64: { name: "/m/03fp41", id: 64, displayName: "chậu cây" },
    65: { name: "/m/03ssj5", id: 65, displayName: "giường" },
    67: { name: "/m/04bcr3", id: 67, displayName: "bàn ăn" },
    70: { name: "/m/09g1w", id: 70, displayName: "bồn cầu" },
    72: { name: "/m/07c52", id: 72, displayName: "tivi" },
    73: { name: "/m/01c648", id: 73, displayName: "laptop" },
    74: { name: "/m/020lf", id: 74, displayName: "chuột" },
    75: { name: "/m/0qjjc", id: 75, displayName: "điều khiển" },
    76: { name: "/m/01m2v", id: 76, displayName: "bàn phím" },
    77: { name: "/m/050k8", id: 77, displayName: "điện thoại di động" },
    78: { name: "/m/0fx9l", id: 78, displayName: "lò vi sóng" },
    79: { name: "/m/029bxz", id: 79, displayName: "lò nướng" },
    80: { name: "/m/01k6s3", id: 80, displayName: "máy nướng bánh mì" },
    81: { name: "/m/0130jx", id: 81, displayName: "bồn rửa" },
    82: { name: "/m/040b_t", id: 82, displayName: "tủ lạnh" },
    84: { name: "/m/01b638", id: 84, displayName: "sách" },
    85: { name: "/m/0h8n5zk", id: 85, displayName: "đồng hồ" },
    86: { name: "/m/068zj", id: 86, displayName: "bình hoa" },
    87: { name: "/m/0dj6p", id: 87, displayName: "kéo" },
    88: { name: "/m/09ddx", id: 88, displayName: "gấu bông" },
    89: { name: "/m/01f91_", id: 89, displayName: "máy sấy tóc" },
    90: { name: "/m/03wvsk", id: 90, displayName: "bàn chải đánh răng" },
};

  var d = (function () {
    function e(e, a) {
      this.modelPath =
        a ||
        ""
          .concat("https://storage.googleapis.com/tfjs-models/savedmodel/")
          .concat(this.getPrefix(e), "/model.json");
    }
    return (
      (e.prototype.getPrefix = function (e) {
        return "lite_mobilenet_v2" === e ? "ssd".concat(e) : "ssd_".concat(e);
      }),
      (e.prototype.load = function () {
        return n(this, void 0, void 0, function () {
          var e, n, m;
          return t(this, function (t) {
            switch (t.label) {
              case 0:
                return (e = this), [4, a.loadGraphModel(this.modelPath)];
              case 1:
                return (
                  (e.model = t.sent()),
                  (n = i.zeros([1, 300, 300, 3], "int32")),
                  [4, this.model.executeAsync(n)]
                );
              case 2:
                return (
                  (m = t.sent()),
                  [
                    4,
                    Promise.all(
                      m.map(function (e) {
                        return e.data();
                      })
                    ),
                  ]
                );
              case 3:
                return (
                  t.sent(),
                  m.map(function (e) {
                    return e.dispose();
                  }),
                  n.dispose(),
                  [2]
                );
            }
          });
        });
      }),
      (e.prototype.infer = function (e, a, m) {
        return n(this, void 0, void 0, function () {
          var n, d, s, o, r, l, p, c, y, u, f, b;
          return t(this, function (t) {
            switch (t.label) {
              case 0:
                return (
                  (n = i.tidy(function () {
                    return (
                      e instanceof i.Tensor || (e = i.browser.fromPixels(e)),
                      i.expandDims(e)
                    );
                  })),
                  (d = n.shape[1]),
                  (s = n.shape[2]),
                  [4, this.model.executeAsync(n)]
                );
              case 1:
                return (
                  (o = t.sent()),
                  (r = o[0].dataSync()),
                  (l = o[1].dataSync()),
                  n.dispose(),
                  i.dispose(o),
                  (p = this.calculateMaxScores(
                    r,
                    o[0].shape[1],
                    o[0].shape[2]
                  )),
                  (c = p[0]),
                  (y = p[1]),
                  (u = i.getBackend()),
                  "webgl" === i.getBackend() && i.setBackend("cpu"),
                  (f = i.tidy(function () {
                    var e = i.tensor2d(l, [o[1].shape[1], o[1].shape[3]]);
                    return i.image.nonMaxSuppression(e, c, a, m, m);
                  })),
                  (b = f.dataSync()),
                  f.dispose(),
                  u !== i.getBackend() && i.setBackend(u),
                  [2, this.buildDetectedObjects(s, d, l, c, b, y)]
                );
            }
          });
        });
      }),
      (e.prototype.buildDetectedObjects = function (e, a, i, n, t, d) {
        for (var s = t.length, o = [], r = 0; r < s; r++) {
          for (var l = [], p = 0; p < 4; p++) l[p] = i[4 * t[r] + p];
          var c = l[0] * a,
            y = l[1] * e,
            u = l[2] * a,
            f = l[3] * e;
          (l[0] = y),
            (l[1] = c),
            (l[2] = f - y),
            (l[3] = u - c),
            o.push({
              bbox: l,
              class: m[d[t[r]] + 1].displayName,
              score: n[t[r]],
            });
        }
        return o;
      }),
      (e.prototype.calculateMaxScores = function (e, a, i) {
        for (var n = [], t = [], m = 0; m < a; m++) {
          for (var d = Number.MIN_VALUE, s = -1, o = 0; o < i; o++)
            e[m * i + o] > d && ((d = e[m * i + o]), (s = o));
          (n[m] = d), (t[m] = s);
        }
        return [n, t];
      }),
      (e.prototype.detect = function (e, a, i) {
        return (
          void 0 === a && (a = 20),
          void 0 === i && (i = 0.5),
          n(this, void 0, void 0, function () {
            return t(this, function (n) {
              return [2, this.infer(e, a, i)];
            });
          })
        );
      }),
      (e.prototype.dispose = function () {
        null != this.model && this.model.dispose();
      }),
      e
    );
  })();
  (e.ObjectDetection = d),
    (e.load = function (e) {
      return (
        void 0 === e && (e = {}),
        n(this, void 0, void 0, function () {
          var a, n, m;
          return t(this, function (t) {
            switch (t.label) {
              case 0:
                if (null == i)
                  throw new Error(
                    "Cannot find TensorFlow.js. If you are using a <script> tag, please also include @tensorflow/tfjs on the page before using this model."
                  );
                if (
                  ((a = e.base || "lite_mobilenet_v2"),
                  (n = e.modelUrl),
                  -1 ===
                    [
                      "mobilenet_v1",
                      "mobilenet_v2",
                      "lite_mobilenet_v2",
                    ].indexOf(a))
                )
                  throw new Error(
                    "ObjectDetection constructed with invalid base model " +
                      "".concat(a, ". Valid names are 'mobilenet_v1',") +
                      " 'mobilenet_v2' and 'lite_mobilenet_v2'."
                  );
                return [4, (m = new d(a, n)).load()];
              case 1:
                return t.sent(), [2, m];
            }
          });
        })
      );
    }),
    (e.version = "2.2.3"),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
//# sourceMappingURL=coco-ssd.min.js.map
