const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
// const web3 = new Web3(ganache.provider())
const provider = ganache.provider()
const web3 = new Web3(provider)
const { interface, bytecode } = require('../compile')

let accounts
let inbox

beforeEach(async () => {
  // Get a list of all accounts
  // promise
  // web3.eth.getAccounts().then(fetchAccounts => {
  //   console.log(fetchAccounts)
  // })
  // async/await
  accounts = await web3.eth.getAccounts()
  // console.log('accounts: ', accounts)

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ['Hi Arm!']
    })
    .send({ from: accounts[0], gas: '1000000' })

  inbox.setProvider(provider)
})

describe('Inbox', () => {
  it('deploys a contract', () => {
    // console.log(accounts)
    // console.log(inbox)
    assert.ok(inbox.options.address)
  })

  it('has a default message', async () => {
    const message = await inbox.methods.message().call()
    assert.equal(message, 'Hi Arm!')
  })

  it('can change the mesaage', async () => {
    await inbox.methods.setMessage('bye').send({ from: accounts[0] })
    const message = await inbox.methods.message().call()
    assert.equal(message, 'bye')
  })
})

// class Car {
//   park() {
//     return 'stopped'
//   }

//   drive() {
//     return 'vroom'
//   }
// }

// let car

// beforeEach(() => {
//   car = new Car()
// })

// describe('Car', () => {
//   it('can park', () => {
//     assert.equal(car.park(), 'stopped')
//   })

//   it('can drive', () => {
//     assert.equal(car.drive(), 'vroom')
//   })
// })
