/** @format */

import numeral from "numeral";


export const formatNumber = (val: string | number)=>numeral(Number(val)).format('0,0.00'); 
