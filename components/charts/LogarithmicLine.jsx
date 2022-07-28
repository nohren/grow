import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import FullScreen from 'highcharts/modules/full-screen';
import HighchartsReact from 'highcharts-react-official';
import habitConfig from '../../utils/habitConfig';
import { formatNumberToString, roundNumber } from '../../utils/utils';

if (typeof Highcharts === 'object') {
  Exporting(Highcharts);
  FullScreen(Highcharts);
}

const { repsGoal, getY } = habitConfig;

//The below method is a reminder that the creators of some library, do things better than you can implement yourself with their stuff.  don't create your own thing.  Just needed to import the FullScreen module.

// class FullScreen {
//   constructor(container) {
//     //invokes the void function below to open fullscreen
//     this.init(container.parentNode);
//   }
//   init(container) {
//     if (container.requestFullscreen) {
//       container.requestFullscreen();
//     } else if (container.mozRequestFullScreen) {
//       container.mozRequestFullScreen();
//     } else if (container.webkitRequestFullscreen) {
//       container.webkitRequestFullscreen();
//     } else if (container.msRequestFullscreen) {
//       container.msRequestFullscreen();
//     }
//   }
// }

/**
 *
 * An svg is created on mount.  For some reason there is a bunch of space it does not use.  Why is that?
 * We need to set width in the outside container, it will abide by that.
 * For some reason it won't abide by height of the outside container, so we need to set it in here.
 *
 * Enable full screen in legend item click
 *
 */
const LogarithmicLine = (props) => {
  const { repsAdjusted } = props;

  const generateChartData = (_repsAdjusted, _repsGoal, decimal = 1) => {
    const data = [];
    for (let i = 0, n = _repsGoal * 10 ** decimal; i <= n; i++) {
      const _i = i / 10 ** decimal;
      data.push({
        x: _i,
        y: getY(_i),
        marker: {
          enabled: _i === roundNumber(_repsAdjusted, decimal),
        },
      });
    }
    return data;
  };

  /**
   *  We were acessing a stale repsAdjusted.  Each time react renders we need to provide chart options for anything that contains state. Providing a function object to chartoptions will only retain access to the state that exists in that snap shot in time, in the closure that existsed then.  Once state changes you need to provide a new function containing a new closure. Do this in useeffect.
   * Otherway to do this is to use a ref. But that is extra work.
   */
  const logToolTipFormatter = function () {
    if (Math.round(this.point.x) === Math.round(repsAdjusted)) {
      return `Adjusted Reps: <b>${formatNumberToString(
        repsAdjusted,
        1
      )}</b><br/>Automaticity: <b>${habitConfig.calculateProgress(
        repsAdjusted
      )}</b><br/>`;
    }
    return false;
  };

  const percentLabelFormatter = function () {
    return habitConfig.calculateProgress(repsAdjusted);
  };

  const [chartOptions, setChartOptions] = useState({
    title: {
      //text: "Habit Training"
      text: undefined,
    },
    chart: {
      backgroundColor: '#000000',
      height: 50,
      spacingBottom: 0,
      spacingTop: 0,
      spacingLeft: 0,
      spacingRight: 0,
    },
    xAxis: {
      min: 0,
      max: repsGoal,
      visible: false,
      title: {
        text: 'Adjusted Reps',
      },
    },
    exporting: {
      buttons: {
        contextButton: {
          enabled: false,
          align: 'right',
          verticalAlign: 'bottom',
        },
      },
    },
    yAxis: {
      visible: false,
      min: 0,
      max: getY(repsGoal),
      title: {
        text: 'Automaticity',
      },
      tickAmount: 0,
    },
    plotOptions: {
      series: {
        color: '#39FF14',
        events: {
          legendItemClick() {
            this.chart.fullscreen.open();
            //prevent the label from deactivating the graph
            return false;
          },
        },
      },
    },
    tooltip: {
      formatter: logToolTipFormatter,
    },
    legend: {
      enabled: true,
      align: 'right',
      layout: 'proximate',
      //   verticalAlign: 'top',
      borderRadius: 5,
      backgroundColor: '#b8b4b4',
      labelFormatter: percentLabelFormatter,
    },
    series: [
      {
        showInLegend: true,
        data: generateChartData(repsAdjusted, repsGoal),
        marker: {
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    ],
    credits: {
      enabled: false,
    },
  });

  useEffect(() => {
    setChartOptions({
      tooltip: {
        formatter: logToolTipFormatter,
      },
      legend: {
        labelFormatter: percentLabelFormatter,
      },
      series: [
        {
          data: generateChartData(repsAdjusted, repsGoal),
        },
      ],
    });
  }, [repsAdjusted]);

  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </>
  );
};

export default LogarithmicLine;
