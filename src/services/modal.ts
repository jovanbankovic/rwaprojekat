export function nacrtajModal(host: HTMLDivElement)
{
    const modalcontent = document.createElement('div');
    modalcontent.className = "modal-content";
    host.appendChild(modalcontent);

    const modalheader = document.createElement('div');
    modalheader.className="modal-header";
    modalcontent.appendChild(modalheader);

    const headertext = document.createElement('h2');
    headertext.innerHTML="Uputstva za koriscenje portala E-Citaonica";
    modalheader.appendChild(headertext);

    const modalbody = document.createElement('div');
    modalcontent.appendChild(modalbody);

    const p1 = document.createElement('p');
    p1.innerHTML="Na pocetku Vam je ponudjena lista dostupnih citaonica. ";
    modalbody.appendChild(p1);
    const p2 = document.createElement('p');
    p2.innerHTML="Unosenje PUNOG imena citaonice u polje ispod liste otvorice Vam izabranu citaonicu sa svim njenim detaljima koji su: <br> - Ime citaonice <br> - Radno vreme citaonice <br> - Broj mesta u citaonici <br> - Broj zauzetih mesta <br> - Broj uticnica u citaonici <br> - Dezurne tetkice <br> - Prikaz slobodnih i zauzetih mesta (Zelena - slobodna / Crvena - zauzeta)";
    modalbody.appendChild(p2);
    const p3 = document.createElement('p');
    p3.innerHTML="Prijava u citaonicu se vrsi popunjavanjem podataka koji se nalaze sa desne strane liste i klikom na dugme (Sacuvaj prijavu) <br> Nakon prijavljivanja u grafickom prikazu citaonice bice prikazano vase mesto gde ste se prijavili.";
    modalbody.appendChild(p3);
    const p4 = document.createElement('p');
    p4.innerHTML="VAZNO OBAVESTENJE! Tetkice u citaonici na svakih 3 minuta rade proveru unosenja hrane u citaonicu, jer je to zabranjeno. <br> Svako ko je u prijavi stavio Hrana: Da ima 30% sanse da bude izbacen iz citaonice."
    modalbody.appendChild(p4);

    const modalfooter = document.createElement('div');
    modalfooter.className="modal-footer";
    modalcontent.appendChild(modalfooter);
    
    const footerh3 = document.createElement('h3');
    footerh3.innerHTML="Hvala na koriscenju portala!";
    modalfooter.appendChild(footerh3);
}

export function modalPrijava(host:HTMLDivElement)
{
    const modalcontent = document.createElement('div');
    modalcontent.className = "modal-content";
    host.appendChild(modalcontent);

    const modalheader = document.createElement('div');
    modalheader.className="modal-header";
    modalcontent.appendChild(modalheader);

    const headertext = document.createElement('h2');
    headertext.innerHTML="Prijava";
    headertext.id="modal-header1";
    modalheader.appendChild(headertext);

    const spanX = document.createElement('span');
    spanX.innerHTML="×";
    spanX.className="close1";
    modalheader.appendChild(spanX);

    const modalbody = document.createElement('div');
    modalcontent.appendChild(modalbody);
    modalbody.className="modal-body";

    const p1 = document.createElement('p');
    p1.innerHTML=" Ime: ";
    modalbody.appendChild(p1);

    const inputIme = document.createElement('input');
    inputIme.id="inputime";
    p1.appendChild(inputIme);

    const p1prezime = document.createElement('p');
    p1prezime.innerHTML=" Prezime: ";
    modalbody.appendChild(p1prezime);

    const inputPrezime = document.createElement('input');
    inputPrezime.id="inputprezime";
    p1prezime.appendChild(inputPrezime);
 
    const godina = document.createElement('p');
    godina.innerHTML=" Godina: ";
    modalbody.appendChild(godina);

    const inputgodina = document.createElement('input');
    inputgodina.id="inputgodina";
    godina.appendChild(inputgodina);

    const fakultet = document.createElement('p');
    fakultet.innerHTML=" Fakultet: "
    modalbody.appendChild(fakultet);

    const inputfakultet = document.createElement('input');
    inputfakultet.id = "inputfakultet";
    fakultet.appendChild(inputfakultet);

    const smer = document.createElement('p');
    smer.innerHTML=" Smer: "
    modalbody.appendChild(smer);

    const inputsmer = document.createElement('input');
    inputsmer.id = "inputsmer";
    smer.appendChild(inputsmer);

    const opcije = ["Da", "Ne"];

    const hrana = document.createElement('p');
    hrana.innerHTML=" Hrana: "
    modalbody.appendChild(hrana);

    const hranaselect = document.createElement('select');
    hranaselect.id = "hranaselect";
    hrana.appendChild(hranaselect);

    for(var i = 0; i<opcije.length;i++)
    {
        var option = document.createElement('option');
        option.value=opcije[i];
        option.text=opcije[i];
        hranaselect.append(option);
    }


    const p2 = document.createElement('p');
    p2.innerHTML=" Broj mesta za koje se prijavljujete: ";
    modalbody.appendChild(p2);

    const mesto = document.createElement('input');
    mesto.type="number";
    mesto.id="mesto";
    p2.appendChild(mesto);


    const dugme = document.createElement('button');
    dugme.innerHTML="Sacuvaj prijavu"
    dugme.id="dugmezaprijavu";
    modalbody.appendChild(dugme);

    const modalfooter = document.createElement('div');
    modalfooter.className="modal-footer";
    modalcontent.appendChild(modalfooter);
    
    const footerh3 = document.createElement('h3');
    footerh3.id="footerh3";
    footerh3.innerHTML="Hvala na koriscenju portala!";
    modalfooter.appendChild(footerh3);
}
