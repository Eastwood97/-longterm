<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="display:flex;justify-content:space-between">
      <div class="filter-item">
        <el-input
          v-model="listQuery.imsi"
          clearable
          class="filter-item"
          style="width: 200px;"
          placeholder="请输入imsi"
        />
        <el-button class="filter-item" type="primary" icon="el-icon-search">查找</el-button>
      </div>
    </div>
    <ve-line :data="chartData"></ve-line>
    <div class="filter-container" style="display:flex;justify-content:space-between">
      <div class="filter-item">
        <el-input
          v-model="listQuery.imsi"
          clearable
          class="filter-item"
          style="width: 200px;"
          placeholder="请输入imsi"
        />
        <el-button class="filter-item" type="primary" icon="el-icon-search">查找</el-button>
      </div>
    </div>
    <ve-histogram :data="chartData2"></ve-histogram>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      listQuery: {
        imsi: ""
      },
      chartData: {
        columns: ["日期", "访问用户", "下单用户", "下单率"],
        rows: [
          { 日期: "1/1", 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: "1/2", 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: "1/5", 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
          { 日期: "1/6", 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
        ]
      },
      chartData2: {
        columns: ["日期", "访问用户"],
        rows: [
          { 日期: "1/1",key: 1393 },
          { 日期: "1/2", 访问用户: 3530 },
          { 日期: "1/3", 访问用户: 2923 },
          { 日期: "1/4", 访问用户: 1723 },
          { 日期: "1/5", 访问用户: 3792 },
          { 日期: "1/6", 访问用户: 4593 },
          { 日期: "1/7", 访问用户: 4593 },
          { 日期: "1/8", 访问用户: 4593 },
          { 日期: "1/9", 访问用户: 4593 },
          { 日期: "1/10", 访问用户: 4593 },
          { 日期: "1/6", 访问用户: 4593 },
          { 日期: "1/6", 访问用户: 4593 }
        ]
      }
    };
  },
  methods: {
    getData(){
      
   alert(this.chartData2.rows[0].key)
    }
    
  },
  created() {
     this.getData();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>