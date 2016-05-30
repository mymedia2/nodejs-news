export var socketServer = { obj: undefined };

export function broadcast(message) {
	socketServer.obj.clients.forEach(cl => cl.send(JSON.stringify(message)));
}
