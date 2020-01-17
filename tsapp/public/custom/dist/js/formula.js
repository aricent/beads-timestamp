function ADD() {
					var output = 0;
					try {
						for(let eachArgument of arguments) {
							output += parseInt(eachArgument);
						}
						return output;						
					} catch(e) {
						return 'ACODEFAILURE';
					}
				}

function SUBTRACT() {
  var output = 0;
  try {
    for(let eachArgument of arguments) {
      output -= parseInt(eachArgument);
    }
    return output;						
  } catch(e) {
    return 'ACODEFAILURE';
  }
}

function MULTIPLY() {
					var output = 1;
					try {
						for(let eachArgument of arguments) {
							output *= parseInt(eachArgument);
						}
						return output;						
					} catch(e) {
						return 'ACODEFAILURE';
					}
				}

function DIVIDE(V1, V2) {
  var output = 0;
  try {
    return V1/V2;						
  } catch(e) {
    return 'ACODEFAILURE';
  }
}

function CONCATENATE(ARR) {
  var output = '';
  try {
    for(let eachArgument of ARR) {
      output += eachArgument.toString();
    }
    return output;						
  } catch(e) {
    return 'ACODEFAILURE';
  }
}

function DATEDIFF(ARR) {
  function parseMillisecondsIntoReadableTime(milliseconds){
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
    return h + ':' + m + ':' + s;
  }
    try {
      var DATE1 = new Date(ARR[0]);
      var DATE2 = new Date(ARR[1]);
      if( DATE1 < DATE2)
        return parseMillisecondsIntoReadableTime(DATE2 - DATE1);
      else
        return parseMillisecondsIntoReadableTime(DATE1 - DATE2);
    } catch(e) {
      return 'ACODEFAILURE';
    }
  }	

function CUMILATIVETIMEADD(ARR) {
  try {
    var times = [ 0, 0, 0 ]
    var max = times.length
    var a = (ARR[0] || '').split(':')
    var b = (ARR[1] || '').split(':')
    // normalize time values
    for (var i = 0; i < max; i++) {
      a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
      b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
    }
    // store time values
    for (var i = 0; i < max; i++) {
      times[i] = a[i] + b[i]
    }
    var hours = times[0]
    var minutes = times[1]
    var seconds = times[2]
    if (seconds >= 60) {
      var m = (seconds / 60) << 0
      minutes += m
      seconds -= 60 * m
    }
    if (minutes >= 60) {
      var h = (minutes / 60) << 0
      hours += h
      minutes -= 60 * h
    }
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
  } catch(e) {
    return 'ACODEFAILURE';
  }
}	

function FLOOR() {
  try {
    return Math.floor(...arguments);
  } catch(e) {
    return 'ACODEFAILURE';
  }
}

function CEILING() {
  try {
    return Math.ceil(...arguments);
  } catch(e) {
    return 'ACODEFAILURE';
  }
}

function ABS() {
  try {
    return Math.abs(...arguments);
  } catch(e) {
    return 'ACODEFAILURE';
  }
}

function MAX() {
  try {
    return Math.max(...arguments);
  } catch(e) {
    return 'ACODEFAILURE';
  }
}

function MIN() {
    try {
      return Math.min(...arguments);
    } catch(e) {
      return 'ACODEFAILURE';
    }
  }
