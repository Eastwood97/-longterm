<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="display:flex;justify-content:space-between">
            <!-- 查询和其他操作 -->
      <el-input
        v-model="listQuery.imsi"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入imsi"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="showAdvanceSearchView">高级搜索
      </el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      </div>
      <!--高级搜索框-->

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
        <el-table-column type="selection" min-width="50" />
        <el-table-column type="index" :index="indexMethod" label="id" min-width="100"></el-table-column>
        <el-table-column align="center" label="imsi" min-width="180px" prop="imsi" />
        <el-table-column align="center" label="归属地" min-width="180px" prop="attribution" />
        <el-table-column align="center" label="抓拍时间" min-width="180px" prop="captureDateTime" />
        <el-table-column
          align="center"
          label="操作"
          min-width="145px"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>



<script>
import {
  getFrequencyPoints,
  doconfig,
  getConfig,
  importNum,
  queryNum
} from "@/api/dashboard";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  data() {
    return {
      loading: false,
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
        ]
      },
      value2: "",
      advanceSearchViewVisible: false,

      listQuery: {
        attribution: "",
        imsi: "",
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
  method: {
    // 清空查询条件
    emptyListQuery() {
      this.listQuery = {
        attribution: "",
        imsi: "",
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
    },
    // 展示高级搜索窗口
    showAdvanceSearchView() {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
      this.emptyListQuery();
      if (!this.advanceSearchViewVisible) {
        this.resetForm();
        this.getList();
      }
    },

    cancelConfig() {
      this.configDialog = false;
    },
    cancelImport() {
      this.importDialog = false;
      this.importForm.endTime = "";
    }
  },
  created() {
    this.getList(this.listQuery);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
