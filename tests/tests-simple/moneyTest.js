import {formatCurrency} from '../../Scripts/utils/money.js';


// Test Cases - situation we're testing

console.log('test suit: formatCurrency'); //test-suit: group of related tests

console.log('converts cents into dollars'); //giving name to the test cases

if (formatCurrency(2095) === '20.95'){
  console.log('passed')
}else{
  console.log('failed');
}

console.log('Works with 0');

if(formatCurrency(0) === '0.00'){
  console.log('passed')
}else{
  console.log('failed');
}

console.log('rounds up to nearest cent');

if (formatCurrency(2000.5) === '20.01'){
 console.log('passed')
}else{
  console.log('failed');
}
