'use client'
import { useState } from "react";
import NavBar from "../layout/Navbar";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "@/components/ui/Modal";
import Spinner from "../ui/Spinner";

export default function PollForm() {
    const [question, setQuestion] = useState('');
    const [deadline, setDeadline] = useState('');
    const [toggle, setToggle] = useState(false);

    const handleSubmit = () => {
        console.log({question, deadline});
    }

    const viewResults = () => {
        setToggle(!toggle); 
    }

return (
    <>
   <NavBar>
    <div> 
        <button>{/* back button */}</button> New Poll 
        <span>Save Draft</span>
    </div>
   </NavBar>

    <form onSubmit={(e) => {e.preventDefault(); handleSubmit();}}>
        <div>

       
        <label htmlFor="question">
            <span>QUESTION</span>
        </label> 
        
      {question && <Input 
        type='text'
         placeholder="Who should lead the Q3 fund?"
         value={question}
         children
         onChange={(val) => setQuestion(val)} />}
        

         <label htmlFor="options">
            <span>OPTIONS</span>
        </label>

        <Modal />

        <label htmlFor="voting-deadline">
            <span>VOTING DEADLINE</span>
        </label>
       <Input 
       type='text' 
       value={deadline}
       children
       onChange={(val) => setDeadline(val)}
       />

        </div>
    </form>

    <div>
        <span>Public results</span>
        <p>Anyone can view after poll closes</p>
        <div 
        className={toggle? 'bg-ink' : 'bg-surface2'}
        onClick={viewResults}
        />
    </div>

    <Button variant='lime'>
        Continue . Add Voters <Spinner size="Small"/>
    </Button>
    </>
);
}

