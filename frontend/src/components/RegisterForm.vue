<template>
  <div class="register-container">
    <v-form ref="form" v-model="formIsValid" @submit.prevent="register">
      <v-card class=" pa-6" max-width="448" style="min-width: 300px; width: 100%;">
        <v-card-title class="text-h3 text-center font-weight-bold">Create account</v-card-title>

        <v-text-field v-model="username" label="Name" density="compact" variant="outlined" rounded="lg"
          bg-color="#eeeeee" color="#3c4ebe" prepend-inner-icon="mdi-account" :rules="nameRules"></v-text-field>

        <v-text-field label="Email" v-model="email" density="compact" prepend-inner-icon="mdi-email-outline"
          variant="outlined" rounded="lg" bg-color="#eeeeee" color="#3c4ebe" :rules="emailRules"></v-text-field>

        <v-text-field v-model="password" label="Password" density="compact" variant="outlined"
          prepend-inner-icon="mdi-lock-outline" rounded="lg" bg-color="#eeeeee" color="#3c4ebe" :rules="passwordRules"
          :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'" :type="visible ? 'text' : 'password'"
          @click:append-inner="visible = !visible"></v-text-field>

        <v-text-field v-model="confirmPassword" label="Re-enter password" variant="outlined" density="compact"
          prepend-inner-icon="mdi-lock-outline" rounded="lg" bg-color="#eeeeee" color="#3c4ebe"
          :rules="confirmPasswordRules" :append-inner-icon="confirmVisible ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="confirmVisible = !confirmVisible"
          :type="confirmVisible ? 'text' : 'password'"></v-text-field>

        <v-btn class="mb-5 mt-2" color="#3c4ebe" size="large" block @click="submitForm" rounded="lg">
          Create your account
        </v-btn>
        <v-card-text class="text-center">
          <a @click="goTologin" class=" text-decoration-none" href="#" style="color: #3c4ebe">
            Already have an account? Sign in
            <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
          <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" elevation="2" location="top">
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

    <v-snackbar v-model="snackbar" color="green" timeout="3000" elevation="2" location="top">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn icon @click="snackbar = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      visible: false,
      confirmVisible: false,
      formIsValid: false,
      snackbar: false,
      errorMessage: '',
      snackbarColor: '',
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters'
      ],
      confirmPasswordRules: [
        v => !!v || 'Password confirmation is required',
        v => v === this.password || 'Passwords must match'
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length >= 3 || 'Name must be at least 3 characters'
      ]
    };
  },
  methods: {

    async submitForm() {
      if (this.formIsValid) {
        this.register(); // Daca formularul este valid, executa functia de inregistrare
      } else {
        this.$refs.form.validate(); // Daca formularul nu este valid, il validezi pentru a afisa mesajele de eroare
      }
    },
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          this.snackbarColor = 'green';
          this.errorMessage = 'Your account has been successfully created. You will be redirected to the login page shortly.';
          this.snackbar = true;

          setTimeout(() => {
            this.$router.push('/login');
          }, 5000);
        } else if (response.status === 409) {
          this.snackbarColor = 'red';
          this.snackbar = true;
          this.errorMessage = 'An account with this email already exists.';
        } else if (response.status === 500) {
          this.snackbarColor = 'red';
          this.snackbar = true;
          this.errorMessage = 'An unexpected error occurred on the server. Please try again later.';
        }
        else {
        this.snackbarColor = 'red';
        this.snackbar = true;
        this.errorMessage = `Unexpected error occurred Please try again later.`;
        console.log(response.status);
        }
      } catch (error) {
        this.snackbarColor = 'red';
        this.snackbar = true;
        this.errorMessage = 'Network error. Please check your connection.';
      }
    },

    goTologin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

}

.v-btn {
  font-size: 16px;
}

.v-text-field {
  margin-bottom: 5px;
}
</style>