<template>
  <div class="movie-detail">
    <div class="movie-header">
      <img :src="movie.imageUrl" :alt="movie.title" class="movie-image" />
      <div class="movie-info">
        <h2>{{ movie.title }}</h2>
        <p><strong>Release Date:</strong> {{ movie.releaseDate }}</p>
        <p><strong>Rating:</strong> {{ movie.rating }}</p>
        <p><strong>Genres:</strong> {{ movie.genres ? movie.genres.join(', ') : 'No genres available' }}</p>
        <p><strong>Director:</strong> {{ movie.director }}</p>
        <p><strong>Status:</strong> {{ movie.status }}</p>
        <p><strong>Description:</strong> {{ movie.description }}</p>
        <div class="cast">
          <h3>Cast</h3>
          <div class="cast-grid">
            <div v-for="actor in movie.cast" :key="actor.actorId" class="cast-item">
              <strong>{{ actor.name }}</strong> as {{ actor.role }}
            </div>
          </div>
        </div>
      </div>
      <v-btn @click="handleDelete" color="red" icon class="delete-button">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleDelete() {
      this.$emit('delete-movie', this.movie);
    }
  }
};
</script>

<style scoped>
.movie-detail {
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.movie-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.movie-image {
  max-width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}

.movie-info {
  width: 100%;
  text-align: left;
}

.movie-info h2 {
  font-size: 2em;
  margin-bottom: 10px;
}

.movie-info p {
  margin: 5px 0;
}

.cast {
  margin-top: 20px;
}

.cast h3 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.cast-grid {
  display: flex;
  gap: 10px;
}

.cast-item {
  flex: 1 1 calc(33.333% - 10px);
  box-sizing: border-box;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  text-align: center;
}


@media (min-width: 768px) {
  .movie-header {
    flex-direction: row;
    text-align: left;
  }

  .movie-image {
    max-width: 200px;
    margin-right: 20px;
    margin-bottom: 0;
  }

  .movie-info {
    flex: 1;
  }

  .cast-item {
    flex: 1 1 calc(33.333% - 10px);
  }
}
</style>