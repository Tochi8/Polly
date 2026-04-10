    'use client';

    import React, { useState } from "react";
    import NavBar from "../layout/Navbar";
    import Button from "../ui/Button";

    interface VoterListProps {
        pollTitle?: string;
    }

    export default function VoterList(
        {pollTitle}
    : VoterListProps) {


        const [usernames, setUsernames] = useState<string[]>([]);
        const [rawInput, setRawInput] = useState("");
        const [errorMessage, setErrorMessage] = useState("");

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value
            setRawInput(value);

            {/* splitting happens here */}
            const list = value
            .split(/, |\n/)
            .map((u) => u.trim())
            .filter((u) => u !== '')

            setUsernames(list);

            const inputRegex = /^@[a-zA-Z0-9_]+$/;
            const invalid = list.find((u) => !inputRegex.test(u));

            if(invalid) {
                setErrorMessage(`"${invalid}" is not valid - usernames must start with @`);
                return;
            }

            setErrorMessage("");
            setUsernames(list);
        }  
       

        const handleSendLinks = () => {
            console.log('Sending Links to:', usernames);
            {/* API call goes here*/}
        }

         return (
            <>
            <NavBar>
                <div className="flex items-center justify-between">
                <button> - </button> 
                <span>Add Voters</span>
               <span>{usernames.length}</span> 
               </div>
            </NavBar>

            <div>
                <div>
                <p>Adding voters to</p>
                <h3>{pollTitle}</h3>
                <p>{/* Deadline from poll form `${votes}` voters do far */}</p>
                </div>
            

            <div>
                <span>PASTE USERNAMES</span>
                <textarea 
                name="usernames"
                 id="usernames" 
                 placeholder="@username1, @username2 
                 Separate with commas or new lines
                 "
                 value={rawInput}
                 onChange={handleChange}
                 className={`w-full border-2 rounded-xl p-3 outline-none
                ${errorMessage
                    ? 'border-red-400 bg-red-50'
                    : 'border-transparent bg-surface focus:border-ink'
                }`}
                 />
                 {errorMessage && (
                    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
                 )}
            </div>

            <div>
                <div className="flex justify-between">
                <span>Added ({usernames.length})</span>
                <span onClick={() => {
                    setUsernames([]); 
                    setRawInput('');
                    setErrorMessage('')
                    }}
                    >
                    Clear all
                </span>
                </div>
           
            <div>
                {usernames.map((username, i) => (
                    <div key={i}>
                        <span>{/* face icon */}</span>
                        <span>{username}</span>
                    </div>
                ))}
            </div>
        </div>

            <Button variant="lime" fullWidth onClick={handleSendLinks}>
                Generate & Send Links
            </Button>
        </div>
            </>
         );
    }
   