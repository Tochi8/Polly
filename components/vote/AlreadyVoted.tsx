'use client'
import {Poll, PollVoter, CandidatesWithVotes} from '@/types'
import Button from '../ui/Button'

interface AlreadyVotedProps {
    poll: Poll
    candidates: CandidatesWithVotes[]
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

