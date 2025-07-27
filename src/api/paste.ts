import axios from "axios";
import { SnippetCreate } from "../types/paste";

const api = axios.create({
  baseURL: "https://aguero.pythonanywhere.com/api/snippets/",
});

export const createSnippet = (data: SnippetCreate) => api.post("/", data);

export const getSnippet = (slug: string, password?: string) =>
  api.post(`/${slug}/view_snippet/`, { "password": password });
