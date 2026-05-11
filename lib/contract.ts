import { ethers } from 'ethers'

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!
const PRIVATE_KEY = process.env.SERVER_WALLET_PRIVATE_KEY!

// The ABI tells ethers.js which functions exist on the contract
const ABI = [
    "function recordVote(bytes32 voteHash) external",
    "function hasVoted(bytes32 voteHash) external view returns (bool)"
]

// Creates a connection to the deployed contract using the server wallet
function getContract() {
    const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology")
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet)
    return contract
}

// Records a vote hash on-chain and returns the transaction hash
export async function recordVoteOnChain(voteHash: string): Promise<string> {
    console.log('Attempting blockchain transaction...')
    const contract = getContract()
    try {
        const bytes32Hash = ethers.encodeBytes32String(voteHash.slice(0, 31))
        const tx = await contract.recordVote(bytes32Hash)
        console.log('Transaction sent:', tx.hash)
        const receipt = await tx.wait()
        console.log('Transaction confirmed:', receipt.hash)
        return receipt.hash
    } catch (err) {
        console.error('Blockchain error:', err)
        throw err
    }
}
// Checks if a vote hash exists on-chain — used for verification
export async function checkVoteOnChain(voteHash: string): Promise<boolean> {
    const contract = getContract()
    const bytes32Hash = ethers.encodeBytes32String(voteHash.slice(0, 31))
    return await contract.hasVoted(bytes32Hash)
}