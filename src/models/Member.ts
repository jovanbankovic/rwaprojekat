class Member
{
    firstName:string; lastName:string; yearOfStudy:string; faculty:string; course:string; food: string; spotNumber:number;
    constructor(firstName:string, lastName:string, yearOfStudy:string, faculty:string, course:string, food:string, spotNumber:number)
    {
        this.firstName=firstName;
        this.lastName=lastName;
        this.yearOfStudy=yearOfStudy;
        this.faculty=faculty;
        this.course=course;
        this.food=food;
        this.spotNumber=spotNumber;
    }

    drawUser(host: HTMLUListElement)
    {
        const memberOfLibrary = document.createElement("li");
        memberOfLibrary.innerHTML = this.firstName + " " + this.lastName + "| " + this.faculty + ", " + this.course + "| " + this.yearOfStudy;
        host.appendChild(memberOfLibrary);
    }

    static createMemberFromLiteral(memberLiteral: Member) {
		return new Member(memberLiteral["firstName"], memberLiteral["lastName"], memberLiteral["yearOfStudy"], memberLiteral["faculty"], memberLiteral["course"], memberLiteral["food"], memberLiteral["spotNumber"]);
	}
}

export default Member;