<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->

    <div class="filter-container">
      <el-input
        v-model="listQuery.targetName"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入目标名称"
      />
      <el-input
        v-model.trim="listQuery.imsi"
        clearable
        class="filter-item"
        style="width: 200px;"
        placeholder="请输入imsi"
      />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="poiHandle()"
      >导出</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table
    @click.stop
      @row-click="rowClick"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column type="index" :index="indexMethod" label="id" min-width="50"></el-table-column>
      <el-table-column align="center" label="姓名" min-width="110px" prop="targetName" />
      <el-table-column align="center" label="imsi" min-width="110px" prop="imsi" />
      <el-table-column align="center" label="备注" min-width="80px" prop="desc" />
      <el-table-column align="center" label="归属地" min-width="80px" prop="attribution" />
      <el-table-column align="center" label="抓拍时间" width="170px" prop="captureDateTime" />
      <!-- <el-table-column
        align="center"
        label="操作"
        width="110px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click.stop="rowClick" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- <el-row>
      <el-button
        v-if="list.length>0"
        :disabled="multipleSelection.length==0"
        size="small"
        type="danger"
        @click="deleteMany"
      >批量删除</el-button>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.row"
        style="text-align:right;margin-top: -30px"
        layout="total, sizes, prev, pager, next, jumper"
        @pagination="getList"
      />
    </el-row>-->

    <!-- 批量删除-->

    <div style="display: flex;justify-content: space-between;margin: 2px">
      <!-- <el-button
        v-if="list.length>0"
        :disabled="multipleSelection.length==0"
        type="danger"
        size="mini"
        @click="deleteMany"
      >批量删除</el-button> -->

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
</style>
<script>
import {
  listTargetInfo,
  deleteTargetInfo,
  excelExport
} from "@/api/targetInfo";
import { uploadPath } from "@/api/storage";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  components: { Pagination },
  data() {
    return {
      advanceSearchViewVisible: false,
      uploadPath,
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
      list: [
        {
          id: 1,
          targetName: "小三",
          imsi: "460006682758499",
          captureTime: "2019-10-30 16:48:54"
        }
      ],
      total: 0,
      captureTime: null,
      listLoading: true,
      listQuery: {
        targetName: "",
        imsi: "",
        page: 1,
        limit: 10,
        startTime: "",
        endTime: ""
      },
      multipleSelection: [],
      dataForm: {
        targetName: "",
        imsi: "",
        targetId: undefined,
        desc: "",
        operatorId: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }]
      },
      downloadLoading: false
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
  methods: {
    rowClick(val) {
      console.log(val.imsi);
      this.$router.push({ name: "chart", query: { id: val } });
    },
    chooseTimeRange(t) {
      console.log(t);
      if (t != null) {
        this.listQuery.startTime = t[0];
        this.listQuery.endTime = t[1];
      } else {
        this.listQuery.startTime = "";
        this.listQuery.endTime = "";
      }
    },
    getList() {
      this.listLoading = true;
      listTargetInfo(this.listQuery)
        .then(response => {
          this.list = response.data.data.list;
          this.total = response.data.data.total;
          console.log(this.list);
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetForm() {
      this.dataForm = {
        imsi: "",
        captureTime: ""
      };
    },
    /**
     * 删除
     */
    handleDelete(index, rowData) {
      var id = rowData.id;
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTargetInfo(id)
            .then(data => {
              this.$message({ type: "success", message: "删除成功!" });
              this.getList();
            })
            .catch(() => {
              this.$message({ message: "执行失败，请重试", type: "error" });
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    /**
     * 批量删除
     */
    deleteMany() {
      var ids = "";
      for (var i = 0; i < this.multipleSelection.length; i++) {
        ids += this.multipleSelection[i].id + ",";
        console.log(ids);
      }
      if (ids.length == 0) {
        this.$message({
          message: "请选择要删除的项",
          showClose: true,
          type: "warning"
        });
        return;
      }
      debugger;
      this.$confirm("此操作将批量永久删除文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTargetInfo(ids)
            .then(data => {
              this.$message({ type: "success", message: "删除成功!" });
              this.getList();
            })
            .catch(() => {
              debugger;
              this.$message({ message: "执行失败，请重试", type: "error" });
            });
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    },
    indexMethod(index) {
      return (this.listQuery.page - 1) * this.listQuery.limit + index + 1;
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },

    currentChange(page) {
      this.listQuery.page = page;
      this.getList();
    },

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
    },

    handleDownload() {
      const options = {
        imsi: this.listQuery.imsi,
        targetName: this.listQuery.targetName,
        startTime: this.listQuery.startTime,
        endTime: this.listQuery.endTime
      };
      this.exportExcel(options);
    },
    /**
     * 封装导出Excal文件请求
     * @param url
     * @param data
     * @returns {Promise}
     */
    exportExcel(options = {}) {
      exportTargetInfo(options)
        .then(response => {
          var blob = new Blob([response.data], {
            type: "application/vnd.ms-excel"
          });
          let fileName = Date.parse(new Date()) + ".xls";
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            var downloadElement = document.createElement("a");
            var href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = fileName; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
          }
        })
        .catch(() => {
          this.$message({ message: "执行失败，请重试", type: "error" });
        });
    },

    // 清空查询条件
    emptyListQuery() {
      (this.captureTime = null),
        (this.listQuery = {
          page: 1,
          row: 20
        });
    },
    // 取消搜索
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      this.emptyListQuery();
      this.beginDateScope = "";
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    format(time, format) {
      var t = new Date(time);
      var tf = function(i) {
        return (i < 10 ? "0" : "") + i;
      };
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
          case "yyyy":
            return tf(t.getFullYear());
          case "MM":
            return tf(t.getMonth() + 1);
          case "mm":
            return tf(t.getMinutes());
          case "dd":
            return tf(t.getDate());
          case "HH":
            return tf(t.getHours());
          case "ss":
            return tf(t.getSeconds());
        }
      });
    }
  }
};
</script>
