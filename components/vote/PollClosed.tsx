'use client'
import {Poll, CandidatesWithVotes, PollVoter} from '@/types'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

interface PollClosedProps {
    poll: Poll
    candidates: CandidatesWithVotes[]
    voters: PollVoter[]
}

export default function PollClosed ({
    poll,
    candidates,
    voters
}: PollClosedProps) {


    const totalVoters = voters.length

    const winner = candidates.reduce((best, current) => 
        current.voteCount > best.voteCount ?
        current : best, candidates[0]
)

    return (
        <>
        <div>

            <div>
                <span>{/*closed icon */}</span>
                <h1>This poll is closed.</h1>
                <p>Voting ended on {poll.closesAt} at {/*time*/}. The results are now final.</p>
            </div>

            <div>
                <h3>{poll.title}</h3>
                <span><Badge variant='Closed' /></span>
                <span>{totalVoters}</span>
            </div>

            <div>
                <span>FINAL RESULT</span>
                <h2>{winner.name}</h2>
                <span>
                    {winner.voteCount} votes . {/* percentage */}% . Poll closed {poll.closesAt}
                </span>
            </div>


            <Button
            variant='lime'
            fullWidth
            >
                See Final Results 
            </Button>

            <Button
            variant='ghost'
            fullWidth
            >
                Back to Home
            </Button>

            <p>Think this is a mistake? Contact the poll admin.</p>

        </div>
        </>
    )
}































































{/* 
    // Properties:
        - Poll close date
        - Poll title
        - Poll status
        - No. of voters
        - Poll winner (candidate) with {
        - no. of votes
        - percentage
        - when poll closed
        }

    // Buttons:
        - Lime button (See Final Results)
        - Ghost button (Back to Home)

    // The logic:
        For the winner:
        - A function that counts the number of votes, with two parameters (the current, and the best).
        - The current is for who is leading atm, and the best is for whoever comes out as highest, then that person will replace the current.
        - Poll is closed/disabled as soon as it hits the deadline date

        To close poll:
        - write a function that adds a date
        - If the poll is greater than or equal to the close date then the poll becomes closed

    // Getting data for poll:
        - from Polls, CandidateWithVotes
        - for the final result, i think it will fetch the data from the database, don't you think? do we need to write it manually? we've already written the logic that calculates votes, percentage, etc... now we just fecth the poll result from the database that stores votes cast for each candidate.
    */}