import React from "react";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import { HistoryTable } from "./HistoryTable";

import "./App.css";
import { connect } from "react-redux";
import { State } from "./redux/reducers";
import {
  fetchDataAction,
  ConnectedComponentProps,
  SPData,
} from "./redux/actions";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

export type TableData = SPData & { cumulativeReturn: number };

interface ReduxProps {
  spData: SPData[];
}

type ComponentProps = ConnectedComponentProps<{}, ReduxProps>;

interface ComponentState {
  startYear: number;
  endYear: number;
  minYear: number;
  maxYear: number;
  startFilteredData: TableData[];
  tableData: TableData[];
}

const mapStateToProps = (state: State) => {
  return {
    spData: state.root.data,
  };
};

class App extends React.Component<ComponentProps> {
  public state: ComponentState = {
    startYear: 0,
    endYear: 0,
    minYear: 0,
    maxYear: 0,
    /** this is the data obtained by recalculating cumulative whenever start changes */
    startFilteredData: [],
    /** this is the data that is displayed in the table */
    tableData: [],
  };

  private addCumulativeToData = (sourceData: SPData[]) => {
    const cumulativeReturns = sourceData
      .map(({ totalReturn }) => totalReturn)
      .reduce<number[]>(
        (acc, current) => {
          let cumulative: number =
            (1 + acc[acc.length - 1] / 100) * (1 + current / 100);
          cumulative = (cumulative - 1) * 100;
          /** toFixed retuns string with trailing zeroes so cast it to a number */
          cumulative = Number(cumulative.toFixed(2));
          acc.push(cumulative);
          return acc;
        },
        [0]
      );
    const newData: TableData[] = sourceData.map((row, idx) => ({
      ...row,
      cumulativeReturn: cumulativeReturns[idx + 1],
    }));

    return newData;
  };

  public componentDidMount() {
    this.props.dispatch(fetchDataAction());
  }

  public componentDidUpdate(prevProps: ComponentProps) {
    /** when data from  redux store changes, re-initialize state */
    if (this.props.spData !== prevProps.spData) {
      const years = this.props.spData.map((item) => item.year);
      const startYear = Math.min(...years);
      const endYear = Math.max(...years);

      this.setState({
        startYear,
        endYear,
        minYear: startYear,
        maxYear: endYear,
      });

      const newData: TableData[] = this.addCumulativeToData(this.props.spData);
      this.setState({ startFilteredData: newData, tableData: newData });
    }
  }

  /**
   *
   * When start year changes we recalculate cumulative and display the table
   *
   * When end changes there are two scenarios:
   * if new end > current end we filter data from startFilteredData
   * if new end < current end we filter data from tableData
   *
   * This kind of seperation of start and end changes helps us avoid unnecessary recalculation of cumulative
   * when end changes with a slight trade-off in managing two lists startFilteredData and tableData
   * instead of just tableData
   *
   * I would probably not do this optimization in production for this particular task in favor of read-ability since the data is
   * reasonably small and calculating cumulative is relatively in-expensive but I just wanted to demonstrate
   * the ability of doing this optimization, generally speaking
   */
  private handleSliderChange = ([newStartYear, newEndYear]: [
    number,
    number
  ]) => {
    const { startYear, endYear, startFilteredData, tableData } = this.state;
    if (newStartYear !== startYear) {
      this.setState({ startYear: newStartYear });
      const filteredData = this.props.spData.filter(
        ({ year }) => newStartYear <= year
      );
      const startFilteredData: TableData[] = this.addCumulativeToData(
        filteredData
      );
      const tableData = startFilteredData.filter(
        ({ year }) => year <= newEndYear
      );

      this.setState({
        startFilteredData,
        tableData,
      });
    }
    if (newEndYear !== endYear) {
      this.setState({ endYear: newEndYear });
      if (newEndYear > endYear) {
        const filteredData = startFilteredData.filter(
          ({ year }) => newStartYear <= year && year <= newEndYear
        );
        this.setState({ tableData: filteredData });
      } else {
        const filteredData = tableData.filter(
          ({ year }) => newStartYear <= year && year <= newEndYear
        );
        this.setState({ tableData: filteredData });
      }
    }
  };

  public render() {
    const { startYear, endYear, minYear, maxYear } = this.state;
    return (
      <div className="App">
        <header className="App-header">S&amp;P 500 Historical Returns</header>
        <div className="body-container">
          <div className="range-container">
            <label htmlFor="year-range">Filter by year:</label>
            <div className="year-range-container">
              <Range
                defaultValue={[minYear, maxYear]}
                min={minYear}
                max={maxYear}
                marks={{ [minYear]: minYear, [maxYear]: maxYear }}
                onChange={this.handleSliderChange}
                value={[startYear, endYear]}
                tipFormatter={(value: number) => `${value}`}
                id="year-range"
              />
            </div>
          </div>
          <HistoryTable data={this.state.tableData} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
