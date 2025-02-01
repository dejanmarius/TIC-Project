<template>
  <v-card class="movie-card">
    <v-img :src="movie.imageUrl" height="300px" alt="Movie poster" @click="viewDetails(movie.id)"
      class="cursor-pointer">
    </v-img>

    <v-card-subtitle class="text-center d-flex justify-center align-center">
      <v-icon icon="mdi-star" class="text-gold"></v-icon>
      <span>{{ movie?.rating }}</span>
    </v-card-subtitle>

    <v-card-title class="title">{{ movie?.title }}</v-card-title>

    <v-card-actions class="d-flex justify-center">
      <v-btn color="#3c4ebe" @click="toggleWatchList(movie)">
        <v-icon>{{ movie?.inWatchList ? 'mdi-check' : 'mdi-plus' }}</v-icon>
        WatchList
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
export default {
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {

    };
  },
  methods: {
    viewDetails(id) {
      this.$router.push({ name: 'movieDetails', params: { id } });
    },
    async toggleWatchList(movie) {
      try {

        const userId = this.$store.getters.getUserId;
        console.log('User ID:', userId);

        if (!userId) {
          this.$router.push('/login');
          return;
        }

        const response = await fetch(`http://localhost:3000/users/${userId}/watchlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            movieId: movie.id,
          }),
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          movie.inWatchList = !movie.inWatchList;
          console.log('Watchlist updated successfully:', data);
        } else {
          console.error('Error updating watchlist:', response.status);
        }
      } catch (error) {
        console.error('Error toggling watchlist:', error);
      }
    },
  },
};
</script>

<style scoped>
.movie-card {
  background-color: #121212;
  color: white;
  border-radius: 14px;
  overflow: hidden;
}

.text-gold {
  color: #f5c518;
}

.title {
  font-size: medium;
}


.cursor-pointer {
  cursor: pointer;
}
</style>