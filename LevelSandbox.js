/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';
const hex2ascii = require('hex2ascii');

class LevelSandbox {
  
    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        let block=null;
        return new Promise(function(resolve, reject) {
            self.db.get(key, function (err, value) {
                if(err){
                    if (err.type == 'NotFoundError') {
                        resolve(undefined);
                    }else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err); // likely the key was not found
                        // reject(`Block ${key} not found`) 
                    }
                }
                // Ta da!
                else { 
                    const block = JSON.parse(value);
                    // block['body']['star']['storyDecoded'] = hex2ascii(block.body.star.story);
                    resolve(block) 
                }
            })          
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.put(key, value, function(err) {
                if (err) return console.log('Block ' + key + ' submission failed', err);
                else {
                    resolve(value)
                }
            })
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject){
            let count = 0;
            self.db.createReadStream().on('data', function(data) { count++; }).on('error', function(err) {
                reject('Unable to get block height', err)
            }).on('close', function() {
                resolve(count)
            });
        });
    }

    // Get block by hash
    getBlockByHash(hash) {
        let self = this;
        let block = null;
        return new Promise(function(resolve, reject){
            self.db.createReadStream({ keys: false, values: true })
            .on('data', function (data) {
                const parseData = JSON.parse(data);
                const datahashValue = parseData.hash;
                if(datahashValue == hash){
                    block = parseData;
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(block);
            });
        });
    }

    // Get block by wallet address
    getBlocksByWalletAddress(walletAddress) {
        let self = this;
        let blocks = [];
        return new Promise(function(resolve, reject){
            self.db.createReadStream({ keys: false, values: true })
            .on('data', function (data) {
                const parseData = JSON.parse(data);
                if(parseData.body.address === walletAddress){
                    parseData['body']['star']['storyDecoded'] = hex2ascii(parseData.body.star.story);
                    blocks.push(parseData);
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(blocks);
            });
        });
    }
}

module.exports.LevelSandbox = LevelSandbox;
