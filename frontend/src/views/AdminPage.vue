<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app mini-variant>
      <v-list>
        <v-list-item @click="currentView = 'users'" :class="{'active-tab': currentView === 'users'}">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item>
        <v-list-item @click="currentView = 'movies'" :class="{'active-tab': currentView === 'movies'}">
          <v-list-item-icon>
            <v-icon>mdi-movie</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Movies</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dense>
      <v-btn icon @click="drawer = !drawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <h1 class="mb-6">Admin Dashboard</h1>

        <v-card v-if="currentView === 'users'" class="elevation-4">
          <v-card-title>
            <v-text-field v-model="userSearch" append-icon="mdi-magnify" label="Search Users"></v-text-field>
          </v-card-title>
          <v-data-table :headers="userHeaders" :items="users" :search="userSearch" :items-per-page="10">
            <template #[`item.actions`]="{ item }">
              <v-icon small @click="editUser(item)" class="mr-2">mdi-pencil</v-icon>
              <v-icon small @click="deleteUser(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="editUserDialog" max-width="500px">
          <v-card>
            <v-card-title>Edit User</v-card-title>
            <v-card-text>
              <v-text-field v-model="editedUser.name" label="Name"></v-text-field>
              <v-text-field v-model="editedUser.email" label="Email"></v-text-field>
              <v-select v-model="editedUser.role" :items="['User', 'Admin']" label="Role"></v-select>
            </v-card-text>
            <v-card-actions>
              <v-btn color="red" text @click="editUserDialog = false">Cancel</v-btn>
              <v-btn color="green" text @click="updateUser">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-card v-if="currentView === 'movies'" class="elevation-4">
          <v-card-title>
            <v-text-field v-model="movieSearch" append-icon="mdi-magnify" label="Search Movies"></v-text-field>
          </v-card-title>
          <v-data-table :headers="movieHeaders" :items="movies" :search="movieSearch" :items-per-page="10">
            <template #[`item.actions`]="{ item }">
              <v-icon small @click="editMovie(item)" class="mr-2">mdi-pencil</v-icon>
              <v-icon small @click="deleteMovie(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>

        <v-dialog v-model="editMovieDialog" max-width="500px">
          <v-card>
            <v-card-title>Edit Movie</v-card-title>
            <v-card-text>
              <v-text-field v-model="editedMovie.title" label="Title"></v-text-field>
              <v-text-field v-model="editedMovie.releaseDate" label="Release Date" type="date"></v-text-field>
              <v-text-field v-model="editedMovie.rating" label="Rating" type="number" min="0" max="10"></v-text-field>
              <v-text-field v-model="editedMovie.director" label="Director"></v-text-field>
              <v-textarea v-model="editedMovie.description" label="Description"></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn color="red" text @click="editMovieDialog = false">Cancel</v-btn>
              <v-btn color="green" text @click="updateMovie">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>



<script>
export default {
  data() {
    return {
      userSearch: '',
      movieSearch: '',
      users: [],
      movies: [],  
      editUserDialog: false,  
      editMovieDialog: false,  
      editedUser: {},
      editedMovie: {}, 
      userHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Email', value: 'email', sortable: true },
        { text: 'Role', value: 'role', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      movieHeaders: [
        { text: 'ID', value: 'id' },
        { text: 'Title', value: 'title', sortable: true },
        { text: 'Release Date', value: 'releaseDate', sortable: true },
        { text: 'Rating', value: 'rating', sortable: true },
        { text: 'Director', value: 'director', sortable: true },
        { text: 'Description', value:'description', width: '200px',sortable: true },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      drawer: false,
      currentView: 'users', 
    };
  },
  async created() {
    await this.fetchUsers();
    await this.fetchMovies();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await fetch('http://localhost:3000/users', { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
        const result = await response.json();
        if (response.ok) this.users = result.users;
        else console.error('Error fetching users:', result.error || result.message);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    async fetchMovies() {
      try {
        const response = await fetch('http://localhost:3000/movies', { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
        const result = await response.json();
        console.log('Fetched movies:', result);
        if (response.ok) {
          this.movies = result;
        } else {
          console.error('Error fetching movies:', result.error || result.message);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },

    editUser(user) {
      this.editedUser = { ...user };
      this.editUserDialog = true;  
    },


    async updateUser() {
      try {
        const response = await fetch(`http://localhost:3000/users/${this.editedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: this.editedUser.name, email: this.editedUser.email, role: this.editedUser.role }),
        });

        if (response.ok) {
          const index = this.users.findIndex(u => u.id === this.editedUser.id);
          if (index !== -1) this.users[index] = { ...this.editedUser };
          this.editUserDialog = false;
        } else {
          const result = await response.json();
          console.error('Error updating user:', result.error || result.message);
          alert('Error updating user: ' + (result.error || result.message));
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    },

    editMovie(movie) {
      this.editedMovie = { ...movie };
      this.editMovieDialog = true;  
    },

    async updateMovie() {
      try {
        const response = await fetch(`http://localhost:3000/movies/${this.editedMovie.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: this.editedMovie.title,
            releaseDate: this.editedMovie.releaseDate,
            rating: this.editedMovie.rating,
            director: this.editedMovie.director,
            description: this.editedMovie.description,
          }),
        });

        if (response.ok) {
          const index = this.movies.findIndex(m => m.id === this.editedMovie.id);
          if (index !== -1) this.movies[index] = { ...this.editedMovie };
          this.editMovieDialog = false;
        } else {
          const result = await response.json();
          console.error('Error updating movie:', result.error || result.message);
          alert('Error updating movie: ' + (result.error || result.message));
        }
      } catch (error) {
        console.error('Error updating movie:', error);
      }
    },

    async deleteUser(user) {
      if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;
      try {
        const response = await fetch(`http://localhost:3000/users/${user.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          this.users = this.users.filter(u => u.id !== user.id);
        } else {
          const result = await response.json();
          console.error('Error deleting user:', result.error || result.message);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },


    async deleteMovie(movie) {
      if (!confirm(`Are you sure you want to delete ${movie.title}?`)) return;
      try {
        const response = await fetch(`http://localhost:3000/movies/${movie.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          this.movies = this.movies.filter(m => m.id !== movie.id);
        } else {
          const result = await response.json();
          console.error('Error deleting movie:', result.error || result.message);
        }
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    },
  },
};
</script>



<style scoped>
.v-navigation-drawer {
  width: 180px; 
}

.v-navigation-drawer .v-list-item {
  transition: background-color 0.3s ease;
}

.active-tab {
  background-color: #3c4ebe; 
  color: white;
}

.v-icon {
  cursor: pointer;
}

@media (max-width: 768px) {
  .v-navigation-drawer {
    width: 70px;
  }

  .v-navigation-drawer .v-btn {
    width: 100%;
  }
}
</style>
