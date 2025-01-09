## Quick start

```jsx
const { colt } = require('cols');

// 印出紅色字
colt('hello world').red().log();

// 印出紅色字，但Jack是綠色
colt('hi' + col('Jack').green() + '.').red().log();

// 印出紅色字、綠色背景
colt('with background').bgGreen().red().log();

// 印出色碼是9(紅色)的顏色字
// 色碼參考網站 https://www.ditig.com/256-colors-cheat-sheet
colt('256 color').color256(9).log();

// 印出色碼是9(紅色)的背景色
// 色碼參考網站 https://www.ditig.com/256-colors-cheat-sheet
colt('256 color').bgColor256(9).log();

// 返回字串
colt('return string').red().t();
colt('return string').red().toString();

// 使用hex色碼(支援性不佳，可能有的環境會無效果)
colt('hex color').hex('#fff').log();

// 使用reg色碼(支援性不佳，可能有的環境會無效果)
colt('hex color').rgb(255, 255, 255).log();
```