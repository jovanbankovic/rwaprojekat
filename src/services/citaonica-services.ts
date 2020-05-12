import Library from "../models/library";
import CleaningLady from "../models/CleaningLady";
import { fromEvent, from, zip, Observable, of, Observer, merge} from "rxjs";
import { debounceTime, map, switchMap, filter, take, takeUntil } from "rxjs/operators";
import Member from "../models/member";

const members = new Array();
const DATA_BASE_URL:string = "http://localhost:3000/"

export async function getLibrary() {
	const libraryResp = await fetch(DATA_BASE_URL + "libraries");
	const libraryArray = await libraryResp.json();
	let library = libraryArray.map((libraryLiteral: Library) => Library.createLibraryFromLiteral(libraryLiteral));
	return library;
}

export function eventOnInput(inputElement: HTMLInputElement, listaOfCleaningLadies: HTMLLIElement) {
	const descriptionOfLibrary = document.getElementById("citaonica-desc") as HTMLDivElement;
	fromEvent(inputElement, "input").pipe(debounceTime(1000),
	take(3),
	map(() => getInputNameValue(inputElement)), 
	switchMap(name => { return getLibraryDesc(name)  }))
		.subscribe((library) => drawLibrary(library, descriptionOfLibrary));

}

function getInputNameValue(inputElement: HTMLInputElement) { return inputElement.value; }

function drawLibrary(library: any, descriptionOfLibrary: HTMLDivElement)
{
	library.drawDescriptionOfLibrary(descriptionOfLibrary);
}

function getLibraryDesc(libraryName: any) { 
	const queStringLibrary = "?name=" + formatNameOfLibraryToDb(libraryName);
  	return getLibraryDetails(queStringLibrary).pipe(switchMap(libraryLiteral => { 
		const library = createLibraryOrError(libraryLiteral);
  		return getLibraryObservable(libraryLiteral, library);
    })
  );
}

function createLibraryOrError(libraryLiteral: Library) {
	return libraryLiteral !== undefined
		? Library.createLibraryFromLiteral(libraryLiteral)
		: Library.createErrorLibrary();
}

function getLibraryDetails(queStringLibrary: string)
{
	return from(fetch(DATA_BASE_URL + "libraries/" + queStringLibrary).then(response => response.json())
	).pipe(map(name => name[0]));
}

function getLibraryObservable(libraryLiteral: Library, library: Library) {
	let libraryObservable;
	if (libraryLiteral !== undefined) {
	  const cleaningLadyIDS = getValuesFromObjectArray(libraryLiteral["cleaningLadies"]);
	  libraryObservable = getCleaningLadiesByArrayOfID(cleaningLadyIDS).pipe(map(cleaningLadies => { library.cleaningLadies = cleaningLadies;
		  return library;
		})
	  );
	} else {
	  libraryObservable = Observable.create((observer: Observer<Library>) => { observer.next(library);});
	}
	return libraryObservable;
  }
  

function formatNameOfLibraryToDb(libraryName: string) {
	libraryName = libraryName.toLowerCase();
	let allWords = libraryName.split(" ");
	let modifiedWords = allWords.map(
		word => word.charAt(0).toUpperCase() + word.slice(1)
	);
	let returnVal = modifiedWords.join(" ");
	return returnVal;
}

function getValuesFromObjectArray(objectArray: Object) {
	return Object.values(objectArray).map((value) => parseInt(value));
}

function getCleaningLadiesByArrayOfID(cleaningLadyIDArray: any[]) 
{
	let clObservable = cleaningLadyIDArray.map(id => getCleaningLadyDetails(id));
	return zip(...clObservable).pipe(map(clArrayLiteral => clArrayLiteral.map(clLiteral => CleaningLady.createCleaningLadyFromLiteral(clLiteral))));
}

function getCleaningLadyDetails(cleaningLadyID: number) 
{
	const cleaningLady = "cleaningLadies/" + cleaningLadyID;
	let url = DATA_BASE_URL + cleaningLady;
	return from(fetch(url).then(promise => promise.json().then(data => data)));
}

export function onPrijavaEvent(button: HTMLButtonElement, inputNumberOfSpot: HTMLInputElement)
{
	const libraryInput= (<HTMLInputElement><unknown>document.getElementById('citaonica-input'));
	const obs = fromEvent(inputNumberOfSpot, 'input').pipe(debounceTime(1000),
	map(()=>getInputNameValue(libraryInput)),
	switchMap(ime=>getTaken(ime)));

	const checkFull = obs.pipe(filter(val=>val<1))

	const button1 = fromEvent(button,'click').pipe(
		debounceTime(1500),
		 map(()=>getInputValues()),
		 switchMap((data)=>formatMemberInfo(data)),
		 takeUntil(checkFull)
		 
	 ).subscribe((user)=>addUser(user));
}

async function getInputValues()
{
	const prvi = of((document.getElementById('inputime') as unknown as HTMLInputElement).value);
	const drugi = of((document.getElementById('inputprezime') as unknown as HTMLInputElement).value);
	const treci = of((document.getElementById('inputgodina') as unknown as HTMLInputElement).value);
	const cetvrti = of((document.getElementById('inputfakultet') as unknown as HTMLInputElement).value);
	const peti = of((document.getElementById('inputsmer') as unknown as HTMLInputElement).value);
	const sesti = of((document.getElementById('hranaselect')as HTMLSelectElement).value);
	const sedmi = of((document.getElementById('mesto') as unknown as HTMLInputElement).value);

	const vrednost:string=((document.getElementById('mesto') as HTMLInputElement).value);
	const idmesta = document.getElementById('mestosed' + vrednost) as unknown as HTMLButtonElement;
	idmesta.style.backgroundColor="red";
	idmesta.title=((document.getElementById('inputime') as unknown as HTMLInputElement).value) + " " + ((document.getElementById('inputprezime') as unknown as HTMLInputElement).value);

	const allInputsObs=zip(prvi,drugi,treci,cetvrti,peti,sesti,sedmi);

	const result = getValue(allInputsObs);
	clearInputValues();
    return result;
}

function clearInputValues()
{
	const prvi = of(document.getElementById('inputime')as HTMLInputElement);
	const drugi = of(document.getElementById('inputprezime')as HTMLInputElement);
	const treci = of(document.getElementById('inputgodina')as HTMLInputElement);
	const cetvrti = of(document.getElementById('inputfakultet')as HTMLInputElement);
	const peti = of(document.getElementById('inputsmer')as HTMLInputElement);
	const sesti = of(document.getElementById('mesto')as HTMLInputElement);

	merge(prvi,drugi,treci,cetvrti,peti,sesti).subscribe(x=> x.value='');
}

function hasValue(value: any) 
{
	return value !== null && value !== undefined;
}
  
function getValue<Citaonica>(observable: Observable<Citaonica>): Promise<Citaonica>
{
	return observable
	  .pipe(
		filter(hasValue), 
	  ).toPromise();
}

  
function formatMemberInfo(userInfo: Promise<any>)
{
	const modifiedWords=userInfo.then((resolve)=>resolve.map((user: string)=>formatWords(user))) 
	return modifiedWords;
}

function formatWords(user: string)
{
    user = user.toLowerCase();
    let allWords = user.split(" ");
    let modifiedWords = allWords.map(
        word => word.charAt(0).toUpperCase() + word.slice(1)
     );
    let returnVal = modifiedWords.join(" ");

    return returnVal;
}

const addUser = async (user: Array<any>) => {
	const member=new Member(user[0], user[1], user[2], user[3], user[4], user[5], user[6]);
	members.push(member);

	setInterval(removeUser,10000, members); //2 minuta
	
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

function getTaken(ime: string)
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