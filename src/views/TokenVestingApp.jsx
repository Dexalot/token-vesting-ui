import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import { getTokenVesting, getDexalotToken } from '../contracts'

import Header from './Header'
import VestingDetails from './VestingDetails'
import VestingSchedule from './VestingSchedule'
import Spinner from './Spinner'

import '../stylesheets/TokenVestingApp.css'


class TokenVestingApp extends Component {
  constructor() {
    super()
    this.state = { name: 'Token', loading: true }
  }

  componentDidMount() {
    this.getData()
  }

  render() {
    const { address, token } = this.props
    return (
      <div className="TokenVestingApp">

        { this.state.loading ? <Spinner /> : null }

        <Header address={ address } token={ token } tokenName={ this.state.name } />

        <Container>
          <Row>
            <Col xs={12} md={6}>
              <VestingDetails
                address={ address }
                token={ token }
                details={ this.state }
                getData={ () => this.getData() }
                setLoader={ x => this.setLoader(x) }
              />
            </Col>

            <Col xs={12} md={6}>
              <VestingSchedule details={ this.state } />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  setLoader(loading) {
    this.setState({ loading })
  }

  async getData() {
    const { address, token } = this.props

    const tokenVesting = await getTokenVesting(address)
    const tokenContract = await getDexalotToken(token)

    const start = await tokenVesting.start()
    const duration = await tokenVesting.duration()
    const end = start + duration

    const balance  = await tokenContract.balanceOf(address)
    const released = await tokenVesting.released(token)
    const total = balance + released

    this.setState({
      start,
      end,
      cliff: await tokenVesting.cliff(),
      total,
      released,
      vested: await tokenVesting.vestedAmount(token),
      decimals: await tokenContract.decimals(),
      beneficiary: await tokenVesting.beneficiary(),
      owner: await tokenVesting.owner(),
      revocable: await tokenVesting.revocable(),
      revoked: await tokenVesting.revoked(token),
      name: await tokenContract.name(),
      symbol: await tokenContract.symbol(),
      loading: false
    })
  }
}


export default TokenVestingApp
