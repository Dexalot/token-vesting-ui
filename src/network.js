import { ethers } from 'ethers'
import { sleep } from './utils'

const Network = {
  async web3() {
    const provider = await Network.provider();
    return provider;
  },

  async eth() {
    const web3 = await Network.web3()
    return web3.eth
  },

  async provider() {
    let { ethereum } = window

    while (ethereum === undefined) {
      Network.log("Waiting for web3")
      await sleep(500)
      ethereum = window.ethereum
    }
  
    return new ethers.providers.Web3Provider(ethereum)
  },

  getAccounts() {
    
    return Network.web3().then(web3 => web3.listAccounts())
    // return new Promise((resolve, reject) => {
      
      // Network.eth().then(eth => eth.getAccounts(Network._web3Callback(resolve, reject)))
    // })
  },

  async getSigner() {
    
    return (await Network.provider()).getSigner()
  },

  _web3Callback(resolve, reject) {
    return (error, value) => {
      if (error) reject(error)
      else resolve(value)
    }
  },

  log(msg) {
    console.log(`[Network] ${msg}`)
  }
}

export default Network