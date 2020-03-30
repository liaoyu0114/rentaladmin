<template>
    <div class="gd-map">
        <div id="gd-map"></div>
        <div id="panel" v-show="!showPanel"></div>
        <div class="button">
            <el-button type="primary" @click="start">前往导航</el-button>
        </div>
    </div>
</template>

<script>
import AMap from 'AMap';
export default {
    name: 'Gd-Map',
    mounted() {
        this.getRoutes();
    },
    props: {
        location: {
            type: Object,
            default() {
                return {
                    start: [103.988471, 30.581856],
                    end: [103.971329, 30.563505]
                };
            }
        }
    },
    data() {
        return {
            route: {
                start: {},
                end: {}
            },
            showUpOrDown: false
        };
    },
    computed: {
        getHref() {
            return (
                'https://gaode.com/dir?from%5Bname%5D=%E8%B5%B7%E7%82%B9&from%5Blnglat%5D=' +
                this.route.start.location.lng +
                '%2C' +
                this.route.start.location.lat +
                '&to%5Bname%5D=%E7%BB%88%E7%82%B9&to%5Blnglat%5D=' +
                this.route.end.location.lng +
                '%2C' +
                this.route.end.location.lat +
                '&policy=1&type=car'
            );
        },
        showPanel() {
            return window.screen.width < 500;
        }
    },
    methods: {
        getRoutes() {
            const self = this;
            var map = new AMap.Map('gd-map', {
                resizeEnable: true,
                // center: self.location.start, // 地图中心点
                zoom: 16 // 地图显示的缩放级别
            });
            var path = [];
            // path.push(this.location.start);
            // path.push(this.location.end);

            AMap.plugin('AMap.Driving', function() {
                var driving = new AMap.Driving({
                    // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
                    policy: AMap.DrivingPolicy.LEAST_TIME
                });
                map.addControl(driving);
            });

            var driving = new AMap.Driving({
                // map: map,
                panel: 'panel'
            });
            // 根据起终点名称规划驾车导航路线
            driving.search(this.location.start, this.location.end, function(status, result) {
                // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                map.center = [103.988471, 30.581856];
                if (status === 'complete') {
                    self.route.start = result.start;
                    self.route.end = result.end;
                    console.log(result.routes[0].steps[0].start_location);
                    let start = [result.routes[0].steps[0].start_location.lng, result.routes[0].steps[0].start_location.lat];
                    let end = [
                        result.routes[0].steps[result.routes[0].steps.length - 1].end_location.lng,
                        result.routes[0].steps[result.routes[0].steps.length - 1].end_location.lat
                    ];
                    path.push(start);
                    path.push(end);
                    map.plugin('AMap.DragRoute', function() {
                        var route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE); //构造拖拽导航类
                        route.search(); //查询导航路径并开启拖拽导航
                    });
                } else {
                    this.$alert('获取路线失败', '提示！！！', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.$message({
                                type: 'info',
                                message: `action: ${action}`
                            });
                        }
                    });
                }
            });
        },
        start() {
            window.screenX;
            window.open(this.getHref);
        }
    }
};
</script>

<style scoped>
.gd-map,
#gd-map {
    width: 100%;
    height: 100%;
}
#panel {
    position: fixed;
    background-color: white;
    max-height: 90%;
    overflow-y: auto;
    top: 75px;
    right: 10px;
    width: 280px;
}
#panel .amap-call {
    background-color: #009cf9;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
.button {
    position: fixed;
    bottom: 18px;
    left: calc(50vw - 40px);
}
</style>