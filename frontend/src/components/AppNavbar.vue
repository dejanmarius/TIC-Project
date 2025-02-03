<template>
  <v-app-bar class="app-bar" prominent>
    <div class="app-bar-content">
      <v-label class="app-bar-title" color="white" @click="navigateHome">RateFlix</v-label>

      <div class="search-container">
        <v-text-field class="search-field" v-model="searchQuery" placeholder="Search movie" variant="outlined"
          append-inner-icon="mdi-magnify" density="compact" hide-details bg-color="#eeeeee" @input="$emit('searchUpdated', searchQuery)" ></v-text-field>
      </div>

      <div class="actions">
        <v-btn class="watchlist-btn" @click="navigateToWatchlist" color="#3c4ebe" prepend-icon="mdi-heart">
          Watchlist
        </v-btn>

        <v-menu v-if="isAuthenticated" offset-y :close-on-content-click="false" transition="slide-y-reverse-transition">
          <template #activator="{ props }">
            <v-btn v-bind="props" color="#3c4ebe" prepend-icon="mdi-account-circle">
              {{ userName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout">
              <v-list-item-title>Log Out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn v-else class="signin-btn" @click="navigateToSignIn" color="#3c4ebe" prepend-icon="mdi-login">
          Sign In
        </v-btn>
      </div>
    </div>

    <div class="mobile-icons">
      <v-btn class="search-btn" icon @click="openSearch" color="#3c4ebe">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn class="menu-btn" icon @click="drawer = !drawer" color="#3c4ebe">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list>
      <v-list-item prepend-icon="mdi-heart" title="Watchlist " @click="navigateToWatchlist"></v-list-item>
      <v-list-item v-if="!isAuthenticated" prepend-icon="mdi-login" title="Sign In" @click="navigateToSignIn"></v-list-item>
      <v-list-item v-else prepend-icon="mdi-logout" title="Log Out" @click="logout"></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-dialog v-model="searchDialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h6">Search movies</v-card-title>
      <v-card-text>
        <v-text-field v-model="searchQuery" label="Search..." variant="outlined" prepend-inner-icon="mdi-magnify " @input="$emit('searchUpdated', searchQuery)"
          hide-details></v-text-field>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      searchDialog: false,
      searchQuery: "",
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userName() {
      return this.$store.getters.getUserName || "User";
    },
    
  },
  methods: {
   
    openSearch() {
      this.searchDialog = true;
    },

    navigateHome() {
    this.$router.push('/'); 
  },
    navigateToWatchlist() {
      if (this.isAuthenticated) {
        this.$router.push("/watchlist");
      } else {
        this.$router.push("/login");
      }
      this.drawer = false;
    },
    navigateToSignIn() {
      this.$router.push("/login");
      this.drawer = false;
    },
    async logout() {
      try {
        const response = await fetch('http://localhost:3000/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Logout failed');
        }
        this.$store.dispatch('logout');
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  },
 
};
</script>

<style scoped>
.app-bar {
  background-color: black;
  padding: 0 20px;
}

.app-bar-content {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

}

.app-bar-title {
  color: white !important;
  font-size: 1.5rem;
  font-weight: bold;
  margin-left: 35px;
  margin-right: 35px;
}

.search-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  margin-right: 10px;

}

.search-field {
  max-width: 600px;
  text-align: center;
}

.actions {
  display: flex;
  gap: 5px;
  flex-grow: 0;
}


.signin-btn {
  margin-right: 35px;
}

/* nu le afisez decat daca e pe mobil */
.search-btn,
.menu-btn {
  display: none;
}

@media (max-width: 960px) {

  .search-container,
  .actions {
    display: none;
  }

  .search-btn,
  .menu-btn {
    display: block;

  }

  .mobile-icons {
    display: flex;
  }

  .app-bar-title {
    margin-left: 0;
  }

  .v-navigation-drawer {
    background-color: black;
  }

  .v-list-item {
    color: #3c4ebe;
  }
}
</style>