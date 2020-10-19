/*
Copyright 2020 OmiseGO Pte Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { assert, should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import * as Util from '../util';

should();
use(chaiAsPromised);

describe('common/util test', function () {
  it('prefixHex works as intended', function () {
    const unprefixed = 'foo';
    const result = Util.prefixHex(unprefixed);
    assert.equal(result, '0xfoo');

    const alreadyPrefixed = '0xbar';
    const result2 = Util.prefixHex(alreadyPrefixed);
    assert.equal(result2, alreadyPrefixed);
  });
});
