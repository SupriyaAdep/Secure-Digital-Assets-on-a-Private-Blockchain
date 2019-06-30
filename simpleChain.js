/* ===== Executable Test ==================================
|  Use this file to test your project.
|  =========================================================*/

const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

let myBlockChain = new BlockChain();

/******************************************
 * Function for Create Tests Blocks   ****
 ******************************************/


// (function theLoop (i) {
// 	setTimeout(function () {
// 		let newBlock = new Block("Test Block - " + (i + 1));
// 		// myBlockChain.addBlock(newBlock);
// 		// // Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
// 		myBlockChain.addBlock(newBlock).then((result) => {
// 		 	console.log('add block result', result);
// 		    i++;
// 		    if (i < 10) theLoop(i);
// 		});
// 	}, 10000);
//   })(0);


/* **********************************************
 ** Function to get the Height of the Chain ****
 ********************************************** */

/* Checked
// Be careful this only will work if `getBlockHeight` method in Blockchain.js file return a Promise
myBlockChain.getBlockHeight().then((height) => {
	console.log('getBlockHeight',  height);
}).catch((err) => { console.log(err);});
*/

/***********************************************
 ******** Function to Get a Block  *************
 ***********************************************/

/* Checked
// Be careful this only will work if `getBlock` method in Blockchain.js file return a Promise
myBlockChain.getBlock(10).then((block) => {
	console.log('getBlock', JSON.stringify(block));
}).catch((err) => { console.log(err);});
*/

/***********************************************
 ***************** Validate Block  *************
 ***********************************************/

/* Checked */
// Be careful this only will work if `validateBlock` method in Blockchain.js file return a Promise
// myBlockChain.validateBlock(3).then((valid) => {
// 	console.log('validate block', valid);
// })
// .catch((error) => {
// 	console.log(error);
// })


/** Tampering a Block this is only for the purpose of testing the validation methods */
/*
myBlockChain.getBlock(5).then((block) => {
	let blockAux = block;
	blockAux.body = "Tampered Block";
	myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
		if(blockModified){
			myBlockChain.validateBlock(blockAux.height).then((valid) => {
				console.log(`Block #${blockAux.height}, is valid? = ${valid}`);
			})
			.catch((error) => {
				console.log(error);
			})
		} else {
			console.log("The Block wasn't modified");
		}
	}).catch((err) => { console.log(err);});
}).catch((err) => { console.log(err);});

myBlockChain.getBlock(6).then((block) => {
	let blockAux = block;
	blockAux.previousBlockHash = "jndininuud94j9i3j49dij9ijij39idj9oi";
	myBlockChain._modifyBlock(blockAux.height, blockAux).then((blockModified) => {
		if(blockModified){
			console.log("The Block was modified");
		} else {
			console.log("The Block wasn't modified");
		}
	}).catch((err) => { console.log(err);});
}).catch((err) => { console.log(err);});

/***********************************************
 ***************** Validate Chain  *************
 ***********************************************/


// Be careful this only will work if `validateChain` method in Blockchain.js file return a Promise
// myBlockChain.validateChain().then((errorLog) => {
// 	if(errorLog.length > 0){
// 		// console.log("The chain is not valid:");
// 		errorLog.forEach(error => {
// 			console.log(error);
// 		});
// 	} else {
// 		console.log("No errors found, The chain is Valid!");
// 	}
// })
// .catch((error) => {
// 	console.log(error);
// })

