/* ===== RequestObect Class ==============================
|  Class with a constructor for requests to create 
|  a block
|  ===============================================*/

class RequestObject {
    constructor(address, message){
        this.walletAddress = address,
        this.requestTimeStamp = new Date().getTime().toString().slice(0,-3),
        this.message = `${address}:${this.requestTimeStamp}:${message}`, // [walletAddress]:[timeStamp]:starRegistry
        this.validationWindow = 300
    }
}
module.exports = RequestObject;