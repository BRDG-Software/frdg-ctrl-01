"use client"
import { getRandomInt } from '@/utils/utils.js'
import { socket } from "@/lib/socketClient"
import { useState, useEffect } from "react"

import DisplaySample from '@/components/DisplaySample'

export default function Home() {

  const usernum = getRandomInt(9999,99999)
  const userBuilt = "controller" + usernum
  console.log(userBuilt)

  const [message, setMessage ] = useState<
    { sender: string; message: string}[]
  >([])
  const [room, setRoom] = useState("123")
  const [userName, setUserName] = useState(userBuilt)
  const [joined, setJoined] = useState(false)

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, username: userName})
      setJoined(true)
    }
  }

  useEffect(() => {

    handleJoinRoom()

    socket.on("message", (data) => {
      console.log(data)
      setMessage((prev) => [...prev, data])
    })
    socket.on("user_joined", (message) => {
      setMessage((prev) => [...prev, { sender: "system", message }])
    })
    return () => {
      socket.off("user_joined")
      socket.off("message")
    }
  }, []);
  
  const sendChango = (msg) => {
    const message = msg//"/video/cake.mp4"
    const data = { room, message, sender: userName };
    setMessage((prev) => [...prev, {sender: userName, message}])
    socket.emit("message", data)
    console.log(message)
  }
/*
  const sendFarm = () => {
    const msg = "farmitup"
    setMessage((prev) => [...prev, msg])
    socket.emit("message", msg)
    console.log(msg)
  }
*/
/* this is done automatically 
          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg"
          >
          join roomy
          </button>

*/
  const Buttony = ({whichScreen, whichContent}) => {
    return (
      <button
      onClick={() => sendChango(`{"screen":"${whichScreen}", "content": "${whichContent}"}`)}
      className=" 
      grid
        w-[10vw]
        h-[10vh] 
        text-[1.5vw]
        text-center
        text-white bg-blue-500 rounded-lg
      ">
      {whichContent}
      </button>
    )
  }
  const Menuto = ({whichScreen}) => {

    return (
      <div className="
        bg-[#fff]
        text-center
        h-[74vh]
      ">
        <h1> {whichScreen} </h1>
      <div className="
        w-[11vw]
        bg-blue-200
        h-[64vh]
        grid grid-rows-4
        items-center justify-items-center
        gap-4
      ">
        <Buttony
          whichScreen={whichScreen}
          whichContent={"elp"}
        />
        <Buttony
          whichScreen={whichScreen}
          whichContent={"rollback"}
        />
        <Buttony
          whichScreen={whichScreen}
          whichContent={"walmart"}
        />
        <Buttony
          whichScreen={whichScreen}
          whichContent={"kraft"}
        />
        <Buttony
          whichScreen={whichScreen}
          whichContent={"storebranded"}
        />
        </div>
      </div>
    )
  }


  return (
    <div className="
      font-sans grid grid-cols-7 gap-4
      items-center justify-items-center min-h-screen -pt-10 p-0 pb-0 sm:p-0
      ">

      <div>
        <Menuto 
          whichScreen={"all"}
        />
      </div>  
      <div>
        <Menuto 
          whichScreen={"screen1"}
        />
      </div>
      <div>
        <Menuto 
          whichScreen={"screen2"}
        />
      </div>
      <div>
        <Menuto 
          whichScreen={"screen3"}
        />
      </div>
      <div>
        <Menuto 
          whichScreen={"screen4"}
        />
      </div>
      <div>
        <Menuto 
          whichScreen={"screen5"}
        />
      </div>
      <div>
        <Menuto 
          whichScreen={"screen6"}
        />
      </div>
      <div className="
        w-100
        
        justify-items-center items-center
        grid grid-rows-1
      ">
        <button
          onClick={() => sendChango(`{"system":"refresh"}`)}
          className="
          w-[20vw]
          h-[10vh]
          text-[2vw]

          text-white bg-blue-500 rounded-lg"
        >
          refresh all screens
        </button>
      </div>
    </div>
  );
}
