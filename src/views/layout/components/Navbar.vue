<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
         <div class="avatar-container right-menu-item" v-if="this.$store.state.cmcc1==3">
        <div class="avatar-wrapper">
          <el-tooltip
            class="item"
            effect="dark"
            :content="'一号设备暂未建立连接'"
            placement="bottom-start"
          >
            <img :src="'/static/img/red_ball.png'" class="ball" />
          </el-tooltip>
        </div>
      </div>
      <div  class="avatar-container right-menu-item" v-else>
      <div class="avatar-container right-menu-item" >
        <div class="avatar-wrapper">
          <el-tooltip
            v-if="this.$store.state.cmcc1==1"
            class="item"
            effect="dark"
            :content="'一号设备移动模块工作正常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/green_ball.png'" class="ball" />
          </el-tooltip>
          <el-tooltip
            v-else
            class="item"
            effect="dark"
            :content="'一号设备移动模块工作异常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/red_ball.png'" class="ball" />
          </el-tooltip>
        </div>
      </div>
      <div class="avatar-container right-menu-item" >
        <div class="avatar-wrapper">
          <el-tooltip
            v-if="this.$store.state.cmcc1==1"
            class="item"
            effect="dark"
            :content="'一号设备联通模块工作正常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/green_ball.png'" class="ball" />
          </el-tooltip>
          <el-tooltip
            v-else
            class="item"
            effect="dark"
            :content="'一号设备联通模块工作异常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/red_ball.png'" class="ball" />
          </el-tooltip>
        </div>
      </div>
      <div class="avatar-container right-menu-item">
        <div class="avatar-wrapper">
          <el-tooltip
            v-if="this.$store.state.cmcc1==1"
            class="item"
            effect="dark"
            :content="'一号设备电信模块工作正常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/green_ball.png'" class="ball" />
          </el-tooltip>
          <el-tooltip
            v-else
            class="item"
            effect="dark"
            :content="'一号设备电信模块工作异常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/red_ball.png'" class="ball" />
          </el-tooltip>
        </div>
      </div>
      </div>
         <div class="avatar-container right-menu-item" v-if="this.$store.state.cmcc2==3">
        <div class="avatar-wrapper">
          <el-tooltip
            class="item"
            effect="dark"
            :content="'二号设备暂未建立连接'"
            placement="bottom-start"
          >
            <img :src="'/static/img/red_ball.png'" class="ball" />
          </el-tooltip>
        </div>
      </div>
      <div  class="avatar-container right-menu-item" v-else>
      <div class="avatar-container right-menu-item">
        <div class="avatar-wrapper">
          <el-tooltip
            v-if="this.$store.state.cmcc2==1"
            class="item"
            effect="dark"
            :content="'二号设备移动模块工作正常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/green_ball.png'" class="ball" />
          </el-tooltip>
          <el-tooltip
            v-else
            class="item"
            effect="dark"
            :content="'二号设备移动模块工作异常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/red_ball.png'" class="ball" />
          </el-tooltip>
        </div>
      </div>
      <div class="avatar-container right-menu-item">
        <div class="avatar-wrapper">
          <el-tooltip
            v-if="this.$store.state.cucc2==1"
            class="item"
            effect="dark"
            :content="'二号设备联通模块工作正常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/green_ball.png'" class="ball" />
          </el-tooltip>
          <el-tooltip
            v-else
            class="item"
            effect="dark"
            :content="'二号设备联通模块工作异常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/red_ball.png'" class="ball" />
          </el-tooltip>
        </div>
      </div>
      <div class="avatar-container right-menu-item">
        <div class="avatar-wrapper">
          <el-tooltip
            v-if="this.$store.state.ctcc2==1"
            class="item"
            effect="dark"
            :content="'二号设备电信模块工作正常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/green_ball.png'" class="ball" />
          </el-tooltip>
          <el-tooltip
            v-else
            class="item"
            effect="dark"
            :content="'二号设备电信模块工作异常'"
            placement="bottom-start"
          >
            <img :src="'/static/img/red_ball.png'" class="ball" />
          </el-tooltip>
        </div>
      </div>
      </div>
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img src="/static/img/police.png" class="user-avatar" />
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>主页</el-dropdown-item>
          </router-link>
          <!-- <a target='_blank' href="#">
            <el-dropdown-item>
              项目地址
            </el-dropdown-item>
          </a>-->
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";

export default {
  data: function() {
    return {
      url: "/static/img/green_ball.png",
      msg: ""
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar"])
  },
  created() {
    // switch (this.$store.state.devState) {
    //   case 0:
    //     this.url="/static/img/green_ball.png"
    //     this.msg="设备连接正常"
    //     break;
    //    case 1:
    //     this.url="/static/img/yellow_ball.png"
    //     this.msg="一号设备异常"
    //     break;
    //    case 2:
    //     this.url="/static/img/yellow_ball.png"
    //     this.msg="二号设备异常"
    //     break;
    //    case 3:
    //     this.url="/static/img/red_ball.png"
    //     this.msg="没有设备连接"
    //     break;
    // }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      });
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
      console.log("导航栏WebSocket连接成功    状态码：" + this.websocket.readyState);
    },
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理

      var data = JSON.parse(event.data);
     
      // alert('服务端返回：' + data.regcognition.compareScore)
      switch (data.state) {
        case 5: {
          if (data.devId == 0) {
            this.$store.commit("updateCmcc1", data.cmcc);
            this.$store.commit("updateCucc1", data.cucc);
            this.$store.commit("updateCtcc1", data.ctcc);
          } else {
            this.$store.commit("updateCmcc2", data.cmcc);
            this.$store.commit("updateCucc2", data.cucc);
            this.$store.commit("updateCtcc2", data.ctcc);
          }
          break;
        }
        case -5: {
          if (data.devId == 0) {
            this.$store.commit("updateCmcc1", 3);
          } else {
            this.$store.commit("updateCmcc2", 3);
          }
          break;
        }
        default: {
          break;
        }
      }
  }
  },
    mounted() {
    // console.log("----------------+++++++++++++" + getToken());
    const userName = "adminNavBar";

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
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .ball {
          width: 20px;
          height: 20px;
          vertical-align: 10px;
        }
        .item {
          margin: 4px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
