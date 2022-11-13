class SkipValidateError extends Error {

}

function required(message) {
  message = message || "此项必填";
  function requiredValidator(v) {
    if (v === undefined || v === "") {
      throw new Error(message);
    } else {
      return v;
    }
  }
  return requiredValidator;
}
function notRequired(v) {
  if (v === undefined || v === "") {
    return;
  } else {
    return v;
  }
}
function decode(v) {
  return JSON.parse(v);
}
function encode(v) {
  return JSON.stringify(v);
}
function number(v) {
  return Number(v);
}
let boolMap = {
  [true]: true,
  [false]: false,
  t: true,
  f: false,
  on: true,
  off: false,
  [1]: true,
  [0]: false,
  ["1"]: true,
  ["0"]: false,
  ["true"]: true,
  ["false"]: false,
  ["TRUE"]: true,
  ["FALSE"]: false,
  ["是"]: true,
  ["否"]: false,
};
function boolean(v) {
  let bv = boolMap[v];
  if (bv === undefined) {
    throw new Error(`invalid boolean value:${v}(${typeof v})`);
  } else {
    return bv;
  }
}
function booleanCn(v) {
  let bv = boolMap[v];
  if (bv === undefined) {
    throw new Error("请填“是”或“否”");
  } else if (bv === true) {
    return "是";
  } else {
    return "否";
  }
}
function asIs(v) {
  return v;
}
function string(v) {
  if (typeof v === "string") {
    return v;
  } else {
    throw new Error("string type required, not " + typeof v);
  }
}
function trim(v) {
  return v.trim()
}
function deleteSpaces(v) {
  return v.replace(/\s/g, '')
}
function maxlength(len, message) {
  message = message || "字数不能多于%s个";
  message = message.replace('%s', String(len))
  function maxlengthValidator(v) {
    if (v.length > len) {
      throw new Error(message);
    } else {
      return v;
    }
  }
  return maxlengthValidator;
}
function length(len, message) {
  message = message || "字数需等于%s个";
  message = message.replace('%s', String(len))
  function lengthValidator(v) {
    if (v.length !== len) {
      throw new Error(message);
    } else {
      return v;
    }
  }
  return lengthValidator;
}
function minlength(len, message) {
  message = message || "字数不能少于%s个";
  message = message.replace('%s', String(len))
  function minlengthValidator(v) {
    if (v.length < len) {
      throw new Error(message);
    } else {
      return v;
    }
  }
  return minlengthValidator;
}
function pattern(regex, message) {
  message = message || "格式错误";
  let re = new RegExp(regex)
  function patternValidator(v) {
    if (!re.test(v)) {
      throw new Error(message);
    } else {
      return v;
    }
  }
  return patternValidator;
}
function max(n, message) {
  message = message || "值不能大于%s";
  message = message.replace('%s', n)
  function maxValidator(v) {
    if (v > n) {
      throw new Error(message);
    } else {
      return v;
    }
  }
  return maxValidator;
}
function min(n, message) {
  message = message || "值不能小于%s";
  message = message.replace('%s', n)
  function minValidator(v) {
    if (v < n) {
      throw new Error(message);
    } else {
      return v;
    }
  }
  return minValidator;
}
function validDate(year, month, day) {
  if (month > 12 || month < 1) {
    throw new Error("月份数字" + (month + "错误"));
  }
  if (day > 31 || day < 1) {
    throw new Error("日期数字" + (day + "错误"));
  }
  if ((month === 4 || month === 6 || month === 9 || month === 11) && day > 30) {
    throw new Error(`${month}月只有30天`);
  } else if (month === 2) {
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      if (day > 29) {
        throw new Error("闰年2月最多29天");
      }
    } else if (day > 28) {
      throw new Error("普通年份2月最多28天");
    }
  } else if (day > 31) {
    throw new Error(`${month}月只有31天`);
  }
  return [year, month, day];
}
function date(v) {
  v = /^(\d{4})([^\d])(\d\d?)([^\d])(\d\d?)([^\d])?$/.exec(v)
  if (v) {
    validDate(
      Number(v[1]),
      Number(v[3]),
      Number(v[5])
    );
    return `${v[1]}-${v[3]}-${v[5]}`
  } else {
    throw new Error("日期格式错误, 正确格式举例: 2010-01-01");
  }
}
function time(v) {
  let m = /^(\d\d?):(\d\d?):(\d\d?)$/.exec(v)
  if (m) {
    let hour = Number(m[1]);
    if (hour > 24 || hour < 0) {
      throw new Error("小时数字" + (m[1] + "错误"));
    }
    let minute = Number(m[2]);
    if (minute > 60 || minute < 0) {
      throw new Error("分钟数字" + (m[2] + "错误"));
    }
    let second = Number(m[3]);
    if (second > 60 || second < 0) {
      throw new Error("秒数字" + (m[3] + "错误"));
    }
    return v;
  } else {
    throw new Error("时间格式错误, 正确格式举例: 01:30:00");
  }
}
function datetime(v) {
  v = /^(\d{4})([^\d])(\d\d?)(\2)(\d\d?) (\d\d?):(\d\d?):(\d\d?)(\+\d\d?)?$/.exec(v)
  if (v) {
    validDate(
      Number(v[1]),
      Number(v[3]),
      Number(v[5])
    );
    let hour = Number(v[6]);
    if (hour > 24 || hour < 0) {
      throw new Error("小时数字" + (v[6] + "错误"));
    }
    let minute = Number(v[7]);
    if (minute > 60 || minute < 0) {
      throw new Error("分钟数字" + (v[7] + "错误"));
    }
    let second = Number(v[8]);
    if (second > 60 || second < 0) {
      throw new Error("秒数字" + (v[8] + "错误"));
    }
    return `${v[1]}-${v[3]}-${v[5]} ${v[6]}:${v[7]}:${v[8]}`;
  } else {
    throw new Error("日期格式错误, 正确格式举例: 2010-01-01 01:30:00");
  }
}
function nonEmptyArrayRequired(message) {
  message = message || "此项必填";
  function arrayValidator(v) {
    if (v.length === 0) {
      throw new Error(message);
    } else {
      return v;
    }
  }
  return arrayValidator;
}
function integer(v) {
  let n = Number(v);
  if (!Number.isInteger(n)) {
    throw new Error("要求整数");
  } else {
    return n;
  }
}
let URL_REGEX = /^(https?:)?\/\/.*$/;
function url(v) {
  if (!URL_REGEX.test(v)) {
    throw new Error("错误链接格式");
  } else {
    return v;
  }
}
let a = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
let b = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
function validateSfzh(s) {
  let n = 0;
  for (let i = 0; i < 17; i = i + 1) {
    n = n + Number(s[i]) * a[i];
  }
  if (b[n % 11] === s[17]) {
    return s;
  } else {
    throw new Error("身份证号错误");
  }
}
function sfzh(v) {
  if (v.length !== 18) {
    throw new Error(`身份证号必须为18位，现在输入的是${v.length}位`);
  }
  v = v.toUpperCase();
  if (!/^\d{17}[\dX]$/.test(v)) {
    throw new Error("身份证号前17位必须为数字, 第18位必须为数字或大写字母X");
  }
  try {
    validDate(
      Number(v.slice(6, 10)),
      Number(v.slice(10, 12)),
      Number(v.slice(12, 14))
    );
  } catch (error) {
    throw new Error("身份证号日期部分错误:" + error.message);
  }
  return validateSfzh(v);
}

export default {
  SkipValidateError,
  required,
  notRequired,
  string,
  maxlength,
  minlength,
  length,
  max,
  min,
  pattern,
  nonEmptyArrayRequired,
  integer,
  url,
  encode,
  decode,
  number,
  asIs,
  date,
  datetime,
  time,
  trim,
  deleteSpaces,
  boolean,
  booleanCn,
  sfzh,
  validateSfzh,
  boolMap,
};