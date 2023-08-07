import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Route } from "wouter";
import { AuthorPage } from "./components/AuthorPage";
import { HomePage } from "./components/HomePage";
import { ProjectPage } from "./components/ProjectPage";
import { TagPage } from "./components/TagPage";
import "./index.css";

const App = () => <>
  <Route path="/"><HomePage /></Route>
  <Route path="/project/:project">{({ project }) => <ProjectPage name={decodeURI(project)} />}</Route>
  <Route path="/author/:author">{({ author }) => <AuthorPage name={decodeURI(author)} />}</Route>
  <Route path="/tag/:tag">{({ tag }) => <TagPage tag={decodeURI(tag)} />}</Route>
</>;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
