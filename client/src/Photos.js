import React from 'react';
import { Query } from 'react-apollo';

import { ROOT_QUERY } from './api';

const Photos = () => (
  <Query query={ROOT_QUERY}>
    {({ data, loading }) =>
      loading ? (
        <p>loading...</p>
      ) : (
        data.allPhotos.map((photo) => (
          <img
            key={photo.id}
            src={`http://localhost:4000${photo.url}`}
            alt=''
            width={350}
          />
        ))
      )
    }
  </Query>
);

export default Photos;
