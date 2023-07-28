export const backColors = [
  "#e3f2fd",
  "#bbdefb",
  "#90caf9",
  "#f57c00",
  "#64b5f6",
  "#42a5f5",
  "#2196f3",
  "#00bcd4",
  "#1e88e5",
  "#1976d2",
  "#1565c0",
  "#0d47a1",
  "#82b1ff",
  "#ff8f00",
  "#448aff",
  "#2979ff",
  "#2962ff",
  "#e1f5fe",
  "#b3e5fc",
  "#81d4fa",
  "#1de9b6",
  "#cddc39",
  "#4fc3f7",
  "#29b6f6",
  "#03a9f4",
  "#039be5",
  "#0288d1",
  "#01579b",
  "#0277bd",
  "#00bfa5",
];

export function FormatDateTime_Long(paramDate) {
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Moscow",
  };

  //console.log(dt);
  let res = new Intl.DateTimeFormat("ru-RU", options).format(paramDate);
  return res;
}

export function randomInteger(min, max) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

export function FormatCurrency(paramCurrency) {
  let options = {
    // style: "currency",
    // currency: "RUB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  let res = new Intl.NumberFormat("ru-RU", options).format(paramCurrency);
  return res;
}

//Добавляет в массив обьектов свойство Selected для каждого обьекта если второй параметр = true
export function ArrayFromObject(paramObj, paramAddSelected = false) {
  let o_keys = Object.keys(paramObj);
  let res = [];
  if (o_keys.length > 0) {
    o_keys.forEach((item) => {
      if (paramAddSelected) paramObj[item].Selected = false;
      res.push(paramObj[item]);
    });
  }

  return res;
}

/**
* Сортировка массива по нескольким полям
*
// *@param {Array} keys массив ключей приоритетов сортировки, от большего к меньшему
* sortByMultipleKey(["Name", "Value", "Previous"])
*/
export function sortByMultipleKey(keys) {
  return function (a, b) {
    if (keys.length == 0) return 0;
    let key = keys[0];
    if (a[key] < b[key]) return -1;
    else if (a[key] > b[key]) return 1;
    else return sortByMultipleKey(keys.slice(1))(a, b);
  };
}

export function isObject_empty(paramObj) {
  if (typeof paramObj === "object") {
    let o_keys = Object.keys(paramObj);
    if (o_keys.length > 0) {
      return false;
    } else {
      return true;
    }
  } else return true;
}

export function getDateNow() {
  let current = new Date(Date.now());
  let res =
    String(current.getFullYear()) +
    "-" +
    String(current.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(current.getDate()).padStart(2, "0");
  return res;
}

export function setDateValue(paramDate) {
  let current = new Date(paramDate);
  let res =
    String(current.getFullYear()) +
    "-" +
    String(current.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(current.getDate()).padStart(2, "0");
  return res;
}

export function getAverageFromArray(paramArray) {
  let res = 0;
  if (Array.isArray(paramArray) && paramArray.length > 0) {
    //console.log(paramArray);
    res = paramArray.reduce((currentSum, currentItem) => {
      return currentSum + Number(currentItem);
    }, 0);
    res = (res / paramArray.length).toFixed(2);
    //console.log(res);
  }

  return res;
}

export function getMedianFromArray(paramArray) {
  let res = 0;
  let tmp_a = [];
  let isChetnoe = false;
  let index1 = -1;
  let index2 = -1;
  let workArray = [];

  if (Array.isArray(paramArray) && paramArray.length > 0) {
    workArray = paramArray.slice(0);
    //Отсортировать массив
    tmp_a = workArray.sort((a, b) => {
      if (a - b > b - a) return 1;
      else return -1;
    });
    //    console.log(tmp_a);
    if (workArray.length < 2) {
      res = parseFloat(workArray[0]).toFixed(2);
      return res;
    }
    //Проверить на четное/нечетное
    isChetnoe = tmp_a.length % 2 === 0 ? true : false;
    //console.log(isChetnoe);
    let a, b;
    if (isChetnoe) {
      //index1 = Math.floor(tmp_a.length / 2);
      index1 = tmp_a.length >> 1;
      if (index1 < 0) index1 = 0;
      index2 = index1 + 1;
      if (index2 > workArray.length - 1) index2 = workArray.length - 1;
      a = parseFloat(tmp_a[index1]).toFixed(2);
      b = parseFloat(tmp_a[index2]).toFixed(2);

      //console.log(tmp_a.length, index1, index2, a, b);

      res = parseFloat((Number(a) + Number(b)) / 2).toFixed(2);
    } else {
      //index1 = Math.floor(tmp_a.length / 2);
      index1 = tmp_a.length >> 1;
      res = parseFloat(tmp_a[index1]).toFixed(2);
      //console.log(tmp_a.length, index1, res);
    }
    //    console.log(tmp_a, tmp_a.length);
  }

  return res;
}
