import Citaonica from "../models/citaonica";
import Tetkica from "../models/tetkica";
import { fromEvent, from, zip, Observable, of, Observer, merge, timer } from "rxjs";
import { debounceTime, map, switchMap, filter, take, mergeMap, tap, delay, takeUntil } from "rxjs/operators";
import Clan from "../models/clan";

const clanovi = new Array();

const DATA_BASE_URL:string = "http://localhost:3000/"

export async function getCitaonica() {
	const citaonicaResponse = await fetch(DATA_BASE_URL + "citaonica");
	const citaonicaNiz = await citaonicaResponse.json();
	let citaonica = citaonicaNiz.map((citaonicaLiteral: Citaonica) => Citaonica.createCitaonicaFromLiteral(citaonicaLiteral));
	return citaonica;
}

export function inputEVENT(inputElement: HTMLInputElement, listaTetkica: HTMLLIElement) {
	const citaonicaDescription = document.getElementById("citaonica-desc") as HTMLDivElement;
	fromEvent(inputElement, "input").pipe(debounceTime(1000),
	map(() => uzmiinput(inputElement)), 
	switchMap(ime => { return getOpisCitaonice(ime)  }))
		.subscribe((citaonica) => crtajCitaonicu(citaonica, citaonicaDescription));
}

function uzmiinput(inputElement: HTMLInputElement)
{
	return inputElement.value;
}

function crtajCitaonicu(citaonica: any, citaonicaDescription: HTMLDivElement)
{
	citaonica.drawDescriptionCitaonica(citaonicaDescription);
}

function getOpisCitaonice(imeCitaonice: any) { 
	const queryStringCitaonica = "?ime=" + formatImeCitaoniceToDb(imeCitaonice);
  	return getCitaonicaDetails(queryStringCitaonica).pipe(switchMap(citaonicaLiteral => { 
		const citaonica = createCitaonicaOrError(citaonicaLiteral);
  		return getCitaonicaObservable(citaonicaLiteral, citaonica);
    })
  );
}

function createCitaonicaOrError(citaonicaLiteral: Citaonica) {
	//updateCitaonice(citaonicaLiteral);
	return citaonicaLiteral !== undefined
		? Citaonica.createCitaonicaFromLiteral(citaonicaLiteral)
		: Citaonica.createErrorCitaonica();
}

function getCitaonicaDetails(queryStringCitaonica: string)
{
	return from(
		fetch(DATA_BASE_URL + "citaonica/" + queryStringCitaonica).then(response => 
			response.json()
		)
	).pipe(map(ime => ime[0]));
}

function getCitaonicaObservable(citaonicaLiteral: Citaonica, citaonica: Citaonica) {
	let citaonicaObservable;
	if (citaonicaLiteral !== undefined) {
	  const tetkiceIDs = getValuesFromObjectArray(citaonicaLiteral["tetkice"]);
	  citaonicaObservable = getAllTetkiceByArrayOfID(tetkiceIDs).pipe(map(tetkice => { citaonica.tetkice = tetkice;
		  return citaonica;
		})
	  );
	} else {
	  citaonicaObservable = Observable.create((observer: Observer<Citaonica>) => { observer.next(citaonica);});
	}
	return citaonicaObservable;
  }
  

function formatImeCitaoniceToDb(imeCitaonice: string) {
	imeCitaonice = imeCitaonice.toLowerCase();
	let allWords = imeCitaonice.split(" ");
	let modifiedWords = allWords.map(
		word => word.charAt(0).toUpperCase() + word.slice(1)
	);
	let returnVal = modifiedWords.join(" ");
	return returnVal;
}

function getValuesFromObjectArray(objectArray: Object) {
	return Object.values(objectArray).map((value) => parseInt(value));
}

function getAllTetkiceByArrayOfID(tetkiceIDArray: any[]) 
{
	let tetkiceObservable = tetkiceIDArray.map(id => getTetkicaDetails(id));
	return zip(...tetkiceObservable).pipe(map(tetkiceArrayLiteral => tetkiceArrayLiteral.map(tetkiceLiteral => Tetkica.createTetkicafromLiteral(tetkiceLiteral))));
}

function getTetkicaDetails(tetkicaID: number) 
{
	const specificActor = "tetkice/" + tetkicaID;
	let url = DATA_BASE_URL + specificActor;
	return from(fetch(url).then(promise => promise.json().then(data => data)));
}

export function onPrijavaEvent(button: HTMLButtonElement, inputBrojMesta: HTMLInputElement)
{
	const InputCitaonice= (<HTMLInputElement><unknown>document.getElementById('citaonica-input'));
	const test = fromEvent(inputBrojMesta, 'input').pipe(debounceTime(1000),
	map(()=>uzmiinput(InputCitaonice)),
	switchMap(ime=>getZauzeto(ime)));

	const checkFull = test.pipe(filter(val=>val<1))

	const button1 = fromEvent(button,'click').pipe(
		debounceTime(1500),
		 map(()=>getInputValues()),
		 switchMap((data)=>formatUserInfo(data)),
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

  
function formatUserInfo(userInfo: Promise<any>)
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
	const clan=new Clan(user[0], user[1], user[2], user[3], user[4], user[5], user[6]);
	clanovi.push(clan);

	const ind = (document.getElementById('citaonica-input') as HTMLInputElement).value;
	const objCitaonica = getOpisCitaonice(ind);
	objCitaonica.subscribe(x=>updateZauzetaMesta(x));
	//updateZauzetaMesta(objCitaonica);
	setInterval(removeUser,1000000, clanovi); //1 minut

	const settings = {
		method: 'POST',
		body: JSON.stringify(clan),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	}

    const response = await fetch(DATA_BASE_URL+"clanovi/", settings)
    .then(res => res.json()).then(response=>console.log(response));
}

function removeUser(niz:Array<any>) : void
{
	niz.forEach(element => {
		const sansa = Math.floor(Math.random() * 10);
		const izborHrane = document.getElementById('hranaselect') as HTMLSelectElement;
		const result = izborHrane.options[izborHrane.selectedIndex].text;
		console.log(sansa);
		if(result == "Da" && sansa>=8)
		{
			console.log(element.brmesta);
			const seat = element.brmesta;
			const button = document.getElementById('mestosed'+seat) as HTMLButtonElement;
			button.style.background="greenyellow";
			button.title="";
			niz.splice(element);
		}
	});
}

const updateCitaonice = async (citaonica: Citaonica) =>
{
	const settings = {
		method: 'PUT',
		body: JSON.stringify({
			id:citaonica.id,
			ime:citaonica.ime,
			radiod:citaonica.radiod,
			radido:citaonica.radido,
			uticnice:citaonica.uticnice,
			mesta:citaonica.mesta,
			zauzeto:citaonica.zauzeto=97,
			tetkice:citaonica.tetkice
		}),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}
	const response = await fetch(DATA_BASE_URL+'citaonica/'+citaonica.id,settings)
	.then(res => res.json()).then(response=>console.log(response));
}

async function uzmiCitaonicu(ind: string)
{
	const name = formatImeCitaoniceToDb(ind);
	const citaonica = await fetch('http://localhost:3000/citaonica' + "?ime="+name);
	const jsonCitaonica = await citaonica.json();

	const citaonicaJson=jsonCitaonica[0];
	return new Citaonica(citaonicaJson["id"],citaonicaJson["ime"],citaonicaJson["radiod"],citaonicaJson["radido"],citaonicaJson["uticnice"],citaonicaJson["mesta"], citaonicaJson["zauzeto"]);
}

const updateZauzetaMesta = async (objCitaonica: any) =>
{
	const citaonicaObject = objCitaonica;
	console.log("Citaj: ", citaonicaObject.zauzeto);
	const tetkicaObj=
		{
			"1": 2
		}
	
	console.log("bra");
	console.log(citaonicaObject);
	const settings = {
		method: 'PUT',
		body: JSON.stringify({
			id:(citaonicaObject).id,
			ime:(citaonicaObject).ime,
			radiod:(citaonicaObject).radiod,
			radido:(citaonicaObject).radido,
			uticnice:(citaonicaObject).uticnice,
			mesta:(citaonicaObject).mesta,
			zauzeto:citaonicaObject.zauzeto+1,
			tetkice:tetkicaObj
		}),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}
	const citaonicaDescription = document.getElementById("citaonica-desc") as HTMLDivElement;
	const response = await fetch(DATA_BASE_URL+'citaonica/'+(await citaonicaObject).id,settings)
	.then(res => res.json()).then(response=>console.log(response));
}

function getZauzeto(ime: string)
{
	const citaonicaObj = formatImeCitaoniceToDb(ime);
	const cit = uzmiCitaonicu(citaonicaObj);
	const citaonicaZauzeto = cit.then((resolve)=> {return resolve.mesta-resolve.zauzeto;})
	console.log("test");
	console.log(citaonicaZauzeto);
	return citaonicaZauzeto;
}