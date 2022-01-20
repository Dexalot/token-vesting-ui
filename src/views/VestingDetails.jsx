import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import moment from 'moment'
import { ethers } from 'ethers'

import { getTokenVesting, getTokenVestingSigner, getDexalotTokenSigner } from '../contracts'
import { displayAmount } from '../utils'
import Network from '../network'

import { ContractLink } from './Links'
import Emoji from './Emoji'


class VestingDetails extends Component {
  constructor() {
    super()
    this.state = { canRevoke: false }
  }

  async componentWillReceiveProps(nextProps) {
    const { owner, revoked } = nextProps.details
    const accounts = await Network.getAccounts()

    const isOwner = accounts[0]
      ? owner.toLowerCase() === accounts[0].toLowerCase()
      : undefined

    this.setState({ accounts, canRevoke: isOwner && !revoked })
  }

  render() {
    const { start, cliff, end, total, released, vested, revocable, beneficiary } = this.props.details
    const releasable = vested ? vested - released : null

    return <div className="details">
      <h4>Vesting details</h4>
      <Table striped bordered>
        <tbody>
          <TableRow title="Beneficiary">
            <ContractLink address={beneficiary} />
          </TableRow>

          <TableRow title="Start date">
            {this.formatDate(start)}
          </TableRow>

          <TableRow title="Cliff">
            {this.formatDate(cliff)}
          </TableRow>

          <TableRow title="End date">
            {this.formatDate(end)}
          </TableRow>

          <TableRow title="Total vesting">
            {this.formatTokens(total)}
          </TableRow>

          <TableRow title="Already vested">
            {this.formatTokens(vested)}
          </TableRow>

          <TableRow title="Already released">
            {this.formatTokens(released)}
          </TableRow>

          <TableRow title="Releasable">
            <Releasable releasable={releasable} onRelease={() => this.onRelease()}>
              {this.formatTokens(releasable)}
            </Releasable>
          </TableRow>

          <TableRow title="Auction">
            <Portfolio releasable={releasable} onPortfolioApprove={() => this.onPortfolioApprove()} onFundPortfolio={() => this.onFundPortfolio()}>
              {this.formatTokens(releasable)}
            </Portfolio>
          </TableRow>

          <TableRow title="Revocable">
            <Revocable revocable={revocable} canRevoke={this.state.canRevoke} onRevoke={() => this.onRevoke()} />
          </TableRow>
        </tbody>
      </Table>
    </div>
  }

  formatDate(date) {
    if (!date) return
    const milliseconds = date * 1000
    return moment(milliseconds).format("dddd, MMMM Do YYYY, h:mm:ss a")
  }

  formatTokens(amount) {
    if (amount == null) return
    const { decimals, symbol } = this.props.details
    const display = displayAmount(amount, decimals)

    return `${display} ${symbol}`
  }

  startLoader() {
    this.props.setLoader(true)
  }

  stopLoader() {
    this.props.setLoader(false)
  }

  async getTokenVesting() {
    return getTokenVesting(this.props.address)
  }

  async getTokenVestingSigner() {
    return getTokenVestingSigner(this.props.address)
  }

  async getDexalotTokenSigner() {
    return getDexalotTokenSigner(this.props.token)
  }

  async onRelease() {
    const { token } = this.props
    const tokenVesting = await this.getTokenVestingSigner()

    try {
      this.startLoader()
      let tx = await tokenVesting.release(token)
      await tx.wait()
      this.props.getData()
    } catch (e) {
      console.log(e)
      this.stopLoader()
    }
  }

  async onFundPortfolio() {
    const { token } = this.props
    const tokenVesting = await this.getTokenVestingSigner()

    try {

      this.startLoader()

      let tx = await tokenVesting.setFundingPortfolio(token, true)
      await tx.wait()

      this.props.getData()
    } catch (e) {
      console.log(e)
      this.stopLoader()
    }
  }

  async onPortfolioApprove() {
    const { released, vested } = this.props.details
    const releasable = vested ? vested - released : null
    const tokenVesting = await this.getTokenVesting()
    const tokenContract = await this.getDexalotTokenSigner();

    try {
      this.startLoader()
      await tokenContract.increaseAllowance(tokenVesting.address, ethers.utils.formatUnits(releasable.toString(), "wei"))
      this.props.getData()
    } catch (e) {
      console.log(e)
      this.stopLoader()
    }
  }

  async onRevoke() {
    const { token } = this.props
    const tokenVesting = await this.getTokenVestingSigner()

    try {
      this.startLoader()
      await tokenVesting.revoke(token)
      this.props.getData()
    } catch (e) {
      this.stopLoader()
    }
  }
}


function TableRow({ title, children }) {
  return (
    <tr>
      <th>{title}</th>
      <td>
        {children}
      </td>
    </tr>
  )
}


function Revocable({ revocable, onRevoke, canRevoke }) {
  if (!revocable) return <Emoji e="❌" />

  return <span>
    <Emoji e="✅" />
    {canRevoke ? <a className="action" onClick={onRevoke}>revoke</a> : null}
  </span>
}


function Releasable({ releasable, onRelease, children }) {
  return <span>
    {children}
    {releasable > 0 ? <a className="action" onClick={onRelease}>release</a> : null}
  </span>
}

function Portfolio({ releasable, onPortfolioApprove, onFundPortfolio }) {
  return <span>

    <a className="action" onClick={onFundPortfolio}>join</a>
    {releasable > 0 ? <a className="action" onClick={onPortfolioApprove}>approve</a> : null}


  </span>
}

export default VestingDetails