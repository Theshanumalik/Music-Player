musicAppMain();
document.querySelector(".theme-changer").addEventListener("click", changeTheme);

function changeTheme() {
  document.body.classList.toggle("toggle-mode");
}

// main Function For Fetching Data And HandlingEventes
async function musicAppMain() {
  // Entializing the variables
  const url = "/json/music.json"; //url from where we are fetching song object / json
  const res = await fetch(url); //fetching data from url with await
  const songsMain = await res.json(); // Storing song data in a variable
  let songs = [...songsMain]; //Copying data from songMain array
  const song = new Audio(); //creating a new audio ( USING THIS ONLY OBJECT ALL OVER THE APP )
  const preBtn = document.getElementById("preBtn");
  const playBtn = document.getElementById("playBtn");
  const nextBtn = document.getElementById("nextBtn");
  const menuBtn = document.getElementById("menuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const songList = document.querySelector(".song-list");
  const songListContainer = document.querySelector(".song-list-container");
  const progressContainer = document.querySelector(".progress-container");
  const searchBox = document.getElementById("search-box");
  const songCover = document.getElementById("song-cover");
  const songTitle = document.getElementById("song-title");
  const altImg = "icons/song-icon.png";
  let songIndex = 0;

  // loading song's list and also setting first song as active
  LoadMusicList(songs);
  song.src = `resource/${songs[songIndex].src}`;
  songCover.src = `${songs[songIndex].cover}` || altImg;
  songTitle.innerText = `${songs[songIndex].title}`;
  document.getElementById(`songIndex${songIndex}`).classList.add("active");

  // Listening events
  playBtn.addEventListener("click", playSong);
  nextBtn.addEventListener("click", playNext);
  preBtn.addEventListener("click", playPrew);
  song.addEventListener("ended", playNext);
  progressContainer.addEventListener("click", setProgress);
  menuBtn.addEventListener("click", showMusicList);
  closeMenuBtn.addEventListener("click", () => {
    data = [...songsMain];
    LoadMusicList(data);
    showMusicList();
    searchBox.value = '';
  });
  searchBox.addEventListener("keyup", filterSongList);

  // updating progress bar
  song.ontimeupdate = () => {
    currentTime = song.currentTime;
    duration = song.duration;
    precent = (currentTime / duration) * 100;
    document.querySelector(".progress").style.width = `${precent}%`;
  };
  // key bordshortcut for play next and previous
  document.addEventListener(
    "keydown",
    (event) => {
      let code = event.code;
      if (code === "ArrowRight" || code === "ArrowDown") {
        playNext();
        return 0;
      }
      if (code === "ArrowLeft" || code === "ArrowUp") {
        playPrew();
        return 0;
      }
    },
    true
  );
  // keybordshortcut for PLAY/PAUSE and MENU
  document.addEventListener(
    "keypress",
    (event) => {
      let code = event.code;
      if (code === "Space") {
        playSong();
        return 0;
      } else if (code === "KeyM") {
        showMusicList();
        return 0;
      } else if (code === "KeyT") {
        changeTheme();
        return 0;
      } else if (code === "KeyF") {
        toggleFullscreen();
        return 0;
      }
    },
    true
  );

  // Intializing fuctions Or defination of all functions

  // play previous song
  function playPrew() {
    songIndex--;
    if (songIndex < 0) {
      songIndex = songs.length - 1;
    }
    song.src = `resource/${songs[songIndex].src}`;
    songCover.src = `${songs[songIndex].cover}` || altImg;
    songTitle.innerText = `${songs[songIndex].title}`;
    playSong();
    updateList(`songIndex${songIndex}`);
  }
  // play next Functionallity
  function playNext() {
    songIndex++;
    if (songIndex > songs.length - 1) {
      songIndex = 0;
    }
    song.src = `resource/${songs[songIndex].src}`;
    songCover.src = `${songs[songIndex].cover}` || altImg;
    songTitle.innerText = `${songs[songIndex].title}`;
    playSong();
    updateList(`songIndex${songIndex}`);
  }

  // play song functionallity
  function playSong() {
    if (song.paused) {
      song.play();
      playBtn.classList.add("fa-pause");
      playBtn.classList.remove("fa-play");
      document.querySelector(".song-img").classList.add("song-animation-play");
    } else {
      song.pause();
      playBtn.classList.add("fa-play");
      document
        .querySelector(".song-img")
        .classList.remove("song-animation-play");
    }
  }

  // updating progress bar
  function setProgress(e) {
    width = this.clientWidth;
    widthX = e.offsetX;
    duration = song.duration;
    time = (widthX / width) * duration;
    song.currentTime = time;
    if (song.paused) {
      song.play();
      playBtn.classList.add("fa-pause");
      playBtn.classList.remove("fa-play");
      document.querySelector(".song-img").classList.add("song-animation-play");
    }
  }

  // Show and hide music list
  function showMusicList() {
    songList.classList.toggle("showList");
  }

  // To load all song's list
  function LoadMusicList(songListArray) {
    let MusicListItems = "";
    songListArray.forEach((element, index) => {
      MusicListItems += `<div class="list-item" id="songIndex${index}" >
                          <span>${index + 1}</span>
                          <button class="btn fa-solid fa-play"></button>
                          <p>${element.title}</p>
                      </div>`;
    });
    songListContainer.innerHTML = MusicListItems;
    songListArray.forEach((element, index) => {
      document
        .getElementById(`songIndex${index}`)
        .addEventListener("click", () => {
          playWithList(element.src, index, `songIndex${index}`);
        });
    });
  }

  // play from menu

  function playWithList(src, index, id) {
    const myaudio = new Audio(`/resource/${src}`);
    updateList(id);
    if (song.src == myaudio.src) {
      playSong();
    } else {
      song.src = `resource/${songs[index].src}`;
      songCover.src = `${songs[index].cover}` || altImg;
      songTitle.innerText = `${songs[index].title}`;
      songIndex = index;
      playSong();
    }
  }

  // updatin song menu || Making song item active which is currently playing
  function updateList(id) {
    const items = document.querySelectorAll(".list-item");
    items.forEach((elem) => {
      elem.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
  }

  // Sorting songs by keywords

  function filterSongList(e) {
    songs = songsMain;
    keyword = e.target.value;
    keyword = keyword.toLowerCase();
    newList = songs.filter((data) => {
      data = data.title.toLowerCase();
      if (data.includes(keyword)) {
        return data;
      }
    });
    LoadMusicList(newList);
    songs = newList;
  }
}

function toggleFullscreen(elem) {
  elem = elem || document.documentElement;

  if (
    !document.fullscreenElement &&
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}
