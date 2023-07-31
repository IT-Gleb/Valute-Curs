<?php

if($_SERVER["REQUEST_METHOD"] === "GET"){
    $url = "";
    if ($_GET["currency"] === "abc"){
        $dt1= $_GET["dt1"];
        $dt2= $_GET["dt2"];
        $id= $_GET["id"];

        $url1= "https://www.cbr.ru/scripts/XML_dynamic.asp?";
        $url2= "date_req1=###1&";
        $url3= "date_req2=###2&";
        $url4= "VAL_NM_RQ=###3";

        $url= $url1. str_replace("###1", $dt1, $url2). 
              str_replace("###2", $dt2, $url3). 
              str_replace("###3", $id, $url4);

        $data= file_get_contents($url);

        print_r($data);
    }
}