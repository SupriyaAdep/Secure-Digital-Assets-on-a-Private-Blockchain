/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        return this.bd.getBlocksCount().then(res => res).catch(err => err);
    }

    // Add new block
    async addBlock(newBlock) {
        let blockHeight = await this.getBlockHeight();
        if(blockHeight === 0) {
            newBlock.height = 0;
        }
        else{
            newBlock.height = blockHeight;
            let previousBlock = await this.getBlock(newBlock.height - 1);
            newBlock.previousblockhash = previousBlock.hash
        }
        newBlock.time = new Date().getTime().toString().slice(0,-3);// time calculation
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        return this.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock));
    }

    // Get Block By Height
    getBlock(height) {
        return this.bd.getLevelDBData(height).then(res => res).catch(err => err);
    }

    // Validate if Block is being tampered by Block Height
    async validateBlock(height) {
        // get block
        let self = this;
        let blockObj = await self.getBlock(height);
        return new Promise(function(resolve, reject){
            let blockHash = blockObj.hash;
            blockObj.hash = '';
            let validBlockHash = SHA256(JSON.stringify(blockObj)).toString();
            if (blockHash===validBlockHash) {
                console.log("Block no "+height+" is valid");
                resolve(true);
             } else {
                console.log('Block #'+height+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                reject(false);
             }
        })
    }

    // Validate Blockchain
    validateChain() {
        let errorLog = [];
        let self = this;
        return new Promise(async (resolve, reject) => { // <--- this line
            const height =  await this.getBlockHeight();
            for (let i =0; i < height -1 ; i++) {
                self.validateBlock(i)
                    .then((valid) => {console.log('validate block - ', i, ' is ', valid)})
                    .catch((error) => { errorLog.push(i)})
                let curBlock = await self.getBlock(i);
                let nextBlock = await self.getBlock(i+1);
                let curblockHash = curBlock.hash;
                let nexblockPrevHash = nextBlock.previousblockhash;
                if (curblockHash!==nexblockPrevHash) {
                    errorLog.push(i);
                    console.log('Chain --Block #'+i+' invalid hash:\n'+ curblockHash +'<>'+ nexblockPrevHash);
                }
            } 
            if (errorLog.length>0) {
               console.log('Block errors = ' + errorLog.length);
               console.log('Blocks: '+errorLog);
               reject(errorLog)
            } else {
               resolve(errorLog)
            }
        });
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }

    // Get Block By hash value
    getBlockByHashValue(hash){
        return this.bd.getBlockByHash(hash).then(res => res).catch(err => err);
    }

    // Get all blocks By wallet address
    getBlocksByWalletAdressValue(walletAddress){
        return this.bd.getBlocksByWalletAddress(walletAddress).then(res => res).catch(err => err);
    }
   
}

module.exports = Blockchain;