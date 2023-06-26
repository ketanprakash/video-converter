import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useEffect, useState } from "react";
const ffmpeg = createFFmpeg({ log: true });

export default function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  const convertToGif = async () => {
    ffmpeg.FS("writeFile", "src.mp4", await fetchFile(video));

    await ffmpeg.run('-i', 'src.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif');

    const data = ffmpeg.FS("readFile", "out.gif");

    const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));
    setGif(url);
  }

  return ready ? (
    <div className="App">
      {video && <video controls width="250" src={URL.createObjectURL(video)}></video>}
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))}/>

      <button onClick={convertToGif}>Convert to Gif</button>

      {gif && <img src={gif} width="250" />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}
