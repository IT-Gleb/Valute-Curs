<template>
  <my-spinner v-if="isLoading"></my-spinner>

  <div class="box" v-show="isShow && !isLoading">
    <div class="subtitle is-size-5 has-text-centered">
      График колебания валюты
    </div>
    <div class="chartBox">
      <canvas ref="ctxChart"></canvas>
    </div>
    <div class="notification is-light mt-1 mb-0 has-text-centered is-size-7">
      <div class="tile is-ancestor is-vertical">
        <div class="tile">
          <div class="tile is-parent is-12">
            <div class="tile is-child">
              <span class="title is-size-6">Данные за выбранный период</span>
            </div>
          </div>
        </div>
        <div class="tile">
          <div class="tile is-parent is-12">
            <div class="tile is-child">
              <div
                class="tile is-child subtitle is-size-7 has-background-primary has-text-light p-2"
              >
                Минимальное <br />
                значение:
              </div>
              <div class="tile is-child subtitle is-size-7 p-2">
                {{ MinMaxData.Min.Date }}
              </div>
              <div
                class="tile is-child subtitle is-size-6 has-text-weight-semibold"
              >
                {{ MinMaxData.Min.Value }}
              </div>
            </div>
            <div class="tile is-child">
              <div
                class="tile is-child subtitle is-size-7 has-background-primary has-text-light p-2"
              >
                Максимальное <br />
                значение:
              </div>
              <div class="tile is-child subtitle is-size-7 p-2">
                {{ MinMaxData.Max.Date }}
              </div>
              <div
                class="tile is-child subtitle is-size-6 has-text-weight-semibold"
              >
                {{ MinMaxData.Max.Value }}
              </div>
            </div>
            <div class="tile is-child">
              <div
                class="tile is-child subtitle is-size-7 has-background-primary has-text-light p-2"
              >
                Среднее <br />
                значение:
              </div>
              <div class="tile is-child subtitle is-size-7 p-2">&nbsp;</div>
              <div
                class="tile is-child subtitle is-size-6 has-text-weight-semibold"
              >
                {{ MinMaxData.Average.Value }}
              </div>
            </div>
            <div class="tile is-child">
              <div
                class="tile is-child subtitle is-size-7 has-background-primary has-text-light p-2"
              >
                Медианное <br />
                значение:
              </div>
              <div class="tile is-child subtitle is-size-7 p-2">&nbsp;</div>
              <div
                class="tile is-child subtitle is-size-6 has-text-weight-semibold"
              >
                {{ MinMaxData.Median.Value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$ctxWidth: 900 * 1px;
.chartBox {
  position: relative;
  max-width: $ctxWidth;
  min-height: 35vh;
  margin: 0 auto;

  padding: 8px;
  //  border: solid 1px darkgrey;
  //  border-radius: 20px 20px;
}
</style>

<script>
// import {
//   Chart,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js/auto";

import { Chart } from "chart.js/auto";
import { watchEffect, ref, onMounted, onUnmounted, defineComponent } from "vue";
import { getAverageFromArray, getMedianFromArray } from "@/lib";
import { useStore } from "vuex";
import MySpinner from "@/components/MySpinner.vue";

export default defineComponent({
  components: {
    MySpinner,
  },

  setup() {
    const store = useStore();
    const isShow = ref(false);
    let ctxChart = ref();
    let dataVal = [];
    let labelsData = [];
    let config = {};
    let ctxValute = null;
    let NameValute = "";
    let isLoading = ref(true);
    let MinMaxData = ref({
      Min: { Date: 0, Value: 0 },
      Max: { Date: 0, Value: 0 },
      Median: { Value: 0 },
      Average: { Value: 0 },
    });
    // const MinMaxText = ref("");

    function minFromArray(paramArray) {
      let res = {
        Min: { Date: 0, Value: 0 },
        Max: { Date: 0, Value: 0 },
        Median: { Value: 0 },
        Average: { Value: 0 },
      };
      let temp = [];

      if (Array.isArray(paramArray) && paramArray.length > 0) {
        temp = paramArray.map((item) => {
          return parseFloat(String(item.Value).replace(",", ".")).toFixed(2);
        });
        if (temp.length > 0) {
          let m = Math.min(...temp);
          let top = Math.max(...temp);
          // console.log(temp);
          let indMin = temp.indexOf(m.toFixed(2));

          let indMax = temp.indexOf(top.toFixed(2));
          // console.log(paramArray, m, top, indMin, indMax);

          res.Min.Value = m;

          res.Min.Date = paramArray[indMin].Date;
          res.Max.Value = top;
          res.Max.Date = paramArray[indMax].Date;
        }
      }
      return res;
    }

    function initChart() {
      //---------Config---------------------
      config = {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "",
              data: [],
              backgroundColor: "rgba(25, 125, 0, 0.2)",
              borderColor: "rgba(25, 155, 0, 1)",
              borderWidth: 0.6,
              fill: true,
              tension: 0.45,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          //          aspectRatio: 2,
          elements: {
            point: {
              pointStyle: "rectRot",
            },
          },
          scales: {
            y: {
              grace: 4,
              beginAtZero: false,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            subtitle: {
              display: true,
              position: "top",
              text: "", //NameValute,
              //   text: `ВАЛЮТЫ:  ${store.getters.GET_DATE_VALUTES}`,
              font: { size: 18 },
            },
          },
        },
      };
      //------------End of Config-----------------
      //------------Render------------------------
      if (ctxValute) {
        ctxValute.destroy();
        ctxValute = null;
      }
      ctxValute = new Chart(ctxChart.value, config);
      // ctxValute.register(
      //   CategoryScale,
      //   LinearScale,
      //   BarElement,
      //   Title,
      //   Tooltip,
      //   Legend
      // );

      //------------------------------------------
    }

    watchEffect(() => {
      //Проверить на загрузку
      isLoading.value = store.getters["xmlData/GET_IS_LOAD_DATA"];

      let lenData = store.getters["xmlData/GET_DATA_LENGTH"] > 0;
      let selData = store.getters["GET_SELECTED_VALUTE"];
      NameValute = selData.Name;
      let paramData = store.getters["xmlData/GET_PARAM"];
      let nameEqual =
        String(selData.Name).toLowerCase() ===
        String(paramData.valuteName).toLowerCase();
      //console.log(selData, paramData, lenData);
      isShow.value = lenData && nameEqual;

      //Получить данные
      if (lenData && nameEqual) {
        let tmpData = store.getters["xmlData/GET_DATA"];
        dataVal = tmpData.map((item) => {
          return item.Value;
        });
        labelsData = tmpData.map((item) => {
          return item.Date;
        });

        //Get min max average median value;
        MinMaxData.value = minFromArray(tmpData);
        MinMaxData.value.Average.Value = getAverageFromArray(dataVal);
        MinMaxData.value.Median.Value = getMedianFromArray(dataVal);
        //console.log(MinMaxData.value);

        //        console.log(dataVal);
        //init Chart
        if (ctxValute) {
          ctxValute.data.labels = labelsData;
          ctxValute.data.datasets[0].data = dataVal;
          ctxValute.options.plugins.subtitle.text = NameValute;
          // ctxValute.options.scales.x.min = 0;
          // ctxValute.options.scales.x.max = dataVal.length - 1;
          ctxValute.update("none");
        }
      }
    });

    onMounted(() => {
      //initChart
      initChart();
    });

    onUnmounted(() => {
      if (ctxValute) {
        ctxValute.destroy();
        ctxValute = null;
      }
    });

    return {
      isShow,
      ctxChart,
      MinMaxData,
      isLoading,
    };
  },
});
</script>
