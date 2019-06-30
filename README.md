# Project #2. Private Blockchain

This is Project 2, Private Blockchain, in this project I created the classes to manage my private blockchain, to be able to persist my blochchain I used LevelDB.

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node simpleChain.js__ in the root directory.

## Testing the project

The file __simpleChain.js__ in the root directory has all the code to be able to test the project, please review the comments in the file and uncomment the code to be able to test each feature implemented:

* Uncomment the function:
```
(function theLoop (i) {
	setTimeout(function () {
		let blockTest = new Block("Test Block - " + (i + 1));
		myBlockChain.addNewBlock(blockTest).then((result) => {
			console.log(result);
			i++;
			if (i < 10) theLoop(i);
		});
	}, 10000);
  })(0);
```
This function will create 10 test blocks in the chain.
* Uncomment the function
```
myBlockChain.getBlockChain().then((data) => {
	console.log( data );
})
.catch((error) => {
	console.log(error);
})
```
This function print in the console the list of blocks in the blockchain
* Uncomment the function
```
myBlockChain.getBlock(0).then((block) => {
	console.log(JSON.stringify(block));
}).catch((err) => { console.log(err);});

```
This function get from the Blockchain the block requested.
* Uncomment the function
```
myBlockChain.validateBlock(0).then((valid) => {
	console.log(valid);
})
.catch((error) => {
	console.log(error);
})
```
This function validate and show in the console if the block is valid or not, if you want to modify a block to test this function uncomment this code:
```
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
```
* Uncomment this function:
```
myBlockChain.validateChain().then((errorLog) => {
	if(errorLog.length > 0){
		console.log("The chain is not valid:");
		errorLog.forEach(error => {
			console.log(error);
		});
	} else {
		console.log("No errors found, The chain is Valid!");
	}
})
.catch((error) => {
	console.log(error);
})
```

This function validates the whole chain and return a list of errors found during the validation.

## What do I learned with this Project

* I was able to identify the basic data model for a Blockchain application.
* I was able to use LevelDB to persist the Blockchain data.
* I was able to write algorithms for basic operations in the Blockchain.

## Node.js framework 
* Express Framework for RESTful API

## Endpoint documentation

/*********/
Title:
To validate request with JSON response.

URL:
/requestValidation

Method:
POST

Data Params:
address=[ADDRESS]
Here, address is wallet address of the user initiating the request

Success Response:
Code: 200
Content: {
    "walletAddress": <WalletAddress>,
    "requestTimeStamp": <TimeStamp>,
    "message":  <[WalletAddress]:[TimeStamp]:starRegistry>
    "validationWindow": 300
}

Error Response:
Please provide Address of your new Request


/*********/
Title:
To validate message signature with JSON response.

URL:
/message-signature/validate

Method:
POST

Data Params:
An object containing object as key
{
	"address":<WalletAddress>,
  "signature":<Signature>
}

Success Response:
Code: 200
Content: {
    "registerStar": true,
    "status": {
        "address": <WalletAddress>,
        "requestTimeStamp":  <TimeStamp>,
        "message":  <[WalletAddress]:[TimeStamp]:starRegistry>
        "validationWindow": <TimeStamp when the request was successfully validated>,
        "messageSignature": true, // Signature verified
    }
}

Error Response:
1) When the request was not validated within the 300 seconds time window:
Error: "Transaction expired"

2) When the signature of the user is invalid
Error: "Signature Invalid"

3_ When the data params is empty
Error: "Please provide address and signature"


/*********/
Title:
To submit the Star information to be saved in the Blockchain.

URL:
/block

Method:
POST

Data Params:
An object containing object as key
{
	"address": <WalletAddress>
  "star": {
			"dec": <co-ordinates>,
			"ra": <co-ordinates>,
			"story": <textstring> // Example <"Found star using https://www.google.com/sky/">
    }
}

Success Response:
Code: 200
Content: {
   "hash": <Block hash generated using SHA256>,
    "height": <Block Height>
    "body": {
        "address": <WalletAddress>
        "star": {
            "ra": <co-ordinates>,
            "dec": <co-ordinates>
            "story": <Encoded story string>
        }
    },
    "time": <TimeStamp>,
    "previousBlockHash": <HASH value of previous block>
}

Error Response:
a) When more than one star story is included in the input object
Error: "Incorrect star data"

b) When the transaction is removed from valid memory pool, because time for waiting was removed
Error: "Request is invalid. Cannot add block. Create a new validation Request"

c) When any error occureed while adding block
Error: "Block <block-number> cannot be added"


/*********/
Title:
To get the information of the block in a blockchain, using hash

URL:
/stars

Method:
GET

URL Params:
hash:[HASH]
Here, HASH is hash of the block

Success Response:
Code: 200
Content: {
  "hash": <Block hash generated using SHA256>,
  "height": <Block Height>
  "body": {
    "address": <WalletAddress>,
    "star": {
      "ra": <co-ordinates>
      "dec": <co-ordinates>,
      "story": <Encoded star story>
      "storyDecoded": <Decoded star story>
    }
  },
  "time": <TimeStamp>,
  "previousBlockHash": <HASH value of previous block>
}

Error Response:
Block not found



/*********/
Title:
To get the information of the block in a blockchain, using wallet address 

URL:
/stars

Method:
GET

URL Params:
address:[ADDRESS]
Here, ADDRESS is wallet address

Success Response:
List of all the blocks for given wallet address
Code: 200
Content: [
   {block1},
	 {block2},
	 {block3}
]
where block structure is as follows:
block = {
  "hash": <Block hash generated using SHA256>,
  "height": <Block Height>
  "body": {
    "address": <WalletAddress>,
    "star": {
      "ra": <co-ordinates>
      "dec": <co-ordinates>,
      "story": <Encoded star story>
      "storyDecoded": <Decoded star story>
    }
  },
  "time": <TimeStamp>,
  "previousBlockHash": <HASH value of previous block>
}

Error Response:
Blocks not found


/*********/
Title:
To get the information of the block in a blockchain, using block height

URL:
/block

Method:
GET

URL Params:
height:[HEIGHT]
Here, HASH is hash of the block

Success Response:
List of all the blocks for given wallet address
Code: 200
Content:  {
  "hash": <Block hash generated using SHA256>,
  "height": <Block Height>
  "body": {
    "address": <WalletAddress>,
    "star": {
      "ra": <co-ordinates>
      "dec": <co-ordinates>,
      "story": <Encoded star story>
      "storyDecoded": <Decoded star story>
    }
  },
  "time": <TimeStamp>,
  "previousBlockHash": <HASH value of previous block>
}
Error Response:
Blocks not found


