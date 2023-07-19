import { createStore } from "vuex";
import { ArrayFromObject, FormatDateTime_Long } from "@/lib";
import { XMLModule } from "./XmlGetValuteModule";

const MainStore = createStore({
  state: {
    url: "https://www.cbr-xml-daily.ru/daily_json.js",
    valutesList: [],
    valutesDate: new Date(Date.now()),
    selectedValute: {},
    isValuteLoadError: false,
    isLoadValutes: false,
  },
  getters: {
    GET_ISLOAD_DATA: (state) => {
      return state.isLoadValutes;
    },

    GET_DATA_LIST: (state) => {
      return state.valutesList;
    },
    GET_DATE_VALUTES: (state) => {
      return state.valutesDate;
    },
    GET_DATA_LIST_SIZE: (state) => {
      return state.valutesList.length;
    },
    GET_DATA_ITEM: (state) => (index) => {
      return state.valutesList.find((item) => item === index);
    },
    GET_SELECTED_VALUTE: (state) => {
      return state.selectedValute;
    },
    GET_LOAD_ERROR: (state) => {
      return state.isValuteLoadError;
    },
  },
  mutations: {
    SET_VALUTES: (state, payload) => {
      state.valutesList = Array.from(payload);
      // console.log(state.valutesList);
    },
    SET_DATE_VALUTES: (state, payload) => {
      state.valutesDate = payload;
    },

    SORT_BY_NAME: (state, payload) => {
      let res = Array.from(state.valutesList);

      if (res.length > 0) {
        res.sort((a, b) => {
          if (payload) {
            if (a.Name.toLowerCase() > b.Name.toLowerCase()) return 1;
            else return -1;
          } else {
            if (a.Name.toLowerCase() > b.Name.toLowerCase()) return -1;
            else return 1;
          }
        });
      }
      state.valutesList = Array.from(res);
      //o_keys = null;
      res = null;
    },

    // SORT_BY_NAME_PRICE: (state, paramAsc = true) => {
    //   let res = Array.from(state.valutesList);
    //   if (paramAsc) {
    //     res.sort(sortByMultipleKey(["Name", "Value"]));
    //   } else {
    //     res.sort(sortByMultipleKey(["Value", "Name"]));
    //   }

    //   //console.log(res);

    //   state.valutesList = Array.from(res);
    //   res = null;
    // },
    SORT_BY_NAME_PRICE: (state, paramAsc = true) => {
      let res = Array.from(state.valutesList);
      res.sort(function (a, b) {
        if (paramAsc) {
          return (
            (b.Name < a.Name) - (a.Name < b.Name) ||
            (b.Value < a.Value) - (a.Value < b.Value)
          );
        } else {
          return (
            (b.Name > a.Name) - (a.Name > b.Name) ||
            (b.Value > a.Value) - (a.Value > b.Value)
          );
        }
      });

      state.valutesList = Array.from(res);
      res = null;
    },

    SORT_BY_CODE: (state, payload) => {
      let res = Array.from(state.valutesList);

      if (res.length > 0) {
        res.sort((a, b) => {
          if (payload) {
            if (a.CharCode > b.CharCode) return 1;
            else return -1;
          } else {
            if (a.CharCode > b.CharCode) return -1;
            else return 1;
          }
        });
      }
      state.valutesList = Array.from(res);
      res = null;
    },

    SORT_BY_PRICE: (state, payload) => {
      let res = Array.from(state.valutesList);

      if (res.length > 0) {
        res.sort((a, b) => {
          if (payload) {
            if (a.Value > b.Value) return 1;
            else return -1;
          } else {
            if (a.Value > b.Value) return -1;
            else return 1;
          }
        });
      }
      state.valutesList = Array.from(res);
      res = null;
    },
    SET_SELECTED_ITEM: (state, index) => {
      if (state.valutesList.length > 0) {
        state.selectedValute = state.valutesList[index];
        //console.log(state.selectedValute);
      }
    },
  },
  actions: {
    GET_VALUTES: async ({ state, commit }) => {
      const fetchOptions = {
        Method: "GET",
        Mode: "no-cors",
        Cache: "no-cache",
        Headers: { "Content/Type": "application/json" },
      };
      let res = null;
      let temp = [];
      let tempObj = {};
      let tmpDate = null;

      // console.log("Начинаем...");
      state.isValuteLoadError = false;
      state.isLoadValutes = true;
      try {
        let result = await fetch(state.url, fetchOptions);
        tempObj = await result.json();
        res = tempObj.Valute;
        tmpDate = FormatDateTime_Long(new Date(tempObj.Date));
        //console.log(tmpDate);
        // console.log(res);

        if (res) {
          temp = ArrayFromObject(res);
          if (temp.length) {
            commit("SET_VALUTES", temp);
            commit("SORT_BY_NAME_PRICE");
            //commit("SORT_BY_NAME", true);
            commit("SET_DATE_VALUTES", tmpDate);
            //console.log(temp);
          }
        }
      } catch (e) {
        //try
        state.isValuteLoadError = true;
      } finally {
        state.isLoadValutes = false;
      }
      // console.log("Заканчиваем...");
    },
    GET_SORT_BY_NAME_PRICE: async ({ state, commit }, paramAsc = true) => {
      if (state.valutesList.length > 0) {
        commit("SORT_BY_NAME_PRICE", paramAsc);
      }
    },
  },
  modules: { xmlData: XMLModule },
});

export default MainStore;
