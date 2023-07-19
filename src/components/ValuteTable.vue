<template>
  <section class="section" v-if="isErrorLoad">
    <div class="notification is-danger is-light has-text-centered">
      Ошибка при загрузке данных... Попробовать еще раз...
    </div>
    <div class="control has-text-centered mt-2">
      <button class="button is-small is-info is-rounded" @click="updateHandler">
        <span class="icon is-small mr-1">
          <i class="fas fa-download"></i>
        </span>
        Обновить
      </button>
    </div>
  </section>

  <section class="section pb-0" v-if="!isErrorLoad">
    <calculate-curs></calculate-curs>
  </section>

  <my-spinner v-if="isLoadVal"></my-spinner>

  <section v-else-if="!isErrorLoad && !isLoadVal" class="section pt-0">
    <p class="subtitle">Данные на: {{ valuteDate }}</p>

    <div class="table-container is-hidden-mobile">
      <table class="table is-striped is-fullwidth is-narrow">
        <thead>
          <tr class="has-background-info">
            <th class="is-vcentered is-size-7 has-text-white">№/№</th>
            <th class="is-vcentered is-size-7 has-text-white">Выбрать</th>
            <th class="is-vcentered">
              <button
                class="button is-link is-small is-rounded"
                title="Сортировать"
                @click="
                  () => {
                    isPrice = true;
                    isSorted = true;
                    isCode = !isCode;
                    sortByCode(isCode);
                  }
                "
              >
                <span class="icon has-text-primary-light is-small">
                  <i
                    :class="isCode ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                  ></i>
                </span>

                <span>Код</span>
              </button>
            </th>
            <th class="is-vcentered">
              <button
                class="button is-link is-small is-rounded"
                title="Сортировать"
                @click="
                  () => {
                    isCode = true;
                    isPrice = true;
                    isSorted = !isSorted;
                    sortByName(isSorted);
                  }
                "
              >
                <span class="icon has-text-primary-light is-small">
                  <i
                    :class="isSorted ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                  ></i>
                </span>
                <span>Валюта</span>
              </button>
            </th>
            <th class="is-vcentered is-size-7 has-text-white">Номинал</th>
            <th class="is-vcentered">
              <button
                class="button is-link is-small is-rounded"
                title="Сортировать"
                @click="
                  () => {
                    isCode = true;
                    isSorted = true;
                    isPrice = !isPrice;
                    sortByPrice(isPrice);
                  }
                "
              >
                <span class="icon has-text-primary-light is-small">
                  <i :class="isPrice ? 'fas fa-arrow-up' : 'fas fa-arrow-down'">
                  </i>
                </span>
                <span>Курс</span>
              </button>
            </th>
            <th class="is-vcentered is-size-7 has-text-white">Изм</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) of sortedValutes"
            :key="item.ID"
            :class="sortedValutes[parseInt(i)].Selected ? 'is-selected' : ''"
          >
            <td class="is-size-7 is-vcentered">{{ i }}.</td>
            <td class="is-size-7 is-vcentered has-text-centered">
              <input
                type="radio"
                name="selectVal1"
                class="is-clickable"
                :checked="sortedValutes[parseInt(i)].Selected"
                @change="
                  ($event) => {
                    // console.log($event.target.checked);
                    sortedValutes.forEach((item) => (item.Selected = false));
                    sortedValutes[parseInt(i)].Selected = $event.target.checked;
                    // console.log($event.target.checked);
                    // console.log(sortedValutes[parseInt(i)].Selected);
                    setValuteItem(parseInt(i));
                  }
                "
              />
            </td>
            <td class="is-size-7 is-vcentered has-text-centered">
              {{ item.CharCode }}
            </td>
            <td class="is-size-7 is-vcentered">{{ item.Name }}</td>
            <td class="is-size-7 has-text-right is-vcentered">
              {{ item.Nominal }}
            </td>
            <td class="is-size-7 has-text-right is-vcentered">
              {{ item.Value }}
            </td>
            <td class="is-size-7 has-text-right is-vcentered">
              {{ changeCurs(item) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- //-------------------------------------------------------------------------- -->
  <section class="section">
    <div class="table-container is-hidden-tablet">
      <table class="table is-striped is-fullwidth">
        <thead>
          <tr class="has-background-info is-vcentered">
            <th class="has-text-centered has-text-light">
              <abbr title="Выделить">Sel.</abbr>
            </th>
            <th class="has-text-centered has-text-light">
              <button
                class="button is-link is-small is-rounded"
                title="Сортировать"
                @click="
                  () => {
                    isPrice = true;
                    isSorted = true;
                    isCode = !isCode;
                    sortByCode(isCode);
                  }
                "
              >
                <span class="icon has-text-primary-light is-small">
                  <i
                    :class="isCode ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                  ></i>
                </span>

                <abbr title="Код валюты">ChC.</abbr>
              </button>
            </th>
            <th class="has-text-centered has-text-light">
              <abbr title="Номинал">N.</abbr>
            </th>
            <th class="has-text-centered has-text-light">
              <button
                class="button is-link is-small is-rounded"
                title="Сортировать"
                @click="
                  () => {
                    isCode = true;
                    isSorted = true;
                    isPrice = !isPrice;
                    sortByPrice(isPrice);
                  }
                "
              >
                <span class="icon has-text-primary-light is-small">
                  <i :class="isPrice ? 'fas fa-arrow-up' : 'fas fa-arrow-down'">
                  </i>
                </span>
                <abbr title="Стоимость в рублях">P.</abbr>
              </button>
            </th>
            <th class="has-text-centered has-text-light">
              <abbr title="Изменение">C.</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="is-vcentered"
            v-for="(item, i) of sortedValutes"
            :key="item.ID"
            :class="sortedValutes[parseInt(i)].Selected ? 'is-selected' : ''"
          >
            <td class="is-size-7 has-text-centered">
              <input
                type="radio"
                name="selectVal"
                class="is-clickable"
                :title="item.Name"
                :checked="sortedValutes[parseInt(i)].Selected"
                @change="
                  ($event) => {
                    // console.log($event.target.checked);
                    sortedValutes.forEach((item) => (item.Selected = false));
                    sortedValutes[parseInt(i)].Selected = $event.target.checked;
                    setValuteItem(parseInt(i));
                    //     console.log(sortedValutes[parseInt(i)]);
                  }
                "
              />
            </td>
            <td class="is-size-7 has-text-centered" :title="item.Name">
              {{ item.CharCode }}
            </td>
            <td class="is-size-7 has-text-centered">{{ item.Nominal }}</td>
            <td class="is-size-7 has-text-right">{{ item.Value }}</td>
            <td class="is-size-7 has-text-right">{{ changeCurs(item) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { onBeforeMount, ref, computed, watchEffect } from "vue";
import { FormatDateTime_Long, ArrayFromObject } from "@/lib";
import calculateCurs from "@/components/calculateCurs.vue";
import MySpinner from "./MySpinner.vue";

// import { mapActions } from "vuex";
//import MainStore from "@/store";
import { useStore } from "vuex";

components: {
  MySpinner;
}

// const url = ref("https://www.cbr-xml-daily.ru/daily_json.js");
// const data = ref({});
const valutes = ref({});
const valuteDate = ref(Date.now());
const sortedValutes = ref([]);
const isSorted = ref(true);
const isCode = ref(true);
const isPrice = ref(true);
const isLoadVal = ref(false);
const isErrorLoad = ref(false);
const store = useStore();

function sortByPrice(paramAsc = true) {
  store.commit("SORT_BY_PRICE", paramAsc);
  sortedValutes.value = store.getters["GET_DATA_LIST"];
}

function sortByCode(paramAsc = true) {
  store.commit("SORT_BY_CODE", paramAsc);
  sortedValutes.value = store.getters["GET_DATA_LIST"];
}

function sortByName(paramAsc = true) {
  store.dispatch("GET_SORT_BY_NAME_PRICE", paramAsc);
  sortedValutes.value = store.getters["GET_DATA_LIST"];
}

function setValuteItem(paramindex = 0) {
  store.commit("SET_SELECTED_ITEM", paramindex);
}

function updateHandler() {
  store.dispatch("GET_VALUTES");
  setTimeout(() => {
    isErrorLoad.value = store.getters["GET_LOAD_ERROR"];
    if (!isErrorLoad.value) {
      sortedValutes.value = store.getters["GET_DATA_LIST"];
      //sortByName(isSorted);
      valuteDate.value = store.getters["GET_DATE_VALUTES"];
    }
  }, 900);
}

async function getData(paramUrl) {
  //   const options = {
  //     method: "GET", // *GET, POST, PUT, DELETE, etc.
  //     mode: "no-cors", // no-cors, *cors, same-origin
  //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //     //      credentials: "same-origin", // include, *same-origin, omit
  //     headers: { "Content-Type": "application/json" },
  //   };
  const options = {
    Method: "GET",
    Mode: "no-cors",
    Cache: "no-cache",
    Headers: { "Content-Type": "application/json" },
  };
  let dt = {};
  try {
    const res = await fetch(paramUrl, options);
    dt = await res.json();
    valutes.value = dt.Valute;

    valuteDate.value = new Date(dt["Date"]);
    valuteDate.value = FormatDateTime_Long(valuteDate.value);
    //Добавить во все объекты Selected=false
    sortedValutes.value = ArrayFromObject(valutes.value, true);
    //Отсортировать по имени
    sortByName(isSorted);
    //console.log(sortedValutes.value);

    if (!res.ok) {
      throw new Error("Ошибка при получении данных");
    }
    return dt;
  } catch (Err) {
    console.error(Err);
  }
}

const changeCurs = computed(() => (param) => {
  //console.log(param);
  //let item = store.getters.GET_DATA_ITEM(param);
  let tmp_val = 0;
  tmp_val = (((param.Value - param.Previous) * 100) / 100).toFixed(2);
  if (tmp_val > 0) return "+" + tmp_val;
  else return tmp_val;
});

watchEffect(() => {
  isLoadVal.value = store.getters["GET_ISLOAD_DATA"];
});

onBeforeMount(() => {
  updateHandler();

  // store.dispatch("GET_VALUTES");
  // setTimeout(() => {
  //   isErrorLoad.value = store.getters["GET_LOAD_ERROR"];
  //   if (!isErrorLoad.value) {
  //     sortedValutes.value = store.getters["GET_DATA_LIST"];
  //     //sortByName(isSorted);
  //     valuteDate.value = store.getters["GET_DATE_VALUTES"];
  //   }
  // }, 500);
});
</script>

<style lang="scss">
.table-container {
  max-height: 60vh;
  overflow-y: scroll !important;
  table {
    thead {
      position: relative;
      th {
        position: sticky;
        top: 0;
        background-color: hsl(204, 86%, 53%);
      }
    }
  }
}
.msection {
  width: 100%;
  margin: 0;
  // min-height: 65vh;
}
</style>
