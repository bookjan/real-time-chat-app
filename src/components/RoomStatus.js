import React, {Component} from 'react';

export default class RoomStatus extends Component {
    render() {
        return (
            <div className="status">
                <h5>Online Users: {this.props.onlineCount}, User List: {this.props.userhtml}</h5>
            </div>
        )
    }
}