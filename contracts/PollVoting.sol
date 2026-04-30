// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PollVoting {

    // The address of the server wallet — only this address can record votes
    address public owner;

    // Stores whether a vote hash has been recorded
    // mapping means: given a hash, tell me if it exists
    mapping(bytes32 => bool) private recordedVotes;

    // Event emitted every time a vote is successfully recorded
    event VoteRecorded(bytes32 indexed voteHash);

    // Runs once when the contract is deployed — sets the owner to whoever deployed it
    constructor() {
        owner = msg.sender;
    }

    // Only the owner (your server wallet) can call functions with this modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorised");
        _;
    }

    // Records a vote hash on-chain
    // Can only be called by the server wallet
    function recordVote(bytes32 voteHash) external onlyOwner {
        require(!recordedVotes[voteHash], "Vote already recorded");
        recordedVotes[voteHash] = true;
        emit VoteRecorded(voteHash);
    }

    // Anyone can call this to check if a vote hash exists
    function hasVoted(bytes32 voteHash) external view returns (bool) {
        return recordedVotes[voteHash];
    }
}