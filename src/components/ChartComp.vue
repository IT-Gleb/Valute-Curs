<template>
  <div v-if="isLoading" class="has-text-centered">
    Идет загрузка данных...
    <my-spinner></my-spinner>
  </div>
  <div class="vChart mb-3" v-show="!isLoading">
    <canvas ref="ch"></canvas>
    <div
      ref="DivTip"
      class="textChartArea is-vcentered pl-2 pt-2 pb-2 has-text-centered is-size-7"
    >
      Данные не определены...
    </div>
    <div class="buttons are-small is-centered pt-2">
      <button
        ref="BtnPrev"
        class="button is-success is-rounded"
        @click.prevent="MoveBy(-Step)"
      >
        <span class="icon is-small mr-1">
          <i class="fas fa-arrow-left"></i>
        </span>
        Назад
      </button>
      <button
        ref="BtnNext"
        class="button is-success is-rounded"
        @click.prevent="MoveBy(Step)"
      >
        Вперед
        <span class="icon is-small ml-1">
          <i class="fas fa-arrow-right"></i>
        </span>
      </button>
      <button
        class="button is-warning is-rounded ml-6"
        @click.prevent="ScaleAll()"
      >
        <span class="icon is-small mr-1">
          <i class="fas fa-chart-line"></i>
        </span>
        Вернуть всё
      </button>
    </div>
  </div>
</template>

<script setup>
import { Chart } from "chart.js/auto";
import { onBeforeMount, onMounted, ref, watchEffect } from "vue";
import MySpinner from "./MySpinner.vue";
import { randomInteger, backColors } from "@/lib";
import { useStore } from "vuex";

components: {
  MySpinner;
}

const store = useStore();

// watch(
//   () => store.getters.GET_DATA_LIST,
//   function () {
//     console.log("in store list data changed...");
//   }
// );

const ch = ref();
const data = [
  { year: "USD", value: 88.1 },
  { year: "GBP", value: 111.25 },
  { year: "AUE", value: 77.56 },
  { year: "TRY", value: 26.25 },
  { year: "AWQ", value: 89.12 },
  { year: "DEC", value: 45.12 },
  { year: "FED", value: 28.22 },
  { year: "EUR", value: 96.25 },
];
let valutesChart = {};
const Step = 2;
const BtnPrev = ref();
const BtnNext = ref();
const DivTip = ref();
let backChartColors = [];
let isLoading = ref(true);

function bColors(paramMaxLength = 1) {
  let res = [];
  let ind = 0;
  let id = 0;
  let maxlength = backColors.length - 1;
  while (ind <= paramMaxLength) {
    id = randomInteger(0, maxlength);
    res.push(backColors[id]);
    ind++;
  }
  return res;
}

watchEffect(() => {
  if (isLoading.value === true) return;
  data.value = store.getters.GET_DATA_LIST;
  if (data.value === null || data.value.length < 1) return;
  //  console.log("Данные изменились", data.value);
  reloadChartData(data.value);
});

async function initChart() {
  //   console.log("Chart begin...");
  //   console.log(ch.value);

  //document.getElementById("valutesChart")
  valutesChart = new Chart(ch.value, {
    type: "bar",
    data: {
      labels: data.value.map((item) => item.CharCode),
      datasets: [
        {
          label: "",
          data: data.value.map((item) => {
            let tmp = 0;
            if (item.Nominal > 1) {
              tmp = item.Value / item.Nominal;
              return parseFloat(((tmp * 100) / 100).toFixed(2));
            } else return parseFloat(((item.Value * 100) / 100).toFixed(2));
            // return parseFloat(((item.Value * 100) / 100).toFixed(2));
          }),
          hoverBackgroundColor: "#64dd17",
          // backgroundColor: "#96A2EB",
          backgroundColor: backChartColors,
          borderColor: "darkred",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      //      indexAxis: "y",
      onHover: (ctx) => {
        //console.log(ctx);
        if (ctx.chart._active.length === 0) {
          // DivTip.value.innerText = "Данные не определены...";
          setDivTipText("Данные не определены...");
        }
      },
      scales: {
        x: {
          min: 0,
          max: data.value.length - 1,
        },
        y: {
          beginAtZero: true,
          // min: 0,
          // max: 130,
          grace: 4,
          ticks: {
            stepSize: 0.15,
          },
        },
        // yAxes: [
        //   {
        //     ticks: {
        //       beginAtZero: true,
        //     },
        //   },
        // ],
      },
      //     responsive: true,
      //     // maintainAspectRatio: false,
      //     maintainAspectRatio: true,
      //     scales: {
      //         yAxes: [{
      //             ticks: {
      //                 beginAtZero:true,
      //             }
      //         }]
      //     }
      // },
      plugins: {
        legend: {
          display: false,
        },
        subtitle: {
          display: true,
          position: "top",
          text: `ВАЛЮТЫ:  ${store.getters.GET_DATE_VALUTES}`,
          font: { size: 14 },
        },
        tooltip: {
          callbacks: {
            beforeTitle: function (context) {
              return "===========";
            },
            title: function (context) {
              //console.log(context[0].dataIndex);
              const id = context[0].dataIndex;
              const text = data.value[id].Name;
              return (context[0].label = text);
            },
            afterTitle: function (context) {
              return "===========";
            },
            label: function (context) {
              //console.log(context.chart.config.data.labels);
              // console.log(context.chart);
              let lbls = context.chart.config.data.labels;
              const id = context.parsed.x;
              const counts = data.value[id].Nominal;
              // console.log(context.chart.data.datasets[0].data[id]);
              if (context.parsed.y) {
                let value = new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(context.parsed.y);
                return `${counts} ${lbls[id]} = ${value}`;
                //return `1 ${lbls[id]} = ${value}`;
              } else return "unknown";
            },
            afterLabel: function (context) {
              return "------------------";
            },
            afterFooter: (chart) => {
              //console.log(chart);
              const tmp_name = chart[0].label;
              const vl = parseFloat(
                (data.value[chart[0].parsed.x].Value / 100) * 100
              ).toFixed(2);
              const nominal = data.value[chart[0].parsed.x].Nominal;
              const charCode = data.value[chart[0].parsed.x].CharCode;
              DivTip.value.innerText = `${tmp_name}: ${vl} руб за ${nominal} ${charCode}.`;
            },
          },
          //-----------------------------------
          // callbacks: {
          // label: function (context) {
          //   let label = context.dataset.label || "";
          //   if (label) {
          //     label += ": ";
          //   }
          //   if (context.parsed.y !== null) {
          //     label += new Intl.NumberFormat("ru-RU", {
          //       style: "currency",
          //       currency: "RUB",
          //     }).format(context.parsed.y);
          //   }
          //   return label;
          // },
          // },
        },
      },
    },
  });
  //  console.log("chart done...");
}

const MoveBy = (paramMove) => {
  // console.log(valutesChart.config.options.scales.x.min);
  // console.log(valutesChart.config.options.scales.x.max);
  let StartScale = valutesChart.config.options.scales.x.min + paramMove;
  // let EndScale = valutesChart.config.options.scales.x.min + paramMove;
  let EndScale = StartScale + Math.abs(paramMove);
  const MaxScale = store.getters.GET_DATA_LIST.length - 1;
  const MinScale = 0;

  if (BtnPrev.value.disabled) BtnPrev.value.disabled = false;
  if (BtnNext.value.disabled) BtnNext.value.disabled = false;

  if (StartScale <= MinScale) {
    StartScale = MinScale;
    EndScale = MinScale + Math.abs(paramMove);
    // console.log(BtnPrev.value);
    BtnPrev.value.disabled = true;
  }

  if (EndScale >= MaxScale) {
    StartScale = MaxScale - paramMove;
    EndScale = MaxScale;
    BtnNext.value.disabled = true;
  }

  valutesChart.config.options.scales.x.min = StartScale;
  valutesChart.config.options.scales.x.max = EndScale;

  try {
    valutesChart.update();
  } catch (e) {
    console.log(e.message);
  }
};

const setDivTipText = (paramString) => {
  DivTip.value.innerText = paramString;
};

function ScaleAll() {
  valutesChart.config.options.scales.x.min = 0;
  valutesChart.config.options.scales.x.max =
    store.getters.GET_DATA_LIST.length - 1;

  if (BtnPrev.value.disabled) BtnPrev.value.disabled = false;
  if (BtnNext.value.disabled) BtnNext.value.disabled = false;

  setDivTipText("Данные не определены...");

  try {
    valutesChart.update();
  } catch (e) {
    console.log(e.message);
  }
}

async function reloadChartData(paramData) {
  if (valutesChart) {
    valutesChart.data.labels = paramData.map((item) => item.CharCode);
    valutesChart.data.datasets[0].data = paramData.map((item) => item.Value);
    valutesChart.update();
  }
}

onBeforeMount(() => {
  isLoading.value = true;
  setTimeout(() => {
    data.value = store.getters["GET_DATA_LIST"];
    backChartColors = bColors(store.getters.GET_DATA_LIST_SIZE - 1);
  }, 500);
});

onMounted(() => {
  setTimeout(() => {
    initChart();
    // valutesChart.data.labels = data.value.map((item) => item.ID);
    // valutesChart.update();
    // console.log(valutesChart.data.labels);
    isLoading.value = false;
  }, 800);
});
</script>

<style lang="scss">
$chartWidth: 900 * 1px;
.vChart {
  max-width: $chartWidth;
  border: solid 1px darkgrey;
  border-radius: 20px 29px;
  padding: 12px;
  margin: 0 auto;
  // filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.85));
  // box-shadow: 0 0 24px rgba(0, 0, 0, 0.05);
}
.textChartArea {
  width: 100%;
  min-height: 1vh;
  background-color: rgba(127, 127, 127, 0.09);
  border: solid 1px darkgrey;
  border-radius: 6px 6px;
}

.buttons {
  width: 100%;
  //  margin: 0 auto;
  background-color: #fff;
  //border: solid 1px black;
  // border-bottom: solid 1px lightgrey;
}
</style>
