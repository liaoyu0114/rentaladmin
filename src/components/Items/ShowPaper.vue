<template>
  <div class="A4" >
        <div class="sheet padding-10mm" id="print">
          <div class="title">房屋租赁合同</div>
          <p>出租方：<span class="name-bold">{{scope.landlord.landlord_realname}}</span>（以下简称甲方）；</p>　　　
          <p>承租方：<span class="name-bold">{{scope.tenant.tenant_realname}}</span>（以下简称乙方）。　</p>　
          <p>租赁房屋地址：<span>{{scope.house.housingresources_address}}</span>　</p>　
          <p>依据《中华人民共和国合同法》有关条款，甲乙双方经过充分协商，就乙方租赁甲方房屋事宜达成如下协议：</p>
          <p>一、乙方租赁甲方房屋，以下简称租赁房屋。</p>
          <p>二、起租时间：<span class="time-bold">{{scope.contract_begintime | formatDate("YYYY-MM-DD")}}</span>，退租时间：<span class="time-bold">{{scope.contract_endtime | formatDate("YYYY-MM-DD") }}</span>。
            在合同签订之日，乙方需向甲方支付房屋租金<span class="price-color">￥{{scope.contract_price}}</span>。如续租，请提前3天通知甲方，并重新办理租赁手续。<br /></p>　　　　
          <p>三、违约处理：</p>　
          <p>甲方违约：</p>　
          <p>1．如甲方未能及时将押金退还乙方，甲方每天应按押金的2％向乙方支付违约金；</p>
          <p>2．如甲方提供的维修服务项目与协议不相符，乙方有权提前退租，甲方应全额退还剩余的租金。</p>
          <p>乙方违约：</p>　　
          <p>1．如乙方不按时缴纳租金，甲方有权在其押金中扣除，同时收回房屋，所有损失由乙方负责；</p>　
          <p>2．如果乙方在租赁期限未满时退租，甲方仅退还剩余租金的40％（租期未满一个月的不在此例）；</p>　
          <p>四、本协议书一式两份，甲乙双方各执一份；本协议甲乙双方签字后生效。补充协议亦属于合同的一部分。</p>　
          　<br />　　甲方（盖章）：_________　　　　　　　　乙方（盖章）：_________　　<br />　
          　法定代表人（签字）：_________　　　　　法定代表人（签字）：_________　　<br />　　
          担保人（签章）：_________　　<br />　　
          _________年____月____日　　　　　　　　_________年____月____日　　<br />　　
          签订地点：_________　　　　　　　　　　签订地点：_________

        </div>

    <div class="button">
      <div>
        <el-button>修改合同</el-button>
      </div>
      <div>
        <el-button v-print="'#print'">打印合同</el-button>
      </div>
      <div>
        <el-button>返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'ShowPaper',
        props: {
            scope: {}
        }
    };
</script>

<style scoped>
  .title{
    margin:10px auto;
    text-align:center;
    font-size:30px;
  }
  .button{
    display: flex;
    justify-content: center;
    margin:10px auto;
    text-align:center;
    padding:  0 0 20px;
  }
  .button div {
    margin: 0 5px;
  }
  .name-bold {
    font-size: 16px;
    font-weight: 600;
  }
  .time-bold {
    font-size: 14px;
    font-weight: 600;
  }
  .price-color {
    font-size: 16px;
    color: #f56c6c;
    font-weight: 600;
  }

</style>