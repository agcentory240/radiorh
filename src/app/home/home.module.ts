import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { HomePageRoutingModule } from './home-routing.module';
import { HttpClient,HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers: [HttpClient,MusicControls]
})
export class HomePageModule {}
