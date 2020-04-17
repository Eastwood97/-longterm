<template>
  <div>
      
    
    <div ref="echarts2" class="simpleDemo2"></div>
    <div ref="echarts" class="simpleDemo"></div>
    
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      chart: null,
      chart2: "",
      opinionData: ["3", "2", "4", "4", "5"],
      option: {
        title: {
          text: "24小时出入统计"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          data: [
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24
          ]
        },
        yAxis: {},
        series: {
          name: "销量",
          type: "bar",
          data: [
            5,
            20,
            36,
            10,
            10,
            20,
            5,
            20,
            36,
            10,
            0,
            20,
            5,
            20,
            0,
            10,
            10,
            0,
            5,
            20,
            36,
            10,
            10,
            10
          ],
          itemStyle: {
            color: function(params) {
              let colorList = [
                "#00FFFF",
                "#C0C0C0",
                "#FFFF00",
                "#66FF99",
                "#000000",
                "#FF0000"
              ];
              return colorList[params.dataIndex];
            }
          },
          emphasis: {
            itemStyle: {}
          }
        }
      }
    };
  },
  mounted() {
    this.getPage();
    this.$nextTick(function() {
      this.drawLine();
    });
  },
  methods: {
    getPage() {
      // this.chart = echarts.init(this.$refs.echarts);
      // // 使用刚指定的配置项和数据显示图表。
      // this.chart.setOption(this.option);
      //  this.chart2 = echarts.init(this.$refs.echarts2);
      // this.chart2.setOption(this.option);
      // this.chart2 = echarts.init(document.querySelector('.simpleDemo'))
      // this.chart2.setOption(this.option);
      this.chart = echarts.init(document.querySelector(".simpleDemo"));
      this.chart.setOption(this.option);
    },
    drawLine() {
      this.charts2 = echarts.init(document.querySelector(".simpleDemo2"));
      this.charts2.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["近七日收益"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["1", "2", "3", "4", "5"]
        },
        yAxis: {
          type: "value"
        },

        series: [
          {
            name: "近七日收益",
            type: "line",
            stack: "总量",
            data: this.opinionData
          }
        ]
      });
    }
  }
};
</script>

<style scoped>

.simpleDemo {
  width: 100%;
  height: 400px;
  margin-top: 1%;
}
.simpleDemo2 {
  width: 100%;
  height: 400px;
  margin-top: 1%;
}
a {
  color: #00cc66;
}
.router-link-active {
  text-decoration: none;
}
</style>