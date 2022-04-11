import Frases from '../../src/controllers/backend/frases';

async function Dia(request, response) {

    const frases = new Frases();


    //buscar frase do dia
    let frasedodia = await frases.GetFrase();
    if (frasedodia && frasedodia.length > 0) {
        console.log('existe!')

    }
    else {
        console.log('não existe!')
        //carregar nova frase do dia
        const insertFrase = await frases.CreateFraseDoDia();
        let frasedodia = await frases.GetFrase();
    }



    return response.json(frasedodia);

}

export default Dia;