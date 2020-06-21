import Tab from './Tab';
import React, { Component } from 'react';

class FriendSyncTab extends Tab {

    render() {
        super.render();

        var synced = ["billy", "bob", "joe"];
        var syncedentries = [];

        for (const [index, value] of synced.entries()) {
            syncedentries.push(<li>{value}</li> )
        }

        return (
            <div>
                <div>
                    <label for="fname">Synced: </label>
                    <ul>{syncedentries}</ul>
                    <button type="button">Add Listener</button>

                </div>



            </div>

        )


  }

}

export default FriendSyncTab;