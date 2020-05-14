import {
	getLibrary,
	eventOnInput,
	onPrijavaEvent
} from "./services/library-services";
import { nacrtajModal, modalPrijava } from "./services/modal"
import Library from "./models/library";

const listOfLibraries = document.getElementById("citaonica-list") as HTMLUListElement;

getLibrary().then((citaonica) => { 
	citaonica.forEach((cit: Library) => { cit.drawListOfLibraries(listOfLibraries); }); });

const libraryInput= (<HTMLInputElement><unknown>document.getElementById('citaonica-input'));
let cleaningLadiesList = document.getElementById("tetkica-list") as unknown as HTMLLIElement;

eventOnInput(libraryInput, cleaningLadiesList);

const modal1=document.getElementById("my-modal1") as HTMLDivElement;
modalPrijava(modal1);

const modal = document.getElementById("my-modal") as HTMLDivElement;
nacrtajModal(modal);

const button = document.getElementById("dugmezaprijavu") as unknown as HTMLButtonElement;
const inputmesta = document.getElementById("mesto") as HTMLInputElement;
onPrijavaEvent(button, inputmesta);