export const getCookie = function(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
};

// convert ms to min:sec
export function msToMinAndSec(ms) {
    ms = (ms - ms % 1000) / 1000;
    var secs = ms % 60;
    ms = (ms - secs) / 60;
    var mins = ms % 60;
    return mins + ':' + ((Math.log(secs) * Math.LOG10E + 1 | 0) > 1 ? secs : "0" + secs);
}

export const getHashParams = () => {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
};

