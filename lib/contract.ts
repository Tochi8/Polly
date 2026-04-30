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
    const contract = getContract()

    // Convert the hex string hash to bytes32 format the contract expects
    const bytes32Hash = ethers.encodeBytes32String(voteHash.slice(0, 31))

    const tx = await contract.recordVote(bytes32Hash)

    // Wait for the transaction to be confirmed on-chain
    const receipt = await tx.wait()

    // Return the transaction hash — this is what gets stored in Supabase
    return receipt.hash
}

// Checks if a vote hash exists on-chain — used for verification
export async function checkVoteOnChain(voteHash: string): Promise<boolean> {
    const contract = getContract()
    const bytes32Hash = ethers.encodeBytes32String(voteHash.slice(0, 31))
    return await contract.hasVoted(bytes32Hash)
}