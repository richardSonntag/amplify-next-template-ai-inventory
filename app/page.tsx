"use client";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { CSVLink } from "react-csv";

Amplify.configure(outputs);

const initialTableData = [
  { room: "Living Room", item: "Sofa", condition: "Good" },
  { room: "Kitchen", item: "Fridge", condition: "Needs Repair" },
  { room: "Bedroom", item: "Bed", condition: "Good" },
  { room: "Bathroom", item: "Shower", condition: "Excellent" },
];

const client = generateClient<Schema>();

export default function Home() {
    
  const { signOut } = useAuthenticator();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [tableData, setTableData] = useState(initialTableData);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    setUploadedFiles([...uploadedFiles, ...Array.from(files)]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRun = () => {
    alert("Run button clicked!");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-transparent">
      <div
        className="border-2 border-dashed border-gray-400 p-8 mb-4 text-center w-full max-w-xl bg-white bg-opacity-80"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        style={{ borderRadius: 12 }}
      >
        <p>Drag and drop files here, or click to select files</p>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <button
          onClick={() => {
            const fileInput = document.getElementById("file-upload") as HTMLInputElement;
            fileInput?.click();
          }}
          className="mt-4 p-2 bg-green-500 text-white rounded"
        >
          Upload Files
        </button>
        {uploadedFiles.length > 0 && (
          <div className="mt-2 text-sm text-gray-700">
            <strong>Files:</strong> {uploadedFiles.map(f => f.name).join(", ")}
          </div>
        )}
      </div>

      <button onClick={handleRun} className="mb-8 p-2 bg-yellow-500 text-white rounded w-full max-w-xs">
        Run
      </button>

      <div className="overflow-x-auto w-full max-w-2xl bg-white bg-opacity-80 p-4 rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Room</th>
              <th className="px-4 py-2 border-b">Item</th>
              <th className="px-4 py-2 border-b">Condition</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{row.room}</td>
                <td className="px-4 py-2 border-b">{row.item}</td>
                <td className="px-4 py-2 border-b">{row.condition}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-center">
          <CSVLink
            data={tableData}
            filename={"house-items.csv"}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Download CSV
          </CSVLink>
        </div>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
