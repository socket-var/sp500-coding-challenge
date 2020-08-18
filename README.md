# S&P Challenge:

## Problem statement:

1. Download S&P 500 index returns by year (https://www.slickcharts.com/sp500/returns)

2. Build a single page app which shows a table similar to how it is displayed in the slickcharts link above

but, the year column is sorted ascending, and with an additional column `Cumulative returns` showing returns from the beginning

3. on top of the table have a slider component (https://github.com/react-component/slider)

use a range slider like the one in http://react-component.github.io/slider/examples/handle.html (Range with custom handle)

The range would be the start and end years

the table below would filter out to show only the years and the cumulative returns between them

for e.g say you have downloaded S&P 500 index returns from 1970 - 2018

the range slider on top would default to the maximim range (1970 - 2018)

the table below would show each year in a row and the return and cumulative return

If you change the range slider to 2000 to 2010

the table below would show only those 11 rows (2000 - 2010 both inclusive) and the cumulative return from 2000

You may upload the repository to GitHub under your profile once you are done

## Details:

- This repository uses React and TypeScript
- The code is organized into a simple smart-dumb component relationship between App and HistoryTable components
- To run this, in the root of the repository do `yarn install` and `yarn start`

## Demo Screen Recording:

https://www.loom.com/share/8f09fef5815d4fc4b0c3ca56914bdf78
