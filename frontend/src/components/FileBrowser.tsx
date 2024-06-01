import React, { useState, useEffect, useCallback, useMemo } from "react";
import Folder from "../icons/folder";
import File from "../icons/file";
import { useLocation, useNavigate } from "react-router-dom";

type FileType = {
  name: string;
  isDirectory: boolean;
};

type ErrorGetDirectory = {
  error: string;
};

const FileBrowser: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [contents, setContents] = useState<FileType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const path = useMemo(() => {
    return decodeURIComponent(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    fetchContents(path);
  }, [path]);

  const fetchContents = async (path: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3101?path=${encodeURIComponent(path)}`
      );

      if (!response.ok) {
        const errorResponse: ErrorGetDirectory = await response.json();
        setError(errorResponse.error);
        setLoading(false);
        return;
      }
      const data: FileType[] = await response.json();
      setError(null);
      setContents(data);
    } catch (err) {
      setError("Error while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = useCallback(
    (file: FileType) => {
      if (file.isDirectory) {
        const newPath = path === "/" ? `/${file.name}` : `${path}/${file.name}`;
        navigate(`${newPath}`);
      }
    },
    [navigate, path]
  );

  const goBack = useCallback(() => {
    const newPath = path.split("/").slice(0, -1).join("/");
    navigate(newPath === "" ? `/` : `${newPath}`);
  }, [navigate, path]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File Browser</h1>
      <h2 className="text-xl mb-2">Current Path: {path}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="list-disc pl-5 flex flex-col">
          <button
            onClick={goBack}
            disabled={path === "/"}
            className={`mb-4 px-4 py-2 rounded ${
              path === "/" ? "" : "cursor-pointer hover:bg-gray-200 p-2 rounded"
            }`}
          >
            ...
          </button>
          {contents.map((file, index) => (
            <li
              key={index}
              onClick={() => handleNavigation(file)}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded flex justify-center items-center"
            >
              <div className="mx-2">
                {file.isDirectory ? <Folder /> : <File />}
              </div>
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileBrowser;
