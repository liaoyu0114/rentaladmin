<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/theme/color-green.css";
    @import "https://cdn.bootcdn.net/ajax/libs/paper-css/0.4.1/paper.min.css";
    @page
    {
        size: A4;   /* auto is the initial value */
        margin: 0mm 10mm 0mm 10mm;  /* this affects the margin in the printer settings 最关键的还是这个*/
    }
    @media print {
        .padding-10mm {
            padding: 10mm 0;
        }
    }
    /*body*/
    /*{*/
        /*background-color:#FFFFFF;*/
        /*margin: 0mm;  !* this affects the margin on the content before sending to printer *!*/
    /*}*/
    .item-image {
    width: 70%;
    border-radius: 10px;
    height: 128px;
    overflow: hidden;
}
</style>