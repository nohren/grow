import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsReact from 'highcharts-react-official';
import habitConfig from '../../utils/habitConfig';
import { formatNumberToString, roundNumber } from '../../utils/utils';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

const { repsGoal, getY } = habitConfig;

/**
 * TODO
 * Size this according to the parent container space
 *
 * An svg is created on mount.  For some reason there is a bunch of space it does not use.  Why is that?
 *
 *
 *
 * Remove the chart top right icon.  Keep full screen functionality
 */
const LogarithmicLine = (props) => {
  const { repsAdjusted } = props ?? {};

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
      )}</b><br/>Automaticity: <b>${formatNumberToString(
        (getY(repsAdjusted) / getY(repsGoal)) * 100
      )}%</b><br/>`;
    }
    return false;
  };

  const [chartOptions, setChartOptions] = useState({
    title: {
      //text: "Habit Training"
      text: undefined,
    },
    chart: {
      backgroundColor: '#000000',
      width: 208,
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
      },
    },
    tooltip: {
      formatter: logToolTipFormatter,
    },
    legend: {
      enabled: false,
      align: 'center',
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
