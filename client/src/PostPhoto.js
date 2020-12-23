import React, { Component } from 'react';

import './PostPhoto.css';
import { PhotoCategory } from './PhotoCategory';

class PostPhoto extends Component {
  state = {
    name: '',
    description: '',
    category: PhotoCategory.PORTRAIT,
    file: '',
  };

  postPhoto = (mutation) => {
    console.log('todo: post photo');
    console.log(this.state);
  };

  render() {
    return (
      <form onSubmit={(event) => event.preventDefault()}>
        <h1>Post a Photo</h1>

        <input
          type='text'
          placeholder='photo name...'
          value={this.state.name}
          onChange={({ target }) => this.setState({ name: target.value })}
        />

        <textarea
          placeholder='photo description...'
          value={this.state.description}
          onChange={({ target }) =>
            this.setState({ description: target.value })
          }
        />

        <select
          placeholder='photo category...'
          value={this.state.category}
          onChange={({ target }) => this.setState({ category: target.value })}
        >
          {Object.keys(PhotoCategory).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <input
          type='file'
          accept='image/jpeg'
          placeholder='photo file...'
          onChange={({ target }) =>
            this.setState({
              file: target.files && target.files.length ? target.files[0] : '',
            })
          }
        />

        <div>
          <button onClick={() => this.postPhoto()}>Post Photo</button>
          <button onClick={() => this.props.history.goBack()}>Cancel</button>
        </div>
      </form>
    );
  }
}

export default PostPhoto;
