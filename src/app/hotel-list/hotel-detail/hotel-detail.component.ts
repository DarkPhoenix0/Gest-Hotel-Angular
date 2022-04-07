import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HotelListService} from "../hotel-list.service";
import {IHotel} from "../hotel-interface";

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss'],
})
export class HotelDetailComponent implements OnInit {

  public hotel : IHotel = <IHotel>{}

  constructor(private route: ActivatedRoute, private hotelService : HotelListService, private router : Router) { }

  ngOnInit(): void {
    const id = parseInt(<string>this.route.snapshot.paramMap.get('id'));

    this.hotelService.getHotels().subscribe((hotels: IHotel[])=>{
      // @ts-ignore
      this.hotel = hotels.find(hotel => hotel.hotelId === id)
      console.log(this.hotel);
    })
  }

  public onBackToList():void{
    this.router.navigate(['/hotels'])
  }
}
