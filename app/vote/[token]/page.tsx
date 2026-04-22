'use client';
import Button from "@/components/ui/Button";
import VotingCard from "@/components/vote/VotingCard";
import { useState } from "react";

interface VotePageProps {
    title?: string
    eligible?: string
    deadline?: string
    voterId?: string
}

export default function VoterPage ({
    title,
    eligible,
    deadline,
    voterId
}: VotePageProps) {

    const [submitting, setSubmitting] = useState(false);
    const [successful, setSuccessful] = useState('');

    const handleVoteCast = async () => {
         setSubmitting(true);

         try {
        const res = await fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                candidateId: '',
                voterId: '',
            }),
        });

        const data = await res.json();
       
        if(!res.ok) {
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
                {title}
                <span>{eligible}</span>
                <span>{deadline}</span>
            </div>

            <div>
                <div>
                    {voterId}
                </div>

                 <VotingCard />
            </div>

            <Button 
            variant="ink" 
            fullWidth
            type="submit"
            onClick={handleVoteCast}>
                Cast My Vote
            </Button>

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