export default class Library
{
    id:number; name:string; worksFrom:string; worksTo:string; sockets:number; spots:number; takenSpots:number; cleaningLadies: any[];
    constructor(id:number, name:string, worksFrom:string, worksTo:string, sockets:number, spots:number, takenSpots:number, cleaningLadies = new Array())
    {
        this.id=id;
        this.name=name;
        this.worksFrom=worksFrom;
        this.worksTo=worksTo;
        this.sockets=sockets;
        this.spots = spots;
        this.takenSpots=takenSpots;
        this.cleaningLadies=cleaningLadies;
    }

    drawListOfLibraries(host: HTMLUListElement)
    {
        const citaonicaListItem = document.createElement("li");
        citaonicaListItem.innerHTML = this.name;
		host.appendChild(citaonicaListItem);
    }

    drawDescriptionOfLibrary(host: HTMLDivElement)
    {
        host.innerHTML = "";
        if(this.id===-1) { 
            host.innerHTML="Ne postoji citaonica sa tim imenom!";
            (document.getElementById('uspesnaprijava') as HTMLDivElement).innerHTML="";
    }
        else
        {
            (document.getElementById('uspesnaprijava') as HTMLDivElement).innerHTML="Uspesno ste prikazali odabranu citaonicu. (Scroll down to review)";
            
            const descriptionOfLibrary = document.createElement("div");
            host.appendChild(descriptionOfLibrary);
            descriptionOfLibrary.className="descriptionCitaonice";

            descriptionOfLibrary.innerHTML = this.name + "<br>" + "Radno vreme: " + this.worksFrom + "/" + this.worksTo + "<br>" + "Mesta: " + this.spots + "<br>" + "Broj uticnica: " +this.sockets + "<br>" + "Lista dezurnih tetkica: ";

            const cleaningLadiesList = document.createElement("ul");
            cleaningLadiesList.className="listaTetkica";
            cleaningLadiesList.id="ulCitaonica";
            this.cleaningLadies.map((tetkica) => tetkica.drawListOfCleaningLadies(cleaningLadiesList));
            descriptionOfLibrary.appendChild(cleaningLadiesList);

            this.drawTakenLabelLibrary(cleaningLadiesList);
            
            const spotsDivision=document.createElement('div');
            cleaningLadiesList.appendChild(spotsDivision);
            spotsDivision.className="buttondiv";
            
            const leftSpots = document.createElement('div');
            spotsDivision.appendChild(leftSpots);
            leftSpots.className="divlevo";
            
            const rightSpots = document.createElement('div');
            spotsDivision.appendChild(rightSpots);
            rightSpots.className="divdesno";
 
            this.drawSpots(leftSpots, rightSpots);
            this.paintSockets();
            this.createDescriptionOfSeats(cleaningLadiesList);
            this.drawTakenPlacesInLibrary();
        }
    }

    drawSpots(leftSpots: HTMLDivElement, rightSpots: HTMLDivElement)
    {
        for(var i = 1; i <= this.spots/2; i++) 
        {
            const seatLeft = document.createElement("button");
            seatLeft.innerHTML = i.toString();
            seatLeft.id="mestosed"+i;
            seatLeft.className="mestazasedenje";
            leftSpots.appendChild(seatLeft);
        }  

        for(var i = this.spots/2 + 1; i <= this.spots; i++) 
        {
            const seatRight = document.createElement("button");
            seatRight.innerHTML = i.toString();
            seatRight.id="mestosed"+i;
            seatRight.className="mestazasedenje";
            rightSpots.appendChild(seatRight);
        }  

    }
    
    drawTakenLabelLibrary(host: HTMLUListElement)
    {
        const takenLabel = document.createElement('label');
        takenLabel.innerHTML="Zauzeto: " + this.takenSpots.toString();
        takenLabel.id="takenlabel";
        host.appendChild(takenLabel);
    }

    paintSockets()
    {
        for(var i = 0; i <= this.sockets;i++)
        {
            const randomSeat = Math.floor(Math.random() * this.spots) + 1;
            (document.getElementById('mestosed' + randomSeat) as HTMLButtonElement).style.background="yellow";
        }
    }

    static createLibraryFromLiteral(citaonicaLiteral:Library) {
		return new Library(
            citaonicaLiteral["id"],
			citaonicaLiteral["name"],
			citaonicaLiteral["worksFrom"],
			citaonicaLiteral["worksTo"],
            citaonicaLiteral["sockets"],
            citaonicaLiteral["spots"],
            citaonicaLiteral["takenSpots"]
		);
    }

    static createErrorLibrary() 
    {
		return new Library(-1, "", "", "", -1, -1, -1);
    }

    isLibraryError() 
    {
        return this.id === -1;
    }

    createDescriptionOfSeats(host: HTMLUListElement)
    {
        const legend = document.createElement('div');
        host.appendChild(legend);
        legend.innerHTML="Legenda: "
        legend.className="legenda";
        
        const greenSeat = document.createElement('button');
        greenSeat.style.background="greenyellow";
        greenSeat.innerHTML="Slobodno mesto";
        legend.appendChild(greenSeat);

        const yellowSeat = document.createElement('button');
        yellowSeat.style.background="yellow";
        yellowSeat.innerHTML="Uticnica";
        legend.appendChild(yellowSeat);

        const redSeat = document.createElement('button');
        redSeat.style.background="red";
        redSeat.innerHTML="Zauzeto mesto";
        legend.appendChild(redSeat);
    }

    drawTakenPlacesInLibrary()
    {
        var randomSeat = 1;
        for(var i = 0; i < this.takenSpots;i++)
        {
            (document.getElementById('mestosed' + randomSeat) as HTMLButtonElement).style.background="red";
            (document.getElementById('mestosed' + randomSeat) as HTMLButtonElement).title="Zauzeto";
            randomSeat++;
        }
    }
}