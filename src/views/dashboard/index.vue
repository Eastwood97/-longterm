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

        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="showAdvanceSearchView"
        >高级搜索</el-button>
      </div>
      <div>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleConfig">配置</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleImport"
          :loading="loading"
        >导入</el-button>
      </div>
    </div>
    <!--高级搜索框-->
    <div
      v-show="advanceSearchViewVisible"
      style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 10px 0px 10px 0px;box-sizing:border-box;border-color: #EBEEF5;"
    >
      <el-row>
        <el-col :span="5">
          归属地:
          <el-input v-model="listQuery.attribution" style="width: 130px" placeholder="请输入" />
        </el-col>
        <el-col :span="10">
          时间范围:
          <el-date-picker
            v-model="timeZone"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 350px"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="chooseTimeRange"
          />
        </el-col>
        <el-col :span="5">
          <el-button @click="cancelSearch">取消</el-button>
          <el-button icon="el-icon-search" type="primary" @click="handleFilter">搜索</el-button>
        </el-col>
      </el-row>
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
    <!-- 配置对话框 -->
    <el-dialog :title="'配置'" :visible.sync="configDialog">
      <el-form
        ref="configForm"
        :rules="rules"
        :model="configForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="移动" prop="cmccArfcn">
          <template>
            <el-select v-model="configForm.cmccArfcn" filterable placeholder="请选择">
              <el-option
                v-for="item in cmccArfcns"
                :key="item.label"
                :label="item.label"
                :value="item.value2"
              ></el-option>
            </el-select>
          </template>
          <el-button type="primary" @click="send1(1)" :disabled="isDisadled1">
            <span v-show="show1">扫网</span>
            <span v-show="!show1" class="count">{{count}} s</span>
          </el-button>
        </el-form-item>
        <el-form-item label="联通" prop="cuccArfcn">
          <template>
            <el-select v-model="configForm.cuccArfcn" filterable placeholder="请选择">
              <el-option
                v-for="item in cuccArfcns"
                :key="item.label"
                :label="item.label"
                :value="item.value2"
              ></el-option>
            </el-select>
          </template>
          <el-button type="primary" @click="send2(2)" :disabled="isDisadled2">
            <span v-show="show2">扫网</span>
            <span v-show="!show2" class="count">{{count}} s</span>
          </el-button>
        </el-form-item>

        <el-form-item label="电信" prop="ctccArfcn">
          <template>
            <el-select v-model="configForm.ctccArfcn" filterable placeholder="请选择">
              <el-option
                v-for="item in ctccArfcns"
                :key="item.label"
                :label="item.label"
                :value="item.value2"
              ></el-option>
            </el-select>
          </template>
          <el-button type="primary" @click="send3(3)" :disabled="isDisadled3">
            <span v-show="show3">扫网</span>
            <span v-show="!show3" class="count">{{count}} s</span>
          </el-button>
        </el-form-item>

        <el-form-item label="功率" prop="isdn">
          <template>
            <el-select v-model="configForm.power" filterable placeholder="请选择">
              <el-option label="一档" value="1" />
              <el-option label="二档" value="2" />
              <el-option label="三挡" value="3" />
              <el-option label="四档" value="4" />
              <el-option label="五档" value="5" />
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-input v-model="configForm.startTime" />
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="configForm.endTime" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelConfig">取消</el-button>
        <el-button type="primary" @click="setConfig">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'导入'" :visible.sync="importDialog"  :before-close="handleClose">
      <el-form
        ref="importForm"
        :rules="rules"
        :model="importForm"
        status-icon
       
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="importForm.startTime" type="date" placeholder="选择日期" disabled="true"></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="importForm.endTime" type="date" placeholder="选择日期"  :pickerOptions="pickerOptions2"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelImport">取消</el-button>
        <el-button type="primary" @click="doImport">确定</el-button>
      </div>
    </el-dialog>
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
      isDisadled1: false,
      isDisadled2: false,
      isDisadled3: false,
      TIME_COUNT: 12,
      show1: true, // 初始启用按钮
      count: "", // 初始化次数
      timer1: null,
      show2: true, // 初始启用按钮
      timer2: null,
      show3: true, // 初始启用按钮
      timer3: null,
      listLoading: false,
      loading: false,
       pickerOptions2: {
          disabledDate(time) {
          return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
        }
       },
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
      cmccArfcns: [
        {
          label: 83950,
          value: 83950
        }
      ],
      cuccArfcns: [
        {
          label: 1650,
          value: 1650
        }
      ],
      ctccArfcns: [
        {
          label: 1285,
          value: 1285
        }
      ],

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
      configDialog: false,
      importDialog: false,
      configForm: {
        cmccArfcn: "",
        cuccArfcn: "",
        ctccArfcn: "",
        power: "",
        startTime: "",
        endTime: ""
      },
      importForm: {
        startTime: "2020-3-1",
        endTime: ""
      },
      downloadLoading: false,
      rules: {}
    };
  },
  computed: {
    headers() {
      return {
        "Admin-Token": getToken()
      };
    }
  },
  mounted() {
    // console.log("----------------+++++++++++++" + getToken());
    const userName = "admin123";

    // var permission = window['permission'];
    // console.log("----------------------:" + permission)
    // WebSocket
    if ("WebSocket" in window) {
      this.websocket = new WebSocket(
        "ws://localhost:8084/websocket/" + userName
      );
      this.initWebSocket();
    } else {
      alert("当前浏览器 Not support websocket");
    }
  },
  beforeDestroy() {
    this.onbeforeunload();
  },
  methods: {
    openSuccess(msg) {
      this.$notify({
        title: "成功",
        message: msg,
        type: "success"
      });
    },
    openFail(msg) {
      this.$notify({
        title: "错误",
        message: msg,
        type: "error"
      });
    },

    //导入
    doImport() {
      importNum(this.importForm)
        .then(res => {})
        .catch(err => {});
      this.loading = false;
    },
    //配置
    setConfig() {
      doconfig(this.configForm)
        .then(res => {})
        .catch(err => {});
      this.configDialog = false;
    },

    //扫网
    send1(mode) {
      this.isDisadled1 = this.isDisadled2 = this.isDisadled3 = true;
      scanNet(mode);
      if (!this.timer1) {
        this.count = this.TIME_COUNT;
        this.show1 = false;
        this.timer1 = setInterval(() => {
          if (this.count > 0 && this.count <= this.TIME_COUNT) {
            this.count--;
          } else {
            this.show1 = true;
            clearInterval(this.timer1); // 清除定时器
            this.timer1 = null;
            this.isDisadled1 = this.isDisadled2 = this.isDisadled3 = false;
          }
        }, 1000);
      }
    },
    send2(mode) {
      this.isDisadled1 = this.isDisadled2 = this.isDisadled3 = true;
      scanNet(mode);
      if (!this.timer2) {
        this.count = this.TIME_COUNT;
        this.show2 = false;
        this.timer2 = setInterval(() => {
          if (this.count > 0 && this.count <= this.TIME_COUNT) {
            this.count--;
          } else {
            this.show2 = true;
            clearInterval(this.timer2); // 清除定时器
            this.timer2 = null;
            this.isDisadled1 = this.isDisadled2 = this.isDisadled3 = false;
          }
        }, 1000);
      }
    },
    send3(mode) {
      this.isDisadled3 = this.isDisadled2 = this.isDisadled3 = true;
      scanNet(mode);
      if (!this.timer3) {
        this.count = this.TIME_COUNT;
        this.show3 = false;
        this.timer3 = setInterval(() => {
          if (this.count > 0 && this.count <= this.TIME_COUNT) {
            this.count--;
          } else {
            this.show3 = true;
            clearInterval(this.timer3); // 清除定时器
            this.timer3 = null;
            this.isDisadled3 = this.isDisadled2 = this.isDisadled3 = false;
          }
        }, 1000);
      }
    },
    scanNet(mode) {
      getFrequencyPoints(mode)
        .then(Response => {})
        .catch(err => {});
    },

    // 分页查询
    handleFilter() {
      this.listQuery.page = 1;
      getList(this.listQuery);
    },

    getList(listQuery) {},
    handleConfig() {
      //获取默认配置
      getConfig()
        .then(res => {})
        .catch(err => {});
      this.configDialog = true;
      this.$nextTick(() => {
        this.$refs["configForm"].clearValidate();
      });
    },
    handleImport() {
      this.importDialog = "true";
      this.$nextTick(() => {
        this.$refs["importForm"].clearValidate();
      });
    },

    // 取消搜索
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      this.emptyListQuery();
      this.getList(this.listQuery);
    },
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
        this.emptyListQuery();
        this.getList();
      }
    },

    //取消
     handleClose(done) {
       this.cancelImport()
    },
    cancelConfig() {
      this.configDialog = false;
    },
    cancelImport() {
      this.importDialog = false;
      this.importForm.endTime = "";
    },
    initWebSocket() {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage;

      // 连接成功
      this.websocket.onopen = this.setOnopenMessage;

      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage;

      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage;

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload;
    },
    setErrorMessage() {
      console.log(
        "WebSocket连接发生错误   状态码：" + this.websocket.readyState
      );
    },
    setOnopenMessage() {
      console.log("WebSocket连接成功    状态码：" + this.websocket.readyState);
    },
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理

      var data = JSON.parse(event.data);
      // alert('服务端返回：' + data.regcognition.compareScore)

      if (data.state == 2) {
        this.openSuccess(data.msg);
      }
      if (data.state == 3) {
        switch (data.plmn) {
          case "1":
            this.cuccArfcns = data.arfcnResult;
            break; //跳出switch语句
          case "2":
            this.cmccArfcns = data.arfcnsarfcnResult;
            break;
          case "3":
            this.ctccArfcns = data.arfcnResult;
            break;
        }
        this.openSuccess(data.msg);
      }
      if (data.state == 4) {
        this.openSuccess(data.msg);
        this.loading = true;
      }
      if (data.state == -1) {
        this.openFail(data.msg);
      }
      if (data.state == -2) {
        this.openFail(data.msg);
      }
      if (data.state == -3) {
        this.openFail(data.msg);
      }
      if (data.state == -4) {
        this.openFail(data.msg);
        this.loading = true;
      }
    },
    setOncloseMessage() {
      console.log("WebSocket连接关闭    状态码：" + this.websocket.readyState);
    },
    onbeforeunload() {
      this.closeWebSocket();
    },
    closeWebSocket() {
      this.websocket.close();
    }
  },
  created() {
    this.getList(this.listQuery);
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
