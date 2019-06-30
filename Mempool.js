/** 
* ******MEMPOOL COMPONENT******
*/
const bitcoinMessage = require('bitcoinjs-message'); 

class MemPool {
    constructor() {
        this.memPool = []; // temporary storage for validation requests:
        this.timeoutRequests = [], // temporary storage for time out requests:
        this.mempoolValid = []; // temporary storage valid requests:
    }
    
    // get request object details from mempool
    getDetailsFromMemPool(cWalletAddress){
        return this.memPool[cWalletAddress]
    }

    // Add reuest to validate in mempool
    addRequestValidation(newRequestObject, requestTimeOut){
        let self = this;
        this.memPool[newRequestObject.walletAddress] = newRequestObject;
        this.timeoutRequests[newRequestObject.walletAddress]=setTimeout(function(){ self.removeValidationRequest(newRequestObject.walletAddress); console.log('SET-TIME-OUT')}, requestTimeOut );
    }
    
    // Delete the request from mempool and timeout-request
    removeValidationRequest(cWalletAddress){
        this.memPool[cWalletAddress] = null;
        this.timeoutRequests[cWalletAddress] = null;
        clearTimeout(this.timeoutRequests[cWalletAddress])
    }
    
    // Once the request in validated, add the validated mempool in Valid Mempool array
    storeToValidMemPool(cWalletAddress){
        try{
            this.mempoolValid[cWalletAddress] = cWalletAddress
            this.memPool[cWalletAddress] = null;
            this.timeoutRequests[cWalletAddress] = null;
            clearTimeout(this.timeoutRequests[cWalletAddress])
            return true;
        }catch(e){
            return false;
        }
    }

    // Check if the window time has expired or not
    verifyTimeLeft(cWalletAddress) {
        if(this.memPool[cWalletAddress]){
            return true;
        }
        else return false;
    }

    // Verify if the request validation exists and if it is valid.
    verifyAddressRequest(cWalletAddress){
        if(this.mempoolValid[cWalletAddress]){
            return true;
        }
        else return false;
    }

    // Validate the request by wallet address and store it to an array of validated mempool
    validateRequestByWallet(requestData){
        let address =  requestData.address;
        let signature = requestData.signature;
        let isWindowTimeLeft = this.verifyTimeLeft(address);
        if (!isWindowTimeLeft) {
            return "Request expired"
        } 
        let requestObject = this.getDetailsFromMemPool(address);
        const { message, requestTimeStamp, validationWindow } = requestObject;
        const isValid = bitcoinMessage.verify(message, address, signature);;
        if(!isValid){ 
            const isStored = this.storeToValidMemPool(address) 
            if ( isStored ) {
                let obj = {
                    registerStar:true,
                    status: {
                        address,
                        requestTimeStamp,
                        message,
                        validationWindow,
                        messageSignature: true
                    }
                } 
                return obj;
            }
        }
        return 'Signature Invalid'
    }
    
}
module.exports = MemPool;

//  timeouts[address] = setTimeout(function(){ removeWhiteList(address) }, whiteListTimeWall );