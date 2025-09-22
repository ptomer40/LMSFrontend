import axios from "axios";

const API_URL = "http://localhost:8081/api/question-mcq";

export const getAllQuestions = async () => {
  const response = await axios.get(API_URL);
  console.log("Fetched questions:", response.data);
  return response.data;
};