function ShowError(data){
    console.log(data.status);
    console.log(data.message);
    switch(data.code){
        case 400: console.log('The request is missing key information or is malformed.');break;
        case 403: console.log('The API key is not valid, or the allocated call limit has been exceeded.');break;
        case 404: console.log('The requested item cannot be found.');break;
        case 405: console.log('Particular method not allowed (error will be returned for methods like a POST).');break;
        case 500:
        case 501:
        case 503:console.log('There is a server error on the Best Buy side.');break;
    }
}
module.exports.ShowError=ShowError;