
async function Conjugacao(request, response) {

    const loading = await fetch('https://www.conjugacao.com.br/verbo-por/')
        .then(response => {

            return response.text();
        })
        .catch((error) => {
            console.log('error: ' + error);
            return error;
        });


    return response.json(loading);

}

export default Conjugacao;