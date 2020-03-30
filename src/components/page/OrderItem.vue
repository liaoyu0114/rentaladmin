<template>
    <div class="orderitem">
        <el-alert title="消息提示的文案" type="info" v-if="!scope"></el-alert>
        <div v-else>
            <el-row :gutter="10" class="order-title">
                <el-col :span="14">
                    <span class="state-title">{{getState}}</span>
                    <span class="time-title">下单时间：{{scope.row.createTime}}</span>
                    <span class="order-id-title">订单号：{{scope.row.orderId}}</span>
                </el-col>
                <el-col :span="10">
                    <div class="price-count">
                        <span class="count-title">
                            共
                            <span class="count-num">{{scope.row.count}}</span>件商品
                        </span>
                        <span class="price-title">
                            合计
                            <span class="price-num">{{scope.row.count * scope.row.good.price}}</span>元
                        </span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" class="order-detail">
                <el-col :span="8" class="detail-first">
                    <el-row :gutter="10" class="order-detail-item">
                        <el-col :span="4">
                            <el-image
                                :src="scope.row.good.pic"
                                :preview-src-list="piclist"
                                class="good-pic"
                            >
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </el-col>
                        <el-col :span="14">
                            <span class="good-name">{{scope.row.good.name}}</span>
                        </el-col>
                        <el-col :span="6">
                            <div class="detail-count">
                                数量：
                                <span>{{scope.row.count}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="4">
                    <el-col :span="6">
                        <el-avatar :src="scope.row.user.avatar" @error="errorHandler">
                            <img
                                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                            />
                        </el-avatar>
                    </el-col>
                    <el-col :span="18">
                        <span class="detail-name">{{scope.row.user.name}}</span>
                    </el-col>
                    <el-col :span="24">
                        <span>手机：{{scope.row.user.phone}}</span>
                    </el-col>
                </el-col>
                <el-col :span="8">
                    <el-col :span="24">
                        <span class="detail-lpname">{{scope.row.location.lpName}}</span>
                        <span class="detail-lpphone">{{scope.row.location.lpPhone}}</span>
                    </el-col>
                    <el-col :span="24">
                        <span>{{scope.row.location.lpLoc}}</span>
                    </el-col>
                    <el-col :span="24">
                        <span>备注备注</span>
                    </el-col>
                </el-col>
                <el-col :span="4">
                    <div>
                        <el-button
                            type="primary"
                            size="mini"
                            round
                            :disabled="!showButton"
                            v-if="scope.row.state === 1"
                            @click="butyconClick"
                        >确认订单</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            round
                            v-if="scope.row.state === 2"
                            @click="butyconClick"
                        >开始配送</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            round
                            v-if="scope.row.state === 3"
                            @click="butyconClick"
                        >确认送达</el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            round
                            v-if="scope.row.state === 3"
                            @click="routeClick"
                        >查看路线</el-button>
                        <el-button size="mini" round v-if="scope.row.state !== 4">取消订单</el-button>
                        <el-button type="text">联系买家（feature）</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrderItem',
    props: {
        scope: {}
    },
    data() {
        return {
            piclist: []
        };
    },
    mounted() {
        this.piclist = [this.scope.row.good.pic];
    },
    computed: {
        getState() {
            switch (this.scope.row.state) {
                case 1:
                    return '未接单';
                case 2:
                    return '已接单';
                case 3:
                    return '配送中';
                case 4:
                    return '已完成';
                default:
                    return '';
            }
        },
        showButton() {
            return this.scope.row.state === 1;
        }
    },
    methods: {
        errorHandler() {
            return true;
        },
        butyconClick() {
            console.log(this.scope.row);
            this.$emit('stateAdd', this.scope.row.orderId);
        },
        routeClick() {
            this.$emit('routeClick', this.scope.row.orderId);
        }
    }
};
</script>

<style scoped>
.order-title {
    font-size: 15px;
    padding: 10px;
    color: #333;
    background: #f5faff;
}
.state-title {
    font-size: 14px;
    color: #f56c6c;
    margin-right: 5px;
}
.time-title {
    margin-right: 10px;
}
.price-title {
    margin-left: 20px;
}
.order-detail {
    padding: 10px 0;
}
.good-name {
    font-size: 18px;
    font-weight: 600;
}
.good-pic {
    margin-left: 5px;
}
.count-num {
    color: #f56c6c;
}
.price-num {
    color: #1e9efb;
}
.count-num,
.price-num {
    font-weight: 600;
}
.detail-count {
    font-weight: 600;
    font-size: 14px;
}
.detail-name,
.detail-lpname {
    font-weight: 600;
    font-size: 14px;
}
.detail-lpphone {
    margin-left: 10px;
}
.image-slot {
    font-size: 30px;
}
.image-slot i {
    width: 100%;
    height: 100%;
    font-size: 30px;
    color: #777;
}
</style>