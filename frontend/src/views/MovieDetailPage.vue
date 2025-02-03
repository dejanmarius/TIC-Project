<template>
  <v-container v-if="loading" class="loading-container">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </v-container>
  <v-container v-else-if="movie" class="movie-container">

    <v-row class="justify-center">
      <v-col cols="12" sm="10" md="8" lg="6" class="d-flex">
        <v-row>

          <v-col cols="12" sm="4" class="image-col">
            <v-img :src="movie.imageUrl" class="movie-image"></v-img>
          </v-col>


          <v-col cols="12" sm="8" class="details-col">
            <h1 class="movie-title text-center text-sm-left">{{ movie.title }}</h1>
            <div class="text-center text-sm-left">
              <v-chip class="info-chip" label>
                <v-icon start>mdi-calendar</v-icon>
                {{ formatDate(movie.releaseDate) }}
              </v-chip>
              <v-chip class="info-chip" label>
                <v-icon start>mdi-star</v-icon>
                {{ movie.rating }}
              </v-chip>
            </div>

            <p class="movie-description">{{ movie.description }}</p>

            <div class="mt-3 text-center text-sm-left">
              <v-chip v-for="genre in movie.genres" :key="genre" class="ma-1" color="accent">
                {{ genre }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="cast-director-row justify-center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-row>
          <v-col cols="12" md="6" class="cast-col">
            <h2 class="section-title">Cast:</h2>
            <span v-for="(member, index) in movie.cast" :key="member.actorId" class="cast-member">
              {{ member.name }}<span v-if="index < movie.cast.length - 1">,</span>
            </span>
          </v-col>
          <v-col cols="12" md="6" class="director-col">
            <h2 class="section-title">Director:</h2>
            <span class="director-name">{{ movie.director }}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>


    <v-row class="reviews-row justify-center">
      <v-col cols="12" md="8" lg="6">
        <h4 class="section-title">Reviews ({{ movie.reviewCount }})</h4>
        <v-btn class="review-btn" @click="toggleReviewForm">
          {{ showReviewForm ? 'Close Review Form' : 'Add Review' }}
        </v-btn>

        <v-form v-if="showReviewForm" @submit.prevent="submitReview" class="review-form">
          <v-rating v-model="newReview.rating" color="yellow darken-3" background-color="grey darken-1"
            empty-icon="mdi-star-outline" half-increments hover length="10" density="compact"></v-rating>
          <v-textarea v-model="newReview.comment" label="Your Review" required outlined class="review-textarea"></v-textarea>
          <v-btn type="submit" class="submit-btn">Submit Review</v-btn>
        </v-form>

  
        <v-row class="review-list justify-center">
          <v-col cols="12">
            <v-card v-for="review in movie.reviews" :key="review.id" class="review-card">
              <v-card-title>
                <v-icon color="yellow darken-3">mdi-star</v-icon>
                <span class="ml-2">{{ review.rating }}</span>
              </v-card-title>
              <v-card-text>
                <p class="review-comment">{{ review.comment }}</p>
                <p class="review-meta">
                  <span class="review-username">{{ review.username }}</span>
                  <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                </p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="snackbar.visible" :color="snackbar.color" :elevation=2 :top="snackbar.location" timeout="3000">
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script>
import { handleTokenExpiration } from '@/utils/authUtils';
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      movie: null,
      newReview: {
        rating: 0,
        comment: '',
      },
      showReviewForm: false,
      loading: true,
      snackbar: {
        visible: false,
        message: '',
        color: 'red',
        elevation: "2",
        location: "top",
      },
    };
  },
  async created() {
    await this.fetchMovieDetails();
  },
  methods: {
    async fetchMovieDetails() {
      try {
        const response = await fetch(`http://localhost:3000/movies/${this.id}`);
        const result = await response.json();
        if (response.ok) {
          this.movie = result.data;

          if (this.movie.reviews && this.movie.reviews.length > 0) {
            this.movie.reviews.sort((a, b) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateB - dateA; 
            });
          }

        } else {
          console.error('Error fetching movie details:', result.error || result.message);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        this.loading = false;
      }
    },

    async submitReview() {
  if (!this.newReview.rating || !this.newReview.comment) {
    this.snackbar.message = 'Please fill in both fields.';
    this.snackbar.visible = true;
    this.snackbar.color = 'yellow';
    return;
  }
  try {
    const userId = this.$store.getters.getUserId;
    const username = this.$store.getters.getUserName;

    const response = await fetch(`http://localhost:3000/movies/${this.id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        username,
        rating: this.newReview.rating,
        comment: this.newReview.comment,
      }),
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {
      this.movie = result.data; // Actualizez filmul cu noua recenzie
      this.newReview.rating = 0; // Resetez formularul
      this.newReview.comment = '';
      this.showReviewForm = false;

      await this.fetchMovieDetails();
    } else {
      if (response.status === 401) {
        const errorMessage = await handleTokenExpiration(this.$store, this.$router);
        this.snackbar.message = errorMessage;
        this.snackbar.color = 'red';
        this.snackbar.visible = true;
      } else {
        this.snackbar.message = 'Error adding review: ' + (result.message || 'Unknown error');
        this.snackbar.color = 'red';
        this.snackbar.visible = true;
      }
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    this.snackbar.message = 'An error occurred while submitting your review.';
    this.snackbar.color = 'red';
    this.snackbar.visible = true;
  }
},
    toggleReviewForm() {
      if (this.isAuthenticated()) {
        this.showReviewForm = !this.showReviewForm;
      } else {
        this.snackbar.message = 'You must be logged in to submit a review. Please log in and try again.';
        this.snackbar.visible = true;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
};
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #212121;
}

.movie-container {
  background-color: #212121;
  color: white;

  max-width: 100%;
}

.image-col {
  display: flex;
  justify-content: center;
}

.movie-image {
  max-height: 300px;
  max-width: 200px;
  border-radius: 8px;
}

.details-col {
  padding-left: 40px;
}

.movie-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.info-chip {
  background-color: #3c4ebe;
  color: white;
  margin: 5px;
}

.movie-description {
  font-size: 1rem;
  margin-top: 20px;
}

.cast-director-row {
  margin-top: 20px;
}

.cast-col,
.director-col {
  padding: 10px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  display: inline;
}

.cast-member {
  margin-left: 10px;
}

.director-name {
  margin-left: 10px;
}

.reviews-row {
  margin-top: 20px;
}

.review-btn {
  background-color: #3c4ebe;
  color: white;
  margin-left: 20px;
}

.review-form {
  margin-top: 10px;
}

.review-textarea {
  margin-top: 20px;
}

.submit-btn {
  background-color: #3c4ebe;
  color: white;
  margin-top: 20px;
}

.review-list {
  margin-top: 20px;
}

.review-card {
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #333;
  color: white;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.review-card .v-card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffd700;
}

.review-card .review-comment {
  font-size: 1rem;
  margin-top: 10px;
}

.review-card .review-meta {
  font-size: 0.9rem;
  color: #aaa;
  margin-top: 10px;
}

.review-card .review-username {
  font-weight: bold;
}

.review-card .review-date {
  margin-left: 10px;
}

@media (max-width: 768px) {
  .movie-image {
    max-height: 300px;
    max-width: 200px;
  }


  .details-col {
    padding-left: 0;
    text-align: center;
  }

  .info-chip {
    margin-left: 10px ;
  
  }

  .review-card {
    max-width: 100%;
  }

  .review-card .v-card-title {
    font-size: 1rem;
  }

  .review-card .review-comment {
    font-size: 0.9rem;
  }

  .review-card .review-meta {
    font-size: 0.8rem;
  }

}
</style>