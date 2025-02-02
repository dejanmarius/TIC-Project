<template>
  <div class="login-container">
    <v-form ref="form" v-model="formIsValid" @submit.prevent="login">
      <v-card class="mx-auto pa-6" max-width="448" style="min-width: 400px; width: 100%;">

        <v-card-title class="text-h3 text-center font-weight-bold">Sign In</v-card-title>

        <div class="text-subtitle-1 text-large-emphasis">Email</div>
        <v-text-field v-model="email" density="compact" placeholder="Email address"
          prepend-inner-icon="mdi-email-outline" variant="outlined" rounded="lg" bg-color="#eeeeee" color="#3c4ebe"
          :rules="emailRules">
        </v-text-field>

        <div class="text-subtitle-1 text-large-emphasis">Password</div>
        <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline" variant="outlined" rounded="lg" @click:append-inner="visible = !visible"
          bg-color="#eeeeee" color="#3c4ebe" :rules="passwordRules">
        </v-text-field>

        <v-btn class="mb-5 mt-2" color="#3c4ebe" size="large" block @click="submitForm" rounded="lg">
          Sign In
        </v-btn>
        <v-card-text class="text-center">
          <a @click.prevent="goToRegister" class="text-decoration-none" href="#"
            style="color: #3c4ebe; cursor: pointer;">
            No account? Create your RateFlix account
            <v-icon icon="mdi-chevron-right"></v-icon>
          </a>

          <v-snackbar v-model="snackbar" color="red darken-2" timeout="3000" elevation="2" location="top">
            {{ errorMessage }}
            <template v-slot:actions>
              <v-btn icon @click="snackbar = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
          </v-snackbar>
        </v-card-text>

      </v-card>
    </v-form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      visible: false,
      formIsValid: false,
      snackbar: false,
      errorMessage: '',
      emailRules: [
        v => !!v || 'Email is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ]
    };
  },

  methods: {
    async submitForm() {
      if (this.formIsValid) {
        this.login(); //daca formularul este valid, execut functia de login
      }
      else {
        this.$refs.form.validate(); //daca formularul nu este valid, il validez pentri a afisa mesajele de eroare
      }
    },

    async login() {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Login successful', data);

          this.$store.commit('setAuthState', {
            isAuthenticated: true,
            userRole: data.role,
            userName: data.name,
            userId: data.userId
          });

          if (data.role === 'admin') {
            this.$router.push('/adminDashboard');
          } else {
            this.$router.push('/');
          }
        } else {
          if (response.status === 401) {
            this.errorMessage = 'The combination between email and password is invalid.';
          } else if (response.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
          this.snackbar = true;
        }
      } catch (error) {
        this.errorMessage = 'Network error. Please check your connection.';
        this.snackbar = true;
      }
    },

    goToRegister() {
      console.log('Navigating to Register page...');
      this.$router.push('/register');
    }
  }
}
</script>


<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.v-btn {
  font-size: 16px;
}

.v-card {
  box-shadow: none;
}
</style>