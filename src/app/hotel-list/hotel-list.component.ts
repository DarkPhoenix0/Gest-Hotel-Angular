import {Component, OnInit} from "@angular/core";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {IHotel} from "./hotel-interface";
import {HotelListService} from "./hotel-list.service";

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Observable} from "rxjs";

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})

export class HotelListComponent implements OnInit {
  //Déclaration de variables
  public hotels: IHotel[] = []
  public showBadge: boolean = false
  private _hotelFilter = 'mot'
  public filteredHotels: IHotel[] = []
  public modaleType = ''
  public errMsg: string = ''
  modalTitle = 'Nouvelle Chambre'
  description: string = ''
  titre: string = ''
  image: any
  title = 'hotel list'
  prix: number = 0
  closeResult = '';


  constructor(
    private hotelListeService: HotelListService,
    private modalService: NgbModal,
    public starage: AngularFireStorage,
  ) { }

  ngOnInit() {
    this.hotelFilter = ''
    this.hotelListeService.getHotels().subscribe({
      next: hotels => {
        this.hotels = hotels,
          this.filteredHotels = this.hotels
      },
      error: err => this.errMsg = err
    })
  }

  //Déclaration de Méthodes
  public togleShowBadge(): void {
    this.showBadge = !this.showBadge
  }

  public get hotelFilter(): string {
    return this._hotelFilter
  }

  public set hotelFilter(filter: string) {
    this._hotelFilter = filter
    this.filteredHotels = this.hotelFilter ? this.filterHotels(this.hotelFilter) : this.hotels;
  }

  public filterHotels(critere: string): IHotel[] {
    critere = critere.toLocaleLowerCase()

    const res = this.hotels.filter(
      (hotel: IHotel) => hotel.hotelName.toLocaleLowerCase().indexOf(critere) !== -1
    )

    return res
  }

  public open(content: any) {
    this.modaleType = 'Save'
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // la methode "onFileSelected()" losque le l'image est sélectionnée
  public onFileSelected(e: any) {
    this.image = e.target.files[0]
    console.log(this.image)


    /*if(file){
      const reader = new FileReader()
      reader.readAsDataURL(file)
      console.log(reader);
      reader.onload =(e:any)=>this.image = e.target.result
    }*/
  }

  public onSave() {
    console.log(this.titre, this.description, this.image);
    this.hotels.push({
      hotelId: this.hotels.length + 1,
      hotelName: this.titre,
      description: this.description,
      price: this.prix,
      imageUrl: this.image,
      rating: 3
    })
    this.starage.upload('/images'+Math.random()+this.image, this.image)
  }

  public openUpdate(id: any, content: any) {
    this.modalTitle = 'Modifer les informations'

    this.modaleType = 'Update'

    const selectedHotel: IHotel[] = this.hotels.filter(hotel => hotel.hotelId === id)

    console.log(selectedHotel[0].imageUrl)

    this.titre = selectedHotel[0].hotelName;
    this.description = selectedHotel[0].description;
    this.prix = selectedHotel[0].price;
    this.image = selectedHotel[0].imageUrl

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.titre = ''
      this.description = ''
      this.prix = 0
      this.image = ''
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.titre = ''
      this.description = ''
      this.prix = 0
      this.image = ''
    });

  }

  public onUpdate() {
    console.log('update');
  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
