/**
 * Copyright (c) 2018-present, Elegant Themes, Inc.
 * Copyright (c) 2015-2018, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

export default () => (
  <span>
    <span id="feature-file-env-original-1">
      {process.env.DIVI_EXTENSION_ORIGINAL_1}
    </span>
    <span id="feature-file-env-original-2">
      {process.env.DIVI_EXTENSION_ORIGINAL_2}
    </span>
    <span id="feature-file-env">
      {process.env.DIVI_EXTENSION_DEVELOPMENT}
      {process.env.DIVI_EXTENSION_PRODUCTION}
    </span>
    <span id="feature-file-env-x">{process.env.DIVI_EXTENSION_X}</span>
  </span>
);
