<template>
  <div class="div">
    <AppNavbar @searchUpdated="handleSearchUpdated" />
    <div class="hero">
      <h1>What to Watch - RateFlix</h1>
    </div>

    <div class="container-wrapper">
      <v-container fluid>
        <v-row class="movie-grid">
          <v-col v-for="(movie, index) in filteredMovies" :key="index" cols="6" sm="4" md="3" lg="2" xl="2">
            <MovieCard :movie="movie" />
          </v-col>
          <v-col v-if="filteredMovies.length === 0">
            <p>No movies found for your search.</p>
          </v-col>
        </v-row>


      </v-container>
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue'
import MovieCard from '@/components/MovieCard.vue';


export default {
  name: 'HomePage',
  components: {
    AppNavbar,
    MovieCard,
  },
  data() {
    return {
      movies: [],
      searchQuery: '',
    };
  }, computed: {

    filteredMovies() {
      if (this.searchQuery.trim() === "") {
        return this.movies;
      }
      return this.movies.filter(movie =>
        movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  mounted() {
    this.getMovies();
  },
  methods: {
    async getMovies() {
      try {
        const response = await fetch('http://localhost:3000/movies', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.movies = data;
        } else {
          console.error('Error fetching movies:', response.status);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },
    handleSearchUpdated(query) {
      this.searchQuery = query;
    }

    // ,
    // async addToWatchlist(movie) {
    //   const userId = this.$store.getters.getUserId;
    //   try {
    //     const response = await fetch(`http://localhost:3000/users/${userId}/watchlist`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         movieId: movie.id,
    //       }),
    //       credentials: 'include',
    //     });

    //     if (response.ok) {
    //       const data = await response.json();
    //       console.log('Movie added to watchlist:', data);

    //       movie.inWatchlist = !movie.inWatchlist;
    //     } else {
    //       const errorData = await response.json();
    //       console.error('Failed to add movie to the watchlist:', errorData.message);
    //     }
    //   } catch (error) {
    //     console.error(`Error occurred while adding '${movie.title}' to the watchlist: ${error.message}`);
    //   }
    // },
  }
};

</script>

<style scoped>
.div {
  background-color: black;
  min-height: 100vh;
}

.hero {
  background-size: cover;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
}


.v-container {
  background-color: black;
  padding: 0 100px;
}


.movie-grid {
  margin: -10px;
}


.v-col {
  padding: 5px !important;
}

.v-col p {
  color: white;
  text-align: center;
  padding: 20px;
}


@media (max-width: 768px) {
  .v-container {
    padding: 0 20px;
  }

  .v-col {
    padding: 5px !important;
  }
}
</style>