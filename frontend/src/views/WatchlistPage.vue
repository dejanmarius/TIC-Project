<template>
  <div class="watchlist-page">
    <AppNavbar @searchUpdated="handleSearchUpdated" />

    <div class="hero">
      <h1>Your Watchlist</h1>
      <p>Your Watchlist is your go-to place for keeping track of all the movies and shows you want to watch.</p>
    </div>

    <div class="watchlist-content">
      <div v-if="filteredMovies.length > 0" class="sort-options">
        <span class="titles-count">{{ filteredMovies.length }} titles</span>
        <div class="sort-controls">
          <v-select v-model="sortBy" :items="sortOptions" label="Sort by" outlined dense class="sort-select"
            solo></v-select>
          <v-btn @click="toggleSortDirection" icon color="#3c4ebe" class="sort-button">
            <v-icon>{{ sortDirection === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
          </v-btn>
          <v-btn icon class="filter-button">
            <v-icon>mdi-tune</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-if="filteredMovies.length === 0" class="no-movies-message">
        <p>No movies match your search criteria.</p>
      </div>

      <div v-if="filteredMovies.length > 0" class="watchlist-items">
        <WatchlistMovieDetail v-for="movie in sortedMovies" :key="movie._id" :movie="movie"
          @delete-movie="deleteFromWatchlist" />
      </div>

      <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" color="error">
        {{ snackbar.message }}
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue';
import WatchlistMovieDetail from '@/components/WatchlistMovieDetail.vue';
import { handleTokenExpiration } from '../utils/authUtils';

export default {
  components: {
    AppNavbar,
    WatchlistMovieDetail
  },
  data() {
    return {
      searchQuery: '', 
      sortBy: 'Alphabetical',
      sortDirection: 'asc',
      sortOptions: ['Alphabetical', 'Date added', 'Rating', 'Release Date'],
      movies: [],
      filteredMovies: [], 
      snackbar: {
        visible: false,
        message: '',
        timeout: 3000,
      },
    };
  },
  computed: {

    sortedMovies() {
      let sorted = [...this.filteredMovies];

      if (this.sortBy === 'Alphabetical') {
        sorted.sort((a, b) => b.title.localeCompare(a.title));
      }
      else if (this.sortBy === 'Date added') {
        sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      }
      else if (this.sortBy === 'Rating') {
        sorted.sort((a, b) => b.rating - a.rating);
      } else if (this.sortBy === 'ReleaseDate') {
        sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
      }

      if (this.sortDirection === 'asc') {
        sorted.reverse();
      }

      return sorted;
    }
  },
  methods: {
    handleSearchUpdated(query) {
      this.searchQuery = query;
      this.filterMovies();
    },

    filterMovies() {
      if (!this.searchQuery) {
        this.filteredMovies = this.movies;
      } else {
        this.filteredMovies = this.movies.filter(movie =>
          movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    },

    toggleSortDirection() {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    },

    async fetchWatchlist() {
      const userId = this.$store.getters.getUserId;

      try {
        const response = await fetch(`http://localhost:3000/users/${userId}/watchlist`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            const errorMessage = await handleTokenExpiration(this.$store, this.$router);
            this.snackbar.message = errorMessage;
            this.snackbar.visible = true;
            return;
          }
          this.snackbar.message = 'Failed to fetch watchlist';
          this.snackbar.visible = true;
          return;
        }

        const data = await response.json();
        console.log('Watchlist data:', data);
        this.movies = data.watchlist;
        this.filteredMovies = data.watchlist; 

      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    },

    async deleteFromWatchlist(movie) {
      const userId = this.$store.getters.getUserId;
      const movieId = movie.id;
      console.log('Deleting movie from watchlist:', movieId);
      try {
        const response = await fetch(`http://localhost:3000/users/${userId}/watchlist/${movieId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 401) {
            const errorMessage = await handleTokenExpiration(this.$store, this.$router);
            this.snackbar.message = errorMessage;
            this.snackbar.visible = true;
            return;
          }
          this.snackbar.message = 'Failed to delete movie from watchlist';
          this.snackbar.visible = true;
          return;
        }

        const data = await response.json();
        console.log('Deleted movie from watchlist:', data);
        this.movies = this.movies.filter(m => m.id !== movieId);
        this.filterMovies();

      } catch (error) {
        console.error('Error deleting movie from watchlist:', error);
      }
    },

  },
  created: async function () {
    await this.fetchWatchlist();
  }
}
</script>

<style scoped>
.watchlist-page {
  padding: 20px;
}

.hero {
  text-align: center;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.2em;
  color: #666;
}

.watchlist-content {
  max-width: 1000px;
  margin: 0 auto;
}

.sort-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 15px;
  margin-bottom: 10px;
  max-width: 1000px;
}

.titles-count {
  font-size: 1em;
  color: #333;
  font-weight: bold;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sort-select {
  width: 200px;
  background-color: #ffffff;
  border-radius: 4px;
  height: 40px;
}

.sort-button,
.filter-button {
  background-color: #3c4ebe;
  color: white;
  height: 40px;
  width: 40px;
}

.no-movies-message {
  text-align: center;
  color: #999;
  font-size: 1.2em;
  margin-top: 20px;
}
</style>
