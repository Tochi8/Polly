'use client'
import {Poll, Candidate, PollVoter} from '@/types'
import Button from '../ui/Button'

interface CandidateWithVotes extends Candidate {
    voteCount: number
}

interface AlreadyVotedProps {
    poll: Poll
    candidates: CandidateWithVotes[]
    voters: PollVoter[]
    voter: PollVoter
}

export default function AlreadyVoted ({
    poll,
    candidates,
    voters,
    voter
}: AlreadyVotedProps) {

    const totalVotes = voters.filter(v => v.used).length
    const totalVoters = voters.length
    const totalPercentage = totalVotes > 0 ? Math.round((totalVotes / totalVoters) * 100) : 0

    const winner = candidates.reduce((best, current) => current.voteCount > best.voteCount
    ? current : best, candidates[0]
)

    return (
        <>
        <div>

        <div>
           <span>{/*check icon */}</span>
           <h1>You already voted.</h1>
           <p>
            Your vote was cast and your link has been used. This cannot be changed. <br/>
           </p>
        </div>

        <div>
            <span>Poll</span> <h3>{poll.title}</h3>
            <span>You voted for</span> <h3>{/* who was voted for */}</h3>
            <span>Voted at</span> <h3>{voter.votedAt}</h3>
        </div>

        <div>
            <span>CURRENT LEADER</span>
            <h2>{winner.name}</h2>
            <span>
                {totalVotes} votes . {totalPercentage}% . Poll closes {poll.closesAt}
            </span> 
        </div>

        <div>
            <Button 
            variant='lime'
            fullWidth
            >
                View Full Results
            </Button>
        </div>

        <div>
            <Button
            variant='ghost'
            fullWidth
            >
                Back to Home
            </Button>
        </div>
        
        <p> Wasn't you? Please contact support.</p>
        </div>
        </>
    )
}

{/* 
    // should show the page when token has been used, so this will be a component

    // wil require less logic

    // import Poll, Candidate, PollVoter

    // logic for who is leading:
    get the candidate, calculate the no. of votes, the percentage, get the poll deadline

    // Button to view full result (ResultsChart)
    // Button to go back to home page
    */}

