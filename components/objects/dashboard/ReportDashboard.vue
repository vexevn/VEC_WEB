<template lang="">
  <div style="height: 100%;overflow: auto">
  <div style=" display: flex; "></div>
    <InputContainer label="Loại" labelWidth="80" style="flex: 1 1 150px">
      <el-input v-model="params.iType"></el-input>
    </InputContainer>
  </div>
</template>
<script>
import GetDataAPI from "~/assets/scripts/GetDataAPI";
import API from "~/assets/scripts/API";
import TablePaging from "~/assets/scripts/base/TablePaging";
import TablePagingCol from "~/assets/scripts/base/TablePagingCol";
export default {
  data() {
    return {
      data: "",
      params: {
        iType: "",
        iState: 0,
      },
    };
  },
  methods: {
    LoadPie(div, re) {
      am4core.useTheme(am4themes_animated);
      var chart = am4core.create(div, am4charts.PieChart);
      const item = re.pop();

      chart.data = re;
      chart.radius = am4core.percent(70);
      // chart.cursor.fontSize = "11";
      // Add and configure Series
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "SL";
      pieSeries.dataFields.category = "Rank";
      pieSeries.labels.template.fontSize = 13;
      pieSeries.ticks.template.disabled = true;
      pieSeries.alignLabels = false;
      pieSeries.labels.template.text = "{category}: {value} xe";

      pieSeries.labels.template.radius = am4core.percent(-70);
      // pieSeries.labels.template.fontSize = 4;
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.labels.template.fill = am4core.color("white");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;

      pieSeries.labels.template.adapter.add(
        "radius",
        function (radius, target) {
          if (target.dataItem && target.dataItem.values.value.percent < 11) {
            return 0;
          }
          return radius;
        }
      );

      pieSeries.labels.template.adapter.add("fill", function (color, target) {
        if (target.dataItem && target.dataItem.values.value.percent < 11) {
          return am4core.color("#000");
        }
        return color;
      });

      pieSeries.labels.template.relativeRotation = 90;
      var label = chart.seriesContainer.createChild(am4core.Label);
      label.text = `[fontSize:18px]Tổng[/]: [bold fontSize:30px]${item.SL} xe[/]`;
      label.horizontalCenter = "middle"; // Center horizontally
      label.verticalCenter = "top"; // Align at the top
      label.dy = 130;
      label.textAlign = "middle";
      console.log(label);
      chart.legend = new am4charts.Legend();
      chart.legend.height = 80;
      chart.legend.scrollable = true;
    },

    LoadrankB2(re, r) {
      // am4core.useTheme(am4themes_animated);
      var chart = am4core.create(this.$refs[r][0], am4charts.PieChart);
      chart.data = re.SL_Duthi;
      chart.radius = am4core.percent(95);
      chart.innerRadius = am4core.percent(30);
      // Add and configure Series
      var pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value_Dat_truot";
      pieSeries.dataFields.category = "label_Dat_truot";

      pieSeries.ticks.template.disabled = true;
      pieSeries.alignLabels = false;
      pieSeries.labels.template.text =
        "{value} ({value.percent.formatNumber('#.0')}%)";
      pieSeries.labels.template.fontSize = 12;
      pieSeries.labels.template.maxWidth = 65;
      pieSeries.labels.template.wrap = true;

      pieSeries.labels.template.radius = am4core.percent(-30);
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.labels.template.fill = am4core.color("white");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.propertyFields.fill = "color";
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.slices.template.tooltipText =
        "{category}: {value.percent.formatNumber('#.0')}% ({value})";
      pieSeries.radius = am4core.percent(50);
      // pieSeries.innerRadius = am4core.percent(10);
      chart.startAngle = 180;
      chart.endAngle = 360;
      chart.legend = new am4charts.Legend();
      chart.legend.itemContainers.template.events.on("ready", function (event) {
        let dataItem = event.target.dataItem;
        if (dataItem.dataContext.category === "Tổng thí sinh") {
          console.log(dataItem);
          dataItem.valueLabel.text = "{value}";
        }
      });
      // chart.legend.data = this.processLengendData(chart.data)
      // console.log(this.processLengendData(chart.data));

      // chart.legend .valueLabels.template.text = "{percent}%";
      // chart.legend.maxHeight = 150;
      // chart.legend.scrollable = true;

      var pieSeries2 = chart.series.push(new am4charts.PieSeries());
      pieSeries2.dataFields.value = "value";
      pieSeries2.dataFields.category = "label";

      pieSeries2.slices.template.stroke = am4core.color("#fff");
      pieSeries2.slices.template.strokeWidth = 2;
      pieSeries2.slices.template.strokeOpacity = 1;
      pieSeries2.ticks.template.disabled = true;
      pieSeries2.alignLabels = false;
      pieSeries2.labels.template.text =
        " {value} ({value.percent.formatNumber('#.0')}%)";
      pieSeries2.labels.template.maxWidth = 65;
      pieSeries2.labels.template.fontSize = 12;

      pieSeries2.labels.template.wrap = true;
      pieSeries2.labels.template.radius = am4core.percent(-14);
      pieSeries2.slices.template.stroke = am4core.color("#fff");
      pieSeries2.labels.template.fill = am4core.color("white");
      pieSeries2.slices.template.propertyFields.fill = "color";
      pieSeries2.radius = am4core.percent(78);
      pieSeries2.innerRadius = am4core.percent(40);

      var pieSeries3 = chart.series.push(new am4charts.PieSeries());
      pieSeries3.dataFields.value = "value_tong";
      pieSeries3.dataFields.category = "label_tong";
      pieSeries3.ticks.template.disabled = true;
      pieSeries3.alignLabels = false;
      pieSeries3.labels.template.text = "{value}";
      pieSeries3.slices.template.tooltipText = "{category}: {value}";
      pieSeries3.labels.template.fill = am4core.color("white");
      pieSeries3.slices.template.strokeWidth = 2;
      pieSeries3.slices.template.strokeOpacity = 1;
      pieSeries3.labels.template.radius = am4core.percent(-7);
      pieSeries3.innerRadius = am4core.percent(79);

      var label = chart.seriesContainer.createChild(am4core.Label);
      label.text = `[bold fontSize:30px]${r}[/]`;
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.textAlign = "middle";
    },
  },
  mounted() {
    GetDataAPI({
      url: API.Dashboard_GetCounterByState,
      params: this.params,
      action: (re) => {
        console.log(this);
      },
    });
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
};
</script>
<style lang="scss" scoped>
.sl {
  margin-top: 10px;
  padding-left: 10px;
  width: 100%;
  display: flex;
  align-items: center;

  .sl-item {
    margin-right: 20px;
    display: flex;
    width: 150px;
    justify-content: space-between;
    align-items: center;
    height: 35px;
    padding: 0px 15px;
    line-height: 30px;
    margin-bottom: 10px;
    border-radius: 10px;
    color: white;
    font-weight: 500;
    // background-color: aqua;
  }
}

.Chart {
  position: relative;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  h4 {
    position: absolute;
  }
  > div {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 18px 0px;
    border-radius: 5px;
    min-width: 430px;
    padding: 10px;
    margin-top: 10px;
    div {
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 18px 0px;
      border-radius: 5px;
    }
  }
}

.scale-up-center {
  -webkit-animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1)
    both;
  animation: scale-up-center 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}
/* ----------------------------------------------
 * Generated by Animista on 2024-8-27 12:8:16
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation scale-up-center
 * ----------------------------------------
 */
@-webkit-keyframes scale-up-center {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
@keyframes scale-up-center {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
