'use client';
import SideBar from "@/components/layout/AdminSidebar";
import NavBar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import PollCard from "@/components/polls/PollCard";
import Spinner from "@/components/ui/Spinner";
import { useEffect } from "react";
import { useState } from "react";

const hours = new Date().getHours();

const greeting = () => {
if (hours < 12) { 
    return "Good morning";
} else if (hours < 17) { 
    return "Good afternoon";
} else {
    return "Good evening";
}
}

export default function AdminPage() {

const [polls, setPolls] = useState([]);
const [isLoadingPolls, setisloadingPolls] = useState(false);


const fetchPolls = async () => { 
    setisloadingPolls(true);

    try {
        const res = await fetch('/api/polls'); {/* fetch active polls */}
        const data = await res.json(); {/* receive response */}

    if(!res.ok) { {/* if the response coming from the server is bad */}
        setisloadingPolls(false);
        return;
    }

    setPolls(data.polls);

    } catch (error) {
       console.log('Error fetching polls:', error);
    } finally {
        setisloadingPolls(false);
    }
}

useEffect(() => {
    fetchPolls(); {/* fetch polls only when the page renders */}
}, [])


    return (
        <>
        <NavBar>
            {greeting()}
        </ NavBar>

            <SideBar />

            <main>
                <div>
                    {/* for poll stats, etc */}
                </div>

                <Button variant="lime">
                    {/* icon */} Create New Poll 
                </ Button>

                <div>
                    <div><span>Active Polls</span>
                    {/* supposed to load more polls when clicked */} <button>See all</button></div>
                </div>

                <div>
                    {isLoadingPolls && <Spinner size="Medium" />}
                  {/* polls are loaded here */}  {polls.map((poll) => (
                        <PollCard  key={poll.id}>
                            {poll.title}
                        </PollCard>
                    ))}
                </div>
         
            </main>
        </>
    );
}

