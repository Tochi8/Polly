import { useState } from "react";

export default function Modal() {
    const [options, setOptions] = useState<string[]>([""]);

    const addOption = () => setOptions([...options, ""]);

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const updateOption = (index: number, value: string) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    }

    return (
        <>
        {options.map((option, index) => (
            <div key={index} className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-surface border-2 outline-none transition-all duration-150"
            >
                <span>::</span>
                <input 
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                />
                <span onClick={() => removeOption(index)}>X</span>
            </div>
        ))}

        <div onClick={addOption}>
            <span>+</span> Add option
        </div>
        </>
    );
}

















































{/* 
export default function Modal() {

    
        // The Modal flow:
        User Sees default modal 
        User can click cancel to cancel a modal
        User can click add option to add a modal

        // what happens when user clicks cancel?
        (The modal becomes invisible)
        The click triggers the div:
        which will be from the styling, to become hidden
        OR
        The state; 'Modal' to become false if it was true

        // What happens when the user clicks add option?
        A new modal is added:
        Would be a new array from .map
        OR
        onClick to make 'Modal' true
        

    const [modal, setModal] = useState(true);

    const cancelModal = () => {
        setModal(false);
    }

    if (!modal) return null;

    return (
        <>
       <div className=" w-full px-4 py-3 rounded-xl text-sm font-medium
        bg-surface border-2 outline-none
        transition-all duration-150">
         <span>::</span> <input type="text" /> <span onClick={() => {cancelModal}}>X</span>
        </div>

        <div>
            <span onClick={}>+</span> Add option
        </div>
        </>
    );
}*/}