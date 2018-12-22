
async function loadIds(){
    let Ids=await require(__dirname+'/get_ids');
    return Ids;
}
async function loadDetails(Ids){
    let list;
    if(Ids===undefined){
        list = await loadIds();
    }else{
        list=Ids;
    }
    let Details=[];
    for(var i=0;i<list.length;i++)
    {
        if(list[i].sku===undefined){
            Details.push( await require(__dirname+'/get_detail')(list[i]));
        }else{
        Details.push( await require(__dirname+'/get_detail')(list[i].sku));
        }
    }
    return await Details;
}


module.exports={
    loadIds,
    loadDetails
}