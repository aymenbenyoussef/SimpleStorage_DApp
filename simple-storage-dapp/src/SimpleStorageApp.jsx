import { useEffect, useState } from 'react'
import Web3 from 'web3'
import SimpleStorageArtifact from './SimpleStorage.json'

const NETWORK_ID = '5777'

function SimpleStorageApp() {
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState('')
  const [storedValue, setStoredValue] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [transactionHash, setTransactionHash] = useState('')
  const [status, setStatus] = useState('Connecting to MetaMask...')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function connectToMetaMask() {
      try {
        if (!window.ethereum) {
          throw new Error('MetaMask is not installed.')
        }

        const web3Instance = new Web3(window.ethereum)
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        const networkId = String(await web3Instance.eth.net.getId())
        const deployment = SimpleStorageArtifact.networks[NETWORK_ID]

        if (!deployment?.address) {
          throw new Error('No deployment found for network 5777. Run truffle migrate first.')
        }

        if (networkId !== NETWORK_ID) {
          throw new Error(`Wrong network ID. Expected 5777, received ${networkId}.`)
        }

        if (!accounts[0]) {
          throw new Error('No MetaMask account was selected.')
        }

        const contractInstance = new web3Instance.eth.Contract(
          SimpleStorageArtifact.abi,
          deployment.address,
        )
        const value = await contractInstance.methods.get().call()

        setContract(contractInstance)
        setAccount(accounts[0] || '')
        setStoredValue(String(value))
        setStatus('Connected to MetaMask')
      } catch (error) {
        setStatus(error.message)
      }
    }

    connectToMetaMask()
  }, [])

  async function readStoredValue() {
    if (!contract) {
      return
    }

    try {
      const value = await contract.methods.get().call()
      setStoredValue(String(value))
      setStatus('Value read from the blockchain')
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function updateStoredValue(event) {
    event.preventDefault()

    if (!contract || !account || inputValue === '') {
      return
    }

    setIsSubmitting(true)
    setTransactionHash('')
    setStatus('Sending transaction...')

    try {
      const receipt = await contract.methods
        .set(inputValue)
        .send({ from: account })
      const value = await contract.methods.get().call()

      setStoredValue(String(value))
      setTransactionHash(receipt.transactionHash)
      setInputValue('')
      setStatus('Transaction confirmed by MetaMask')
    } catch (error) {
      setStatus(error.code === 4001 ? 'Transaction rejected in MetaMask' : error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="storage-app">
      <p className="eyebrow">GANACHE / NETWORK 5777</p>
      <h1>Simple Storage</h1>
      <p className="status">{status}</p>

      <section className="value-panel" aria-live="polite">
        <span>Stored value</span>
        <strong>{storedValue || '--'}</strong>
        <button type="button" onClick={readStoredValue} disabled={!contract || isSubmitting}>
          Get stored value
        </button>
      </section>

      <form onSubmit={updateStoredValue}>
        <label htmlFor="storage-value">New value</label>
        <div className="input-row">
          <input
            id="storage-value"
            type="number"
            min="0"
            step="1"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Enter a uint256"
            required
          />
          <button type="submit" disabled={isSubmitting || !contract}>
            {isSubmitting ? 'Sending...' : 'Store value'}
          </button>
        </div>
      </form>

      <p className="account">Account: {account || 'Unavailable'}</p>
      {transactionHash && (
        <p className="transaction">
          Transaction: <a href={`#${transactionHash}`}>{transactionHash}</a>
        </p>
      )}
    </main>
  )
}

export default SimpleStorageApp
