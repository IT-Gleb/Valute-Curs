<template>
  <div class="box" id="rangeBox" v-if="!isThisShow">
    <div class="title is-4">
      Изменение курса валюты
      <div class="title is-5 has-text-info is-pulled-right">
        {{ NameValute }}
      </div>
    </div>

    <div class="subtitle is-5 mt-4">Выбрать период:</div>
    <div class="control is-flex is-flex-direction-column">
      <label class="radio ml-2 mb-2">
        <input
          type="radio"
          name="RangeCheck"
          :value="rangeValue"
          @change="
            ($event) => {
              if ($event.target.checked) {
                rangeValue = 0;
              }
            }
          "
        />
        С начала года
      </label>
      <label class="radio mb-2">
        <input
          type="radio"
          name="RangeCheck"
          :value="rangeValue"
          @change="
            ($event) => {
              if ($event.target.checked) {
                rangeValue = 1;
              }
            }
          "
        />
        За текущий месяц
      </label>
      <label class="radio">
        <input
          type="radio"
          name="RangeCheck"
          :value="rangeValue"
          @change="
            ($event) => {
              if ($event.target.checked) {
                rangeValue = 2;
                //console.log($event.target.checked, rangeValue);
              }
            }
          "
        />
        Выборка за период
      </label>
      <div class="tile is-parent mt-4" v-if="rangeValue === 2">
        <div class="tile is-child is-4">
          <label>
            <span class="is-size-7 has-text-weight-semibold">
              Начальная дата:</span
            ><br />
            <input
              class="input is-small"
              type="date"
              name="fromDate"
              v-model="fromDate"
            />
          </label>
        </div>
        &nbsp;&nbsp;
        <div class="tile is-child is-4">
          <label>
            <span class="is-size-7 has-text-weight-semibold">
              Конечная дата: </span
            ><br />
            <input
              class="input is-small"
              type="date"
              name="toDate"
              v-model="toDate"
            />
          </label>
        </div>
      </div>
      <hr class="mt-2 mb-0" />
      <div
        class="notification is-danger mt-3 is-align-self-flex-start"
        v-if="showWarn"
      >
        {{ TextMsg }}
      </div>
      <div
        class="tile is-parent mt-3 is-align-self-flex-end"
        v-if="rangeValue != -1"
      >
        <div class="tile is-child is-6">
          <label class="checkbox has-text-info is-size-7 is-unselectable">
            <input
              type="checkbox"
              name="ServerCheck"
              id="ServerCheck"
              :checked="isServer"
              v-model="isServer"
              @change="handleIsServer"
            />
            Используется сервер
          </label>
        </div>
        <div class="tile is-child is-1"></div>
        <div class="tile is-child is-2 pr-2">
          <button
            class="button is-small is-primary is-rounded"
            @click="handleReport"
            title="Сформировать отчет"
          >
            <span class="icon mr-1">
              <i class="fas fa-chart-pie"></i>
            </span>
            Получить данные
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watchEffect } from "vue";
import { useStore } from "vuex";
import { isObject_empty, getDateNow } from "@/lib";

export default {
  name: "rangeDate",
  setup() {
    let rangeValue = ref(-1);
    let isServer = ref(true);
    const store = useStore();

    let isSelectedValue = reactive({});
    let isThisShow = ref(false);
    let NameValute = ref("");
    let fromDate = ref("");
    let toDate = ref("");
    const TextMsg = ref("");
    const showWarn = ref(false);

    fromDate.value = getDateNow();
    toDate.value = getDateNow();

    //console.log(toDate.value);

    const checkSelectedValue = (paramObj) => {
      return isObject_empty(paramObj);
    };

    const handleIsServer = (event) => {
      store.commit("xmlData/SET_SERVER_URL_USE", isServer.value);
    };

    const checkDates = () => {
      let res = false;
      let startDate = new Date(fromDate.value);
      let endDate = new Date(toDate.value);
      if (startDate >= endDate) {
        res = true;
      }
      return res;
    };

    watchEffect(() => {
      isSelectedValue = store.getters["GET_SELECTED_VALUTE"];
      if (!isObject_empty(isSelectedValue))
        NameValute.value = isSelectedValue.Name;
      //console.log(isSelectedValue);
      isThisShow.value = checkSelectedValue(isSelectedValue);

      switch (rangeValue.value) {
        case 0:
          // console.log(rangeValue.value);
          showWarn.value = false;
          fromDate.value = String(new Date().getFullYear()) + "-" + "01-01";
          // console.log(fromDate.value, toDate.value);
          break;
        case 1:
          // console.log(rangeValue.value);
          showWarn.value = false;
          let dt = new Date(Date.now());
          fromDate.value =
            String(dt.getFullYear()) +
            "-" +
            String(dt.getMonth() + 1).padStart(2, "0") +
            "-" +
            "01";

          toDate.value =
            String(dt.getFullYear()) +
            "-" +
            String(dt.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(dt.getDate()).padStart(2, "0");

          //console.log(fromDate.value, toDate.value);
          break;
        case 2:
          // console.log(rangeValue.value);
          showWarn.value = false;
          let dt2 = new Date(Date.now());
          toDate.value =
            String(dt2.getFullYear()) +
            "-" +
            String(dt2.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(dt2.getDate()).padStart(2, "0");

          dt2.setDate(dt2.getDate() - 7);
          fromDate.value =
            String(dt2.getFullYear()) +
            "-" +
            String(dt2.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(dt2.getDate()).padStart(2, "0");

          break;
        default:
          showWarn.value = false;
          TextMsg.value = "";
          break;
      }
    });

    const handleReport = () => {
      showWarn.value = false;
      let startDate = new Date(fromDate.value);
      let endDate = new Date(toDate.value);
      let maxDate = new Date(Date.now());
      let strFromDate =
        String(startDate.getDate()).padStart(2, "0") +
        "/" +
        String(startDate.getMonth() + 1).padStart(2, "0") +
        "/" +
        startDate.getFullYear();
      let strEndDate =
        String(endDate.getDate()).padStart(2, "0") +
        "/" +
        String(endDate.getMonth() + 1).padStart(2, "0") +
        "/" +
        endDate.getFullYear();
      //   console.log(strFromDate, strEndDate, isSelectedValue.ID);
      if (startDate >= endDate || endDate > maxDate) {
        showWarn.value = true;
        TextMsg.value =
          "Дата начала выборки должна быть меньше даты окончания. Или дата окончания должна быть меньше текущей даты";
        //console.log(TextMsg.value);
        return;
      }
      //Передать данные в XmlStore
      let paramReport = {
        fromDate: strFromDate,
        toDate: strEndDate,
        valuteCode: isSelectedValue.ID,
        Nominal: isSelectedValue.Nominal,
        valuteName: isSelectedValue.Name,
      };
      // console.log(store.state.xmlData.paramObj);
      store.dispatch("xmlData/UPDATE_PARAM_VALUE", paramReport);

      //store.dispatch("xmlData/GET_XML_DATA");
      store.dispatch("xmlData/GET_DATA_XML_AXIOS");
    };

    return {
      rangeValue,
      isServer,
      isThisShow,
      NameValute,
      fromDate,
      toDate,
      TextMsg,
      showWarn,
      handleReport,
      handleIsServer,
    };
  },
};
</script>
