'use strict'
import global from '../always-global/global.js'
import { Process } from '../iso-process/process.js'
import os from './os.js'
import { finishTest } from '../iso-test/index.js'
global.process = Process.getProcess()

if (os.homedir && os.homedir() === process.env.HOME) finishTest('pass homedir')
else finishTest('fail homedir')

// all passed! send kill to finishtest
finishTest('kill')
