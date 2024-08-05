from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return "Chat Server is running!"

@socketio.on('connect')
def handle_connect():
    print("User connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("User disconnected")

@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    send(f"{data['username']} has entered the room.", room=room)

@socketio.on('leave')
def on_leave(data):
    room = data['room']
    leave_room(room)
    send(f"{data['username']} has left the room.", room=room)

@socketio.on('message')
def handle_message(data):
    room = data['room']
    send(data['message'], room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True)
