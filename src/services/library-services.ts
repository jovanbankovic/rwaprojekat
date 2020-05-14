import Library from "../models/library";
import CleaningLady from "../models/CleaningLady";
import { fromEvent, from, zip, Observable, of, Observer, merge} from "rxjs";
import { debounceTime, map, switchMap, filter, take, takeUntil } from "rxjs/operators";
import Member from "../models/member";
import { getTaken,
		addUser,
 } from "./user-services"

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
	map(() => getInputNameValue(inputElement)),switchMap(name => { return getLibraryDesc(name)  }))
		.subscribe((library) => drawLibrary(library, descriptionOfLibrary));
}

function getInputNameValue(inputElement: HTMLInputElement) { return inputElement.value; }

function drawLibrary(library: any, descriptionOfLibrary: HTMLDivElement)
{
	library.drawDescriptionOfLibrary(descriptionOfLibrary);
}

export function getLibraryDesc(libraryName: any) { 
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
  
export function formatNameOfLibraryToDb(libraryName: string) {
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
		 takeUntil(checkFull)).subscribe((user)=>addUser(user));
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
