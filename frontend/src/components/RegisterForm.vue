<template>
  <div class="register-container">
  <v-card
    class=" pa-6"
    max-width="448"
    style="min-width: 300px; width: 100%;" 
  >
  <v-card-title class="text-h3 text-center font-weight-bold">Create account</v-card-title>
      <v-text-field
        v-model="name"
        label="Name"
        density="compact"
        variant="outlined" 
        rounded="lg"
        bg-color="#eeeeee" 
        color="#3c4ebe"
        prepend-inner-icon="mdi-account"
      ></v-text-field>

      <v-text-field
        label="Email"
        v-model="email" 
        density="compact" 
        prepend-inner-icon="mdi-email-outline" 
        variant="outlined" 
        rounded="lg" 
        bg-color="#eeeeee" 
        color="#3c4ebe"
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        density="compact"
        variant="outlined"
        prepend-inner-icon="mdi-lock-outline" 
        rounded="lg" 
        bg-color="#eeeeee"
        color="#3c4ebe"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        label="Re-enter password"
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-lock-outline" 
        rounded="lg" 
        bg-color="#eeeeee"
        color="#3c4ebe"
        
      ></v-text-field>

    <v-btn class="mb-5 mt-2" color="#3c4ebe" size="large" block @click="register" rounded="lg">
          Create your account
        </v-btn>
        <v-card-text class="text-center">
          <a @click="goTologin" class=" text-decoration-none" href="#" style="color: #3c4ebe">
            Already have an account? Sign in
            <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>

  </v-card>
</div>
</template>

<script>

export default {
  data() {
    return {
      name: '',
      email: '',
      password: ''
    };
  },
  methods: {
    async register() {

      try {
        const response = await fetch('http://localhost:3000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            name: this.name,
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();
        console.log(data);
        
        if (response.ok) {
          this.$router.push('/login');
        } else {
          alert('Registration failed: ' + data.message || 'Something went wrong');
        }
      } catch (error) {
        console.error(error);
        alert('Registration failed');
      }
    },
    
    goTologin() {
      this.$router.push('/login');
    }
  }
};
</script>

<style >
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  
}
.v-btn {
  font-size: 16px;
}


</style>