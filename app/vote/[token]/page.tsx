'use client';
import Button from "@/components/ui/Button"
import VotingCard from "@/components/vote/VotingCard"
import AlreadyVoted from "@/components/vote/AlreadyVoted"
import {Poll, PollVoter, User, CandidatesWithVotes} from "@/types"
import { useState } from "react";

interface VotePageProps {
    poll: Poll
    voters: PollVoter[]
    voter: PollVoter
    votingAs: User
    candidates: CandidatesWithVotes[]
}

export default function VoterPage ({
   poll,
   voters,
   voter,
   votingAs,
   candidates
}: VotePageProps) {

    const [submitting, setSubmitting] = useState(false)
    const [successful, setSuccessful] = useState('')
    const [selected, setSelected] = useState('')
    const [alreadyVoted, setAlreadyVoted] = useState(false)

    const eligibleVoters = voters.length

    const handleVoteCast = async () => {
         setSubmitting(true)

         try {
        const res = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                candidateId: selected,
                voterId: voter.id,
            }),
        });

        const data = await res.json();
       
        if(!res.ok) {
            if (res.status === 403) {
                setAlreadyVoted(true);
                return;
            }
            setSuccessful(data.error);
            return;
        }
        
        setSuccessful('Vote Cast');

         } catch (error) {
            console.log('Error casting vote:', error);
         } finally {
            setSubmitting(false);
         }
    }

    return (
        <>
        <div>
            <div>
                <h1>{poll.title}</h1>
                <span>{eligibleVoters}</span>
                <span>{poll.closesAt}</span>
            </div>

            <div>
                <div>
                    {votingAs.username} . {votingAs.provider}
                </div>

                {candidates.map((candidate) => (
                  <VotingCard
                  key={candidate.id}
                  candidate={candidate}
                  selected={selected}
                  onSelect={(id) => setSelected(id)}
                  />  
                ))} 
            </div>

            <Button 
            variant="ink" 
            fullWidth
            type="submit"
            onClick={handleVoteCast}>
                Cast My Vote
            </Button>

               { alreadyVoted && <AlreadyVoted 
                poll={poll}
                candidates={candidates}
                voters={voters}
                voter={voter}
                />}

            {submitting && (
                <Button 
                variant="ghost"
                fullWidth
                disabled
                loading
                >
                Casting vote...
            </Button>
            )}

             {successful && (
                <p></p>
            )}

            <span>Your link expires after voting. <br />
            This cannot be undone.
            </span>
        </div>
       
        </>
    );
}