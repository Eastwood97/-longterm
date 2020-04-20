<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="display:flex;justify-content:space-between">
      <div class="filter-item">
        <el-input v-model="listQuery.imsi" clearable style="width: 200px;" maxlength="15" placeholder="请输入imsi" />
        <el-date-picker
          v-model="listQuery.captureDay"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          :pickerOptions="pickerOptions2"
        ></el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      </div>
    </div>
    <ve-line :data="chartData"></ve-line>
    <div class="filter-container" style="display:flex;justify-content:space-between">
      <div class="filter-item">
        <el-input v-model="listQuery2.imsi" clearable style="width: 200px;" maxlength="15" placeholder="请输入imsi" />
        <el-date-picker
          v-model="timeZone"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="chooseTimeRange"
        ></el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter2">查找</el-button>
      </div>
    </div>
    <ve-histogram :data="chartData2"></ve-histogram>
  </div>
</template>


<script>
import { getOneDay, getLongTime } from "@/api/captureNum";
export default {
  data: function() {
    return {
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
        }
      },
      timeZone: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        disabledDate(time) {
          //return time.getTime() < Date.now() - 8.64e7;//设置选择今天以及今天之后的日
          return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
          //return time.getTime() < Date.now();//设置选择今天之后的日期（不能选择当天时间）
          //  return time.getTime() > Date.now()-1-8.64e7||time.getTime() == Date.now()-1-8.64e7;//设置选择今天之前的日期（不能选择当天）
        }
      },
      listQuery: {
        imsi: "",
        captureDay: ""
      },
      listQuery2: {
        imsi: "",
        startTime: "",
        endTime: ""
      },
      chartData: {
        columns: ["timeStamp", "existence"],
        rows: [
          { timeStamp: "00:00:01", existence: 1 },
          { timeStamp: "02:00:01", existence: 0 },
          { timeStamp: "04:00:01", existence: 1 },
          { timeStamp: "06:00:01", existence: 0 },
          { timeStamp: "09:00:01", existence: 1 },
          { timeStamp: "12:00:01", existence: 0 }
        ]
      },
      chartData2: {
        columns: ["hour", "count"],
        rows: [
          { hour: "00：00", count: 14 },
          { hour: "01：00", count: 23 },
          { hour: "02：00", count: 13 },
          { hour: "03：00", count: 12 },
          { hour: "04：00", count: 12 },
          { hour: "05：00", count: 5 },
          { hour: "06：00", count: 16 },
          { hour: "07：00", count: 2 },
          { hour: "08：00", count: 12 },
          { hour: "09：00", count: 4 },
          { hour: "10：00", count: 0 },
          { hour: "11：00", count: 0 },
          { hour: "12：00", count: 1 },
          { hour: "13：00", count: 1 },
          { hour: "14：00", count: 4 },
          { hour: "15：00", count: 4 },
          { hour: "16：00", count: 2 },
          { hour: "17：00", count: 2 },
          { hour: "18：00", count: 3 },
          { hour: "19：00", count: 14 },
          { hour: "20：00", count: 16 },
          { hour: "21：00", count: 19 },
          { hour: "22：00", count: 22 },
          { hour: "23：00", count: 29 }
        ]
      },
      rules: {
        imsi: [
          { required: true, message: "请输入imsi", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    handleFilter() {
     if(this.listQuery.imsi==""||this.listQuery.captureDay==""){
       this.$message({
          message: '请输入imsi或日期',
          type: 'warning'
        });
        return
      }
      this.getchartData();
    },
    getchartData() {
      getOneDay(this.listQuery)
        .then(respone => {
          this.chartData.rows = respone.data.data.list;
        })
        .catch(err => {});
    },
    handleFilter2() {
      this.getchartData2();
    },
    getchartData2() {
      getLongTime(this.listQuery2)
        .then(response => {
          for (let i = 0; i < 24; i++) {
            this.chartData2.rows[i].count = response.data.data.list[i];
          }
        })
        .catch(err => {});
    },
    // 监听时间变化
    chooseTimeRange(t) {
      if (t == "" || t == null) {
        this.listQuery2.startTime = "";
        this.listQuery2.endTime = "";
      } else {
        this.listQuery2.startTime = t[0];
        this.listQuery2.endTime = t[1];
      }
    }
  },
  created() {
    this.getchartData2();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>