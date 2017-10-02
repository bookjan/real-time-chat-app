import React, {Component} from 'react';
import RoomStatus from './RoomStatus';
import Messages from './Messages';
import ChatInput from './ChatInput';

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        const socket = this.props.socket;
        const siofu = this.props.siofu;
        this.state = {
            myId: this.props.uid,
            myName: this.props.username,
            uid: this.props.uid,
            username: this.props.username,
            socket: socket,
            siofu: siofu,
            messages: [],
            onlineUsers: {},
            onlineCount: 0,
            userhtml: ''
        }
        this.handleSiofuComplete = this
            .handleSiofuComplete
            .bind(this);
        this.ready();
    }

    componentDidMount() {
        this
            .state
            .siofu
            .listenOnInput(this.refs.chatInput.refs.upload_input);

        this
            .state
            .siofu
            .addEventListener("progress", this.handleSiofuProgress);

        this
            .state
            .siofu
            .addEventListener("complete", this.handleSiofuComplete);
    }

    componentWillUnmount() {
        this
            .state
            .siofu
            .removeEventListener("progress", this.handleSiofuProgress);

        this
            .state
            .siofu
            .removeEventListener("complete", this.handleSiofuComplete);
    }

    handleSiofuProgress(e) {
        var percent = e.bytesLoaded / e.file.size * 100;
        console.log("File is", percent.toFixed(2), "percent loaded");
    }

    handleSiofuComplete(e) {
        console.log(e.success);
        console.log(e.detail.downloadLink);
        this.sendMessage(e.detail.downloadLink)
    }

    sendMessage(link) {
        const message = link;
        const socket = this.state.socket;
        if (message) {
            const obj = {
                uid: this.state.myId,
                username: this.state.myName,
                message: message,
                type: 'image'
            }
            socket.emit('message', obj);
        }

        return false
    }

    handleUsers() {
        const users = this.state.onlineUsers;
        let userhtml = '';
        let separator = '';
        for (let key in users) {
            if (users.hasOwnProperty(key)) {
                userhtml += separator + users[key];
                separator = '、';
            }
        }
        this.setState({userhtml: userhtml})
    }

    generateMsgId() {
        return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
    }

    updateSysMsg(o, action) {
        let messages = this.state.messages;
        const newMsg = {
            type: 'system',
            username: o.user.username,
            uid: o.user.uid,
            action: action,
            msgId: this.generateMsgId(),
            time: this.generateTime()
        }
        messages = messages.concat(newMsg)
        this.setState({onlineCount: o.onlineCount, onlineUsers: o.onlineUsers, messages: messages});
        this.handleUsers();
    }

    updateMsg(obj) {
        let messages = this.state.messages;
        const newMsg = {
            type: 'chat',
            username: obj.username,
            uid: obj.uid,
            action: obj.message,
            msgId: this.generateMsgId(),
            time: this.generateTime()
        };
        messages = messages.concat(newMsg);
        this.setState({messages: messages})
    }

    updateImageMsg(obj) {
        let messages = this.state.messages;
        const newMsg = {
            type: 'image',
            link: obj.message,
            username: this.state.username,
            uid: this.state.uid,
            action: '',
            msgId: this.generateMsgId(),
            time: this.generateTime()
        };
        messages = messages.concat(newMsg);
        this.setState({messages: messages})
    }

    generateTime() {
        let hour = new Date().getHours(),
            minute = new Date().getMinutes();
        hour = (hour == 0)
            ? '00'
            : hour;
        minute = (minute < 10)
            ? '0' + minute
            : minute;
        return hour + ':' + minute;
    }

    handleLogout() {
        location.reload();
    }

    ready() {
        const socket = this.state.socket;
        socket.on('login', (o) => {
            this.updateSysMsg(o, 'login');
        })
        socket.on('logout', (o) => {
            this.updateSysMsg(o, 'logout');
        })
        socket.on('message', (obj) => {
            if (obj.type === "image") {
                this.updateImageMsg(obj)
            } else {
                this.updateMsg(obj)
            }
        })
    }

    render() {
        return (
            <div className="container chatroom">
                <div className="row">
                    <div className="col-sm-10 col-10">
                        <h2>Chat Room</h2>
                    </div>
                    <div className="col-sm-2 col-2">
                        <button
                            className="btn btn-primary btn-block btn-flat"
                            onClick={this.handleLogout}>
                            Leave
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <RoomStatus
                            onlineCount={this.state.onlineCount}
                            userhtml={this.state.userhtml}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col chatarea">
                        <div ref="chatArea">
                            <Messages messages={this.state.messages} myId={this.state.myId}/>
                        </div>

                    </div>
                </div>
                <ChatInput
                    ref='chatInput'
                    myId={this.state.myId}
                    myName={this.state.myName}
                    socket={this.state.socket}
                    siofu={this.state.siofu}/>
            </div>
        )
    }
}