import Tab from './Tab';
import React, { Component } from 'react';

class ShuffleTab extends Tab {

  render() {

    super.render();


    const playlists = ['cats', 'uwu', 'umu'];
    var buttons = [];

    for (const [index, value] of playlists.entries()) {
      buttons.push(<button type="button">{index}</button> //add onClick
      )
    }

    return (
      <div>
        <select name="options" id="options">
          <option value="mood">Shuffle by Mood</option>
          <option value="genre">Shuffle by Genre</option>
          <option value="artist">Shuffle by Artist</option>
        </select>

        <div>
          {buttons}
        </div>


      </div>

    )


  }

}

export default ShuffleTab;