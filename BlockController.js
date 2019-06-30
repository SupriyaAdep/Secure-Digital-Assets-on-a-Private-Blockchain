const hex2ascii = require('hex2ascii');
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');
const Mempool = require('./Mempool.js');
const RequestObject = require('./RequestObject.js');

let myBlockChain = new BlockChain();
let memPool = new Mempool();

/**
 * Controller Definition to encapsulate routes to work with blocks
*/
class BlockController {
    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.postBlock();
        this.getBlockByHeight();
        this.requestValidation();
        this.validate();
        this.getStarByHash();
        this.getStarByWAdress();
    }

    /**
    * Implement a POST Endpoint to add a new Block, url: "/block"
    */
    postBlock() {
        this.app.post("/block", async (req, res) => {
            // Store Address and Star Object
            if(!req.body)
            return res.status(422).json( {errors: { data: "cannot be blank" }})
            const wAddress = req.body.address;
            const starDetails = req.body.star;

            let isNested = Object.keys(starDetails).some(function(key) {
                return starDetails[key] && typeof starDetails[key] === 'object';
            });
            if(isNested) {
                res.status(422).json( { errors: "Incorrect star data" })
            }
            let isRequestValid = memPool.verifyAddressRequest(wAddress); 
            if(!isRequestValid) {
                res.status(422).json( { errors: "Request invalid. Cannot add block. Create a new validation Request" })
                return;
            }
            let blockBody = {
                address: wAddress,
                star: {
                    ra: starDetails.ra,
                    dec: starDetails.dec,
                    story: Buffer(starDetails.story).toString('hex'),
                }
            }
            let newBlock = new Block(blockBody);
            let json_newblock = await myBlockChain.addBlock(newBlock);
            res.send(JSON.parse(json_newblock));
        });
    }

    /**
    * Implement a GET Endpoint to retrieve a block by height, url: "/block/:HEIGHT"
    */
    getBlockByHeight() {
        this.app.get("/block/:HEIGHT", (req, res) => {
            myBlockChain.getBlock(req.params.HEIGHT).then((block) => {                
                if(block.height == req.params.HEIGHT)
                {
                    block['body']['star']['storyDecoded'] = hex2ascii(block.body.star.story);
                    res.send(block);
                }
                else {
                    console.log(2)
                    return res.status(404).send(block);
                }
            }).catch((err) => {
                return res.status(422).json( { errors: "Block not found." })
            });

        });
    }

    /**
    * Implement a post endpoint to let user to submit a validation request
    */
    requestValidation() {
        this.app.post("/requestValidation", async (req, res) => {
            // Add your code here
            const payload = req.body;
            const TimeoutRequestsWindowTime = 5*60*1000;

            if (payload.address != "") {
                let requestWalletAddress =  payload.address;
                // Check if the request already exist in mempool
                let validationRequestDetails = memPool.getDetailsFromMemPool(requestWalletAddress);
                if( validationRequestDetails == undefined ) { 
                    // Request Not found, hence create one
                    let newRequestObject = new RequestObject(requestWalletAddress, 'starRegistry');
                    memPool.addRequestValidation(newRequestObject, TimeoutRequestsWindowTime);
                    res.send(newRequestObject); 
                } else {
                    // Update the validation Window Time
                    let timeElapse = (new Date().getTime().toString().slice(0,-3)) - validationRequestDetails.requestTimeStamp;
                    let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
                    validationRequestDetails.validationWindow = timeLeft;
                    res.send(validationRequestDetails); 
                }
            } else {
                res.status(422).json( { errors: 'Please provide Address of your new Request'})
            }
        });
    }

    /**
    * Implement a post endpoint to validate the message signature
    */
    validate() {
        this.app.post("/message-signature/validate", (req, res) => {
            const payload = req.body;
            if (payload.address != "" || payload.signature != '') {
                let requestObject = memPool.validateRequestByWallet(payload);
                res.send(requestObject)
            }else {
                res.status(422).json( { errors: 'Please provide address and signature'})
            }
        })
    }

    /**
    * Implement a get endpoint to fetch star data by hash value
    */
    getStarByHash(){
        this.app.get("/stars/hash/:HASH", (req, res) => {
            myBlockChain.getBlockByHashValue(req.params.HASH).then((block) => {
                if(block)
                {
                    block['body']['star']['storyDecoded'] = hex2ascii(block.body.star.story);
                    res.send(block)
                }
                else {
                    return res.status(422).json( { errors: "Block not found." })
                }
            }).catch((err) => {
                return res.status(422).json( { errors: "Error Occured while fetching block." })
            });
        })
    }

    /**
    * Implement a get endpoint to fetch star data by wallet address
    */
    getStarByWAdress(){
        this.app.get("/stars/address/:ADDRESS", (req, res) => {
            myBlockChain.getBlocksByWalletAdressValue(req.params.ADDRESS).then((blocks) => {
                if(blocks.length !== 0)
                {
                    res.send((blocks))
                }
                else {
                    return res.status(422).json({ errors: "Block not found" })
                }
            }).catch((err) => {
                return res.status(422).json({ errors: "Block not found" })
            });
        })
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}