import { useEffect, useState } from "react";
import { Project } from "./types";

export const useProjects = () => {
  const [data, setData] = useState<Project[] | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const r = await fetch('/projects.json');
      setData(await r.json());
    };

    fetchData();
  }, []);

  return data;
}
