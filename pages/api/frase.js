
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

import Frases from '../../src/controllers/backend/frases';

async function Populate(request, response) {

    const category = 15;
    const frases = new Frases();
    const query = request.query

    console.log(query.page)
    const url = `https://www.pensador.com/frases_motivacionais/${query.page}/?load_more=1`;
    console.log(url)
    const loading = await fetch(url)
        .then(response => {
            return response.json();
        })
        .catch((error) => {
            console.log('error: ' + error);
            return error;
        });

    const dom = new JSDOM(loading.nextPageContent);
    const cards = dom.window.document.querySelectorAll(".thought-card");


    const f = await Promise.all(Array.from(cards).map(async card => {
        //"autor": card.querySelector("a").textContent
        //"frase": card.querySelector(".frase").textContent,

        const frase = card.querySelector(".frase").textContent

        let str = frase;
        const words = frase.split(" ");
        if (words.length > 5) {
            str = words.slice(0, 5).join(" ");
        }

        const url = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/([^\w]+|\s+)/g, '-') // Substitui espaço e outros caracteres por hífen
            .replace(/\-\-+/g, '-')	// Substitui multiplos hífens por um único hífen
            .replace(/(^-+|-+$)/, ''); // Remove hífens extras do final ou do inicio da string


        const resultPost = await frases.InsertPost(frase, url)
        console.log(frase)

        //resultPost.insertId
        if (resultPost.hasOwnProperty("insertId")) {


            const resultRelationship = await frases.InsertRelationship(resultPost.insertId, category);
            //console.log("Relationship", resultRelationship);

            const resultPostmeta1 = await frases.InsertPostMetas(resultPost.insertId, "texto", frase);
            //console.log("Postmeta1", resultPostmeta1);

            const resultPostmeta2 = await frases.InsertPostMetas(resultPost.insertId, "tipo_de_postagem", "st");
            //console.log("Postmeta2", resultPostmeta2);

            const resultPostmeta3 = await frases.InsertPostMetas(resultPost.insertId, "_yoast_wpseo_primary_category", category);
            //console.log("Postmeta3", resultPostmeta3);
        }

        return frase;

    })
    );


    return response.json(f);
}

export default Populate;