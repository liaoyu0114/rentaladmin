<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "app",
        created () {
            if (localStorage.phone !== "" && localStorage.password !== "") {
                let data = {
                    "landlord_phone": localStorage.phone,
                    "landlord_password": localStorage.password
                };
                this.$post("/loginLandlord", data).then(res => {
                    if (res.code === "000") {
                        this.$store.commit("setUserInfo",res.Landlord);
                        if (this.$route.path === '/login') {
                            this.$router.push("/")
                        }
                    }
                })
            }

        }
    };
</script>

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