import { Component } from '@angular/core';
import {Howl, Howler } from 'howler';
import { HttpClient } from '@angular/common/http';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Platform } from '@ionic/angular';
import { BackgroundModeConfiguration } from '@ionic-native/background-mode';
import { MusicControls } from '@ionic-native/music-controls/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private player: Howl = null;
  private style: false;
  private is_loaded: boolean = false;
  private is_error: boolean = false;
  private is_preparing: boolean = false;
  private play_started: boolean = false;
  private data: any = {};
  private current_artist: string = "";
  private current_songtitle: string = "";
  private current_url: string = "";

  private previous_artist: string = "";
  private previous_songtitle: string = "";
  private previous_url: string = "";

  constructor(private http1: HttpClient, private platform: Platform, private backgroundMode: BackgroundMode, public musicControls: MusicControls ) {}


  ngOnInit() {

    this.platform.ready().then(() => {
      this.backgroundMode.setDefaults({ silent: true });
      this.backgroundMode.enable();
    });
     this.reloadSources();
  }

  settingMusicControl(){
    this.musicControls.destroy(); // it's the same with or without the destroy 
    this.musicControls.create({
      track       : this.current_songtitle,        // optional, default : ''
      artist      : this.current_artist,                       // optional, default : ''
      cover       : '',      // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying   : true,                         // optional, default : true
      dismissable : true,                         // optional, default : false
    
      // hide previous/next/close buttons:
      hasPrev   : false,      // show previous button, optional, default: true
      hasNext   : false,      // show next button, optional, default: true
      hasClose  : true,       // show close button, optional, default: false
      hasSkipForward : false,  // show skip forward button, optional, default: false
      hasSkipBackward : false, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
    // iOS only, optional
      album       : '',     // optional, default: ''
      duration : 0, // optional, default: 0
      elapsed : 0, // optional, default: 0
    
      // Android only, optional
      // text displayed in the status bar when the notific\ation (and the ticker) are updated
      ticker    : 'Сейчас играет / '+this.current_songtitle+' / '+this.current_artist
     });

     this.musicControls.subscribe().subscribe((action) => {
      console.log('action', action);
          const message = JSON.parse(action).message;
          console.log('message', message);
          switch(message) {
            case 'music-controls-next':
               // Do something
               break;
            case 'music-controls-previous':
               // Do something
               break;
            case 'music-controls-pause':
               // Do something
               console.log('music pause');
               this.player.pause();
               this.musicControls.listen(); 
               this.musicControls.updateIsPlaying(false);
               break;
            case 'music-controls-play':
               // Do something
               console.log('music play');
               this.player.play();
               this.musicControls.listen(); 
               this.musicControls.updateIsPlaying(true);
               break;
            case 'music-controls-destroy':
               // Do something
               break;
            // External controls (iOS only)
            case 'music-controls-toggle-play-pause' :
              // Do something
              break;
            case 'music-controls-seek-to':
              // Do something
              break;
            case 'music-controls-skip-forward':
              // Do something
              break;
            case 'music-controls-skip-backward':
              // Do something
              break;

              // Headset events (Android only)
              // All media button events are listed below
            case 'music-controls-media-button' :
                // Do something
                break;
            case 'music-controls-headset-unplugged':
                // Do something
                break;
            case 'music-controls-headset-plugged':
                // Do something
                break;
            default:
                break;
          }
    });
    this.musicControls.listen(); // activates the observable above
    this.musicControls.updateIsPlaying(true);
  }  



  doPlay() {
    if (this.play_started) return;
    this.play_started = true;
    console.log("do play");
    this.is_preparing = true;
    this.player = new Howl({
      src: [this.current_url],
      format: ['mp3','aac'],
      html5: true,
      onend: () => { this.playerOnEnd()},
      onload: () => this.playerOnLoad(),
      onstop: () => this.playerOnStop(),
      onfade: () => this.playerOnFade(),
    });
    this.player.play(); 

  }

  playerOnEnd() {
    console.log("playerOnEnd:");
  }

  playerOnLoad() {
    console.log("playerOnLoad:");
    this.is_preparing = false;
  }

  playerOnStop() {
    console.log("playerOnStop:");
  }

  playerOnFade() {
    console.log("playerOnFade:");
  }

  doStop() {
    this.player.stop();
    this.play_started = false;
  }


  async reloadSources() {
    this.data = await this.http1.get("https://myradio24.com/users/5491/status.json").toPromise().then( res=>{
      console.log("promise reload:");
      console.log(res);
      this.data = res;
      this.is_loaded = true;


      this.previous_artist = this.current_artist;
      this.previous_songtitle = this.current_songtitle;

      this.current_url = this.data.streams[0].url;
      this.current_artist = this.data.artist;
      this.current_songtitle = this.data.songtitle;

      //Произошла смена песни, сменим кнопки
      if (this.previous_artist!=this.current_artist || this.previous_songtitle!=this.current_songtitle) {
        this.settingMusicControl();
      }

      //Если в предыдущий раз была ошибка, но плеер при этом играл, то запустим его повторно      
      if (this.is_error && this.play_started) {
        this.doPlay();
      }

      this.is_error = false;
      setTimeout(()=>{
        this.reloadSources();
      },1000);
    }).catch(err=> {
      this.is_error = true;

      //Попробуем запустить заново.
      if (this.player!=null && this.player.playing) this.player.stop();
      setTimeout(()=>{
        this.reloadSources();
      },1000);      
    })
    //console.log(this.data);
  }

}
