import Member from "../models/member";
import {
    getLibraryDesc,
    formatNameOfLibraryToDb
} from "./library-services";
import Library from "../models/library";

const members = new Array();
const DATA_BASE_URL:string = "http://localhost:3000/"

export const addUser = async (user: Array<any>) => {
	const member=new Member(user[0], user[1], user[2], user[3], user[4], user[5], user[6]);
	members.push(member);

	setInterval(removeUser,120000, members); //2 minuta
	
	const ind = (document.getElementById('citaonica-input') as HTMLInputElement).value;
	const objCitaonica = getLibraryDesc(ind);
	objCitaonica.subscribe(x=>updateTakenSpots(x));
	//updateZauzetaMesta(objCitaonica);
	const settings = {
		method: 'POST',
		body: JSON.stringify(member),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	}
    const response = await fetch(DATA_BASE_URL+"members/", settings)
    .then(res => res.json()).then(response=>console.log(response));
}

function removeUser(members:Array<any>) : void
{
	members.forEach(element => {
		const chance = Math.floor(Math.random() * 10);
		const result = element.food;
		if(result == "Da" && chance>=7)
		{
			const ind = (document.getElementById('citaonica-input') as HTMLInputElement).value;
			const objLibrary = getLibraryDesc(ind);
			objLibrary.subscribe(x=>updateTakenSpotsWhenKicked(x));
			const brmesta = element.spotNumber;
			const button = document.getElementById('mestosed'+brmesta) as HTMLButtonElement;
			button.style.background="greenyellow";
			button.title="";
			members.splice(element);
		}
	});
}

const updateOfLibrary = async (library: Library) =>
{
	const settings = {
		method: 'PUT',
		body: JSON.stringify({
			id:library.id,
			name:library.name,
			worksFrom:library.worksFrom,
			worksTo:library.worksTo,
			sockets:library.sockets,
			spots:library.spots,
			takenSpots:library.takenSpots=97,
			cleaningLadies:library.cleaningLadies
		}),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}
	const response = await fetch(DATA_BASE_URL+'libraries/'+library.id,settings)
	.then(res => res.json()).then(response=>console.log(response));
}

async function getLibraryObj(ind: string)
{
	const name = formatNameOfLibraryToDb(ind);
	const library = await fetch('http://localhost:3000/libraries' + "?name="+name);
	const libraryJSON = await library.json();

	const jsonLibrary=libraryJSON[0];
	return new Library(jsonLibrary["id"],jsonLibrary["name"],jsonLibrary["worksFrom"],jsonLibrary["worksTo"],jsonLibrary["sockets"],jsonLibrary["spots"], jsonLibrary["takenSpots"]);
}

const updateTakenSpots = async (objCitaonica: any) =>
{
	const citaonicaObject = objCitaonica;
	const clObject=
	{
			"1": 2
	}
	const settings = {
		method: 'PUT',
		body: JSON.stringify({
			id:(citaonicaObject).id,
			name:(citaonicaObject).name,
			worksFrom:(citaonicaObject).worksFrom,
			worksTo:(citaonicaObject).worksTo,
			sockets:(citaonicaObject).sockets,
			spots:(citaonicaObject).spots,
			takenSpots:citaonicaObject.takenSpots+1,
			cleaningLadies:clObject
		}),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}
	const response = await fetch(DATA_BASE_URL+'libraries/'+(await citaonicaObject).id,settings)
	.then(res => res.json()).then(response=>drawTakenLabel(response.takenSpots));
}

export function getTaken(ime: string)
{
	const libraryObj = formatNameOfLibraryToDb(ime);
	const library = getLibraryObj(libraryObj);
	const libraryTaken = library.then((resolve)=> {return resolve.spots-resolve.takenSpots;})
	return libraryTaken;
}

const updateTakenSpotsWhenKicked = async (objLibrary: any) =>
{
	const libraryObject = objLibrary;
	const clObject=
		{
			"1": 2
		}
	const settings = {
		method: 'PUT',
		body: JSON.stringify({
			id:(libraryObject).id,
			name:(libraryObject).name,
			worksFrom:(libraryObject).worksFrom,
			worksTo:(libraryObject).worksTo,
			sockets:(libraryObject).sockets,
			spots:(libraryObject).spots,
			takenSpots:libraryObject.takenSpots-1,
			cleaningLadies:clObject
		}),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}
	const response = await fetch(DATA_BASE_URL+'libraries/'+(await libraryObject).id,settings)
	.then(res => res.json()).then(response=>drawTakenLabel(response.takenSpots));
}

function drawTakenLabel(takenSpots:number)
{
	(document.getElementById("takenlabel") as HTMLLabelElement).innerHTML="Zauzeto: " + takenSpots;
}
