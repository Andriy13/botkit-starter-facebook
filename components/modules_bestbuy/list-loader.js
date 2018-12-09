
async function loadIds(){
    var Ids=await require(__dirname+'\\get_ids');
    return Ids;
}
async function loadDetails(){
    var list = await loadIds();
    var Details=[];
    for(var i=0;i<7;i++)
    {
        Details.push( await require(__dirname+'\\get_detail')(list[i].sku));
    }
    return await Details;
}


module.exports={
    loadIds,
    loadDetails
}