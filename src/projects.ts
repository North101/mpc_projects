import { useEffect, useState } from "react";

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
