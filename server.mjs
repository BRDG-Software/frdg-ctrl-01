import {createServer} from "node:http";
import next from "next";
import {Server} from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port});
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handle);

	const io = new Server(httpServer); //io is whole room/socket

	io.on("connection", (socket) => {
		console.log(`user connected: ${socket.id}`)
	
		socket.on("disconnect", (socket) => {
			console.log(`user disconnected: ${socket.id}`)
		})
		/*
		socket.on("message", data => {
			console.log(`socket message received: ${data}`)
			socket.emit("message", data)
		})
		*/
		socket.on("join-room", ({room, username}) => {
			//console.log(username)
			socket.join(room);
			console.log(`User ${username} joined room ${room}`)
			socket.to(room).emit("user_joined", `${username} joined room ${room}`)
		})
		socket.on("message", ({ room, message, sender }) => {
			console.log(`Message from ${sender} in: ${room}: ${message}`)
			socket.to(room).emit("message", {sender, message })
		})
	})


	httpServer.listen(port, () => {
		console.log(`server is running on http://${hostname}:${port}`);
	})

})
