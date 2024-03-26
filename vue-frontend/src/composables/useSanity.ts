import { defineComponent } from "vue";
import { useSanityClient } from "vue-sanity";

export const useCustomSanityClient = () => {
  return useSanityClient({
    projectId: "7lcnlqg7", // Replace with your actual Sanity project ID
    dataset: "production", // or your dataset name
    useCdn: process.env.NODE_ENV === "production", // true or false
    // add more configurations as needed
  });
};
