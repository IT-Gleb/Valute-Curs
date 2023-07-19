//Модуль для обработки xml-запроса для выборки валюты за период

export const XMLModule = {
  namespaced: true,
  state: () => {
    const paramObj = {
      fromDate: new Date(Date.now()),
      toDate: new Date(Date.now()),
      valuteCode: "R01235",
      Nominal: 1,
      valuteName: "Доллар США",
    };
    const proxyURL = "https://cors-anywhere.herokuapp.com/";
    let xmlUrl =
      proxyURL +
      `https://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=01/04/2023&date_req2=30/04/2023&VAL_NM_RQ=R01235`;
    let isLoadData = false;
    const DataValute = { data: [] };

    return { paramObj, proxyURL, xmlUrl, isLoadData, DataValute };
  },
  getters: {
    GET_IS_LOAD_DATA: (state) => {
      return state.isLoadData;
    },
    GET_PARAM: (state) => {
      return state.paramObj;
    },
    GET_DATA: (state) => {
      return state.DataValute.data;
    },
    GET_DATA_LENGTH: (state) => {
      return state.DataValute.data.length;
    },
  },
  mutations: {
    SET_PARAM_OBJ: (state, paramObj) => {
      state.paramObj = Object.assign({}, paramObj);
      // console.log(state.paramObj);
    },
    SET_PARAM_URL: (state) => {
      let tmpURL =
        state.proxyURL +
        `https://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${state.paramObj.fromDate}&date_req2=${state.paramObj.toDate}&VAL_NM_RQ=${state.paramObj.valuteCode}`;
      state.xmlUrl = tmpURL;
    },
    SET_DATA: (state, data) => {
      if (Array.isArray(data) && data.length > 0)
        state.DataValute.data = Array.from(data);
    },
  },
  actions: {
    UPDATE_PARAM_VALUE: ({ commit }, paramObj) => {
      commit("SET_PARAM_OBJ", paramObj);
    },

    GET_XML_DATA: async ({ state, commit }) => {
      commit("SET_PARAM_URL");

      state.isLoadData = true;

      let xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status === 200) {
          let ResponseText = xmlHttp.responseText;
          let doc = undefined;
          let parser = new DOMParser();
          doc = parser.parseFromString(ResponseText, "application/xml");
          let ResponseJson = doc.querySelectorAll("Record");
          let ParsedArray = [];

          let tempParsedArray = [];
          tempParsedArray = Array.prototype.slice.call(ResponseJson);
          //          console.log(tempParsedArray);
          tempParsedArray.forEach((element) => {
            let t_obj = {};
            // t_obj.Code = state.paramObj.valuteCode;
            if (element.hasChildNodes()) {
              if (element.hasAttribute("Date")) {
                t_obj.Date = element.getAttribute("Date");
              }

              let tmp = element.lastChild.textContent;
              tmp = String(tmp).replace(",", ".");
              t_obj.Value = parseFloat(tmp).toFixed(2);
              //t_obj.Value = element.lastChild.nodeValue;
              ParsedArray.push(t_obj);
            }
          });
          commit("SET_DATA", ParsedArray);
          state.isLoadData = false;
          // console.log(
          //   state.paramObj.valuteName,
          //   state.DataValute.data
          //   // ParsedArray.length
          // );
        }
      };
      //Дальше
      xmlHttp.open("GET", state.xmlUrl, true);
      xmlHttp.setRequestHeader("Accept", "*/*");
      xmlHttp.setRequestHeader("Mode", "no-cors");
      xmlHttp.setRequestHeader("Content-Type", "application/xml");
      xmlHttp.send();
    },
  },
};
