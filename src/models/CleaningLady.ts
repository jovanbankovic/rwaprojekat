class CleaningLady
{
    clName:string;
    constructor(clName:string)
    {
        this.clName=clName;
    }

    drawListOfCleaningLadies(host: HTMLDivElement)
    {
        const cleaningLadyItem = document.createElement("li");
        cleaningLadyItem.innerHTML = this.clName;
        host.appendChild(cleaningLadyItem);
    }

    static createCleaningLadyFromLiteral(cleaningLadyLiteral: CleaningLady)
    {
        return new CleaningLady(cleaningLadyLiteral["clName"]);
    }
}

export default CleaningLady;
