import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import board from './chat-board.png';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import {FiArrowUp} from 'react-icons/fi'
import {animateScroll as scroll} from 'react-scroll';

import './Chat.css';
import Navbar from "../../Navbar/Navbar";

const ENDPOINT = 'http://localhost:5000/';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    console.log('entered in sendMessage')
    if (message) {
      console.log('sendMessage emitted')
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="chat-bg">
      <Navbar />
      <div className="outerContainer">
        <div className="chat-container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
        <TextContainer users={users} />
      </div>
      <div className="chat-instructions">Note: Use '|' in end if you are ending your message in hindi or Sanskrit. </div>
      <div className="chatboard-flex">
        <div className="chatboard-heading">Keyboard Layout</div>
        <img src={board} title="chatboard" className="chatboard"/>
      </div>
    <div onClick={() => {scroll.scrollToTop();}} className="top-button"><FiArrowUp /></div>
    </div>
  );
}

export default Chat;