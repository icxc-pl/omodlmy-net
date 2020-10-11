#!/usr/bin/env node

'use strict';

const finka = require('@bitbar/finka');
finka();

const App = require('./App');
new App().start();
