import Tab from './Tab';
import React, { Component } from 'react';

class MultiPlaylistTab extends Tab {

    render() {
        super.render();

        var friends = ["billy", "bob", "joe"];
        var listentries = [];

        for (const [index, value] of friends.entries()) {
            listentries.push(<li>{value}</li> )
        }

        var sharedplaylists = ["bob's playlist", "joe's playlist", "billy's playlist"];
        var sharedentries = [];

        for (const [index, value] of sharedplaylists.entries()) {
            sharedentries.push(<li>{value}</li> )
        }

        return (
            <div>
                <div>
                    <label for="fname">Add Friend: </label>
                    <input type="text" id="fname" name="fname"></input>
                </div>

                <div>
                    <label for="fname">Contributors: </label>
                    <ul>{listentries}</ul>
                </div>

                <div>
                    <label for="fname">Create Playlist: </label>
                    <input type="text" id="fname" name="fname"></input>
                    <button type="button">Create</button>
                </div>

                <div>
                    <label for="fname">All Accessible Playlists: </label>
                    <ul>{sharedentries}</ul>
                </div>

            </div>
        )
                     


    }

}

export default MultiPlaylistTab;