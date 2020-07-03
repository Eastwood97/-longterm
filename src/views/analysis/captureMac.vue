<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div class="filter-item">
        <el-date-picker
          v-model="timeZone"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @change="chooseTimeRange"
        />
      </div>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>

      <!-- <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="poiHandle()"
      >导出</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column type="index" :index="indexMethod" label="id" width="50"></el-table-column>
      <el-table-column align="center" min-width="150px" label="mac" prop="mac" />
      <el-table-column align="center" min-width="150px" label="assocMac" prop="assocMac" />
      <el-table-column align="center" min-width="150px" label="厂商" prop="company" />
      <el-table-column align="center" min-width="150px" label="捕获时间" prop="captureTime" />
       <el-table-column align="center" label="来源" min-width="100px" prop="devId"  :formatter="stateFormat"/>

      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="deleteNumber(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 批量删除-->

    <div style="display: flex;justify-content: space-between;margin: 2px">
      <el-button
        v-if="list.length>0"
        :disabled="multipleSelection.length==0"
        type="danger"
        size="mini"
        @click="deleteManyNumbers"
      >批量删除</el-button>

      <el-pagination
        v-show="total>0"
        :total="total"
        :page-sizes="[5, 10, 20, 100]"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<style>
img {
  width: 50px;
  height: 50px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}

.el-table td,
.el-table th.is-leaf,
.el-table--border,
.el-table--group {
  border-color: #304156;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: #304156;
}
</style>

<script>
import { listResult, deleteResult } from "@/api/captureMac";
import { getToken } from "@/utils/auth";

// import Pagination from '@/components/Pagination'

export default {
  name:'captureMac',
  data() {
    return {
      haveTarget: false,
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
          return time.getTime() > Date.now() + 8.64e7; //设置选择今天以及今天以前的日期
          //return time.getTime() < Date.now();//设置选择今天之后的日期（不能选择当天时间）
          //  return time.getTime() > Date.now()-1-8.64e7||time.getTime() == Date.now()-1-8.64e7;//设置选择今天之前的日期（不能选择当天）
        }
      },

      multipleSelection: [],
      advanceSearchViewVisible: false,

      count: 1,
      list: [],
      total: 0,
      timeZone: "",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        startTime: "",
        endTime: " ",
        id: undefined
      },
      tableLoading: false
    };
  },
  computed: {
    headers() {
      return {
        "X-Litemall-Admin-Token": getToken()
      };
    }
  },
  created() {
    this.getList();
  },
  // destroyed() {
  //   console.log("mac destory");
  // },
  activated() {
    console.log("mac actived");
    this.$router.push(this.path);
  },
  deactivated() {
    console.log("deactivate");
  },
  beforeRoutLeave(){
    console.log(this.$$router.path);
    this.path=this.$$router.path
  },
  methods: {
      stateFormat(row){
      if(row.from==0){
        return "一号设备"
      }else{
        return "二号设备"
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },

    currentChange(page) {
      this.listQuery.page = page;
      this.getList();
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
    // 执行分页查询
    getList() {
      this.listLoading = true;
      listResult(this.listQuery)
        .then(response => {
          this.list = response.data.data.rows;
          this.total = response.data.data.total;

          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    // 分页查询
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    // 清空查询条件
    emptyListQuery() {
      this.listQuery = {
        page: 1,
        limit: 20,
        timeZone: "",
        id: undefined
      };
    },

    // 取消搜索
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      this.emptyListQuery();
      this.beginDateScope = "";
      this.getList();
    },
    // 监听选项变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 执行删除
    doDelete(ids) {
      this.tableLoading = true;
      deleteResult(ids)
        .then(resp => {
          this.tableLoading = false;
          if (resp && resp.data.errno == 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getList();
          }
        })
        .catch(response => {
          this.$message({ message: "执行失败，请重试", type: "error" });
        });
    },
    // 批量删除
    deleteManyNumbers() {
      this.$confirm(
        "此操作将删除[" + this.multipleSelection.length + "]条数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          var ids = "";
          for (var i = 0; i < this.multipleSelection.length; i++) {
            ids += this.multipleSelection[i].id + ",";
            console.log(ids);
          }
          this.doDelete(ids);
        })
        .catch(() => {});
    },
    // 单个删除
    deleteNumber(row) {
      this.$confirm("此操作将永久删除[" + row.mac + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(row.id);
        })
        .catch(() => {});
    },

    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1;
    },

    // doDownLoadVedio(captureTime) {},
    // 导出
    poiHandle() {
      var data = null;
      excelExport(data)
        .then(res => {
          // 将文件流转成blob形式
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          });
          let filename = "test.xls";
          // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
          const elink = document.createElement("a");
          elink.download = filename;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        })
        .catch(() => {
          this.$message.error("导出失败");
        });
    }
  }
};
</script>