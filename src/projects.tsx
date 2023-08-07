import projects from "./projects.json";

export default projects.reverse().map(e => ({
  ...e,
  created: "created" in e ? new Date(e.created as string) : new Date(),
  updated: "updated" in e ? new Date(e.updated as string) : new Date(),
}));
