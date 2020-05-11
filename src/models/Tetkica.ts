class Tetkica
{
    ime:string;
    constructor(ime:string)
    {
        this.ime=ime;
    }

    drawListOfCleaningLadies(host: HTMLDivElement)
    {
        const citaonicaListItem = document.createElement("li");
        citaonicaListItem.innerHTML = this.ime;
        host.appendChild(citaonicaListItem);
    }

    static createTetkicafromLiteral(tetkicaLiteral: Tetkica)
    {
        return new Tetkica(tetkicaLiteral["ime"]);
    }
}

export default Tetkica;
