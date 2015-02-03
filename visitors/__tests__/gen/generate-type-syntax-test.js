/**
 * Copyright 2013 Facebook, Inc.
 *
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
 */

/*jshint evil:true*/

var tests = require("./../type-syntax-test");
var jstransform = require('../../../src/jstransform');
var visitors = require('../../type-syntax').visitorList;
var fs = require("fs");

var out = "/*\n";
out += "* WARNING: This file is autogenerated by visitors/__tests__/gen/generate-type-syntax-test.js\n";
out += "* Do NOT modify this file directly! Instead, add your tests to \n";
out += "* visitors/__tests__/type-syntax-test.js and run visitors/__tests__/gen/generate-type-syntax-test.js\n";
out += "*/\n\n";

function escape_content(content) {
  return content
    .replace(/[\\]/g, '\\\\')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t')
    .replace(/[']/g, "\\'");
}

out += "module.exports = {\n";
for (var section in tests) {
  out += "    '"+section+"': {\n";
  for (var test in tests[section]) {
    test = tests[section][test];
    out += "        '"+escape_content(test)+"': {\n";
    try {
      var transformed = jstransform.transform(visitors, test).code;
      out += "            raworiginal: '"+escape_content(test)+"',\n";
      out += "            transformed: '"+escape_content(transformed)+"',\n";
      try {
        eval(transformed);
        out += "            eval: 'No error',\n";
      } catch (e) {
        out += "            eval: '"+e.message+"',\n";
      }
    } catch (e) {
      out += "            error: '"+e.message+"',\n";
    }
    out += "\n";
    out += "        },\n";
  }
  out += "    },\n";
}
out += "};\n";

fs.writeFileSync(__dirname+'/type-syntax-test.rec.js', out);
console.log("Recorded type-syntax-test.js output into type-syntax-test.rec.js");
