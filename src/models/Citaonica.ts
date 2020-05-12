export default class Citaonica
{
    id:number; ime:string; radiod:string; radido:string; uticnice:number; mesta:number; zauzeto:number;
    tetkice: any[];
    constructor(id:number, ime:string, radiod:string, radido:string, uticnice:number, mesta:number, zauzeto:number, tetkice = new Array())
    {
        this.id=id;
        this.ime=ime;
        this.radiod=radiod;
        this.radido=radido;
        this.uticnice=uticnice;
        this.mesta = mesta;
        this.zauzeto=zauzeto;
        this.tetkice=tetkice;
        
    }

    drawListItem(host: HTMLUListElement)
    {
        const citaonicaListItem = document.createElement("li");
        citaonicaListItem.innerHTML = this.ime;
		host.appendChild(citaonicaListItem);
    }

    drawDescriptionCitaonica(host: HTMLDivElement)
    {
        host.innerHTML = "";
        if(this.id===-1) { 
            host.innerHTML="Ne postoji citaonica sa tim imenom!" 
            const successAttempt = document.getElementById('uspesnaprijava') as HTMLDivElement;
            successAttempt.innerHTML=""
    }
        else
        {
            const successAttempt = document.getElementById('uspesnaprijava') as HTMLDivElement;
            successAttempt.innerHTML="Uspesno ste prikazali odabranu citaonicu. (Scroll down to review)"

            const descriptionCitaonice = document.createElement("div");
            host.appendChild(descriptionCitaonice);
            descriptionCitaonice.className="descriptionCitaonice";

            descriptionCitaonice.innerHTML = this.ime + "<br>" + "Radno vreme: " + this.radiod + "/" + this.radido + "<br>" + "Broj uticnica: " +this.uticnice + "<br>" + "Lista dezurnih tetkica: ";
            const ulCitaonica = document.createElement("ul");
            ulCitaonica.className="listaTetkica";
            ulCitaonica.id="ulCitaonica";
		    this.tetkice.map((tetkica) => tetkica.drawListOfCleaningLadies(ulCitaonica));
            descriptionCitaonice.appendChild(ulCitaonica);

            this.drawTakenLabelLibrary(ulCitaonica);
            
            const buttondiv=document.createElement('div');
            ulCitaonica.appendChild(buttondiv);
            buttondiv.className="buttondiv";
            
            const divlevo = document.createElement('div');
            buttondiv.appendChild(divlevo);
            divlevo.className="divlevo";
            
            const divdesno = document.createElement('div');
            buttondiv.appendChild(divdesno);
            divdesno.className="divdesno";
 
            this.drawSeats(divlevo, divdesno);
            this.paintSockets();
            this.createDescriptionOfSeats(ulCitaonica);
        }
    }

    drawSeats(divlevo: HTMLDivElement, divdesno: HTMLDivElement)
    {
        for(var i = 1; i <= this.mesta/2; i++) 
        {
            const mestoucit = document.createElement("button");
            mestoucit.innerHTML = i.toString();
            mestoucit.id="mestosed"+i;
            mestoucit.className="mestazasedenje";
            divlevo.appendChild(mestoucit);
        }  

        for(var i = this.mesta/2 + 1; i <= this.mesta; i++) 
        {
            const mestoucit2 = document.createElement("button");
            mestoucit2.innerHTML = i.toString();
            mestoucit2.id="mestosed"+i;
            mestoucit2.className="mestazasedenje";
            divdesno.appendChild(mestoucit2);
        }  

    }
    
    drawTakenLabelLibrary(host: HTMLUListElement)
    {
        const takenLabel = document.createElement('label');
        takenLabel.innerHTML="Zauzeto: " + this.zauzeto.toString();
        takenLabel.id="takenlabel";
        host.appendChild(takenLabel);
    }

    paintSockets()
    {
        for(var i = 0; i <= this.uticnice;i++)
        {
            const brojmestauticnice = Math.floor(Math.random() * this.mesta) + 1;
            const mesto = (document.getElementById('mestosed' + brojmestauticnice) as unknown as HTMLButtonElement);
            mesto.style.background="yellow";
        }
    }

    static createCitaonicaFromLiteral(citaonicaLiteral:Citaonica) {
		return new Citaonica(
            citaonicaLiteral["id"],
			citaonicaLiteral["ime"],
			citaonicaLiteral["radiod"],
			citaonicaLiteral["radido"],
            citaonicaLiteral["uticnice"],
            citaonicaLiteral["mesta"],
            citaonicaLiteral["zauzeto"]
		);
    }

    static createErrorCitaonica() 
    {
		return new Citaonica(-1, "", "", "", -1, -1, -1);
    }

    isCitaonicaError() 
    {
        return this.id === -1;
    }

    createDescriptionOfSeats(host: HTMLUListElement)
    {
        const legenda = document.createElement('div');
        host.appendChild(legenda);
        legenda.innerHTML="Legenda: "
        legenda.className="legenda";
        
        const zeleno = document.createElement('button');
        zeleno.style.background="greenyellow";
        zeleno.innerHTML="Slobodno mesto";
        legenda.appendChild(zeleno);

        const zuti = document.createElement('button');
        zuti.style.background="yellow";
        zuti.innerHTML="Uticnica";
        legenda.appendChild(zuti);

        const crveno = document.createElement('button');
        crveno.style.background="red";
        crveno.innerHTML="Zauzeto mesto";
        legenda.appendChild(crveno);
    }
}