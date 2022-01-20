import { ethers } from 'ethers'
import Network from "./network"
import tokenVestingJson from './TokenVesting.json'
import dexalotTokenJson from './DexalotToken.json'

export async function getTokenVesting(address) {
  const provider = await Network.provider()
  const TokenVesting = new ethers.Contract(address, tokenVestingJson.abi, provider)
  return TokenVesting;
}

export async function getTokenVestingSigner(address) {  
  const signer = await Network.getSigner()
  const TokenVesting = new ethers.Contract(address, tokenVestingJson.abi, signer)
  TokenVesting.connect(signer)
  return TokenVesting;
}

export async function getDexalotToken(address) {
  const provider = await Network.provider()
  const DexalotToken = new ethers.Contract(address, dexalotTokenJson.abi, provider)
  return DexalotToken;
}

export async function getDexalotTokenSigner(address) {  
  const signer = await Network.getSigner()
  const DexalotToken = new ethers.Contract(address, dexalotTokenJson.abi, signer)
  DexalotToken.connect(signer)
  return DexalotToken;
}

// export async function getSimpleToken(address) {
//   const SimpleToken = contract(require('contracts/SimpleToken.json'))
//   const provider = await Network.provider()
//   SimpleToken.setProvider(provider)
//   return SimpleToken.at(address)
// }