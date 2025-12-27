import { useState } from "react";
import "./App.css";

function App() {
  const [platform, setPlatform] = useState("youtube"); // 'youtube' | 'instagram'
  const [link, setLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // YouTube
  const [ytInfo, setYtInfo] = useState(null);
  const [ytVideoFormats, setYtVideoFormats] = useState([]);
  const [ytAudioFormats, setYtAudioFormats] = useState([]);
  const [mediaType, setMediaType] = useState("video"); // 'video' | 'audio'

  // Instagram
  const [igType, setIgType] = useState("post"); // 'post' | 'reel' | 'story'
  const [igData, setIgData] = useState(null);
  const [igIndex, setIgIndex] = useState(0); // current carousel index

  // ============ NAVBAR CHANGE ============
  const handlePlatformChange = (e) => {
    const value = e.target.value;
    setPlatform(value);

    // reset all states when switching
    setLink("");
    setError("");
    setLoading(false);

    setYtInfo(null);
    setYtVideoFormats([]);
    setYtAudioFormats([]);
    setMediaType("video");

    setIgType("post");
    setIgData(null);
    setIgIndex(0);
  };

  // ============ YOUTUBE FETCH INFO ============
  const handleFetchYoutube = async () => {
    if (!link) {
      alert("Paste a YouTube link first");
      return;
    }

    setLoading(true);
    setError("");
    setYtInfo(null);
    setYtVideoFormats([]);
    setYtAudioFormats([]);

    try {
      const res = await fetch(
        `http://localhost:5000/info?url=${encodeURIComponent(link)}`
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("YT INFO ERROR:", res.status, text);
        setError("Server error while fetching YouTube info");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setYtInfo(data);
        setYtVideoFormats(data.videoFormats || []);
        setYtAudioFormats(data.audioFormats || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch video info");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFormat = (formatId) => {
    if (!link) {
      alert("Paste a link first");
      return;
    }
    if (!formatId) {
      alert("Select a quality first");
      return;
    }
    window.location.href = `http://localhost:5000/download?url=${encodeURIComponent(
      link
    )}&format=${formatId}`;
  };

  // ============ INSTAGRAM FETCH ============
  const handleFetchInstagram = async () => {
    if (!link) {
      alert("Paste an Instagram link first");
      return;
    }

    setLoading(true);
    setError("");
    setIgData(null);

    try {
      const res = await fetch(
        `http://localhost:5000/instagram-info?url=${encodeURIComponent(
          link
        )}&type=${igType}`
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("IG INFO ERROR:", res.status, text);
        setError("Server error while fetching Instagram media");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setIgData(data);
        setIgIndex(0); // first slide
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Instagram media");
    } finally {
      setLoading(false);
    }
  };

  // ============ INSTAGRAM DOWNLOAD ============
  const handleDownloadInstagram = () => {
    if (!link) {
      alert("Paste an Instagram link first");
      return;
    }

    // For posts & reels: Instaloader reel/post route
    if (igType === "post" || igType === "reel") {
      window.location.href =
        `http://localhost:5000/instagram-reel-instaloader?url=${encodeURIComponent(
          link
        )}`;
      return;
    }

    // For stories: yt-dlp story route
    if (igType === "story") {
      window.location.href =
        `http://localhost:5000/instagram-stories-instaloader?url=${encodeURIComponent(
          link
        )}`;
      return;
    }
  };

  // ================== UI SECTIONS ==================

  const renderYoutubeSection = () => (
    <div className="content">
      <div className="inputRow">
        <input
          className="input mainInput"
          type="text"
          placeholder="Paste YouTube link here..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button className="arrowButton" onClick={handleFetchYoutube}>
          ➜
        </button>
      </div>

      {loading && (
        <div className="loadingWrapper">
          <div className="spinner" />
          <p className="infoText">Fetching video info…</p>
        </div>
      )}

      {error && !loading && (
        <p className="infoText errorText">{error}</p>
      )}

      {ytInfo && !loading && (
        <>
          <div className="infoBox">
            <img
              src={ytInfo.thumbnail}
              alt={ytInfo.title}
              className="thumbnail"
            />
            <div>
              <h3 className="videoTitle">{ytInfo.title}</h3>
              <p className="meta">Channel: {ytInfo.channel}</p>
              <p className="meta">
                Duration:{" "}
                {ytInfo.duration ? `${ytInfo.duration} sec` : "Unknown"}
              </p>
            </div>
          </div>

          {/* Video / Audio Toggle */}
          <div className="toggleWrapper">
            <button
              className={
                mediaType === "video" ? "toggleBtn active" : "toggleBtn"
              }
              onClick={() => setMediaType("video")}
            >
              Video
            </button>
            <button
              className={
                mediaType === "audio" ? "toggleBtn active" : "toggleBtn"
              }
              onClick={() => setMediaType("audio")}
            >
              Audio
            </button>
          </div>

          {/* Formats list */}
          {mediaType === "video" ? (
            <div className="formatList">
              {ytVideoFormats.length === 0 && (
                <p className="infoText">No video formats found.</p>
              )}
              {ytVideoFormats.map((f) => (
                <div key={f.id} className="formatRow">
                  <div>
                    <div className="formatTitle">
                      {f.resolution || "Unknown"}{" "}
                      {f.fps ? `@ ${f.fps}fps` : ""}
                    </div>
                    <div className="formatMeta">
                      {f.ext.toUpperCase()}{" "}
                      {f.filesize
                        ? `• ~${(f.filesize / 1024 / 1024).toFixed(1)} MB`
                        : ""}
                    </div>
                  </div>
                  <button
                    className="smallButton"
                    onClick={() => handleDownloadFormat(f.id)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="formatList">
              {ytAudioFormats.length === 0 && (
                <p className="infoText">No audio formats found.</p>
              )}
              {ytAudioFormats.map((f) => (
                <div key={f.id} className="formatRow">
                  <div>
                    <div className="formatTitle">
                      {f.abr ? `${f.abr} kbps` : "Audio"}
                    </div>
                    <div className="formatMeta">
                      {f.ext.toUpperCase()}{" "}
                      {f.filesize
                        ? `• ~${(f.filesize / 1024 / 1024).toFixed(1)} MB`
                        : ""}
                    </div>
                  </div>
                  <button
                    className="smallButton"
                    onClick={() => handleDownloadFormat(f.id)}
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderInstagramSection = () => {
    const medias = igData?.medias || [];

    const current = medias[igIndex] || null;

    const rawThumb =
      current?.preview ||
      current?.url ||
      igData?.thumbnail ||
      "";

    const thumbSrc = rawThumb
      ? `http://localhost:5000/proxy-image?url=${encodeURIComponent(
          rawThumb
        )}`
      : "";

    const goPrev = () => {
      if (!medias.length) return;
      setIgIndex((prev) => (prev - 1 + medias.length) % medias.length);
    };

    const goNext = () => {
      if (!medias.length) return;
      setIgIndex((prev) => (prev + 1) % medias.length);
    };

    return (
      <div className="content">
        <div className="inputRow">
          <input
            className="input mainInput"
            type="text"
            placeholder="Paste any Instagram link here (post, reel, story)..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button className="arrowButton" onClick={handleFetchInstagram}>
            ➜
          </button>
        </div>

        {loading && (
          <div className="loadingWrapper">
            <div className="spinner" />
            <p className="infoText">Getting Instagram media…</p>
          </div>
        )}

        {error && !loading && (
          <p className="infoText errorText">{error}</p>
        )}

        {igData && !loading && (
          <div className="infoBox instagramBox">
            <h2 className="sectionTitle">
              Instagram {igType.charAt(0).toUpperCase() + igType.slice(1)}
            </h2>

            <h3 className="captionLabel">
              {igType.charAt(0).toUpperCase() + igType.slice(1)} Caption:
            </h3>

            <h3 className="videoTitle">
              {igData.title || "Instagram Media"}
            </h3>

            <p className="meta">
              {igData.count && igData.count > 1
                ? `Carousel • ${igData.count} items`
                : "Single media"}
            </p>

            {/* Preview */}
            {current && (
              <div className="previewWrapper">
                {current.type === "video" ? (
                  <video
                    controls
                    className="previewVideo"
                    src={`http://localhost:5000/proxy-video?url=${encodeURIComponent(
                      current.url
                    )}`}
                  />
                ) : (
                  <img
                    src={thumbSrc}
                    alt="Instagram preview"
                    className="previewImage"
                  />
                )}
              </div>
            )}

            {/* <video
              controls
              className="previewVideo"
              poster={thumbSrc}
              src={`http://localhost:5000/proxy-video?url=${encodeURIComponent(
                current.url
              )}`}
            /> */}




            {/* Carousel controls */}
            {medias.length > 1 && (
              <div className="carouselControls">
                <button className="navArrow" onClick={goPrev}>
                  ‹
                </button>
                <div className="dots">
                  {medias.map((_, idx) => (
                    <button
                      key={idx}
                      className={idx === igIndex ? "dot activeDot" : "dot"}
                      onClick={() => setIgIndex(idx)}
                    />
                  ))}
                </div>
                <button className="navArrow" onClick={goNext}>
                  ›
                </button>
              </div>
            )}

            {/* Download Button Centered */}
            <div className="downloadCenter">
              <button className="button" onClick={handleDownloadInstagram}>
                {igType === "story" ? "Download Story" : "Download"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="appRoot">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navLeft">
          <span className="logoText">Downloadables</span>
        </div>
        <div className="navRight">
          <select
            className="navSelect"
            value={platform}
            onChange={handlePlatformChange}
          >
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="heroSection">
        <h1 className="heroTitle">Download Anything Instantly</h1>
        <p className="heroSub">
          Paste any YouTube or Instagram link and grab videos, audio, posts,
          reels, and stories in one place.
        </p>
        <p className="heroTag">
          Currently using: <span>{platform === "youtube" ? "YouTube" : "Instagram"}</span>
        </p>
      </section>

      {/* MAIN */}
      <div className={`page ${loading ? 'centered' : ''}`}>
        <div className="card">
          {platform === "youtube"
            ? renderYoutubeSection()
            : renderInstagramSection()}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footerInner">
          <div className="footerLeft">
            <span className="footerBrand">Downloadables</span>
            <span className="footerCopy">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>
          <div className="footerRight">
            <span className="footerNote">
              Built by Jeeva • Please respect platform terms & creator rights.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
