import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

import './PostPhoto.css';
import { PhotoCategory } from './PhotoCategory';
import { POST_PHOTO_MUTATION, ROOT_QUERY } from './api';

class PostPhoto extends Component {
  state = {
    name: '',
    description: '',
    category: PhotoCategory.PORTRAIT,
    file: '',
  };

  postPhoto = async (mutation) => {
    await mutation({ variables: { input: this.state } }).catch(console.error);
    this.props.history.replace('/');
  };

  updatePhotos = (cache, { data: { postPhoto } }) => {
    const data = cache.readQuery({ query: ROOT_QUERY });
    data.allPhotos = [...data.allPhotos, postPhoto];
    cache.writeQuery({ query: ROOT_QUERY, data });
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
          <Mutation mutation={POST_PHOTO_MUTATION} update={this.updatePhotos}>
            {(mutation) => (
              <button onClick={() => this.postPhoto(mutation)}>
                Post Photo
              </button>
            )}
          </Mutation>
          <button onClick={() => this.props.history.goBack()}>Cancel</button>
        </div>
      </form>
    );
  }
}

export default PostPhoto;
