<template>
  <v-container>
    <v-card>
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field v-model="email" label="Email" required></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" color="primary">Login</v-btn>
        </v-form>
        <p v-if="error">{{ error }}</p>
      </v-card-text>
      <v-btn @click="googleLogin" color="primary">Sign in with Google</v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";

const { signInWithEmail, signInWithGoogle, error } = useAuth();
const email = ref("");
const password = ref("");

const login = async () => {
  await signInWithEmail(email.value, password.value);
};

const googleLogin = async () => {
  await signInWithGoogle();
};
</script>
