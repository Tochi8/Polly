"use client";
import NavBar from "../layout/Navbar";
import { PollVoter, Candidate, Poll} from "@/types";

    interface CandidateWithVotes extends Candidate{
        voteCount: number
    }

    interface ResultsChartProps {
        poll: Poll
        voters: PollVoter[]
        candidates: CandidateWithVotes[]
    }

    export default function ResultsChart ({
        poll,
        voters,
        candidates
    }: ResultsChartProps) {

        {/* Finding total votes cast*/}
        const totalVoted = voters.filter(v => v.used).length;
        const totalVoters = voters.length;
        const turnoutPercentage = totalVoters > 0
        ? Math.round((totalVoted / totalVoters) * 100)
        : 0

        {/* Finding the winning candidate*/}
        const winner = candidates.reduce((best, current) => 
        current.voteCount > best.voteCount ? current : best , candidates[0])

        return (
            <>
            <NavBar>
                <span>Back to polls</span>

                {/* there may be a div here later*/}
                <h1>{poll.title}</h1>
                <div>
                  <span>{poll.status}</span>  
                    <span>{totalVoters} voters . {totalVoted} cast</span>
                </div>
            </NavBar>

            {/* winner card */}
            {totalVoted > 0 && winner && (
                <div>
                    <p>Currently Leading</p>
                    <h2>{winner.name}</h2>
                    <p>{winner.voteCount} votes . {Math.round((winner.voteCount / totalVoted) * 100)} %</p>
                </div>
            )}

            {/* results bars */}
            {candidates.map((candidate) => {
                const percent = totalVoted > 0 
                ? Math.round((candidate.voteCount / totalVoted) * 100)
                : 0

                const isWinner = winner && candidate.id === winner.id;

                return (
                    <div key={candidate.id}>
                        <div>
                            <span>{candidate.name}</span>
                            <span>{candidate.voteCount} . {percent}%</span>
                        </div>

                        {/* progress bar */}
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                            className={`h-full rounded-full ${isWinner ?
                                'bg-lime-dk' : 'bg-ink'
                            }`}
                            />
                        </div>

                    </div>
                )
            })}

            {/* turnout boxes */}
            <div>
                <p>Turnout</p>
                <div>
                    <span>{totalVoted} Voted</span>
                    <span>{totalVoters - totalVoted} Pending</span>
                    <span>{turnoutPercentage}%</span>
                </div>
            </div>
            </>
        );
    }
