<template>
    <div class="wrapper">
    <div class="image-section"></div>
    <div class="register-section">
      <RegisterForm />
    </div>

  </div>
  </template>
  
  <script>
  import RegisterForm from '@/components/RegisterForm.vue';
  
  export default {
    components: {
      RegisterForm
    }
  };
  </script>
  
  <style scoped>
  .wrapper {
  display: flex;
  height: 100vh; 
}

.image-section {
 
  flex: 1;
  background-image: url('../assets/cinema-realistic-poster-with-illuminated-bucket-popcorn-drink-3d-glasses-reel-tickets-blue-background-with-tapes-vector-illustration_1284-77070.avif');
  background-size: cover;
  background-position: center;
}

.register-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .image-section {
    display: none; 
  }
  .register-section {
    width: 100%;
  }
}
</style>