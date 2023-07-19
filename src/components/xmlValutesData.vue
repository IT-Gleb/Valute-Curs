<template>
  <div class="container">
    <div v-if="isLoading">Идет загрузка данных...</div>
    <div v-if="isError">{{ ErrorMsg }}</div>
    <div v-else-if="!isError && !isLoading">
      <div class="colums is-flex is-flex-wrap-wrap is-flex-direction-row">
        <div class="column" v-for="item in ParsedArray">
          {{ item.Date }}={{ item.Value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";

let ErrorMsg = ref("");
let isError = ref(false);
let ResponseText = "";
let ResponseJson = ref({});
let ParsedArray = ref([]);
const isLoading = ref(false);

const proxyURL = "https://cors-anywhere.herokuapp.com/";
const xmlUrl =
  proxyURL +
  "https://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=01/01/2023&date_req2=30/04/2023&VAL_NM_RQ=R01235";

let xmlHttp = new XMLHttpRequest();

xmlHttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status === 200) {
    ResponseText = xmlHttp.responseText;
    //ResponseText = xmlHttp.responseXML;
    //ResponseJson.value = xmlToJson(ResponseText);
    let doc = undefined;
    let parser = new DOMParser();
    doc = parser.parseFromString(ResponseText, "application/xml");
    ResponseJson.value = doc.querySelectorAll("Record");
    //console.log(ResponseJson.value);
    //    console.log(ResponseJson.value);
    let tempParsedArray = [];
    ParsedArray.value = [];
    let Records = ResponseJson.value;
    let t_obj = {};

    tempParsedArray = Array.prototype.slice.call(Records);
    //console.log(tempParsedArray);
    tempParsedArray.forEach((element) => {
      t_obj = {};
      if (element.hasChildNodes()) {
        t_obj.Date = element.getAttribute("Date");
        let tmp = element.lastChild.textContent;
        tmp = String(tmp).replace(",", ".");
        t_obj.Value = parseFloat(tmp).toFixed(2);
        //t_obj.Value = element.lastChild.nodeValue;
        ParsedArray.value.push(t_obj);
      }
    });
    //console.log(parsedArray);
    //console.log(ResponseText);
    isLoading.value = false;
  }
  if (this.status > 300) {
    isLoading.value = false;
    isError.value = true;
    ErrorMsg.value = `"Ошибка запроса к www.cbr.ru - Code error = ${this.status}`;
    //console.log(this.readyState, this.status);
  }
  // isError.value = true;
  // ErrorMsg.value = "Ошибка запроса к www.cbr.ru";
  //    console.log(this.readyState, this.status);
};

// Changes XML to JSON
function xmlToJson(xml) {
  // Create the return object
  let obj = {};

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        let attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      let item = xml.childNodes.item(i);
      let nodeName = item.nodeName;
      if (typeof obj[nodeName] == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == "undefined") {
          let old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

onBeforeMount(() => {
  setTimeout(() => {
    isLoading.value = true;

    xmlHttp.open("GET", xmlUrl, true);
    xmlHttp.setRequestHeader("Accept", "*/*");
    // xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    // xmlHttp.setRequestHeader("Access-Control-Request-Method", "GET");
    // xmlHttp.setRequestHeader("Referer", "no-referrer");
    // xmlHttp.setRequestHeader("Referer-Policy", "no-referrer-when-downgrade");
    xmlHttp.setRequestHeader("mode", "no-cors");
    //    xmlHttp.setRequestHeader("Content-Type", "application/xml;charset=UTF-8");
    xmlHttp.setRequestHeader("Content-Type", "application/xml");
    xmlHttp.send();
  }, 1000);
});
</script>
