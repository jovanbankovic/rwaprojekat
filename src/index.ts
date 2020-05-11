import {
	getCitaonica,
	inputEVENT,
	onPrijavaEvent
} from "./services/citaonica-services";
import { zip } from "rxjs";

import { nacrtajModal, modalPrijava } from "./services/modal"
import Citaonica from "./models/citaonica";

const listaCitaonica = document.getElementById("citaonica-list") as HTMLUListElement;

getCitaonica().then((citaonica) => { citaonica.forEach((cit: Citaonica) => { cit.drawListItem(listaCitaonica); }); });

const InputCitaonice= (<HTMLInputElement><unknown>document.getElementById('citaonica-input'));
let listaTetkica = document.getElementById("tetkica-list") as unknown as HTMLLIElement;
inputEVENT(InputCitaonice, listaTetkica);

//crtanje modala
const modal1=document.getElementById("my-modal1") as HTMLDivElement;
modalPrijava(modal1);

const modal = document.getElementById("my-modal") as HTMLDivElement;
nacrtajModal(modal);

const button = document.getElementById("dugmezaprijavu") as unknown as HTMLButtonElement;
const inputmesta = document.getElementById("mesto") as HTMLInputElement;
onPrijavaEvent(button, inputmesta);