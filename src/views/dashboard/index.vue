<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container" style="display:flex;justify-content:space-between">
      <div class="filter-item">
        <el-input
          v-model="listQuery.imsi"
          clearable
          :maxlength="15"
          class="filter-item"
          style="width: 200px;"
          placeholder="请输入imsi"
        />
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter()"
        >查找</el-button>

        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="showAdvanceSearchView"
        >高级搜索</el-button>
      </div>
      <div>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-setting"
          @click="handleConfig"
        >配置</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleImport"
          :loading="loading"
        >导入</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-close" @click="handleDel">数据清洗</el-button>
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
          <el-input
            v-model="listQuery.attribution"
            style="width: 130px"
            :maxlength="15"
            placeholder="请输入"
          />
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
      <el-table-column align="center" label="抓拍时间" min-width="180px" prop="captureDateTime" />
      <el-table-column align="center" label="归属地" min-width="180px" prop="attribution" />
      <el-table-column
        align="center"
        label="操作"
        min-width="145px"
        class-name="small-padding fixed-width"
      >
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
        :page-sizes="[10, 20, 100]"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentChange"
        @size-change="handleSizeChange"
      />
    </div>
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
          <el-button type="primary" @click="send1(0)" :disabled="isDisadled1">
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
          <el-button type="primary" @click="send2(1)" :disabled="isDisadled2">
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
          <el-button type="primary" @click="send3(2)" :disabled="isDisadled3">
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

        <el-form-item label="开始时间" placeholder="请输入0到23的整数" prop="beginTime">
          <el-input v-model="configForm.beginTime" />
        </el-form-item>

        <el-form-item label="结束时间" placeholder="请输入0到23的整数" prop="overTime">
          <el-input v-model="configForm.overTime" />
        </el-form-item>
        <el-form-item label="工作时间" placeholder="请输入0到23的整数" prop="workTime">
          <el-input v-model="configForm.workTime" />
        </el-form-item>

        <el-form-item label="睡眠时间" placeholder="请输入0到23的整数" prop="sleepTime">
          <el-input v-model="configForm.sleepTime" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelConfig">取消</el-button>
        <el-button type="primary" @click="setConfig">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'导入'" :visible.sync="importDialog" :before-close="handleClose">
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
          <el-date-picker
            v-model="importForm.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            disabled="true"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="importForm.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            :pickerOptions="pickerOptions2"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelImport">取消</el-button>
        <el-button type="primary" @click="doImport">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="'数据清洗'" :visible.sync="delDialog" :before-close="handleCloseDel">
      <el-form
        ref="delForm"
        :rules="rules"
        :model="delForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="delForm.startTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            :pickerOptions="pickerOptions2"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="delForm.endTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            :pickerOptions="pickerOptions2"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDel">取消</el-button>
        <el-button type="primary" @click="deleteByTime">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
import {
  getFrequencyPoints,
  doconfig,
  getConfig,
  importNum
} from "@/api/dashboard";
import { queryNum, deleteNum, cleanData } from "@/api/captureNum";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
export default {
  components: {},
  data() {
    let sleepTimeValidate = (rule, value, callback) => {
      let sleepTime = value;
      if (sleepTime <= 1440 && sleepTime >= 0) {
        callback();
      } else {
        callback("请输入0-1440的整数(单位为分钟)");
      }
    };
    return {
      total: 0,
      multipleSelection: [],
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
          label: 38950,
          value: 38950
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
      delDialog: false,
      configForm: {
        cmccArfcn: "",
        cuccArfcn: "",
        ctccArfcn: "",
        power: "",
        beginTime: "",
        overTime: "",
        workTime: "",
        sleepTime: ""
      },
      importForm: {
        startTime: "2018-03-01",
        endTime: ""
      },
      delForm: {
        startTime: "",
        endTime: ""
      },
      downloadLoading: false,
      rules: {
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        beginTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
          {
            required: true,
            pattern: /^([0-9]|(1[0-3]|2[0-3]))$/,
            message: "请输入0-23的整数",
            trigger: "blur"
          }
        ],
        overTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
          {
            required: true,
            pattern: /^([0-9]|(1[0-3]|2[0-3]))$/,
            message: "请输入0-23的整数",
            trigger: "blur"
          }
        ],
        workTime: [
          { required: true, message: "范围30-180整数,单位秒", trigger: "blur" },
          {
            required: true,
            pattern: /^([3-9]|[3-9]\d|1[0-7]\d|180)$/,
            message: "请输入30-180的整数,单位秒",
            trigger: "blur"
          }
        ],
        sleepTime: [
          {
            required: true,
            message: "请输入0-1440的整数(单位为分钟)",
            trigger: "blur"
          },
          {
            validator: sleepTimeValidate,
            required: true
          }
        ]
      }
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
        "ws://localhost:8089/websocket/" + userName
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
    deleteByTime() {
      this.$refs["delForm"].validate(valid => {
        if (valid) {
          cleanData(this.delForm)
            .then(res => {
              console.log(res.data);
            })
            .catch(err => {
            openFail("删除失败")
            });
            this.delDialog=false;
        }
      });
    },

    //导入
    doImport() {
      this.$refs["importForm"].validate(valid => {
        if (valid) {
          importNum(this.importForm)
            .then(res => {})
            .catch(err => {});
          this.loading = true;
          this.importDialog = false;
        }
      });
    },
    //配置
    setConfig() {
      this.$refs["delForm"].validate(valid => {
        if (valid) {
          doconfig(this.configForm)
            .then(res => {})
            .catch(err => {});
          this.configDialog = false;
        }
      });
    },

    //扫网
    send1(mode) {
      this.isDisadled1 = this.isDisadled2 = this.isDisadled3 = true;
      this.scanNet(mode);
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
      this.scanNet(mode);
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
      this.scanNet(mode);
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
      this.getList();
    },

    getList() {
      queryNum(this.listQuery)
        .then(response => {
          this.list = response.data.data.list;
          this.total = response.data.data.total;
          this.listLoading = false;
          this.importForm.startTime = response.data.data.list[0].captureDay;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },

    currentChange(page) {
      this.listQuery.page = page;
      this.getList();
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
          var targetIds = "";
          for (var i = 0; i < this.multipleSelection.length; i++) {
            targetIds += this.multipleSelection[i].targetId + ",";
            console.log(targetIds);
          }
          this.doDelete(targetIds);
        })
        .catch(() => {});
    },

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
    handleDel() {
      this.delDialog = "true";
      this.$nextTick(() => {
        this.$refs["delForm"].clearValidate();
      });
    },

    // 取消搜索
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      this.timeZone=""
      this.emptyListQuery();
      this.getList();
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
      // this.emptyListQuery();
      if (!this.advanceSearchViewVisible) {
        this.timeZone = "";
        this.emptyListQuery();
        this.getList();
      }
    },

    //取消
    handleClose(done) {
      this.cancelImport();
    },
    handleCloseDel(done) {
      this.cancelDel();
    },
    cancelConfig() {
      this.configDialog = false;
    },
    cancelImport() {
      this.importDialog = false;
      this.importForm.endTime = "";
    },
    cancelDel() {
      this.delDialog = false;
      this.delForm.startTime = "";
      this.delForm.endTime = "";
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
      if (data.state == 1) {
        this.configForm.cmccArfcn = data.msg.cmccArfcn;
        this.configForm.ctccArfcn = data.msg.ctccArfcn;
        this.configForm.cuccArfcn = data.msg.cuccArfcn;
        this.configForm.beginTime = data.msg.beginTime;
        this.configForm.overTime = data.msg.overTime;
        this.configForm.power = data.msg.power;
        this.configForm.workTime = data.msg.workTime;
        this.configForm.sleepTime = data.msg.sleepTime;
        // localStorage.setItem("workTime", this.configForm.workTime);
        //  localStorage.setItem("sleepTime", this.configForm.sleepTime)
      }

      if (data.state == 2) {
        this.openSuccess(data.msg);
      }
      if (data.state == 3) {
        switch (data.msg.plmn) {
          case "0":
            this.cmccArfcns = data.msg.arfcnResultList;
            break; //跳出switch语句
          case "1":
            this.cuccArfcns = data.msg.arfcnResultList;
            break;
          case "2":
            this.ctccArfcns = data.msg.arfcnResultList;
            break;
        }
        this.openSuccess("扫网成功");
      }
      if (data.state == 4) {
        this.openSuccess(data.msg);
        this.loading = false;
        this.getList();
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
    },
    // 单个删除
    deleteNumber(row) {
      this.$confirm("此操作将永久删除[" + row.imsi + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(row.id);
        })
        .catch(() => {});
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
          }
          this.doDelete(ids);
        })
        .catch(() => {});
    },
    // 执行删除
    doDelete(ids) {
      // this.tableLoading = true;
      var _this = this;
      deleteNum(ids)
        .then(resp => {
          // _this.tableLoading = false;
          if (resp && resp.status == 200) {
            this.$notify.success({
              title: "成功",
              message: "删除成功",
              type: "success"
            });
            _this.getList();
          }
        })
        .catch(response => {
          this.$notify.error({
            title: "失败",
            message: response.data.errmsg
          });
        });
    }
  },
  created() {
    this.getList();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
