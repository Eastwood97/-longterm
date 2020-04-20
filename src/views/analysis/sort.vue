<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div class="filter-item">
        <el-date-picker
          v-model="timeZone"
          type="datetimerange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          @change="chooseTimeRange"
        ></el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      </div>
    </div>
    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" :index="indexMethod" label="id" min-width="100"></el-table-column>
      <el-table-column align="center" label="imsi" min-width="180px" prop="imsi" />
      <el-table-column align="center" label="抓拍时间" min-width="180px" prop="captureDateTime" />
      <el-table-column align="center" label="次数" min-width="180px" prop="count" />
      <el-table-column align="center" label="归属地" min-width="180px" prop="attribution" />
    </el-table>
    <div style="display: flex;justify-content: space-between;margin: 2px">
      <el-pagination
        v-show="total>0"
        :total="total"
        :page-sizes="[10, 20, 100]"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>



<script>
import { getSortNum } from "@/api/captureNum";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  data() {
    return {
      total: 0,
      listLoading: false,
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
      value2: "",
      advanceSearchViewVisible: false,

      listQuery: {
        startTime: "",
        endTime: "",
        page: 1,
        limit: 10
      },
      timeZone: "",
      list: [],
      downloadLoading: false
    };
  },
  computed: {
    headers() {
      return {
        "Admin-Token": getToken()
      };
    }
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },

    currentChange(page) {
      this.listQuery.page = page
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getSortNum(this.listQuery)
        .then(response => {
          this.list = response.data.data.list;
          this.total = response.data.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    // 清空查询条件
    emptyListQuery() {
      this.listQuery = {
        startTime: "",
        endTime: "",
        page: 1,
        limit: 10
      };
    },

    // 监听时间变化
    chooseTimeRange(t) {
      if (t == "" || t == null) {
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      } else {
        this.listQuery.startTime = t[0];
        this.listQuery.endTime = t[1];
      }
    },
    // 监听选项变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //下标递增
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1;
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
