//Модуль обработки xml-запроса для выборки валюты за период

import axios from "axios";

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

      tmpURL = `php_x/cbr_xml.php?currency=abc&dt1=${state.paramObj.fromDate}&dt2=${state.paramObj.toDate}&id=${state.paramObj.valuteCode}`;

      state.xmlUrl = tmpURL;
    },
    SET_DATA: (state, data) => {
      if (Array.isArray(data) && data.length > 0)
        state.DataValute.data = Array.from(data);
    },
    SET_LOAD_DATA: (state, flag = false) => {
      state.isLoadData = flag;
    },
  },
  actions: {
    UPDATE_PARAM_VALUE: ({ commit }, paramObj) => {
      commit("SET_PARAM_OBJ", paramObj);
    },

    GET_XML_DATA: async ({ state, commit }) => {
      commit("SET_PARAM_URL");

      commit("SET_LOAD_DATA", true);

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
          commit("SET_LOAD_DATA", false);
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
      xmlHttp.setRequestHeader("mode", "no-cors");
      xmlHttp.setRequestHeader("Content-Type", "application/xml");
      xmlHttp.send();
    },
    GET_DATA_XML_AXIOS: async ({ state, commit }) => {
      commit("SET_PARAM_URL");
      commit("SET_LOAD_DATA", true);
      let url = state.xmlUrl;

      // console.log(url);

      const options = {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/xml",
          Accept: "*",
          mode: "no-cors",
        },
        withCredentials: false,
        responseType: "document",
        // onDownloadProgress: (event) => {
        //   console.log(event);
        // },
      };
      let myres, ResultArray;
      await axios
        .get(url, options)
        .then((response) => {
          myres = response.data;
        })
        .catch((error) => {
          commit("SET_LOAD_DATA", false);
          console.log(error);
        });
      if (myres) {
        let tmp_o = {};
        let responseXML = myres.querySelectorAll("Record");
        if (responseXML && responseXML.length > 0) {
          ResultArray = [];
          for (let i = 0; i < responseXML.length; i++) {
            let dt1, nominal, value;
            tmp_o = {};
            if (responseXML.item(i).hasAttribute("Date")) {
              dt1 = responseXML.item(i).getAttribute("Date");
            }
            //console.log(responseXML.item(i));
            if (responseXML.item(i).hasChildNodes) {
              nominal = responseXML.item(i).childNodes[0].textContent;
              let v = responseXML.item(i).childNodes[1].textContent;
              v = String(v).replace(",", ".").padEnd(2, "0");
              value = Number(v).toFixed(2);
            }
            tmp_o.Date = dt1;
            tmp_o.Value = value;
            tmp_o.Nominal = nominal;
            ResultArray.push(tmp_o);

            // console.log(dt1, nominal, value);
          }
        }
      }

      if (ResultArray && ResultArray.length > 0)
        commit("SET_DATA", ResultArray);
      //console.log(res);
      commit("SET_LOAD_DATA", false);
    }, // end of GET_DATA_XML_AXIOS
  }, // end of actions
};
