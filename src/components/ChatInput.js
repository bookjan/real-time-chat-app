import React, {Component} from 'react';
import Dropzone from 'react-dropzone';

export default class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: this.props.socket,
            message: '',
            myId: this.props.myId,
            myName: this.props.myName
        }
    }

    // 监控input变化
    handleChange(e) {
        this.setState({message: e.target.value})
    }

    // 点击提交或按回车
    handleClick(e) {
        e.preventDefault();
        this.sendMessage()
    }

    handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.sendMessage()
        }
        return false;
    }

    // 发送聊天信息
    sendMessage(e) {
        const message = this.state.message;
        const socket = this.state.socket;
        if (message) {
            const obj = {
                uid: this.state.myId,
                username: this.state.myName,
                message: message
            }
            socket.emit('message', obj);
            this.setState({message: ''})
        }

        return false
    }
    render() {
        return (
            <div className="inputarea">
                <div className="row">
                    <div className="col-10">
                        <input
                            type="text"
                            maxLength="140"
                            className="form-control"
                            placeholder="Enter messages..."
                            value={this.state.message}
                            onKeyPress={this
                            .handleKeyPress
                            .bind(this)}
                            onChange={this
                            .handleChange
                            .bind(this)}/>
                    </div>
                    <div className="col-2">
                        <button
                            type="button"
                            className="btn btn-primary btn-block btn-flat"
                            onClick={this
                            .handleClick
                            .bind(this)}>Send</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                ref="upload_input"
                                accept="image/*"/>
                            <span className="custom-file-control"></span>
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}