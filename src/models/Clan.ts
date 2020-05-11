class Clan
{
    ime:string; prezime:string; godina:string; fakultet:string; smer:string; hrana: string; brmesta:number;
    constructor(ime:string, prezime:string, godina:string, fakultet:string, smer:string, hrana:string, brmesta:number)
    {
        this.ime=ime;
        this.prezime=prezime;
        this.godina=godina;
        this.fakultet=fakultet;
        this.smer=smer;
        this.hrana=hrana;
        this.brmesta=brmesta;
    }

    crawUser(host: HTMLUListElement)
    {
        const clanCitaonice = document.createElement("li");
        clanCitaonice.innerHTML = this.ime + " " + this.prezime + "| " + this.fakultet + ", " + this.smer + "| " + this.godina;
        host.appendChild(clanCitaonice);
    }

    static createClanFromLiteral(clanLiteral: Clan) {
		return new Clan(clanLiteral["ime"], clanLiteral["prezime"], clanLiteral["godina"], clanLiteral["fakultet"], clanLiteral["smer"], clanLiteral["hrana"], clanLiteral["brmesta"]);
	}
}

export default Clan;