const TzDate = require('./tzDate');

const tzDate = new TzDate(null, 0);
tzDate.setHours(1);
console.log(tzDate.format());
console.log(tzDate.getTimestamp());

const tzDate2 = tzDate.createAnotherTZ(8);

console.log(tzDate2.format());
console.log(tzDate2.getTimestamp());
