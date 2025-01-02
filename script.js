let currentSong = new Audio();
let currFolder;
let songs = [];
//function to get all the songs inside the respective folder inside an arr called songs.
async function getSongs(folder) {
    currFolder = folder;
    // console.log(currFolder);
    
    let a = await fetch(`${currFolder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = [];
    for(let i = 0; i<as.length; i++){
        const content = as[i];
        if(content.href.endsWith('.mp3')){
            songs.push(content.href);
        }
    }
    // console.log(songs);
    let songUL = document.querySelector('.songsList').getElementsByTagName('ul')[0];
    songUL.innerHTML = "";
    for (let song of songs) {
        // console.log(song);
        
        songUL.innerHTML = songUL.innerHTML + `<li class='roundBorder'>  
                            <img class="invert songImgForLibrary" src="music.svg" alt="">
                            <div class="songDetails">
                                <div class='inter-font'> ${song.split(`/${currFolder}/`)[1].replaceAll('%20',' ').replaceAll('.mp3','')} </div>
                                <div class='inter-font'>Artist</div>

                            </div>
                            <img id='songImgForLibrary' class="invert songImgForLibrary cursorPointer playSongFromLib" src="playSong.svg" alt=""> 
                            </li>`

    }
    
    //attach an event listener to everysong in 'your library' on playbutton to play the song everytime the button is clicked.
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        let playbutton = e.querySelectorAll('.songImgForLibrary')[1]; 
     
        playbutton.addEventListener('click', ()=>{
            // console.log(e.querySelector('.songDetails').getElementsByTagName('div')[0].innerHTML);
            playSong(e.querySelector('.songDetails').getElementsByTagName('div')[0].innerHTML.trim());
   

        })  
        
            
    });

    return songs;    
    
}

// a function that plays the song
let playSong = (track, pause=false)=>{
    currentSong.src = `${currFolder}/`+`${track}`+'.mp3';
    // console.log(currentSong.src);
    
    // console.log(currentSong.src);
    
    if(!pause){
        // console.log('trying to play the track');
        
        currentSong.play();
        play.src = 'pause.svg';
    }
    document.querySelector('.songinfo').innerHTML = track;
    document.querySelector('.songduration').innerHTML = '00:00/00:00';
}
async function displayAlbums() {
    // console.log("displaying albums");
    let a = await fetch(`Song/`)
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    // console.log(div);
    let anchors = div.getElementsByTagName('a'); 
    let array = Array.from(anchors); 
    
    for(let i = 0; i<array.length; i++){
        let element = array[i];
        if(element.href.includes('/Song/')){
            let folder = element.href;
            // console.log(folder);
            let foldername = folder.split('/Song/')[1].replaceAll('%20',' ').replaceAll('.mp3','');
            // console.log(foldername);
            let b = await fetch(`${folder}/info.json`);
            let newresponse = await b.json();
            // console.log(newresponse);
            let cards = document.querySelector('.cards');
            cards.innerHTML = cards.innerHTML + `<div data-folder=${foldername} class="card p-2 roundBorder">
                    <div class="playOuter cursorPointer">
                        <div class="play ">
                             <svg width="197px" height="197px" viewBox="-4.24 -4.24 16.48 16.48" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" transform="rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0" transform="translate(0,0), scale(1)"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.064"></g><g id="SVGRepo_iconCarrier"> <title>play [#1001]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke-width="0.00008" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-427.000000, -3765.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <polygon id="play-[#1001]" points="371 3605 371 3613 378 3609"> </polygon> </g> </g> </g> </g></svg>
                        </div>
                    </div>
                    
                    <img src="Song/${foldername}/cover.jpeg"  alt="" class="roundBorder">
                    <div class="inter-font">
                        <h1 class="font-Weight">${newresponse.title}</h2>
                        <p class="font-Weight">${newresponse.description}</p>
                    </div>
                </div>`
            
            

            
            
        }

    }
    
    
    
    
}
//the main function that applies all the eventListeners and the other java script parts, also calls the above two functions as well. 
async function main() {
    await getSongs('Song/mySongs')           
    // console.log(songs);
    
    //setting a default song to be visible on the play bar. 
    playSong(songs[0].split(`/${currFolder}/`)[1].replaceAll('%20',' ').replaceAll('.mp3',''), true);

    await displayAlbums();

    //click the playbutton in playbar to play/pause the song. 
    play.addEventListener('click',()=>{
        // let playbutton = e.querySelectorAll('.songImgForLibrary')[1];
        if(currentSong.paused){
            currentSong.play();
            play.src = 'pause.svg';


            // play.classList.add('pause');
            // play.classList.remove('playing');

        }
        else{
            currentSong.pause();
            play.src = 'playSong.svg';
            // play.classList.remove('pause');
            // play.classList.add('playing');
            
        }
    })
    //function that changes seconds to mins in the format : minutes:seconds. 
    function secondstoMins(seconds) {
        if(isNaN(seconds) || seconds<0){
            return '00:00';
        }
        let min = Math.floor(seconds/60);
        let remain = Math.floor(seconds%60);
        let minstr = `${min}`;
        let remainstr = `${remain}`;

        let first = minstr.padStart(2,'0');
        let second = remainstr.padStart(2,'0');


        return `${first}:${second}`;
    }

    //function that gets the percentage of song covered. 
    function getPercentageLeft(time, duration){
        let percentage = (time/duration)*100;
        return percentage;
    }

    //eventlisterner to make the circle movable in the playbar when the song in playing. 
    currentSong.addEventListener('timeupdate',()=>{
        document.querySelector('.songduration').innerHTML = ` ${secondstoMins(currentSong.currentTime)}/${secondstoMins(currentSong.duration)}`;
        // document.querySelector('.circle').removeAttribute('left');
        document.querySelector('.circle').setAttribute('style',`left : ${getPercentageLeft(currentSong.currentTime,currentSong.duration)}%`);
    })

    //event listener to change the position of the circle whenever there's an click on the playbar.    
    document.querySelector('.songtime').addEventListener('click',(e)=>{
        // console.log(e.target.getBoundingClientRect().width, e.offsetX);
        //offsetX: left edge se pixels mai distance dega
        //e.target will print .songtime wala div
        //.getBoundClientRect() will give us element ki 1. left edge ka x coordinate 2. right edge ka coordinate 4. total width of the element including the padding and the margin... etc
        //offsetX will give the range of total pixels from the extreme left excluding the padding.  
        document.querySelector('.circle').style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + '%';
        let newseconds =  ((e.offsetX/e.target.getBoundingClientRect().width)*100)/100 * currentSong.duration;
        currentSong.currentTime =  newseconds;
        document.querySelector('.songduration').innerHTML = ` ${secondstoMins(currentSong.currentTime)}/${secondstoMins(currentSong.duration)}`;


    })

    //eventlistener that automatically updates the time to 00:00 when the song is over.
    currentSong.addEventListener("ended", ()=>{
        play.src = 'playSong.svg';
        currentSong.currentTime = 0;
    })
    
    //eventlisterner for hamburger. 
    document.querySelector('.hamburgerImg').addEventListener('click',()=>{
        document.querySelector('.left').style.left = 0+'%';
        document.querySelector('.library').classList.remove('p-1');
        document.querySelector('.library').classList.add('p-library');
        document.querySelector('.library').classList.remove('m-1');
        document.querySelector('.library').classList.add('m-library');


    })

    //event listener for closing the library in a phone.  
    document.querySelector('.close').addEventListener('click',()=>{
        document.querySelector('.left').style.left = -200+'%';
        document.querySelector('.library').classList.add('p-1');
        document.querySelector('.library').classList.remove('p-library');
        document.querySelector('.library').classList.add('m-1');
        document.querySelector('.library').classList.remove('m-library');

    })

    //eventlistner to play the nextSong
    nextSong.addEventListener('click',()=>{
        let index = songs.indexOf(currentSong.src);
        let newind;
        if(index==songs.length-1){
            newind = 0;
        }
        else{
            newind = index+1;
        }
        let src = songs[newind];
        // console.log(src);
        playSong(src.split(`/${currFolder}/`)[1].replaceAll('%20',' ').replaceAll('.mp3',''));
        
        
        
    })

    //event listerner to play the previous song. 
    previousSong.addEventListener('click',()=>{
        let index = songs.indexOf(currentSong.src);
        let newind;
        if(index==0){
            newind = songs.length-1;
        }
        else{
            newind = index-1;
        }
        let src = songs[newind];
        // console.log(src);
        playSong(src.split(`/${currFolder}/`)[1].replaceAll('%20',' ').replaceAll('.mp3',''));
    })

    // on clicking the volume buttom, the volume should be muted and if it was muted, then it should get max. 
    document.querySelector('.volume>img').addEventListener('click',(e)=>{
        if(e.target.src.includes('volume.svg')){
            e.target.src='mute.svg';
            currentSong.volume = 0;
            volbar.value = 0;

        }
        else{
            e.target.src='volume.svg';
            currentSong.volume = 1;
            volbar.value = 100;
        }

        
    })

    //changing volume and if volume is 0 the volume button should be changed to a muted button:
    document.querySelector('.volumeBar').getElementsByTagName('input')[0].addEventListener('change',(e)=>{
        // console.log(e.target.value, e);
        currentSong.volume = parseInt(e.target.value)/100;
        // console.log(currentSong.volume);
        
        if(e.target.value==0){
            document.querySelector('.volume').getElementsByTagName('img')[0].src = 'mute.svg';
        }
        else{
            document.querySelector('.volume').getElementsByTagName('img')[0].src = 'volume.svg';
        }
        
    })

    //attaching an action listener to each card so that when ever we click on the card, it's library gets loaded.
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async()=>{
            // console.log(e.dataset.folder);
            await getSongs(`Song/${e.dataset.folder}`);
            playSong(songs[0].split(`/${currFolder}/`)[1].replaceAll('%20',' ').replaceAll('.mp3',''), true);
            play.src = 'playSong.svg'
            playSong(songs[0].split(`/${currFolder}/`)[1].replaceAll('%20',' ').replaceAll('.mp3',''));



        })
        
    })
}

main();
