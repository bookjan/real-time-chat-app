import React, {Component, PropTypes} from 'react';
import ChatRoom from '../components/ChatRoom';
import '../style.scss';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            uid: '',
            socket: io(),
            siofu: new SocketIOFileUpload(io.connect())
        }

    }

    // 生成用户id
    generateUid() {
        return new Date().getTime() + "" + Math.floor(Math.random() * 9 + 1);
    }

    // 监控名称变化
    handleChange(e) {
        this.setState({username: e.target.value})
    }

    // 监控点击提交或按回车
    handleClick(e) {
        e.preventDefault();
        this.handleLogin();
    }
    handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.handleLogin()
        }
        return false;
    }

    // 登陆
    handleLogin() {
        let username = this.state.username;

        //  username = 'User' + Math.floor(Math.random()*89+10)
        const uid = this.generateUid();
        if (!username) {
            username = 'User:' + uid;
        }
        this.setState({uid: uid, username: username});
        this
            .state
            .socket
            .emit('login', {
                uid: uid,
                username: username
            })
    }
    render() {
        let renderDOM;
        if (this.state.uid) {
            renderDOM = <ChatRoom
                uid={this.state.uid}
                username={this.state.username}
                socket={this.state.socket}
                siofu={this.state.siofu}/>
        } else {
            renderDOM = (
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col col-md-auto login-box ">
                            <h2>Enter Chat Room</h2>
                            <div className="input">
                                <input
                                    type="text"
                                    placeholder="Input your nickname"
                                    className="form-control"
                                    onChange={this
                                    .handleChange
                                    .bind(this)}
                                    onKeyPress={this
                                    .handleKeyPress
                                    .bind(this)}/>
                            </div>
                            <div className="submit">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block btn-flat"
                                    onClick={this
                                    .handleClick
                                    .bind(this)}>Start</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>{renderDOM}</div>
        )
    }
}