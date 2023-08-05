import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { ChatsList } from "./ChatsList";
import './Chats.css'
import { Context } from "../../Context";


function Chats() {

    const [chats, setChats] = useState([]);
    function chts(cht) {
        setChats((state) => [...state, cht]);
    }

    const navigate = useNavigate();
    
    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        } else {
            navigate('/conversations');
        }
    }, [navigate])

    var chatTemps = {};
    useEffect(() => {
        try {
            supabase.from('messages') //consulto por todos los mensajes y guardo solo el último  
                .select('*')
                .then(data => {
                    data.data.map((msg) => {
                        const temp = msg.contact_id;
                        chatTemps[temp] = {
                            text: (msg.content.body ? msg.content.body : msg.content),
                            direction: msg.direction
                        };
                    })
                    chts(chatTemps)
                })
        } catch (error) {
            console.error(error)
        }
        
    }, [navigate])

    return (
        <>
            <header className="chats-header--container">
                <h1 className="chats">Chats</h1>
                <div className="chat-header--container--options">
                    <input type="text" className="header-search--chats" />
                    <button
                        className="header-button--logout"
                        onClick={() => supabase.auth.signOut()}>Log out</button>
                </div>
            </header>

            <ul className="chats-container">
                {
                    chats.map((c, i) => (
                        <ChatsList
                            key={i}
                            c={c} />

                    ))
                }
            </ul>

        </>

    );
}

export { Chats };