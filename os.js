/* global location:false */
import global from '../always-global/global.js'
import { Process } from '../iso-process/process.js'
global.process = Process.getProcess()

export let os

export class Os {
  constructor (options) {
    options = options || {}
    if (options.endianness) process.env.ENDIAN = options.endianness
    if (options.loadavg) this.loadavg = options.loadavg.bind(this)
    if (options.uptime) this.uptime = options.uptime.bind(this)
    if (options.freemem) this.freemem = options.freemem.bind(this)
    if (options.totalmem) this.totalmem = options.totalmem.bind(this)
    if (options.cpus) this.cpus = options.cpus.bind(this)
    if (options.release) this.release = options.release.bind(this)
    if (options.hostname) this.hostname = options.hostname.bind(this)
    if (options.networkInterfaces) this.networkInterfaces = options.networkInterfaces.bind(this)
    if (options.getNetworkInterfaces) this.getNetworkInterfaces = options.getNetworkInterfaces.bind(this)
    if (options.platform) this.platform = options.platform.bind(this)
    if (options.type) this.type = options.type.bind(this)
    if (options.userInfo) this.userInfo = options.userInfo.bind(this)
    if (options.tmpDir) this.tmpDir = options.tmpDir.bind(this)
    if (options.constants) this.constants = options.constants
    if (options.arch) this.arch = options.arch.bind(this)
    // Screw the others!
    this.EOL = '\n'
    this.constants = options.constants || {
      'UV_UDP_REUSEADDR': 4,
      'dlopen': {
        'RTLD_LAZY': 1,
        'RTLD_NOW': 2,
        'RTLD_GLOBAL': 256,
        'RTLD_LOCAL': 0,
        'RTLD_DEEPBIND': 8
      },
      'errno': {
        'E2BIG': 7,
        'EACCES': 13,
        'EADDRINUSE': 98,
        'EADDRNOTAVAIL': 99,
        'EAFNOSUPPORT': 97,
        'EAGAIN': 11,
        'EALREADY': 114,
        'EBADF': 9,
        'EBADMSG': 74,
        'EBUSY': 16,
        'ECANCELED': 125,
        'ECHILD': 10,
        'ECONNABORTED': 103,
        'ECONNREFUSED': 111,
        'ECONNRESET': 104,
        'EDEADLK': 35,
        'EDESTADDRREQ': 89,
        'EDOM': 33,
        'EDQUOT': 122,
        'EEXIST': 17,
        'EFAULT': 14,
        'EFBIG': 27,
        'EHOSTUNREACH': 113,
        'EIDRM': 43,
        'EILSEQ': 84,
        'EINPROGRESS': 115,
        'EINTR': 4,
        'EINVAL': 22,
        'EIO': 5,
        'EISCONN': 106,
        'EISDIR': 21,
        'ELOOP': 40,
        'EMFILE': 24,
        'EMLINK': 31,
        'EMSGSIZE': 90,
        'EMULTIHOP': 72,
        'ENAMETOOLONG': 36,
        'ENETDOWN': 100,
        'ENETRESET': 102,
        'ENETUNREACH': 101,
        'ENFILE': 23,
        'ENOBUFS': 105,
        'ENODATA': 61,
        'ENODEV': 19,
        'ENOENT': 2,
        'ENOEXEC': 8,
        'ENOLCK': 37,
        'ENOLINK': 67,
        'ENOMEM': 12,
        'ENOMSG': 42,
        'ENOPROTOOPT': 92,
        'ENOSPC': 28,
        'ENOSR': 63,
        'ENOSTR': 60,
        'ENOSYS': 38,
        'ENOTCONN': 107,
        'ENOTDIR': 20,
        'ENOTEMPTY': 39,
        'ENOTSOCK': 88,
        'ENOTSUP': 95,
        'ENOTTY': 25,
        'ENXIO': 6,
        'EOPNOTSUPP': 95,
        'EOVERFLOW': 75,
        'EPERM': 1,
        'EPIPE': 32,
        'EPROTO': 71,
        'EPROTONOSUPPORT': 93,
        'EPROTOTYPE': 91,
        'ERANGE': 34,
        'EROFS': 30,
        'ESPIPE': 29,
        'ESRCH': 3,
        'ESTALE': 116,
        'ETIME': 62,
        'ETIMEDOUT': 110,
        'ETXTBSY': 26,
        'EWOULDBLOCK': 11,
        'EXDEV': 18
      },
      'signals': {
        'SIGHUP': 1,
        'SIGINT': 2,
        'SIGQUIT': 3,
        'SIGILL': 4,
        'SIGTRAP': 5,
        'SIGABRT': 6,
        'SIGIOT': 6,
        'SIGBUS': 7,
        'SIGFPE': 8,
        'SIGKILL': 9,
        'SIGUSR1': 10,
        'SIGSEGV': 11,
        'SIGUSR2': 12,
        'SIGPIPE': 13,
        'SIGALRM': 14,
        'SIGTERM': 15,
        'SIGCHLD': 17,
        'SIGSTKFLT': 16,
        'SIGCONT': 18,
        'SIGSTOP': 19,
        'SIGTSTP': 20,
        'SIGTTIN': 21,
        'SIGTTOU': 22,
        'SIGURG': 23,
        'SIGXCPU': 24,
        'SIGXFSZ': 25,
        'SIGVTALRM': 26,
        'SIGPROF': 27,
        'SIGWINCH': 28,
        'SIGIO': 29,
        'SIGPOLL': 29,
        'SIGPWR': 30,
        'SIGSYS': 31,
        'SIGUNUSED': 31
      },
      'priority': {
        'PRIORITY_LOW': 19,
        'PRIORITY_BELOW_NORMAL': 10,
        'PRIORITY_NORMAL': 0,
        'PRIORITY_ABOVE_NORMAL': -7,
        'PRIORITY_HIGH': -14,
        'PRIORITY_HIGHEST': -20
      }
    }
  }

  arch () {
    return process.arch
  }

  endianness () {
    if (typeof process.env.ENDIAN === 'undefined') {
      var a = new ArrayBuffer(2)
      var b = new Uint8Array(a)
      var c = new Uint16Array(a)
      b[0] = 1
      b[1] = 2
      if (c[0] === 258) {
        process.env.ENDIAN = 'BE'
      } else if (c[0] === 513) {
        process.env.ENDIAN = 'LE'
      } else {
        throw new Error('unable to figure out endianess')
      }
    }
    return process.env.ENDIAN
  }

  uptime () {
    return process.uptime || 0
  }

  loadavg () {
    return []
  }

  freemem () {
    return Number.MAX_VALUE
  }

  totalmem () {
    return Number.MAX_VALUE
  }

  cpus () {
    return []
  }

  release () {
    if (typeof navigator !== 'undefined') {
      return navigator.appVersion
    }
    return ''
  }

  homedir () {
    return process.env.HOME
  }

  hostname () {
    if (typeof location !== 'undefined') {
      return location.hostname
    } else return process.env.USER
  }

  networkInterfaces () {}
  getNetworkInterfaces () {}

  type () {
    return {
      'linux': 'Linux',
      'freebsd': 'FreeBSD',
      'openbsd': 'OpenBSD',
      'sunos': 'SunOS',
      'aix': 'AIX',
      'win32': 'Windows_NT',
      'android': 'Linux',
      'darwin': 'Darwin'
    }[process.platform]
  }

  userInfo (options) {
    return {
      username: process.env.USER,
      uid: -1,
      gid: -1,
      homedir: process.env.HOME
    }
  }

  tmpDir () {
    return '/tmp'
  }
}

if (process.release && process.release.name === 'node' && typeof (require) !== 'undefined') {
  // use official os lib
  os = require('os')
  if (!(os instanceof Os)) os = new Os(os)
} else {
  os = new Os()
}
export const homedir = os.homedir
export const tmpdir = os.tmpdir
export const hostname = os.hostname
export const endianness = os.endianness
export const constants = os.constants
export default os
