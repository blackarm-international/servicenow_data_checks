// find all possible models that might be chassis and do not have u_max_children
// https://godaddydev.service-now.com/nav_to.do?uri=%2Fcmdb_hardware_product_model_list.do%3Fsysparm_query%3Dstatus%253DIn%2520Production%255Eu_max_children%253D%255Eu_device_category!%253D384e9357dbfa085cdaeb9ed6db961982%255Eu_device_category!%253Da789eeeddbae4c9ce670d48a48961923%255Eu_device_category!%253Da59b6e25dbee4c9ce670d48a48961902%255Eu_device_category!%253D8eda26e1dbee4c9ce670d48a48961912%255Eu_device_category!%253D6dc12117dbfd10541093f40c0c9619a9%255Eu_device_category!%253D288beae1dbee4c9ce670d48a4896192d%255Eu_device_category!%253D46ea6ea1dbee4c9ce670d48a4896195b%255Eu_device_category!%253D7d070889130298942567d7028144b090%255Eu_device_category!%253Db29beae1dbee4c9ce670d48a48961930%255Eu_device_category!%253D040aa4dfdba9ec1c079933f3b9961914%26sysparm_first_row%3D1%26sysparm_view%3D

var modelSysIdList = [];
var grModel = new GlideRecord('cmdb_hardware_product_model');
grModel.addEncodedQuery('status=In Production^u_max_children=^u_device_category!=384e9357dbfa085cdaeb9ed6db961982^u_device_category!=a789eeeddbae4c9ce670d48a48961923^u_device_category!=a59b6e25dbee4c9ce670d48a48961902^u_device_category!=8eda26e1dbee4c9ce670d48a48961912^u_device_category!=6dc12117dbfd10541093f40c0c9619a9^u_device_category!=288beae1dbee4c9ce670d48a4896192d^u_device_category!=46ea6ea1dbee4c9ce670d48a4896195b^u_device_category!=7d070889130298942567d7028144b090^u_device_category!=b29beae1dbee4c9ce670d48a48961930^u_device_category!=040aa4dfdba9ec1c079933f3b9961914');
grModel.query();
var log = [];
while (grModel.next()) {
  modelSysIdList.push(grModel.getUniqueValue());
}
// find every possible sled that has a parent in one of these models
// collect the sys_id of the parent chassis
// https://godaddydev.service-now.com/nav_to.do?uri=%2Falm_hardware_list.do%3Fsysparm_query%3Du_rack!%253DNULL%255Eparent!%253DNULL%255Emodel_category!%253D8ffdf454c3031000b959fd251eba8f1c%255Emodel_category!%253D387198aa4f5f7e08dc4927201310c76f%255Emodel_category!%253D7de648e10f120200609b6798b1050e91%255Emodel_category!%253D55f050a64f5f7e08dc4927201310c7cb%26sysparm_first_row%3D1%26sysparm_view%3D

var possibleChassisSysId = {};
var grSled = new GlideRecord('alm_hardware');
grSled.addEncodedQuery('u_rack!=NULL^parent!=NULL^model_category!=8ffdf454c3031000b959fd251eba8f1c^model_category!=387198aa4f5f7e08dc4927201310c76f^model_category!=7de648e10f120200609b6798b1050e91^model_category!=55f050a64f5f7e08dc4927201310c7cb');
grSled.addQuery('parent.model', 'IN', modelSysIdList)
grSled.query();
while (grSled.next()) {
  possibleChassisSysId[grSled.getValue('parent')] = true;
}

// query the parent chassis and collect unique model sys_ids
var susModelSysid = {};
// collect model sys_ids
var grSled = new GlideRecord('alm_hardware');
grSled.addQuery('sys_id', 'IN', Object.keys(possibleChassisSysId))
grSled.query();
while (grSled.next()) {
  susModelSysid[grSled.getValue('model')] = true;
}

// make the url
url = 'https://godaddy.service-now.com/nav_to.do?uri=%2Fcmdb_hardware_product_model_list.do%3Fsysparm_query%3Dsys_idIN';
first = true;
Object.keys(susModelSysid).forEach(function (modelSysId) {
  if (first) {
    url += modelSysId;
    first = false;
  } else {
    url += '%252C' +modelSysId;
  }
});
gs.log(url);
