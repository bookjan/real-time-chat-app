import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

export default class Messages extends Component {
    componentDidUpdate() {
        const messageList = ReactDOM.findDOMNode(this.refs.messages);
        window.scrollTo(0, messageList.clientHeight + 50);
    }
    render() {
        const myId = this.props.myId;
        const oneMessage = this
            .props
            .messages
            .map(function (message) {
                return (<Message
                    key={message.msgId}
                    url={message.link}
                    msgType={message.type}
                    msgUser={message.username}
                    action={message.action}
                    isMe={(myId == message.uid)
                    ? true
                    : false}
                    time={message.time}/>)
            })
        return (
            <div className="messages" ref="messages">{oneMessage}</div>
        )
    }
}

class Message extends Component {
    render() {
        let imagePreviewUrl = this.props.url;
        let $imagePreview = null;
        if (imagePreviewUrl) 
            $imagePreview = (<img src={imagePreviewUrl} height="200"/>);
        
        if (this.props.msgType == 'system') {
            return (
                <div className="one-message system-message">
                    {this.props.msgUser}
                    {(this.props.action == 'login')
                        ? ' joined the Chat Room'
                        : ' left the Chat Room'}
                    <span className="time">&nbsp;{this.props.time}</span>
                </div>
            )
        } else if (this.props.msgType == 'image') {
            return (
                <div
                    className={(this.props.isMe)
                    ? 'me one-message'
                    : 'other one-message'}>
                    <p className="time">
                        <span>{this.props.msgUser}</span>
                        {this.props.time}</p>
                    <div className="message-content">
                        <a href={this.props.url} download>Click here to download</a>
                    </div>
                    <div className="imgPreview">
                        {$imagePreview}
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    className={(this.props.isMe)
                    ? 'me one-message'
                    : 'other one-message'}>
                    <p className="time">
                        <span>{this.props.msgUser}</span>
                        {this.props.time}</p>
                    <div className="message-content">{this.props.action}</div>
                </div>
            )
        }
    }
}